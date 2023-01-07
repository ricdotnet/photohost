export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type ToastTypes = 'info' | 'warning' | 'danger';
export type AlbumType = { albumName: string, albumCover: string, randomCover: boolean };
