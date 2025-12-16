export interface Card {
  id: string;
  name: string;
  type: string;
  cost?: number;
  power?: number;
  description?: string;
  imageUrl?: string;
}
