"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header"
import Navbar from "@/app/components/Navbar"

export default function AdminDashboard() {
  const router = useRouter();
  const [event, setEvent] = useState({
    date: "",
    time: "",
    group_count: "",
    players: "",
    is_tourn: false,
  });

  const [teeTimeInterval, setTeeTimeInterval] = useState<number>(10); // Default to 10
  const [isTourn, setIsTourn] = useState<boolean>(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token"); // Get the stored token
    console.log("Retrieved token:", token); // ✅ Debugging log

    if (!token) {
      // If no token, redirect to login page
      router.push("/admin/login");
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSelectMenu = (menu: string) => {
    console.log("Selected menu:", menu);
  };  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!event.date || !event.time || !event.group_count || !event.players.trim()) {
      alert("Please fill in all required fields.");
      return;
    }
  
    const playerList = event.players.split(",").map((player) => player.trim()).filter(Boolean);
    const maxPlayers = Number(event.group_count) * 4;
  
    if (playerList.length > maxPlayers) {
      alert(`Total players exceed group capacity. Max allowed: ${maxPlayers} players.`);
      return;
    }
  
    const eventData = {
      date: event.date,
      time: event.time,
      is_tourn: event.is_tourn,
      group_count: Number(event.group_count),
      players: playerList,
    };
  
    try {
      const response = await fetch("/api/create_event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...eventData,
          teeTimeInterval, // Pass teeTimeInterval separately
        }),
      });
  
      if (response.ok) {
        alert("Tournament created successfully!");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to create event.");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert("An error occurred while creating the event.");
    }
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

    <div className="text-black min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">新增賽事&球叙</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">日期:</label>
            <input
              type="date"
              name="date"
              value={event.date}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
              <label className="block font-semibold">是否是賽事？</label>
              <div className="flex items-center space-x-2">
                <select
                  value={isTourn ? "true" : "false"}  // Ensure correct string representation
                  onChange={(e) => {
                    const value = e.target.value === "true"; // Convert string to boolean
                    setIsTourn(value);
                    setEvent((prevEvent) => ({ ...prevEvent, is_tourn: value })); // Sync state
                  }}
                  className="p-2 border rounded-md w-full"
                  required
                >
                  <option value="true">是</option>
                  <option value="false">否</option>
                </select>
              </div>
            </div>

          <div>
            <label className="block font-semibold">第一組開球時間:</label>
            <input
              type="time"
              name="time"
              value={event.time}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Tee Time Interval Selection */}
            <div>
              <label className="block font-semibold">球組間隔時間:</label>
              <div className="flex items-center space-x-2">
                <select
                  value={teeTimeInterval}
                  onChange={(e) => setTeeTimeInterval(Number(e.target.value))}
                  className="p-2 border rounded-md w-full"
                  required
                >
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                </select>
                <span className="text-gray-600">分鐘</span>
              </div>
            </div>

          <div>
            <label className="block font-semibold">球組總數:</label>
            <input
              type="number"
              name="group_count"
              value={event.group_count}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="例如： 4"
              required
              min="1"
            />
          </div>
          <div>
            <label className="block font-semibold">參加會員ID (逗號分隔):</label>
            <textarea
              name="players"
              value={event.players}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              rows={3}
              placeholder="輸入會員ID，逗號分隔 例如. 1,15,19"
              required
            />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
            新增賽事
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}
