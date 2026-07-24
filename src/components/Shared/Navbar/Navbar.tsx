"use client";

import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [  
  // { path: "/", label: "Guides" },
  // { path: "/onsite", label: "App URL" }, 
  // { path: "/alt-text", label: "Alt Text" },
  // { path: "/html-format-d", label: "HTML Format (D)" },
  // { path: "/html-format-m", label: "HTML Format (M)" },   
  // { path: "/innov-id", label: "Innov ID" },
  // { path: "/onsite", label: "Onsite" },
  // { path: "/post-cmx", label: "Posts" },
  { path: "/", label: "Previews" },
  { path: "/creatives", label: "Creatives" },
  { path: "/codes", label: "Codes" },
  { path: "/image-names", label: "Image Names" },
  { path: "/ss-sr", label: "SS & SR" },
  { path: "/paths", label: "Paths" },
  { path: "/team", label: "Team" },
  { path: "/post", label: "Post" },
  { path: "/qa", label: "QA" },
  { path: "/daily", label: "Daily" },  
];

const Navbar = () => {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-green-700 to-green-600 text-white shadow-md sticky top-0 z-50 py-3 lg:py-5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center gap-10">
          <div className="text-2xl font-bold cursor-pointer">My Tools Hub </div>

          <ul className="hidden lg:flex flex-wrap gap-6">
            {routes.map((route) => (
              <li key={route.path} className="relative">
                <Link
                  href={route.path}
                  className={`relative text-white hover:text-gray-200 transition-colors duration-300
                    after:block after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5
                    after:bg-white after:scale-x-0 after:origin-center after:transition-transform after:duration-300
                    ${
                      pathname === route?.path
                        ? "after:scale-x-100 font-bold"
                        : ""
                    } 
                    hover:after:scale-x-100`}
                >
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="lg:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              initial={false}
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="focus:outline-none"
            >
              <motion.div
                key={isOpen ? "close" : "menu"}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="lg:hidden fixed top-[3.6rem] overflow-y-auto right-0 h-full w-72 bg-green-600 shadow-lg z-50"
          >
            <ul className="flex flex-col gap-4 py-6 px-4">
              {routes.map((route) => (
                <motion.li
                  key={route.path}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    href={route.path}
                    className={`block py-2 rounded px-4 text-center transition-colors ${
                      pathname === route?.path
                        ? "bg-white text-green-500 font-bold"
                        : "hover:bg-green-500"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {route.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
