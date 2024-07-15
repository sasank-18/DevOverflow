import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center  bg-auth-light bg-cover bg-center bg-no-repeat dark:bg-auth-dark">
      {children}
    </div>
  );
};

export default Layout;
