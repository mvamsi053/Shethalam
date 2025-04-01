import type { ReactNode } from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
interface LayoutProps {
  children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div
      className={`flex flex-col flex-auto gap-y-4 bg-gradient-to-br from-background to-muted`}
    >
      <Header />
      <main className='flex flex-col flex-auto px-4 min-h-screen'>
        {children}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
