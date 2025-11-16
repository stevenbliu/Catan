
"use client";
// import FeatureForm from "./components/FeatureForm";
import FeatureList from "../components/FeatureList";
import PageButton from "../components/PageButton";

// import { useToast } from "../../../context/ToastContext";
import { useFeatures } from "../hooks/useFeatures";

import { useState, useEffect } from "react";

export default function FeaturePage() {
  const { items, fetchFeatures, addFeature, currentPage, totalItems, totalPages, setCurrentPage } = useFeatures();
//   const { addToast } = useToast();

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Feature List</h1>
      {/* <FeatureForm onSubmit={handleAddFeature} /> */}
      <FeatureList items={items}/>
      <PageButton  currentPage={currentPage} onPageChange={setCurrentPage} totalPages={totalPages}/>
    </div>
  );
}

