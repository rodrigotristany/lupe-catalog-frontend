import client from './client';

export async function getProducts(filters = {}) {
  const { data } = await client.get('/products', { params: filters });
  if (data.items !== undefined) return data;
  return { items: data, total: data.length, page: 1, per_page: data.length, pages: 1 };
}

export async function getProduct(id) {
  const { data } = await client.get(`/products/${id}`);
  return data;
}
