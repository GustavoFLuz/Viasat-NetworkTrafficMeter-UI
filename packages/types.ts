export type Interface = {
  Index: number;
  Description: string;
  Name: string;
};

export type configuration = {
  pid?: number | null;
  interface?: Interface;
};
