declare module 'yugioh-types' {
  export interface YugiohCard {
    id: string;
    name: string;
    type: string;
    attribute?: string;
    level?: number;
    rank?: number;
    atk?: number;
    def?: number;
    description?: string;
    imageUrl?: string;
    race?: string;
    card_images?: {
      id: number;
      image_url: string;
      image_url_small: string;
    }[];
    card_prices?: {
      cardmarket_price?: string;
      tcgplayer_price?: string;
      ebay_price?: string;
      amazon_price?: string;
    }[];
  }
}
