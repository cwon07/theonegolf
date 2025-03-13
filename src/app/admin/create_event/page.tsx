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
  });

  const [teeTimeInterval, setTeeTimeInterval] = useState<number>(10); // Default to 10

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

    console.log("Tournament Created:", event);

    // Send the event data to the API
    const eventData = {
      date: event.date,
      time: event.time,
      group_count: Number(event.group_count),
      players: event.players.split(",").map((player) => player.trim()),
    };

    try {
      const response = await fetch("/api/create_event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        //body: JSON.stringify(eventData),
        body: JSON.stringify({
          ...eventData,
          teeTimeInterval, // Pass teeTimeInterval separately
        }),
      });

      if (response.ok) {
        alert("Tournament created successfully!");
      } else {
        alert("Failed to create event.");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert("An error occurred while creating the event.");
    }
  };

  return (

    <div className="min-h-screen bg-white">
    {/* Header + Navbar */}
    <div className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Header />
        <Navbar onSelectMenu={handleSelectMenu} />
      </div>
    </div>

    <div className="text-black flex flex-col items-center items-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-2xl p-6 bg- shadow-lg rounded-lg bg-white">
        <h1 className="text-2xl font-bold text-center mb-4">Create Golf Tournament Event</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">Date:</label>
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
            <label className="block font-semibold">Time:</label>
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
              <label className="block font-semibold">Tee Time Interval:</label>
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
                <span className="text-gray-600">minutes</span>
              </div>
            </div>

          <div>
            <label className="block font-semibold">Group Count:</label>
            <input
              type="number"
              name="group_count"
              value={event.group_count}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
              min="1"
            />
          </div>
          <div>
            <label className="block font-semibold">Players (comma-separated):</label>
            <textarea
              name="players"
              value={event.players}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              rows={3}
              placeholder="Enter player IDs, separated by commas"
              required
            />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
            Create Tournament Event
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}
