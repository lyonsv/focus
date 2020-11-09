import {create} from 'apisauce';

const baseApi = create({
  baseURL: 'https://built.ie',
  headers: {
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'X-Permitted-Cross-Domain-Policies': 'none',
  },
});

const createApi = () => {
  return baseApi;
};

const api = createApi();

export default api;
