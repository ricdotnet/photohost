import { createContext } from 'react';
import { PhotoInterface } from '../interfaces/PhotoInterface';

const PhotosStore = <PhotoInterface[]>[];

export const PhotosContext = createContext(PhotosStore);
