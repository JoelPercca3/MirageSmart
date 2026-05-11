import { useQuery } from "@tanstack/react-query";
import { productAPI } from "../api/product.api.js";

export const useProducts = (params) =>
  useQuery({
    queryKey: ["products", params],
    queryFn: () => productAPI.getAll(params),
    select: (res) => ({
      data: res.data,
      meta: res.meta,
    }),
  });

export const useProduct = (id) =>
  useQuery({
    queryKey: ["product", id],
    queryFn: () => productAPI.getOne(id),
    select: (res) => res.data,
    enabled: !!id,
  });

export const useFeaturedProducts = () =>
  useQuery({
    queryKey: ["products", "featured"],
    queryFn: productAPI.getFeatured,
    select: (res) => res.data,
  });

export const useRelatedProducts = (id) =>
  useQuery({
    queryKey: ["products", "related", id],
    queryFn: () => productAPI.getRelated(id),
    select: (res) => res.data,
    enabled: !!id,
  });

export const useProductReviews = (id, params) =>
  useQuery({
    queryKey: ["reviews", id, params],
    queryFn: () => productAPI.getReviews(id, params),
    select: (res) => res.data,
    enabled: !!id,
  });
