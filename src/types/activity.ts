export type Activity = {
  id: number;
  thumbnail: string;
  title: string;
  content: string;
  assets: { id: number; asset: string }[];
};
