import { useApiRequest } from './UseApiRequest';

export const useDashboard = () => {
  const { request } = useApiRequest();

  const updateEmail = async (payload: any, type: string) => {
    const { data, error } = await request({
      route: '/user',
      method: 'PATCH',
      payload: payload,
      params: {
        type: type,
      }
    });

    return {
      data,
      error
    };
  };

  const updateDigest = async (type: string) => {
    const { data, error } = await request({
      route: '/user',
      method: 'PATCH',
      params: {
        type: type,
      }
    });

    return {
      data,
      error,
    };
  };

  return {
    updateEmail,
    updateDigest,
  };
};
