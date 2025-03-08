"use client"

import { useState } from "react";
import Header from "./components/Header";
import Navbar from "./components/Navbar";

export default function Home() {
  const [selectedMenu, setSelectedMenu ] = useState<string>("");

  const handleSelectMenu = (menu: string) => {
    setSelectedMenu(menu);
  };

  return (
    <>  
      <div className="min-h-screen flex flex-col">
       
        {/* Header + Navbar combined with logo on the left */}
        <div className="flex items-center justify-between">
          {/* Logo on the left */}
          <div className="flex items-center space-x-4">
          <Header />
          </div>
          {/* Navbar */}
          <Navbar onSelectMenu={handleSelectMenu} />
        </div>

      {/* Main Content Area */}
      <div 
        className="flex justify-center items-center p-4 flex-grow">
        <div
            className="w-full max-w-4xl min-h-[60vh] max-h-[calc(100vh-120px)] p-8 bg-white border-2 border-slate-300 rounded-xl shadow-lg overflow-y-auto transition-all duration-300 ease-in-out flex flex-col"
        >
          <h2 className="text-2xl font-bold text-center">Welcome to Monday Club</h2>
        
            {selectedMenu === "general-rules" && (
              <div>
                <h2>月賽 & 晚宴</h2>
                <p>5 - 9 月比賽（4 times）</p>
                <p>1. 月賽當晚舉行晚宴與頒獎</p>
                <p>新會員第一次參加比賽，淨桿獎不予計算</p>
                <p>總桿與遠桿獎一年一次為限</p>
                <p>新會員第二次參加比賽，淨桿低於標準桿，可得獎，但得獎後需照規矩調桿</p>
                <p>淨桿如有平手，差點低者勝，差點相同以年長者為勝，又相同就比後九洞，然後前九洞</p>
                <p>總桿如有平手，差點高者勝，又相同就比後九洞，然後前九洞，再以年長者為勝</p>
                <p>得獎者照表調整差點，新會員除外</p>
                <p>男差點最高30，女差點最高35，80歲+， 33，38</p>
                <p>總桿得獎者調一桿差點</p>
                <p></p>
                <p>計算明年度差點</p>
                <p>新年度差點調整，（最好+最差）/2 = 差點1 年度最後差點 = 差點2，新年度差點 = （差點1+差點2） / 2</p>
                <p>最好最差 最多9桿</p>
                <p>女生差點超過26桿，最好最差不以9桿為限 （可超過）</p>
              </div>
            )}

            {selectedMenu === "competition-rules" && (
              <div>
                <h2>月賽規則詳解</h2>

                <h2>總桿 & 遠桿</h2>
                <p>總桿與遠桿獎一年一次為限</p>
                <p>總桿如有平手，差點高者勝，又相同就比後九洞，然後前九洞，再以年長者為勝</p>
                <p> </p>
                <h2>净桿</h2>
                <p>新會員第一次參加比賽，淨桿獎不予計算</p>
                <p>新會員第二次參加比賽，淨桿低於標準桿，可得獎，但得獎後需照規矩調桿</p>
                <p>淨桿如有平手，差點低者勝，差點相同以年長者為勝，又相同以後九洞比分優先評估，最後如還是平手則用前九洞比分決定勝負</p>
                <p> </p>
                <p>得獎者照表調整差點</p>
                <p>新會員第一次參賽會以比賽成績成立初始差點</p>
                <p>男差點最高30，女差點最高35，80歲+， 33，38</p>
                <p>總桿得獎者調一桿差點</p>
                <p>調整詳解請看 - 差點調整</p>

                <p> </p>
                <p>計算明年度差點</p>
                <p>新年度差點調整，（最好+最差）/2 = 差點1 年度最後差點 = 差點2，新年度差點 = （差點1+差點2） / 2</p>
                <p>最好最差 最多9桿</p>
                <p>女生差點超過26桿，最好最差不以9桿為限 （可超過）</p>
              </div>
            )}   

            {selectedMenu === "handicap-rules" && (
              <div>
                <h2>月賽規則詳解</h2>
              </div>
            )}         
            
            {selectedMenu === "current-event" && (
              <div>
                <h2>Current Event</h2>
                <p>Need to display group with tee times and members in the groups. Also empty fields for score recording and winner recording</p>
              </div>
            )}
            {selectedMenu === "past-events" && (
              <div>
                <h2>Past Events</h2>
                <p>Need to display past event - date, group, player scores, and winners</p>
              </div>
            )}
         </div> 
        </div>
      </div>  
    </>
  );
}