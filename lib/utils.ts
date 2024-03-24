import { adjectives, animals, colors, uniqueNamesGenerator } from "unique-names-generator";

export const generateName = () => {
  const name = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });

  return name;
};
