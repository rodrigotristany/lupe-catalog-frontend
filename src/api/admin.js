import client from './client';

export async function login(username, password) {
  const { data } = await client.post('/admin/login/', { username, password });
  return data;
}

// Products
export async function getAdminProducts(filters = {}) {
  const { data } = await client.get('/admin/products/', { params: filters });
  return data;
}

export async function createProduct(payload) {
  const { data } = await client.post('/admin/products/', payload);
  return data;
}

export async function updateProduct(id, payload) {
  const { data } = await client.put(`/admin/products/${id}/`, payload);
  return data;
}

export async function deleteProduct(id) {
  await client.delete(`/admin/products/${id}/`);
}

export async function getProductHistory(id) {
  const { data } = await client.get(`/admin/products/${id}/history/`);
  return data;
}

// Images
export async function uploadImages(productId, formData) {
  const { data } = await client.post(`/admin/products/${productId}/images/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function deleteImage(imageId) {
  await client.delete(`/admin/images/${imageId}/`);
}

// Categories
export async function getAdminCategories() {
  const { data } = await client.get('/admin/categories/');
  return data;
}

export async function createCategory(payload) {
  const { data } = await client.post('/admin/categories/', payload);
  return data;
}

export async function updateCategory(id, payload) {
  const { data } = await client.put(`/admin/categories/${id}/`, payload);
  return data;
}

export async function deleteCategory(id) {
  await client.delete(`/admin/categories/${id}/`);
}

// Settings
export async function updateSettings(payload) {
  const { data } = await client.put('/admin/settings/', payload);
  return data;
}
