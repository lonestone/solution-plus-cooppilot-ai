import {
  Config,
  adjectives,
  animals,
  uniqueNamesGenerator,
} from 'unique-names-generator';

export function nameGenerator(): string {
  const config: Config = {
    dictionaries: [
      adjectives,
      // colors,
      animals,
    ],
    separator: '-',
  };

  return uniqueNamesGenerator(config);
}
