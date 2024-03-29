import { env } from "@/env.mjs";
import { drizzle } from "drizzle-orm/postgres-js";
import {
  folderSchema,
  imageSchema,
  oauthAccountSchema,
  projectSchema,
  sessionSchema,
  userSchema,
  memberSchema,
} from "./schema/index";
import postgres from "postgres";

const queryClient = postgres(env.DATABASE_URL);

export const db = drizzle(queryClient, {
  schema: {
    ...folderSchema,
    ...imageSchema,
    ...oauthAccountSchema,
    ...projectSchema,
    ...sessionSchema,
    ...userSchema,
    ...memberSchema,
  },
});
