import { FeatureItem } from "../types/feature";
import Button from "../../../shared_components/UI/Button";
import Link from "next/link";
import { useState } from "react";
import { fetchAPI } from "../../../services/api";


interface FeatureListProps {
  items: FeatureItem[];
  // currentPage?: number;            // optional if using client-side pagination
  // onPageChange?: (page: number) => void; // optional callback
}

export default function FeatureList({ items }: FeatureListProps) {
  const [likeStatus, setLikeStatus] = useState<Record<string, boolean>>({});

  const likeFeedback = (reaction: "like" | "dislike", id: string) => {
    {
      console.log(id);
      setLikeStatus(prev => ({ ...prev, [id]: reaction }));
    }
  }


  if (!items.length) return <p>No features found.</p>;

  return (
    <div className="mb-6 flex flex-col gap-2">
      <ul className="space-y-2 overflow-auto max-h-[42rem]">
        {items.map((item) => (
          <li key={item.id} className="p-2 border rounded flex justify-between items-center">
            <div className="width-14">
              {/* <p className="font-medium">{item.name}</p>
              <p className="text-gray-600 text-sm">{item.description}</p> */}

              {Object.entries(item).map(([key, value]) => (
                <div key={key} className="flex justify-between flex-row items-center">
                  <p className="font-medium capitalize">{key}</p>
                  <p className="text-gray-600">{String(value)}</p>
                </div>
              ))}


              
            </div>
          
            <Link href={`/feature/${item.id}`}>
              <Button variant="secondary">View</Button>
            </Link>

            <div className="flex flex-row gap-2">
            <Button   variant={likeStatus[item.id] === "like" ? "success" : "secondary"} onClick={() => likeFeedback('like', item.id)} disabled={likeStatus[item.id]}>Like</Button>
            <Button   variant={likeStatus[item.id] === "dislike" ? "danger" : "secondary"} onClick={() => likeFeedback('dislike', item.id)} disabled={likeStatus[item.id]}>Dislike</Button>
            </div>

          </li>
        ))}
      </ul>
  </div>
  );
}
