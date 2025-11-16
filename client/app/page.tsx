"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FeatureItem } from "./feature/types/feature";
import { fetchAPI } from "../services/api";

export default function Home() {
  const searchParams = useSearchParams();
  console.log("searchParams:", searchParams); // This is a URLSearchParams object

  const dog = searchParams.get("dog");
  console.log("dog:", dog);

  // const [item, setItem] = useState<FeatureItem | null>(null);

  // useEffect(() => {
  //   const paramsObject = Object.fromEntries(searchParams.entries());
  //   console.log("All params:", paramsObject);
  //   console.log("Dog:", dog);
  //   // fetchAPI<FeatureItem>(`/feedback/${id}`).then(setItem);
  // }, [dog]);

  // if (!item) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
                    {/* {Object.entries(item).map(([key, value]) => (
                <div key={key} className="flex justify-between flex-row items-center">
                  <p className="font-medium capitalize">{key}</p>
                  <p className="text-gray-600">{String(value)}</p>
                </div>
                    )
                    )
                  } */}
            <div>Home </div>
    </div>
  );
}
