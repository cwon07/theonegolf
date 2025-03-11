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
      <div className="bg-white shadow-md relative z-50">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Header />
          <Navbar onSelectMenu={handleSelectMenu} />
        </div>
      </div>

      <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
        <div className="max-w-4xl w-full bg-white shadow-lg rounded-xl p-6">
          <h1 className="text-5xl font-extrabold text-center text-gradient mb-8">
            月賽規則與晚宴
          </h1>

          {/* Monthly Tournament Rules */}
          <section className="mb-8 text-center font-bold">
            <h2 className="text-3xl font-semibold text-purple-700 mb-4">月賽規則</h2>
            <p className="text-xl text-gray-700 mb-4 font-bold text-blue-900">
              5 - 9 月比賽（4 times）
            </p>
            <ul className="text-xl list-none space-y-4">
              <li className="bg-gray-100 p-4 rounded-md shadow-md">
                請務必確認您的Tee-Time，並早10分鐘抵達Tee台
              </li>
              <li className="bg-gray-100 p-4 rounded-md shadow-md">
                如有時間衝突，請在比賽前48小時通知管理委員會
              </li>
              <li className="bg-gray-100 p-4 rounded-md shadow-md">
                比賽時請組長嚴格按照標準規則計算稈數
              </li>
              <li className="bg-gray-100 p-4 rounded-md shadow-md">
                月賽成績會影響您的Handicap, 詳細資料請看差點調整
              </li>
            </ul>
          </section>

          {/* Dinner and Awards */}
          <section className="mb-8 text-center">
            <h2 className="text-3xl font-semibold text-purple-700 mb-4">晚宴</h2>
            <p className="text-xl text-gray-700 mb-4 font-bold">
              月賽當晚舉行晚宴與頒獎
            </p>
            <p className="text-xl text-gray-700 mb-4 font-bold">
              舉行會場：XXXX大廳
            </p>
            <p className="text-xl text-gray-700 mb-4 font-bold">
              晚宴時間：XX:XX PM
            </p>

            <h3 className="text-2xl font-semibold text-purple-700 mb-4">獎項總覽：</h3>
            <ul className="text-xl list-none space-y-4 font-bold">
              <li className="bg-gray-100 p-4 rounded-md shadow-md ">
              <span className="font-bold text-purple-600"> 總稈獎</span> （<span className="font-bold text-blue-600">男</span>&
                <span className="font-bold text-red-600">女</span>）
                <p className="font-bold text-yellow-600"> 獎勵：球（一盒）</p>
                <p>總桿獎一年一次為限， 男女分開計</p>
                <p>最低稈者勝, 如有平手，以下面方案決定勝負</p>
                <ul className="text-center pl-6">
                  <li>1. 差點高者勝</li>
                  <li>2. 後九洞比分</li>
                  <li>3. 前九洞比分</li>
                  <li>4. 年長者為勝</li>
                </ul>
              </li>
              <li className="bg-gray-100 p-4 rounded-md shadow-md">
              <span className="font-bold text-purple-600"> 净稈獎 </span> （<span className="font-bold text-blue-800">男</span>&
                <span className="font-bold text-red-800">女</span>）
                <p className="font-bold text-yellow-600"> 第1名獎勵：球（1盒）</p>
                <p className="font-bold text-yellow-600"> 第2名獎勵：球（3條）</p>
                <p className="font-bold text-yellow-600"> 第3名獎勵：球（2條）</p>
                <p className="font-bold text-yellow-600"> 第4名獎勵：球（2條）</p>
                <p className="font-bold text-yellow-600"> 第5名獎勵：球（2條）</p>
                <p>得獎次數無限制, 男女分開計算</p>
                <p>新會員第一次參加比賽，淨桿獎不予計算</p>
                <p>新會員第二次參加比賽，淨桿低於標準桿，可得獎，但得獎後需照規矩調桿</p>
                <p>以差點低者勝, 如有平手，以下面方案決定勝負</p>
                <ul className="text-center pl-6">
                  <li>1. 年長者為勝</li>
                  <li>2. 後九洞比分</li>
                  <li>3. 前九洞比分</li>
                </ul>
              </li>
              <li className="bg-gray-100 p-4 rounded-md shadow-md">
              <span className="font-bold text-purple-600"> 遠稈獎 </span> （<span className="font-bold text-blue-800">男</span>&
                <span className="font-bold text-red-800">女</span>）
                <p className="font-bold text-yellow-600"> 獎勵：球（2條）</p>
                <p>遠桿獎一年一次為限, 男女分開計算</p>
              </li>
              <li className="bg-gray-100 p-4 rounded-md shadow-md">
              <span className="font-bold text-green-800"> 最近中間獎 (長青)</span>
              <p className="font-bold text-yellow-600"> 獎勵：球（2條）</p>
                <p>最近中間獎只開放給長青會員</p>
                <p>必須大於Tee台150碼以上</p>
              </li>
              <li className="bg-gray-100 p-4 rounded-md shadow-md">
              <span className="font-bold text-blue-800"> 男子近洞獎 （Hole 2，7，12，16） </span>
              <p className="font-bold text-yellow-600"> 獎勵：球（2條）</p>
                <p>每個洞分開計算</p>
                <p>同一個比賽可重複得獎</p>
              </li>
              <li className="bg-gray-100 p-4 rounded-md shadow-md">
              <span className="font-bold text-red-800"> 女子近洞獎 （Hole 7，12） </span>
              <p className="font-bold text-yellow-600"> 獎勵：球（2條）</p>
                <p>每個洞分開計算</p>
                <p>同一個比賽可重複得獎</p>
              </li>
              <li className="bg-gray-100 p-4 rounded-md shadow-md">
              <span className="font-bold text-purple-600">Birdie (不限次數)</span>
              <p className="font-bold text-yellow-600"> 獎勵：球（1條）</p>
                <p>同一個比賽最多18個</p>
              </li>
              <li className="bg-gray-100 p-4 rounded-md shadow-md">
              <span className="font-bold text-purple-600"> Eagle (不限次數)</span>
              <p className="font-bold text-yellow-600"> 獎勵：球（2條）</p>
                <p>同一個比賽最多18個</p>
              </li>
              <li className="bg-gray-100 p-4 rounded-md shadow-md">
              <span className="font-bold text-purple-600">Albatrose (不限次數)</span>
              <p className="font-bold text-yellow-600"> 獎勵：球（3條）</p>
                <p>同一個比賽最多18個</p>
                <p>本俱樂部成立以來沒人得過</p>
              </li>
              <li className="bg-gray-100 p-4 rounded-md shadow-md">
              <span className="font-bold text-purple-600">BB獎</span>
              <p className="font-bold text-yellow-600"> 獎勵：球（2條）</p>
                <p>倒數第二名</p>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}



