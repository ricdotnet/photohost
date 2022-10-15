import { createContext } from 'react';
import { AlbumInterface } from '../interfaces/AlbumInterface';

const AlbumsStore = <AlbumInterface[]>[];

export const AlbumsContext = createContext(AlbumsStore);
