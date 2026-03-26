import client from './client';

export async function getCategories() {
  const { data } = await client.get('/categories');
  return data;
}
