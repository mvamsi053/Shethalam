import { useTheme } from "@/contexts/theme-provider";
import { CloudSun, MapIcon, Moon, Sun } from "lucide-react";

import { Link, NavLink } from "react-router-dom";
import SearchComponent from "./SearchComponent";
function Header() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <header className='w-full sticky top-0 z-50  bg-background/80 backdrop-blur border-b supports-[backdrop-filter:blur(0px)]:bg-background/60 py-2'>
      <div className=' flex h-16 items-center justify-between px-4 w-full'>
        <Link to='/' className='flex items-center gap-x-2'>
          <CloudSun size={50} />
          <span className=''>Shethalam</span>
        </Link>
        <div className='flex items-center gap-x-6'>
          <NavLink
            to='/map'
            className={({ isActive }) =>
              isActive
                ? "text-blue-400 flex items-center gap-x-2"
                : " flex items-center gap-x-2"
            }
          >
            <MapIcon size={20} />
            <span className=''>Map</span>
          </NavLink>
          <SearchComponent />
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`${
              isDark ? "rotate-90" : "rotate-0"
            } transition-all duration-300 ease-in-out cursor-pointer`}
          >
            {isDark ? (
              <Sun className='text-yellow-400 rotate-0 transition-all ' />
            ) : (
              <Moon className='text-blue-400 rotate-0 transition-all' />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
