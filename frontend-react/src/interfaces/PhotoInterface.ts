export interface PhotoInterface {
  id: string;
  name: string;
  filename: string;
  // date_added: string;
  // last_updated: string;
  private: boolean;
  width: number;
  height: number;
  blurhash: {
    hash: string;
  };
}
