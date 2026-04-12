import { ProductResponse, Product } from "../types/inventory";

const BASE_URL = "https://dummyjson.com";

export const fetchProducts = async (
  limit: number = 10,
  skip: number = 0,
  search: string = "",
  category: string = ""
): Promise<ProductResponse> => {
  let url = `${BASE_URL}/products`;
  
  if (search) {
    url = `${BASE_URL}/products/search?q=${search}&limit=${limit}&skip=${skip}`;
  } else if (category && category !== "all") {
    url = `${BASE_URL}/products/category/${category}?limit=${limit}&skip=${skip}`;
  } else {
    url = `${BASE_URL}/products?limit=${limit}&skip=${skip}`;
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
};

export const fetchCategories = async (): Promise<string[]> => {
  const response = await fetch(`${BASE_URL}/products/category-list`);
  if (!response.ok) throw new Error("Failed to fetch categories");
  return response.json();
};

export const fetchProductById = async (id: number): Promise<Product> => {
  const response = await fetch(`${BASE_URL}/products/${id}`);
  if (!response.ok) throw new Error("Failed to fetch product");
  return response.json();
};
