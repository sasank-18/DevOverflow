"use client";
import { sidebarLinks } from "@/constant";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { SignedOut } from "@clerk/nextjs";

const LeftSideBar = () => {
  const pathname = usePathname();
  return (
    <div className="background-light900_dark200 light-border custom-scrollbar sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
      <div className="flex size-full flex-col gap-6 ">
        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route;
          return (
            <Link
              key={item.route}
              href={item.route}
              className={`${isActive ? "primary-gradient rounded-lg text-light-900" : "text-dark300_light900"} flex items-center justify-start gap-4 bg-transparent p-4`}
            >
              <Image
                className={`${isActive ? "" : "invert-colors"} `}
                alt={item.label}
                width={20}
                height={20}
                src={item.imgURL}
              />
              <p
                className={`${isActive ? "base-bold" : "base-medium"} max-lg:hidden `}
              >
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>
      <SignedOut>
        <div className="btn-secondary my-2 mt-16 flex flex-col gap-3 rounded-lg shadow-none">
          <Link href="/sign-in">
            <Button className="small-medium  primary-text-gradient min-h-[41px] w-full   px-4 py-3 ">
                <Image
                src='/assets/icons/account.svg'
                alt="login"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
                />    
              <span className="max-lg:hidden">Log In</span>
            </Button>
          </Link>
        </div>
        <div className="light-border-2 btn-tertiary my-2 flex flex-col gap-3 rounded-lg shadow-none">
          <Link href="/sign-in">
            <Button className="small-medium  text-dark400_light900 min-h-[41px] w-full   px-4 py-3 ">
            <Image
                src='/assets/icons/sign-up.svg'
                alt="login"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
                />   
              <span className="max-lg:hidden">Sign In</span>
            </Button>
          </Link>
        </div>
      </SignedOut>
    </div>
  );
};

export default LeftSideBar;
