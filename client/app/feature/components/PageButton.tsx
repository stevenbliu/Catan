import { FeatureItem } from "../types/feature";
import Button from "../../../shared_components/UI/Button";
import Link from "next/link";


interface ButtonProps {
  // items: FeatureItem[];
  currentPage: number;            // optional if using client-side pagination
  onPageChange: (page: number) => void; // optional callback
  totalPages: number;
}

export default function PageButton({ currentPage, onPageChange, totalPages }: ButtonProps) {

  const nextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  return (
    <div className="mb-1 flex flex-col gap-2">
    <div className="mb-1 flex flexcol gap-2">
          <Button variant="secondary" className="flex-1" onClick={prevPage} disabled={currentPage === 1}>Previous Page</Button>
          <Button variant="secondary" className="flex-1" onClick={nextPage} disabled={currentPage === totalPages}>Next Page</Button>
    </div>

  </div>
  );
}
