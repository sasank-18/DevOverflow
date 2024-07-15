"use client";

import { HomePageFilters } from "@/constant/filter";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { removeUrlQuery, setUrlQuery } from "@/lib/utils";

const HomeFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get("filter");
  const [filterValue, setfilterValue] = useState(searchQuery || "");

  const setOnChange = (value: string) => {
    if (filterValue !== value) {
      setfilterValue(value);
      const updatedURL = setUrlQuery({
        param: searchParams.toString(),
        key: "filter",
        searchValue: value,
      });
      router.push(updatedURL, { scroll: false });
    } else {
      setfilterValue("");
      const updatedURL = removeUrlQuery({
        param: searchParams.toString(),
        keyToRemove: ["filter"],
      });
      router.push(updatedURL, { scroll: false });
    }
  };

  const active = filterValue;
  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((item) => (
        <Button
          className={`body-medium rounded-lg px-6 py-3  capitalize shadow-sm
        ${
          active === item.value
            ? "bg-primary-100 text-primary-500 dark:bg-dark-300"
            : "bg-light-800 text-light-500 dark:bg-dark-300"
        }`}
          key={item.value}
          onClick={() => {
            setOnChange(item.value);
          }}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilter;
