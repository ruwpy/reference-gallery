import { google, lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";

import { and, eq } from "drizzle-orm";
import { oauthAccount } from "@/lib/db/schema/oauth-account";
import { parseJWT } from "oslo/jwt";
import { getUserOauthAccounts, insertOauthAccount } from "@/lib/db/handlers/oauth-account";
import { getUserByEmail, createUser } from "@/lib/db/handlers/user";
import { generateName } from "@/lib/utils";

interface GoogleUser {
  sub: string;
  email: string;
  picture: string;
}

//@ts-ignore
export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const storedState = cookies().get("google_oauth_state")?.value ?? null;
  const codeVerifier = cookies().get("code_verifier")?.value ?? null;

  if (!code || !state || !storedState || state !== storedState || !codeVerifier) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);

    const googleUser: GoogleUser = parseJWT(tokens.idToken)!.payload as GoogleUser;

    const [existingOauthAccount] = await db
      .select()
      .from(oauthAccount)
      .where(
        and(
          eq(oauthAccount.providerId, "youtube"),
          eq(oauthAccount.providerEmail, googleUser.email)
        )
      );

    // if connected oauth account exist, allow auth
    if (existingOauthAccount) {
      return await createSessionCookie(existingOauthAccount.userId);
    }

    const existingUser = await getUserByEmail({ email: googleUser.email });

    // if user attempts to connect oauth but the user already has one, decline auth
    if (existingUser) {
      const userOauthAccounts = await getUserOauthAccounts({ userId: existingUser.id });

      if (userOauthAccounts.filter((acc) => acc.providerId === "youtube")[0]) {
        return new Response(null, {
          status: 400,
        });
      }

      await insertOauthAccount({
        providerId: "youtube",
        providerUserId: googleUser.sub,
        userId: existingUser.id,
        providerEmail: googleUser.email,
      });

      return await createSessionCookie(existingUser.id);
    }

    // if user attempts to connect oauth account, but doesnt have account at all, create account and oauth account
    const userId = generateId(15);

    await createUser({
      email: googleUser.email,
      id: userId,
      username: generateName(),
      picture: googleUser.picture,
    });

    await insertOauthAccount({
      providerId: "youtube",
      providerUserId: googleUser.sub,
      userId,
      providerEmail: googleUser.email,
    });

    return await createSessionCookie(userId);
  } catch (e) {
    if (e instanceof OAuth2RequestError && e.message === "bad_verification_code") {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }

    return new Response(null, {
      status: 500,
    });
  }
}

const createSessionCookie = async (id: string) => {
  const session = await lucia.createSession(id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
    },
  });
};
