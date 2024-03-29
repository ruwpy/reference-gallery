import { adjectives, animals, colors, uniqueNamesGenerator } from "unique-names-generator";

export const generateName = () => {
  const name = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });

  return name;
};

export const roundToTwoDigits = (value: number): number => {
  if (Number.isInteger(value)) {
    return value;
  }

  return parseFloat(value.toFixed(2));
};
