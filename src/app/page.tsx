"use client"

import { useState } from "react";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Carousel from "./components/Carousel";

export default function Home() {
  const [selectedMenu, setSelectedMenu ] = useState<string>("");

  const handleSelectMenu = (menu: string) => {
    setSelectedMenu(menu);
  };

  return (
    <>  
      <div className="min-h-screen bg-gray-100">
      {/* Header & Navbar */}
      <div className="bg-white shadow-md relative z-50">
        <div className="container mx-auto flex items-center justify-between border-b border-gray-300 shadow-sm p-4">
          <Header />
          <Navbar onSelectMenu={handleSelectMenu} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col items-center pt-16 pb-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-4">Monday Club</h1>
      <div className="w-full max-w-6xl p-4 bg-white shadow-lg rounded-lg h-[70vh] flex items-center justify-center">
           <Carousel />
         </div> 
        </div>
        </div>
    </>
  );
}