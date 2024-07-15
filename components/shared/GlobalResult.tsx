"use client";
import { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import GlobalFilter from "./GlobalFilter";
import { GlobalSearch } from "@/lib/actions/general.action";
const GlobalResult = () => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState([]);
  const global = searchParams.get("global");
  const type = searchParams.get("type");


  const fetchResult = async () => {
    setResult([]);
    setIsLoading(true);
    try {
    
      const res = await GlobalSearch({
        query : global,
        type 
      })
      console.log('res',res)
      setResult(JSON.parse(res))
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(!global) return ;
    fetchResult();
  }, [global, type]);

  const renderLink = (type: string, id: string) => {
    return type === 'user'? `/profile/${id}` : type ==='answer'? `/question/${id}`:`/${type}/${id}`;
  };

  console.log("rsult",result)


  return (
    <div
      onMouseDown={(e) => {
       e.preventDefault()
      }}
      onClick={()=>{
        console.log('close')
      }}
      className=" absolute mt-1 w-full rounded-lg bg-light-800 px-5 py-3 shadow-sm dark:bg-dark-300 dark:text-white "
    >
      <GlobalFilter />
      <div className="my-4 h-px bg-dark-400/20 dark:bg-light-700/50" />
      <div className="space-y-3">
        <p className="text-dark400_light900 paragraph-semibold ">Top Match</p>

        {isLoading ? (
          <div className="flex-center flex-col px-5">
            <ReloadIcon className="my-2 size-10 animate-spin text-primary-500" />
            <p className="text-dark200_light800 body-regular">
              Browsing the entire database
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {result.length > 0 ? (
              result.map((item: any, index: number) => (
                <Link
                  key={index}
                  href={renderLink(item.type, item.id)}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-full px-4 py-1 hover:bg-light-700/50  hover:dark:bg-dark-500/50 "
                >     
                  <Image
                    src="/assets/icons/tag.svg"
                    alt="tags"
                    width={18}
                    height={18}
                    className=" invert-colors mt-1 object-contain"
                  />

                  <div className="flex flex-col">
                    <p className="body-medium text-dark200_light800 line-clamp-1">
                      {item.title}
                    </p>
                    <p className="small-medium mt-1 font-bold capitalize text-light-400 ">
                      {item.type}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex-center flex-col px-5">
                <p className="text-dark200_light800 body-regular px-5 py-2.5">
                  Oops, no results found
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalResult;
