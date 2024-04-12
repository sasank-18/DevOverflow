"use client";
import React from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useTheme } from "@/context/ThemeProvider";
import Image from "next/image";
import { themes } from "@/constant";
const Theme = () => {
  const { mode, setMode } = useTheme();

  return (
    <Menubar className="relative border-none  shadow-none">
      <MenubarMenu>
        <MenubarTrigger className="focus:bg-light-900 data-[state=open]:bg-light-900 dark:focus:bg-dark-200 dark:data-[state=open]:bg-dark-200">
          {mode === "light" ? (
            <Image
              className="active-theme"
              height={20}
              width={20}
              alt="sun"
              src="/assets/icons/sun.svg"
            />
          ) : (
            <Image
              className="active-theme"
              height={20}
              width={20}
              alt="sun"
              src="/assets/icons/moon.svg"
            />
          )}
        </MenubarTrigger>
        <MenubarContent className="absolute -left-8 right-[-3] mt-3 min-w-[120px] cursor-pointer rounded-sm border bg-white py-2 dark:border-dark-400 dark:bg-dark-300 ">
          {themes.map((item) => (
            <MenubarItem
              onClick={() => {
                setMode(item.value);
                if (item.value !== "system") {
                  localStorage.theme = item.value;
                } else {
                  localStorage.removeItem("theme");
                }
              }}
              className=" flex cursor-pointer items-center gap-2 px-2.5 py-2 dark:focus:bg-dark-400 "
              key={item.value}
            >
              <Image
                src={item.icon}
                alt={item.value}
                width={16}
                height={16}
                className={` ${mode === item.value && "active-theme"}`}
              />
              <p
                className={`cursor-pointer  pl-2 font-semibold text-light-500 ${mode === item.value ? "active-theme" : "text-dark100_light900"}`}
              >
                {item.label}
              </p>
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default Theme;
