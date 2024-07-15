"use client"
import React, {  useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {  useRouter, useSearchParams } from "next/navigation";
import { setUrlQuery } from "@/lib/utils";

interface Props {
  filters: {
    name: string;
    value: string;
  }[];
  otherClasses?: string;
  containerClasses?: string;
}

const Filter = ({ filters, otherClasses, containerClasses }: Props) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const searchQuery = searchParams.get('filter')
  const [filterValue, setfilterValue] = useState(searchQuery || "")

  

  const setOnChange = (value : string) =>{
    setfilterValue(value)
    if(value) {
   const updatedURL =   setUrlQuery({
      param : searchParams.toString() , 
      key : "filter",
      searchValue : value
    })
    router.push(updatedURL, {scroll : false})
  }
  }
  return (
    <div className={`relative  ${containerClasses}`}>
      <Select defaultValue = {filterValue || undefined}  onValueChange={setOnChange}>
        <SelectTrigger 

          className={`body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5 ${otherClasses}`}
        >
          <div className="text-dark500_light700 line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a Filter" />
          </div>
        </SelectTrigger>
        <SelectContent 
        >
          <SelectGroup >
            {filters.map((item) => (
              <SelectItem  className="text-dark500_light700 background-light800_dark300" key={item.value} value={item.value}>
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select> 
    </div>
  );
};

export default Filter;
