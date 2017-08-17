export type RegExpString = string;

export interface AdjunctApp {
  paths: RegExp;
  name: string;
}

export interface AdjunctAppSerialized {
  paths: RegExp;
  name: string;
}

export interface TransmogrifierConfigSerialized {
  adjunct: AdjunctAppSerialized
}

export interface TransmogrifierConfig {
  adjunct: AdjunctApp
}

export function deserialize({ adjunct }: TransmogrifierConfigSerialized): TransmogrifierConfig {
  const { name, paths } = adjunct;
  return {
    adjunct: {
      name,
      paths: new RegExp(paths) 
    }
  };
}