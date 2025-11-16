import { useState, useEffect } from "react";
import { fetchAPI } from "../../../services/api";
import { FeatureItem } from "../types/feature";

export const useFeatures = (itemsPerPage = 10) => {
  const [items, setItems] = useState<FeatureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0); // total count from API
  const [totalPages, setTotalPages] = useState(0); // total count from API

  useEffect(() => {
    fetchFeatures(currentPage);
  }, [currentPage]);

  const fetchFeatures = async (page: number) => {
    try {
      setLoading(true);
      const data = await fetchAPI<{ items: FeatureItem[]; total: number, totalPages: number }>(
        `/feedback?page=${page}&limit=${itemsPerPage}`
      );      
      console.log(data);
      setItems(data.items);
      setTotalItems(data.total);
      setTotalPages(data.totalPages)
    } catch (err) {
      console.error("Failed to fetch features:", err);
    } finally {
      setLoading(false);
    }
  };

  const addFeature = async (feature: Omit<FeatureItem, "id">) => {
    try {
      const newItem = await fetchAPI<FeatureItem>("/feedback", {
        method: "POST",
        body: feature,
      });
      setItems((prev) => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      console.error("Failed to add feature:", err);
      throw err;
    }
  };

  return {
    items,
    loading,
    currentPage,
    setCurrentPage,
    totalItems,
    totalPages,
    fetchFeatures,
    addFeature,
  };
};
