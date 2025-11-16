"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FeatureItem } from "../feature/types/feature";
import { fetchAPI } from "../../services/api";

export default function Dashboard() {
  const searchParams = useSearchParams();
//   const sortby = searchParams.get("sortby");

    const [items, setItems] = useState<FeatureItem[]>([]);

    useEffect(() => {
    const fetchData = async () => {
        const paramsObject = Object.fromEntries(searchParams.entries());
        const queryString = new URLSearchParams(paramsObject).toString();

        const data = await fetchAPI<{
        items: FeatureItem[];
        total: number;
        totalPages: number;
        }>(`/feedback?${queryString}`);
        console.log(data);
        setItems(data.items); // <-- use data.items if API returns { items, total, totalPages }
    };

    fetchData();
    }, [searchParams]);

  // if (!item) return <p className="p-6">Loading...</p>;

  return (
        <div className="p-6">
        {items.length === 0 ? (
            <p>No items found.</p>
        ) : (
            items.map((item, idx) => (
            <div key={idx} className="flex justify-between flex-column items-center">
                {Object.entries(item).map(([key, value]) => (
                <div key={key} className="flex justify-between flex-row items-center gap-2">
                    <span className="font-medium capitalize gap-5">{key}: {String(value)}</span>
                    {/* <span className="text-gray-600 gap-5">{String(value)}</span> */}
                </div>
                ))}
            </div>
            ))
        )}
        </div>
  );
}
