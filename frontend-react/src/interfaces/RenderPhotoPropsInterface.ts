import { BaseSyntheticEvent } from "react";
import { PhotoInterface } from "./PhotoInterface";

export interface RenderPhotoPropsInterface {
  photo: PhotoInterface;
  onClick: (e: BaseSyntheticEvent, photo: PhotoInterface) => void;
  onSelect: (e: BaseSyntheticEvent, photoId: string) => void;
}