import { GlobalSearchFilters } from "@/constant/filter";
import { removeUrlQuery, setUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const GlobalFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("type");
  const [isActive, setIsActive] = useState(query || "");

  const TypeSubmission = (type: string) => {
    if (type !== query) {
      setIsActive(type);
      const newURL = setUrlQuery({
        param: searchParams.toString(),
        key: "type",
        searchValue: type,
      });
      router.push(newURL, { scroll: false });
    } else {
      setIsActive("");
      const newURL = removeUrlQuery({
        param: searchParams.toString(),
        keyToRemove: ["type"],
      });
      router.push(newURL, { scroll: false });
    }
  };

  return (
    <div className="flex  items-center gap-5 ">
      <p className="text-dark400_light900 body-medium">Type:</p>
      <div className="flex  gap-5 p-1 ">
        {GlobalSearchFilters.map((item) => (
          <button
            type="button"
            key={item.value}
            className={`light-border-2 small-medium rounded-2xl  px-5 py-2 capitalize  ${isActive === item.value ? `bg-primary-500` : `bg-slate-200 hover:bg-slate-400 dark:bg-slate-800 dark:hover:bg-slate-700 `}  dark:text-light-800`}
            onClick={() => {
              TypeSubmission(item.value);
            }}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GlobalFilter;
