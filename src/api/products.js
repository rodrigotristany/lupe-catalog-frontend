import client from './client';

export async function getProducts(filters = {}) {
  const { data } = await client.get('/products/', { params: filters });
  return data;
}

export async function getProduct(id) {
  const { data } = await client.get(`/products/${id}/`);
  return data;
}
