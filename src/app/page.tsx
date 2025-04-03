"use client";

import { useState } from "react";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Carousel from "./components/Carousel";

export default function Home() {
  const [selectedMenu, setSelectedMenu] = useState<string>("");

  const handleSelectMenu = (menu: string) => {
    setSelectedMenu(menu);
  };

  return (
    <>  
      <div className="min-h-screen bg-gray-100">
        {/* Header & Navbar */}
        <div className="bg-white shadow-md relative z-50 w-full">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between border-b border-gray-300 shadow-sm p-4">
            <div className="flex justify-center md:justify-start">
              <Header />
            </div>
            <div className="flex justify-center md:justify-start md:flex-nowrap">
              <Navbar onSelectMenu={handleSelectMenu} />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col items-center pt-2 pb-8 bg-gray-100 min-h-screen px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-center pt-2 mb-4"></h1>
          <div className="w-full max-w-6xl p-4 bg-white shadow-lg rounded-lg h-[75vh] flex items-center justify-center overflow-hidden">
            <Carousel />
          </div> 
        </div>
      </div>
    </>
  );
}
