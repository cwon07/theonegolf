// app/rules_and_gathering/page.tsx

"use client"

import { useState } from "react";
import Header from "@/app/components/Header";
import Navbar from "@/app/components/Navbar";

export default function Home() {
  const [selectedMenu, setSelectedMenu ] = useState<string>("");

  const handleSelectMenu = (menu: string) => {
    setSelectedMenu(menu);
  };

  return (
  <div className="min-h-screen bg-gray-100">
      {/* Header & Navbar */}
      <div className="bg-white shadow-md relative z-50">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Header />
          <Navbar onSelectMenu={handleSelectMenu} />
        </div>
      </div>

    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-5xl font-extrabold text-center text-gradient mb-8">
          月賽規則與晚宴
        </h1>

        {/* Monthly Tournament Rules */}
        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-purple-700 mb-4">月賽規則</h2>
          <p className="text-xl text-gray-700 mb-4 font-bold text-blue-900">
            5 - 9 月比賽（4 times）
          </p>
          <ul className="text-xl list-inside pl-6 space-y-4">
            <li className="bg-gray-100 p-4 rounded-md hover:shadow-md transition-shadow relative group">
              請務必確認您的Tee-Time，並早10分鐘抵達Tee台              
            </li>
            <li className="bg-gray-100 p-4 rounded-md hover:shadow-md transition-shadow relative group">
              如有時間衝突，請在比賽前48小時通知管理委員會              
            </li>
            <li className="bg-gray-100 p-4 rounded-md hover:shadow-md transition-shadow relative group">
              比賽時請組長嚴格按照標準規則計算稈數
            </li>
            <li className="bg-gray-100 p-4 rounded-md hover:shadow-md transition-shadow relative group">
              月賽成績會影響您的Handicap, 詳細資料請看差點調整
            </li>
          </ul>
        </section>

        {/* Dinner and Awards */}
        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-purple-700 mb-4">晚宴</h2>
          <p className="text-xl text-gray-700 mb-4 font-bold text-blue-900">
            月賽當晚舉行晚宴與頒獎
          </p>
          <p className="text-xl text-gray-700 mb-4 font-bold text-blue-900">
            舉行會場：XXXX大廳
          </p>
          <p className="text-xl text-gray-700 mb-4 font-bold text-blue-900">
            晚宴時間：XX:XX PM
          </p>

          <h3 className="text-2xl font-semibold text-purple-500 mb-4">獎項總覽：</h3>
          <ul className="text-xl list-inside pl-6 space-y-4">
            <li className="bg-gray-100 p-4 rounded-md hover:shadow-md transition-shadow relative group">
              總稈獎 （<span className="font-bold text-blue-600">男</span>&<span className="font-bold text-red-600">女</span>）
              <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-72 p-4 bg-blue-800 text-white text-xl rounded-md shadow-lg">
              <p className="mb-4">男女分開計算總桿</p>
              <p className="mb-4">總桿獎一年一次為限</p>
              <p className="mb-4">最低稈者勝, 如有平手，以下面方案決定勝負</p>              
              <li className="text-left pl-6">
                <p>1. 差點高者勝</p>
                <p>2. 後九洞比分</p>
                <p>3. 前九洞比分</p>
                <p>4. 年長者為勝</p>
                </li>
              </div>
            </li>
            <li className="bg-gray-100 p-4 rounded-md hover:shadow-md transition-shadow relative group">
              净稈獎 （<span className="font-bold text-blue-600">男</span>&<span className="font-bold text-red-600">女</span>）
              <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-72 p-4 bg-blue-800 text-white text-xl rounded-md shadow-lg">
                <p className="mb-4">新會員第一次參加比賽，淨桿獎不予計算</p>
                <p className="mb-4">新會員第二次參加比賽，淨桿低於標準桿，可得獎，但得獎後需照規矩調桿</p>
                <p className="mb-4">以差點低者勝, 如有平手，以下面方案決定勝負</p>
                <li className="text-left pl-6">
                <p>1. 年長者為勝</p>
                <p>2. 後九洞比分</p>
                <p>3. 前九洞比分</p>
                </li>
              </div>
            </li>
            <li className="bg-gray-100 p-4 rounded-md hover:shadow-md transition-shadow relative group">
              遠稈獎 （<span className="font-bold text-blue-600">男</span>&<span className="font-bold text-red-600">女</span>）
              <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-72 p-4 bg-blue-800 text-white text-xl rounded-md shadow-lg">
              <p className="mb-4">遠桿獎一年一次為限</p>
              </div>
            </li>
            <li className="bg-gray-100 p-4 rounded-md hover:shadow-md transition-shadow relative group">
              最近中間獎 （<span className="font-bold text-green-600">長青</span>）
              <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-72 p-4 bg-blue-800 text-white text-xl rounded-md shadow-lg">
              <p className="mb-4">最近中間獎只開放給長青會員</p>
              <p className="mb-4">必須大於Tee台150碼以上</p>
              </div>
            </li>
            <li className="bg-gray-100 p-4 rounded-md hover:shadow-md transition-shadow relative group">
              男子近洞獎 （Hole 2，7，12，16）
              <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-72 p-4 bg-blue-800 text-white text-xl rounded-md shadow-lg">
              <p className="mb-4">每個洞分開計算</p>
              <p className="mb-4">同一個比賽可重複得獎</p>
              </div>
            </li>
            <li className="bg-gray-100 p-4 rounded-md hover:shadow-md transition-shadow relative group">
              女子近洞獎 （Hole 7，12）
              <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-72 p-4 bg-blue-800 text-white text-xl rounded-md shadow-lg">
              <p className="mb-4">每個洞分開計算</p>
              <p className="mb-4">同一個比賽可重複得獎</p>
              </div>
            </li>
            <li className="bg-gray-100 p-4 rounded-md hover:shadow-md transition-shadow relative group">
              男子混合近洞獎 （Hole 6）
              <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-72 p-4 bg-blue-800 text-white text-xl rounded-md shadow-lg">
              <p className="mb-4">又名第二稈進洞將</p>
              <p className="mb-4">必須以標準稈上果嶺</p>
              </div>
            </li>
            <li className="bg-gray-100 p-4 rounded-md hover:shadow-md transition-shadow relative group">
              女子混合近洞獎 （Hole 12）
              <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-72 p-4 bg-blue-800 text-white text-xl rounded-md shadow-lg">
              <p className="mb-4">又名第二稈進洞將</p>
              <p className="mb-4">必須以標準稈上果嶺</p>
              </div>
            </li>
            <li className="bg-gray-100 p-4 rounded-md hover:shadow-md transition-shadow relative group">
              Birdie (不限次數)
              <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-72 p-4 bg-blue-800 text-white text-xl rounded-md shadow-lg">
              <p className="mb-4">同一個比賽最多18個</p>
              </div>
            </li>
            <li className="bg-gray-100 p-4 rounded-md hover:shadow-md transition-shadow relative group">
              Eagle (不限次數)
              <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-72 p-4 bg-blue-800 text-white text-xl rounded-md shadow-lg">
              <p className="mb-4">同一個比賽最多18個</p>
              </div>
            </li>
            <li className="bg-gray-100 p-4 rounded-md hover:shadow-md transition-shadow relative group">
              Albatrose (不限次數)
              <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-72 p-4 bg-blue-800 text-white text-xl rounded-md shadow-lg">
              <p className="mb-4">同一個比賽最多18個</p>
              <p className="mb-4">本俱樂部成立以來沒人得過</p>
              </div>
            </li>
            <li className="bg-gray-100 p-4 rounded-md hover:shadow-md transition-shadow relative group">
              BB獎
              <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-72 p-4 bg-blue-800 text-white text-xl rounded-md shadow-lg">
              <p className="mb-4">倒數第二名</p>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </div>
    </div>
  );
};


