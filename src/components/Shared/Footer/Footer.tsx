"use client";

import React from "react";
import { motion } from "framer-motion";

const Footer: React.FC = () => {
  return (
    <motion.footer
      className="bg-gradient-to-r from-green-700 to-green-600 text-white py-4 mt-10 shadow-lg"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto text-center px-4">
        <p className="text-yellow-300 font-medium mb-3">
          ⚠ ToolsHub is in testing mode. Please double-check your inputs.
        </p>

        {/* <p className="mb-3 text-lg">
          Contact us:{" "}
          <a
            href="https://wa.me/+8801767094404"
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-200 underline hover:text-white transition-colors"
          >
            WhatsApp
          </a>
        </p> */}

        <div className="w-24 mx-auto border-b border-white/40 mb-3"></div>

        <p className="text-sm text-white/80">
          &copy; {new Date().getFullYear()} ToolsHub. All rights reserved.
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
