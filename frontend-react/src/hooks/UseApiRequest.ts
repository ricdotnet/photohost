import axios, { AxiosRequestConfig } from 'axios';

export const useApiRequest = (withAuth: boolean = false) => {

  const api = import.meta.env.VITE_API;

  const requestConfig: AxiosRequestConfig = {};

  if ( withAuth ) {
    requestConfig.headers = {
      authorization: `Bearer ${localStorage.getItem('access-token')}`,
    };
  }

  const get = async (route: string, options: AxiosRequestConfig = {}) => {
    let data, error;

    try {
      const response = await axios.get(api + route, { ...options, ...requestConfig });
      data = response.data;
    } catch (err: any) {
      if ( err ) {
        error = err.message;
      }
    }

    return { data, error };
  };

  const post = async (route: string, payload: any, options: AxiosRequestConfig = {}) => {
    let data, error;

    try {
      const response = await axios.post(api + route, payload, { ...options, ...requestConfig });
      data = response.data;
    } catch (err: any) {
      if ( err ) {
        error = err.message;
      }
    }

    return { data, error };
  };

  const del = async (route: string, options: AxiosRequestConfig = {}) => {
    let data, error;

    try {
      const response = await axios.delete(api + route, { ...options, ...requestConfig });
      data = response.data;
    } catch (err: any) {
      if ( err ) {
        error = err.message;
      }
    }

    return { data, error };
  };

  return {
    get,
    post,
    del,
  };
};
