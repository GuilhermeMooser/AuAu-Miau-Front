export type City = {
  id: number;
  name: string;
  stateUf: StateUF;
};

type StateUF = {
  id: number;
  name: string;
  acronym: string;
};
