"use client";
import React from "react";
import { Button } from "../ui/button";
import { setUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

const Pagination = ({
  pageNumber,
  isNext,
}: {
  pageNumber: number;
  isNext: boolean;
}) => {
  
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNavigation = (direction: string) => {
    const page = direction === "prev" ? pageNumber - 1 : pageNumber + 1;

    const updatedUrl = setUrlQuery({
      param: searchParams.toString(),
      key: "page",
      searchValue: page.toString(),
    });

    router.push(updatedUrl);
  };
  return (
    <div className="flex w-full items-center justify-center gap-2">
      <Button
        disabled={pageNumber === 1}
        onClick={() => handleNavigation("prev")}
        className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border dark:text-white"
      >
        Prev
      </Button>

      <div className="flex items-center justify-center rounded-md bg-primary-500 px-3.5 py-2">
        <p className="body-semibold text-light-900">{pageNumber}</p>
      </div>

      <Button
        disabled={!isNext}
        onClick={() => handleNavigation("next")}
        className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border dark:text-white"
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
