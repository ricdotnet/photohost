import axios, { AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

interface RequestOptions {
  route: string,
  method?: string,
  withAuth?: boolean,
  payload?: any,
  headers?: RawAxiosRequestHeaders,
  params?: any,
}

export const useApiRequest = () => {

  let data: any, error: any;
  const api = import.meta.env.VITE_API;
  const authorizationHeader = `Bearer ${localStorage.getItem('access-token')}`;

  const request = async ({ route, method, headers, withAuth, payload, params }: RequestOptions) => {

    const options: AxiosRequestConfig = {
      url: api + route,
      method: method ? method : 'GET',
      headers: {
        authorization: (withAuth) ? authorizationHeader : null,
        ...headers,
      },
      data: (payload) ? payload : null,
      params: (params) ? params : null,
    }

    try {
      const response = await axios.request(options);
      
      data = response.data;
    } catch (err) {
      error = err;
    }

    return { data, error };
  }

  return {
    request,
  };
};
