"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarLinks } from "@/constant";
import { SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavContent = () => {
  // usePathname only be used in client components
  const pathname = usePathname();
  console.log(pathname);
  return (
    <section className="flex size-full flex-col gap-6 pt-16">
      {sidebarLinks.map((item) => {
        const isActive = pathname === item.route;
        return (
          <SheetClose asChild className="" key={item.route}>
            <Link
              href={item.route}
              className={`${isActive ? "primary-gradient rounded-lg text-light-900" : "text-dark300_light900"} flex items-center justify-start gap-4 bg-transparent p-4`}
            >
              <Image
              className={`${isActive ? '': "invert-colors"} `}
                alt={item.label}
                width={20}
                height={20}
                src={item.imgURL}
              />
              <p className={`${isActive ? 'base-bold' : 'base-medium'}`}>{item.label}</p>
            </Link>
          </SheetClose>
        );
      })}
    </section>
  );
};

const MobileNav = () => {
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Image
            width={36}
            height={36}
            alt="Menu"
            className=" invert-colors  sm:hidden "
            src="/assets/icons/hamburger.svg"
          />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="background-light900_dark200 overflow-y-auto custom-scrollbar  border-none"
        >
          {/* logo link */}
          <Link href="/" className="flex items-center gap-1">
            <Image
              width={23}
              alt="DevOverflow"
              height={23}
              src="/assets/images/site-logo.svg"
            />
            <p className="h2-bold text-dark100_light900 font-spaceGrotesk">
              Dev <span className="text-primary-500">Overflow</span>
            </p>
          </Link>

          <div>
            {/* Navigation link for diff pages  */}
            <SheetClose asChild className="w-full outline-none">
              <NavContent />
            </SheetClose>
            {/* signup and signin url  */}
            <SignedOut>
              <div className="btn-secondary my-2 flex flex-col gap-3 rounded-lg shadow-none">
                <SheetClose asChild>
                  <Link href="/sign-in">
                    <Button className="small-medium  primary-text-gradient min-h-[41px] w-full   px-4 py-3 ">
                      Log In
                    </Button>
                  </Link>
                </SheetClose>
              </div>
              <div className="light-border-2 btn-tertiary my-2 flex flex-col gap-3 rounded-lg shadow-none">
                <SheetClose asChild>
                  <Link href="/sign-in">
                    <Button className="small-medium  text-dark400_light900 min-h-[41px] w-full   px-4 py-3 ">
                      Sign Up
                    </Button>
                  </Link>
                </SheetClose>
              </div>
            </SignedOut>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
