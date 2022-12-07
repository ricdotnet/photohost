import { useApiRequest } from './UseApiRequest';

interface UsePhotoUploadParamsInterface {
  albumId?: string;
  formData: FormData;
}

export const usePhotoUpload = async ({ albumId, formData }: UsePhotoUploadParamsInterface) => {
  const { request } = useApiRequest();

  formData.append('album', albumId as string ?? 'default-album');

  return await request({
    route: '/photo/upload',
    method: 'post',
    withAuth: true,
    payload: formData,
  });
};
