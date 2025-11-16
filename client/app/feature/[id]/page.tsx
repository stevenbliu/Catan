"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FeatureItem } from "../../../types/feature";
import { fetchAPI } from "../../../services/api";

export default function FeatureDetailPage() {
  const params = useParams();
  const { id } = params;
  const [item, setItem] = useState<FeatureItem | null>(null);

  useEffect(() => {
    fetchAPI<FeatureItem>(`/feedback/${id}`).then(setItem);
  }, [id]);

  if (!item) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
                    {Object.entries(item).map(([key, value]) => (
                <div key={key} className="flex justify-between flex-row items-center">
                  <p className="font-medium capitalize">{key}</p>
                  <p className="text-gray-600">{String(value)}</p>
                </div>
                    )
                    )
                  }
    </div>
  );
}
