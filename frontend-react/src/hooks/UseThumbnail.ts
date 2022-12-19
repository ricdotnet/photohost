import { BaseSyntheticEvent, useCallback, useEffect, useRef, useState } from "react";
import { RenderPhotoPropsInterface } from "../interfaces/RenderPhotoPropsInterface";
import { useApiRequest } from "./UseApiRequest";

export const useThumbnail = (props: RenderPhotoPropsInterface) => {
  const [loading, setLoading] = useState(true);
  const [isSelected, setIsSelected] = useState(false);
  const [heightRatio, setHeightRatio] = useState(0);

  const thumbnailRef = useRef<HTMLImageElement>(null);

  const getThumbnail = useCallback(async () => {
    const queryParams = new URLSearchParams();
    queryParams.append('photoId', props.photo.id);

    const { request } = useApiRequest();
    const { data, error } = await request({
      route: '/photo/thumbnail?' + queryParams,
      responseType: 'blob',
    });

    if ( error ) return console.error(error);

    if ( data ) {
      thumbnailRef.current!.src = URL.createObjectURL(data);
    }
  }, []);

  useEffect(() => {
    const hr = (props.photo.height * 100) / props.photo.width;
    setHeightRatio(() => hr);
    getThumbnail();
  }, []);

  const handleOnLoad = () => {
    setLoading(() => false);
  };

  const handleOnClick = (e: BaseSyntheticEvent) => {
    props.onClick(e, props.photo);
  };

  const handleOnSelect = (e: BaseSyntheticEvent) => {
    e.stopPropagation();
    props.onSelect(e, props.photo.id);
    setIsSelected(!isSelected);
  };

  return {
    loading,
    isSelected,
    heightRatio,
    thumbnailRef,
    handleOnLoad,
    handleOnClick,
    handleOnSelect,
  };
};