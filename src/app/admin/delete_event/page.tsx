"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import mongoose from 'mongoose';
import Header from "@/app/components/Header";
import Navbar from "@/app/components/Navbar";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
  username: string;
  email: string;
  exp: number;
}

interface Member {
  _id: mongoose.Types.ObjectId;
  id: number;
  handicap: [number]
  name: string;
  sex: string;
}

interface Round {
  _id:  mongoose.Types.ObjectId;
  member:  Member
  front_9?: string;
  back_9?: string;
}

interface Group {
  _id: mongoose.Types.ObjectId;
  date: string;
  time: string;
  rounds: Round[];
}

interface Event {
  _id: string;
  date: string;
  is_tourn: boolean;
  groups: Group[]
}

export default function DeleteEventsPage() {
  const [selectedDate, setSelectedDate] = useState("");
  const [adminName, setAdminName] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
          const token = sessionStorage.getItem("token");
          if (token) {
            try {
              const decoded: DecodedToken = jwtDecode(token);
              if (decoded.exp * 1000 > Date.now()) {
                setAdminName(decoded.username);
              } else {
                sessionStorage.removeItem("token");
                setAdminName(null);
              }
            } catch (error) {
              console.error("Error decoding token:", error);
              setAdminName(null);
            }
          }
        }, []);

  // Handle delete request
  const handleDelete = async () => {
    if (!selectedDate) return;
    if (!confirm(`Are you sure you want to delete all events on ${selectedDate}?`)) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/delete_event?date=${selectedDate}`, { method: "DELETE" });
      if (response.ok) {
        alert("Events deleted successfully.");
        setEvents([]);
      } else {
        alert("Failed to delete events.");
      }
    } catch (error) {
      console.error("Error deleting events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMenu = (menu: string) => {
    console.log("Selected menu:", menu);
  };  

  return (
    <div className="min-h-screen bg-white">
      {/* Header + Navbar */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Header />
          <Navbar onSelectMenu={handleSelectMenu}/>
        </div>
      </div>

      {/* Main Content */}
      <div className="text-black flex flex-col items-center min-h-screen p-4 bg-gray-100">
        <div className="w-full max-w-2xl p-6 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-center mb-4">刪除賽事&球叙</h1>

          {/* Date Selector */}
          <div className="block flex items-center space-x-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 flex-grow h-10"
            />
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 h-10"
              disabled={!selectedDate || loading}
            >
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
