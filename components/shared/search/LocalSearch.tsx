"use client";

import { Input } from "@/components/ui/input";
import { removeUrlQuery, setUrlQuery } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface CustomInputProps {
  route: string;
  iconPosition: string;
  imgSrc: string;
  placeHolder: string;
  otherClasses?: string;
}

const LocalSearch = ({
  route,
  iconPosition,
  imgSrc,
  placeHolder,
  otherClasses,
}: CustomInputProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [searchValue, setsearchValue] = useState(query || "");

  useEffect(() => {
    const debounceDelay = setTimeout(() => {
      if (searchValue) {
        const newURL = setUrlQuery({
          param: searchParams.toString(),
          key: "q",
          searchValue,
        });
        console.log("love", pathname);

        router.push(newURL, { scroll: false });
      } else {
        if (route === pathname) {
          const newURL = removeUrlQuery({
            param: searchParams.toString(),
            keyToRemove: ["q"],
          });

          router.push(newURL, { scroll: false });
        }
      }
    }, 200);

    return () => clearTimeout(debounceDelay);
  }, [searchValue, searchParams, route, pathname, router]);

  const handleOnchange = (e: any) => {
    setsearchValue(e.target.value);
  };

  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px]  flex-1 items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          alt="search Icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}

      <Input
        type="text"
        placeholder={placeHolder}
        onChange={handleOnchange}
        value={searchValue}
        className="paragraph-regular no-focus background-light800_darkgradient placeholder text-dark400_light700 border-none shadow-none outline-none"
      />

      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          alt="search Icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default LocalSearch;
