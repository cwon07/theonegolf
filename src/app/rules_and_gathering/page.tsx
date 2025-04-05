"use client";

import { useState } from "react";
import Link from 'next/link';
import Header from "@/app/components/Header";
import Navbar from "@/app/components/Navbar";

export default function Home() {
  const [selectedMenu, setSelectedMenu] = useState<string>("");

  const handleSelectMenu = (menu: string) => {
    setSelectedMenu(menu);
  };

  return (
    <div className="min-h-screen">
      {/* Header & Navbar */}
      <div className="bg-white shadow-md relative z-50">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Header />
          <Navbar onSelectMenu={handleSelectMenu} />
        </div>
      </div>

      <div className="min-h-screen bg-gray-300 p-8 flex flex-col items-center">
        <div className="max-w-4xl w-full bg-white shadow-lg rounded-xl p-6">
          <h1 className="text-black text-5xl font-extrabold text-center text-gradient mb-8">
            月賽規則與晚宴
          </h1>

          {/* Monthly Tournament Rules */}
          <section className="mb-8 text-center font-bold">
            <h2 className="text-3xl font-semibold text-purple-700 mb-4">月賽規則</h2>
            <p className="text-xl mb-4 font-bold text-blue-800">
              5 - 9 月比賽（5次比賽）
            </p>
            <ul className="text-xl list-none space-y-4">
              <li className="text-black bg-gray-100 p-4 rounded-md shadow-md">
                請務必確認您的Tee-Time，並早10分鐘抵達Tee台
              </li>
              <li className="text-black bg-gray-100 p-4 rounded-md shadow-md">
                如有時間衝突，請在比賽前48小時通知管理委員會
              </li>
              <li className="text-black bg-gray-100 p-4 rounded-md shadow-md">
                比賽時請組長嚴格按照標準規則計算稈數
              </li>
              <li className="text-black bg-gray-100 p-4 rounded-md shadow-md">
                月賽成績會影響您的差點, 詳細資料請看
                <Link href="/handicap" className="text-blue-600 underline">差點調整詳解
                </Link>
              </li>
            </ul>
          </section>

          {/* Dinner and Awards */}
          <section className="mb-8 text-center">
            <h2 className="text-3xl font-semibold text-purple-700 mb-4">晚宴</h2>
            <p className="text-xl text-blue-800 mb-4 font-bold">
              月賽當晚舉行晚宴與頒獎
            </p>
            <p className="text-xl text-blue-800 mb-4 font-bold">
              舉行會場：粵海華庭海鮮餐廳
            </p>
            <p className="text-xl text-blue-800 mb-4 font-bold">
              地址：4540 No.3 Road Richmond BC
            </p>
            <p className="text-xl text-blue-800 mb-4 font-bold">
              晚宴時間：6:30 PM 準時用餐
            </p>

            <h3 className="text-3xl font-semibold text-purple-700 mb-4">獎項總覽：</h3>
            <ul className="text-xl list-none space-y-4 font-bold">
              <li className="bg-gray-100 p-4 rounded-md shadow-md text-black">
              <span className="font-bold text-purple-600"> 總稈獎</span> （<span className="font-bold text-blue-800">男</span>&
                <span className="font-bold text-red-600">女</span>）
                <p className="text-black font-bold text-yellow-600"> 獎勵：球（一盒）</p>
                <p className="text-black">總桿獎一年一次為限， 男女分開計</p>
                <p className="text-black">最低稈者勝, 如有平手，以下面方案決定勝負</p>
                <ul className="text-black text-center pl-6">
                  <li>1. 差點高者勝</li>
                  <li>2. 後九洞比分</li>                  
                  <li>3. 年長者為勝</li>
                </ul>
              </li>
              <li className="bg-gray-100 p-4 rounded-md shadow-md text-black">
              <span className="font-bold text-purple-600"> 净稈獎 </span> （<span className="font-bold text-blue-800">男 (5名)</span>&
                <span className="font-bold text-red-800">女 (2名)</span>）
                <p className="font-bold text-yellow-600"> 第1名獎勵：球（1盒）</p>
                <p className="font-bold text-yellow-600"> 第2名獎勵：球（3條）</p>
                <p className="font-bold text-yellow-600"> 第3名獎勵：球（2條）</p>
                <p className="font-bold text-yellow-600"> 第4名獎勵：球（2條）</p>
                <p className="font-bold text-yellow-600"> 第5名獎勵：球（2條）</p>
                <p className="font-bold text-black">得獎次數無限制, 男女分開計算</p>
                <p className="font-bold text-black">如有平手，以下面方案決定勝負</p>
                <ul className="text-black text-center pl-6">                
                  <li>1. 差點低者勝</li>
                  <li>2. 年長者為勝</li>
                  <li>3. 後九洞比分</li>
                  <li>4. 前九洞比分</li>
                </ul>
                <p className="font-bold text-black">新會員第一次參加比賽，淨桿獎不予計算并以此次比賽桿數進行新會員調桿</p>
                <p className="font-bold text-black">新會員第二次參加比賽，可得淨桿獎，然後需照規矩調桿</p>
                <p className="font-bold text-black">新會員第二次參加比賽將去除 ”新“ 頭銜，成爲常規會員</p>
                
              </li>
              <li className="bg-gray-100 p-4 rounded-md shadow-md text-black">
              <span className="font-bold text-purple-600"> 遠稈獎 </span> （<span className="font-bold text-blue-800">男</span>&
                <span className="font-bold text-red-800">女</span>）
                <p className="font-bold text-yellow-600"> 獎勵：球（2條）</p>
                <p className="font-bold text-black"> 遠桿獎一年一次為限, 男女分開計算</p>
              </li>
              <li className="bg-gray-100 p-4 rounded-md shadow-md">
              <span className="font-bold text-green-800"> 最近中間獎 (長青)</span>
              <p className="font-bold text-yellow-600"> 獎勵：球（2條）</p>
              <p className="font-bold text-black">最近中間獎只開放給長青會員</p>
              <p className="font-bold text-black">必須大於Tee台150碼以上</p>
              </li>
              <li className="bg-gray-100 p-4 rounded-md shadow-md">
              <span className="font-bold text-blue-800"> 男子近洞獎 （洞 2，7，12，16） </span>
              <p className="font-bold text-yellow-600"> 獎勵：球（2條）</p>
              <p className="font-bold text-black">每個洞分開計算</p>
              <p className="font-bold text-black"> 同一個比賽可重複得獎</p>
              </li>
              <li className="bg-gray-100 p-4 rounded-md shadow-md">
              <span className="font-bold text-red-800"> 女子近洞獎 （洞 7，12） </span>
              <p className="font-bold text-yellow-600"> 獎勵：球（2條）</p>
              <p className="font-bold text-black">每個洞分開計算</p>
              <p className="font-bold text-black">同一個比賽可重複得獎</p>
              </li>
              <li className="bg-gray-100 p-4 rounded-md shadow-md">
              <span className="font-bold text-purple-600">Birdie (不限次數)</span>
              <p className="font-bold text-yellow-600"> 獎勵：球（1條）</p>
              <p className="font-bold text-black">同一個比賽最多18個</p>
              </li>
              <li className="bg-gray-100 p-4 rounded-md shadow-md">
              <span className="font-bold text-purple-600"> Eagle (不限次數)</span>
              <p className="font-bold text-yellow-600"> 獎勵：球（2條）</p>
              <p className="font-bold text-black">超過三個算你厲害</p>
              </li>
              <li className="bg-gray-100 p-4 rounded-md shadow-md">
              <span className="font-bold text-purple-600">Albatrose (不限次數)</span>
              <p className="font-bold text-yellow-600"> 獎勵：球（3條）</p>
              <p className="font-bold text-black">本俱樂部成立以來沒人得過</p>
              </li>
              <li className="bg-gray-100 p-4 rounded-md shadow-md">
              <span className="font-bold text-purple-600">BB獎</span>
              <p className="font-bold text-yellow-600"> 獎勵：球（2條）</p>
              <p className="font-bold text-black">倒數第二名，這個獎不要得，得了難看</p>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}



