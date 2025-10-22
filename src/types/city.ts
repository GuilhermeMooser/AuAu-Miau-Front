export type City = {
  id: number;
  name: string;
  ibge: number;
  stateUf: StateUF;
};

type StateUF = {
  id: number;
  name: string;
  acronym: string;
  country: number;
};
