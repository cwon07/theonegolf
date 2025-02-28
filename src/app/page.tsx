"use client"

import { createUser } from "./lib/actions/user.actions";
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
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Navbar onSelectMenu={handleSelectMenu} />


      <div 
        style={{ 
          padding: "1rem", 
          flexGrow: 1, // Ensures the content div grows to fill available space
          display: "flex",
          justifyContent: "center",
          alignItems: "center", 
        }}
      >
        
      <div
          style={{
            width: "80%", // Responsive width
            maxWidth: "900px", // Prevents it from growing too large
            minHeight: "60vh", // Ensures enough height on small screens
            maxHeight: "calc(100vh - 120px)", // Prevents it from exceeding screen height
            padding: "2rem",
            borderRadius: "12px",
            border: "2px solid #778899", // Softer slate gray color
            boxSizing: "border-box",
            backgroundColor: "white",
            overflowY: "auto", // Enables scrolling when needed
            transition: "all 0.3s ease-in-out",
            display: "flex", // Allows flexible internal positioning
            flexDirection: "column", // Stacks content vertically
          }}
      >
            {selectedMenu === "general-rules" && (
              <div>
                <h2>Tournaments and Gatherings</h2>
                <p>5 - 9 月比賽（4 times）</p>
                <p>當晚舉行餐會與頒獎</p>
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
            {selectedMenu === "members" && (
              <div>
                <h2>Member #, Mandarin Name, Handicap, English Name, [date played, front9, back9],[winning date, type of awards]</h2>
                <p></p>男：
                <p>1,王惠風,29,Henry Wang</p>
                <p>2,楊秋成,7,Josan Yang</p>
                <p>3,高振源,9,C.Y. Gao</p>
                <p>4,曾立斌,22,Ben Tseng</p>
                <p>5,鄭鴻銘,26,Aming Cheng</p>
                <p>6,陳錦輝,14,Pedro Chan</p>
                <p>7,李友志,14,Johnny Lee</p>
                <p>8,張如村,23,Joe Chang</p>
                <p>9,林秋玉,30,Jewelry Lin</p>
                <p>10,魏錫鉉,12,Andy Wei</p>
                <p>11,王呈豪,30,David Wang</p>
                <p>12,陳詩源,20,Freeman Chan</p>
                <p>13,黃洋一,22,Joe Huang</p>
                <p>14,周洪才,30,James Chou</p>
                <p>15,周德旭,30,D.S.Chou</p>
                <p>16,沈黎川,30,L.C. Shen</p>
                <p>17,姚哲智,14,George Yao</p>
                <p>18,孫繼華,23,James Sun</p>
                <p>19,官大煊,30,D. Kuan</p>
                <p>20,林煥輝,16,Robert Lin</p>
                <p>21,徐文錦,21,Bob Hsu</p>
                <p>22,許清水,30,Walter Hsu</p>
                <p>23,徐明峰,30,Mark Hsu</p>
                <p>24,張宇順,28,Y.S. Chang</p>
                <p>25,林文燦,30,Wayne Lin</p>
                <p>26,鄭世聖,17,Johnson Cheng</p>
                <p>27,張真堯,30,Chang</p>
                <p>28,吳祖修,13,Joey Wu</p>
                <p>29,黃泰志,26,T.J. Huang</p>
                <p>30,王錫滄,25,Leo Wang</p>
                <p>31,易永寧,20,Gerald Yih</p>
                <p>32,廖俊惠,31,PA Liao</p>
                <p>33,陸汝勛,26,Lu Hsun Lu</p>
                <p>34,賴春聲,12,Jackie Lai</p>
                <p>35,林賀宏,25,Gako Lin</p>
                <p>36,吳惠文,20,Mike Wu</p>
                <p>37,張盛達,16,Jeff Chang</p>
                <p>38,湯勝亮,25,S.L. Tang</p>
                <p>39,林大誠,30,David Lin</p>
                <p>40,莊育光,13,Chuang</p>
                <p>41,林隆登,13,Lin</p>
                <p>42,吳德輝,30,Simon Wu</p>
                <p>43,沈德陽,20,Frank Shen</p>
                <p>44,許翼元,16,Allen Hsu</p>
                <p>45,黃志成,19,Johnson Huang</p>
                <p>46,李明昭,17,Owen Lee</p>
                <p>47,林秉毅,6,Charlie Lin</p>
                <p>48,陳椽宏,12,Jason Chen</p>
                <p>49,陳建全,14,Jason Chen</p>
                <p>50,張閎錠,13,John Chang</p>
                <p>51,林家暉,15,Jackey Lin</p>
                <p>52,翁英傑,30,Won</p>
                <p>53,林科松,24,Michael Lin</p>
                <p>54,林峰,23,Ken Lin</p>
                <p>55,麥展嘉,30,James Mai</p>

                <p>女:</p>
                <p>1,李映瓊,30,Dana Lee</p>
                <p>2,張米玉,26,Maggie Chang</p>
                <p>3,陳秋足,16,Aki Chen</p>
                <p>4,鄭竹倫,20,Tiffany Cheng</p>
                <p>5,李阿秀,26,A-Hsiu Lee</p>
                <p>6,張紀齡,32,Jenny Wu</p>
                <p>7,楊素琴,35,Emy Chen</p>
                <p>8,陳美圓,13,Molly Chen</p>
                <p>9,洪璞郁,35,Silvia Hong</p>
                <p>10,洪玲玲,19,Rebecca Hung</p>
                <p>11,陳旖媛,35,Chen</p>
                <p>12,李貞旻,18,Mina Lee</p>
                <p>13,吳美齡,21,Mei Ling Wu</p>
                <p>14,黃麗芳,35,Lola Huang</p>
                <p>15,黃逸家,19,Buffy Huang</p>
                <p>16,王妃,12,Diana Wang</p>
                <p>17,周彩蓮,36,Joyce Chou</p>
                <p>18,徐芳玲,35,</p>
                <p>19,楊紫均,35,Sandy Yang</p>
              </div>
            )}
            {selectedMenu === "event-results" && (
              <div>
                <h2>Event Results</h2>
                <p>Need to add something to select events</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* <main style={{ padding: "2rem" }}>
        <form
          action="/api/createUser"
          method="post"
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div>
            <label htmlFor="username">Username</label>
            <input id="username" name="username" type="text" required />
          </div>
          <div>
            <label htmlFor="firstName">First Name</label>
            <input id="firstName" name="firstName" type="text" required />
          </div>
          <div>
            <label htmlFor="lastName">Last Name</label>
            <input id="lastName" name="lastName" type="text" required />
          </div>
          <div>
            <label htmlFor="email">Email Address</label>
            <input id="email" name="email" type="email" required />
          </div>
          <button type="submit" style={{ marginTop: "1rem" }}>
            Submit
          </button>
        </form>
      </main> */}
    </>
  );
}