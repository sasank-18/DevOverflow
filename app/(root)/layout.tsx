import LeftSideBar from "@/components/shared/LeftSideBar";
import RightSideBar from "@/components/shared/RightSideBar";
import Navbar from "@/components/shared/navbar/Navbar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="background-light850_dark100 relative">
      <Navbar />
      <div className="flex">
        <LeftSideBar />
        <section className="flex min-h-screen flex-1  flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-28">
          <div className="mx-auto w-full  ">{children}</div>
        </section>
        <RightSideBar />
      </div>
      toaster
    </main>
  );
};

export default Layout;
