import axiosInstance from "./axios-instance";

export const fetchItems = async () => {
  const response = await axiosInstance.get("/products");
  return response.data;
};

export const fetchItemById = async (id: string) => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
};

export const createItem = async (itemData: { name: string; price: number }) => {
  const response = await axiosInstance.post("/products", itemData);
  return response.data;
};

export const updateItem = async (
  id: string,
  itemData: { name: string; price: number }
) => {
  const response = await axiosInstance.put(`/products/${id}`, itemData);
  return response.data;
};

export const deleteItem = async (id: string) => {
  const response = await axiosInstance.delete(`/products/${id}`);
  return response.data;
};
