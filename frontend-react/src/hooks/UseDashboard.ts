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

    console.log(data);
  };

  return {
    updateEmail,
  };
};
