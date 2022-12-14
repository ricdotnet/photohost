import axios, { AxiosRequestConfig, RawAxiosRequestHeaders, ResponseType } from 'axios';

interface RequestOptions {
  route: string,
  method?: string,
  withAuth?: boolean,
  payload?: any,
  headers?: RawAxiosRequestHeaders,
  params?: any,
  responseType?: ResponseType,
}

export const useApiRequest = () => {

  let data: any, error: any;
  const api = import.meta.env.VITE_API;
  const authorizationHeader = `Bearer ${localStorage.getItem('access-token')}`;

  const request = async ({ route, method = 'GET', headers, withAuth = true, payload, params, responseType = 'json' }: RequestOptions) => {

    const options: AxiosRequestConfig = {
      url: api + route,
      method: method,
      headers: {
        authorization: (withAuth) ? authorizationHeader : null,
        ...headers,
      },
      data: payload,
      params: params,
      responseType: responseType,
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
