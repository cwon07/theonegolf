"use client";

import { useState } from "react";
import Header from "@/app/components/Header";
import Navbar from "@/app/components/Navbar";

export default function Home() {
  const [selectedMenu, setSelectedMenu] = useState<string>("");

  const handleSelectMenu = (menu: string) => {
    setSelectedMenu(menu);
  };

  return (
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

      <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
        <div className="max-w-4xl w-full bg-white shadow-lg rounded-xl p-6">
          <h1 className="text-black text-5xl font-extrabold text-center text-gradient mb-8">
          差點調整詳解
          </h1>

          {/* Monthly Tournament Rules */}
          <section className="mb-8 text-center font-bold">
            <h2 className="text-3xl font-semibold text-purple-700 mb-4">本年度差點調整規則</h2>
            <ul className="text-xl list-none space-y-4">
              <li className="text-black bg-gray-100 p-4 rounded-md shadow-md">
                得總桿冠軍者，不論男女，調一桿
              </li>
              <li className="text-black bg-gray-100 p-4 rounded-md shadow-md"> 新會員第一次參賽會以比賽成績成立初始差點, 如無參照差點 (完全新手) 則直接以 <span className="text-blue-800"> 30(男)</span>，<span className="text-red-800"> 35(女)</span> 計算 </li>
              <li className="text-black bg-gray-100 p-4 rounded-md shadow-md"> 如果已有USGA或其他俱樂部正式差點，經過委員會同意則可以直接採用 (第一場比賽仍需照新會員規則調桿一次) </li>
              <li className="text-black bg-gray-100 p-4 rounded-md shadow-md">
                净桿得獎者，不論男女，照以下表格調桿
              </li>
              
              <div className="mt-8 overflow-x-auto">
                {/* First Table (7 rows, 6 columns) */}
                <table className="min-w-[600px] text-black text-sm sm:text-base table-auto border-collapse border border-black w-full mb-8">
                <thead>
                  <tr className="text-blue-800">
                    <th className="border border-gray-300 p-1 w-12">差點<br/>名次</th>
                    <th className="border border-gray-300 p-1 w-4">0-9</th>
                    <th className="border border-gray-300 p-1 w-4">10-15</th>
                    <th className="border border-gray-300 p-1 w-4">16-21</th>
                    <th className="border border-gray-300 p-1 w-4">22-26</th>
                    <th className="border border-gray-300 p-1 w-4">27-32</th>
                    <th className="border border-gray-300 p-1 w-4">33-38</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-blue-800 border border-gray-300 p-2">第1名</td>
                    <td className="border border-gray-300 p-2">1</td>
                    <td className="border border-gray-300 p-2">2</td>
                    <td className="border border-gray-300 p-2">3</td>
                    <td className="border border-gray-300 p-2">4</td>
                    <td className="border border-gray-300 p-2">5</td>
                    <td className="border border-gray-300 p-2">6</td>
                  </tr>
                  <tr>
                    <td className="text-blue-800 border border-gray-300 p-2">第2名</td>
                    <td className="border border-gray-300 p-2">0</td>
                    <td className="border border-gray-300 p-2">1</td>
                    <td className="border border-gray-300 p-2">2</td>
                    <td className="border border-gray-300 p-2">3</td>
                    <td className="border border-gray-300 p-2">4</td>
                    <td className="border border-gray-300 p-2">5</td>
                  </tr>
                  <tr>
                    <td className="text-blue-800 border border-gray-300 p-2">第3名</td>
                    <td className="border border-gray-300 p-2">0</td>
                    <td className="border border-gray-300 p-2">0</td>
                    <td className="border border-gray-300 p-2">1</td>
                    <td className="border border-gray-300 p-2">2</td>
                    <td className="border border-gray-300 p-2">3</td>
                    <td className="border border-gray-300 p-2">4</td>
                  </tr>
                  <tr>
                    <td className="text-blue-800 border border-gray-300 p-2">第4名</td>
                    <td className="border border-gray-300 p-2">0</td>
                    <td className="border border-gray-300 p-2">0</td>
                    <td className="border border-gray-300 p-2">0</td>
                    <td className="border border-gray-300 p-2">1</td>
                    <td className="border border-gray-300 p-2">2</td>
                    <td className="border border-gray-300 p-2">3</td>
                  </tr>
                  <tr>
                    <td className="text-blue-800 border border-gray-300 p-2">第5名</td>
                    <td className="border border-gray-300 p-2">0</td>
                    <td className="border border-gray-300 p-2">0</td>
                    <td className="border border-gray-300 p-2">0</td>
                    <td className="border border-gray-300 p-2">0</td>
                    <td className="border border-gray-300 p-2">1</td>
                    <td className="border border-gray-300 p-2">2</td>
                  </tr>
                 
                </tbody>
              </table>
              </div>
              
              <div className="mt-8 overflow-x-auto">
                {/* First Table (7 rows, 6 columns) */}
                <table className="min-w-[600px] text-black text-sm sm:text-base table-auto border-collapse border border-black w-full mb-8">
                <thead>
                  <tr className="text-blue-800">
                    <th className="border border-gray-300 p-1 w-16">差桿<br/>差點</th>
                    <th className="border border-gray-300 p-1 w-2">1</th>
                    <th className="border border-gray-300 p-1 w-2">2</th>
                    <th className="border border-gray-300 p-1 w-2">3</th>
                    <th className="border border-gray-300 p-1 w-2">4</th>
                    <th className="border border-gray-300 p-1 w-2">5</th>
                    <th className="border border-gray-300 p-1 w-2">6</th>
                    <th className="border border-gray-300 p-1 w-2">7</th>
                    <th className="border border-gray-300 p-1 w-2">8</th>
                    <th className="border border-gray-300 p-1 w-2">9</th>
                    <th className="border border-gray-300 p-1 w-2">10</th>
                    <th className="border border-gray-300 p-1 w-2">11</th>
                    <th className="border border-gray-300 p-1 w-2">12</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-blue-800 border border-gray-300 p-2">0-9</td>
                    <td className="border border-gray-300 p-2">0</td>
                    <td className="border border-gray-300 p-2">1</td>
                    <td className="border border-gray-300 p-2">1</td>
                    <td className="border border-gray-300 p-2">1</td>
                    <td className="border border-gray-300 p-2">1</td>
                    <td className="border border-gray-300 p-2">2</td>
                    <td className="border border-gray-300 p-2">2</td>
                    <td className="border border-gray-300 p-2">2</td>
                    <td className="border border-gray-300 p-2">2</td>
                    <td className="border border-gray-300 p-2">3</td>
                    <td className="border border-gray-300 p-2">3</td>
                    <td className="border border-gray-300 p-2">3</td>
                  </tr>
                  <tr>
                  <td className="text-blue-800 border border-gray-300 p-2">10-15</td>
                    <td className="border border-gray-300 p-2">0</td>
                    <td className="border border-gray-300 p-2">1</td>
                    <td className="border border-gray-300 p-2">1</td>
                    <td className="border border-gray-300 p-2">1</td>
                    <td className="border border-gray-300 p-2">2</td>
                    <td className="border border-gray-300 p-2">2</td>
                    <td className="border border-gray-300 p-2">2</td>
                    <td className="border border-gray-300 p-2">3</td>
                    <td className="border border-gray-300 p-2">3</td>
                    <td className="border border-gray-300 p-2">3</td>
                    <td className="border border-gray-300 p-2">4</td>
                    <td className="border border-gray-300 p-2">4</td>
                  </tr>
                  <tr>
                    <td className="text-blue-800 border border-gray-300 p-2">16-21</td>
                    <td className="border border-gray-300 p-2">1</td>
                    <td className="border border-gray-300 p-2">1</td>
                    <td className="border border-gray-300 p-2">2</td>
                    <td className="border border-gray-300 p-2">2</td>
                    <td className="border border-gray-300 p-2">3</td>
                    <td className="border border-gray-300 p-2">3</td>
                    <td className="border border-gray-300 p-2">4</td>
                    <td className="border border-gray-300 p-2">4</td>
                    <td className="border border-gray-300 p-2">5</td>
                    <td className="border border-gray-300 p-2">5</td>
                    <td className="border border-gray-300 p-2">6</td>
                    <td className="border border-gray-300 p-2">6</td>
                  </tr>
                  <tr>
                    <td className="text-blue-800 border border-gray-300 p-2">22-26</td>
                    <td className="border border-gray-300 p-2">1</td>
                    <td className="border border-gray-300 p-2">2</td>
                    <td className="border border-gray-300 p-2">2</td>
                    <td className="border border-gray-300 p-2">3</td>
                    <td className="border border-gray-300 p-2">4</td>
                    <td className="border border-gray-300 p-2">4</td>
                    <td className="border border-gray-300 p-2">5</td>
                    <td className="border border-gray-300 p-2">6</td>
                    <td className="border border-gray-300 p-2">6</td>
                    <td className="border border-gray-300 p-2">7</td>
                    <td className="border border-gray-300 p-2">8</td>
                    <td className="border border-gray-300 p-2">8</td>
                  </tr>
                  <tr>
                    <td className="text-blue-800 border border-gray-300 p-2">27-32</td>
                    <td className="border border-gray-300 p-2">1</td>
                    <td className="border border-gray-300 p-2">2</td>
                    <td className="border border-gray-300 p-2">3</td>
                    <td className="border border-gray-300 p-2">4</td>
                    <td className="border border-gray-300 p-2">5</td>
                    <td className="border border-gray-300 p-2">6</td>
                    <td className="border border-gray-300 p-2">7</td>
                    <td className="border border-gray-300 p-2">8</td>
                    <td className="border border-gray-300 p-2">9</td>
                    <td className="border border-gray-300 p-2">10</td>
                    <td className="border border-gray-300 p-2">11</td>
                    <td className="border border-gray-300 p-2">12</td>
                  </tr>
                  <tr>
                    <td className="text-blue-800 border border-gray-300 p-2">33-38</td>
                    <td className="border border-gray-300 p-2">1</td>
                    <td className="border border-gray-300 p-2">2</td>
                    <td className="border border-gray-300 p-2">3</td>
                    <td className="border border-gray-300 p-2">5</td>
                    <td className="border border-gray-300 p-2">6</td>
                    <td className="border border-gray-300 p-2">7</td>
                    <td className="border border-gray-300 p-2">8</td>
                    <td className="border border-gray-300 p-2">9</td>
                    <td className="border border-gray-300 p-2">10</td>
                    <td className="border border-gray-300 p-2">12</td>
                    <td className="border border-gray-300 p-2">13</td>
                    <td className="border border-gray-300 p-2">14</td>
                  </tr>
                </tbody>
              </table>
              </div>
              <li className="text-black bg-gray-100 p-4 rounded-md shadow-md">
                <p className="text-blue-500"> 調桿例子 1</p> 
                <p>差點18，第二名，總桿83</p>
                <p>18 - 2 (第一表格) - 4 (第二表格) = 12 （新差點）</p>
              </li>

              <li className="text-black bg-gray-100 p-4 rounded-md shadow-md">
                <p className="text-blue-500"> 調桿例子 2</p> 
                <p>差點32，第1名，總桿83</p>
                <p>32 - 5 (第一表格) - 21 (第二表格,如爆表將按照現有表格推算) = 6 （新差點）</p>
              </li>
              <li className="text-black bg-gray-100 p-4 rounded-md shadow-md">
                <p className="text-blue-500"> 新會員調桿例子</p> 
                <p>差點34，總桿92</p>
                <p>34 - 16 (第二表格,如爆表將按照現有表格推算) = 18 （新差點）</p>
              </li>            
            </ul>
          </section>

          <section className="text-black mb-8 text-center font-bold">
            <h2 className="text-3xl font-semibold text-purple-700 mb-4">新年度差點調整規則</h2>
            <ul className="text-xl list-none space-y-4">
            <li className="bg-gray-100 p-4 rounded-md shadow-md">
                <p>(最好+最差) / 2 = 差點 1</p>
                <p>年度最後差點 = 差點 2</p>
                <p>新年度差點 = (差點 1+差點 2) / 2</p>
              </li>
              <li className="bg-gray-100 p-4 rounded-md shadow-md">
                最好與最差，最多相差9桿，如超過則以9桿計算
              </li>
              <li className="bg-gray-100 p-4 rounded-md shadow-md">
                差點超過26桿，最好最差不以9桿為限 （可超過）
              </li>
            </ul>
          </section>

          
        </div>
      </div>
    </div>
  );
}



