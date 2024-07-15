"use client";
import { Input } from "@/components/ui/input";
import { removeUrlQuery, setUrlQuery } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import GlobalResult from "../GlobalResult";

const GlobalSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("global");
  const [search, setSearch] = useState(query || "");
  const [isOpen, setisOpen] = useState(false);
 
  useEffect(() => {
   setisOpen(false)
   setSearch("")
  }, [pathname, router])
  

  useEffect(() => {
    const debounceDelay = setTimeout(() => {
      if (search) {
        const newURL = setUrlQuery({
          param: searchParams.toString(),
          key: "global",
          searchValue: search,
        });
        router.push(newURL, { scroll: false });
      } else {
        const newURL = removeUrlQuery({
          param: searchParams.toString(),
          keyToRemove: ["global", "type"],
        });
        setisOpen(false);
        router.push(newURL, { scroll: false });
      }
    }, 200);

    return () => clearTimeout(debounceDelay);
  }, [search, router, pathname, searchParams]);



  return (
    // max-lg:hidden
    <div className="relative w-full max-w-[600px] ">
      <div className="background-light800_darkgradient  relative flex min-h-[56px] items-center gap-1 rounded-xl px-4">
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />
        <Input
          type="text"
          placeholder="Search globally"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            e.target.value && setisOpen(true);
          }}
          onBlur={() => {
            setSearch("");
            setisOpen(false);
          }}
          className=" paragraph-regular placeholder background-light800_darkgradient border-none shadow-none outline-none active:text-red-700 dark:text-white "
        />
      </div>
      {isOpen && <GlobalResult  />}
    </div>
  );
};

export default GlobalSearch;
