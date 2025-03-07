"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [event, setEvent] = useState({
    date: "",
    time: "",
    malePlayers: "",
    femalePlayers: "",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Tournament Created:", event);

    // Send the event data to the API
    const eventData = {
      date: event.date,
      time: event.time,
      malePlayers: event.malePlayers.split(",").map((player) => player.trim()),
      femalePlayers: event.femalePlayers.split(",").map((player) => player.trim()),
    };

    try {
      const response = await fetch("/api/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-2xl p-6 bg-white shadow-lg rounded-lg">
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

          <div>
            <label className="block font-semibold">Male Players (comma-separated):</label>
            <textarea
              name="malePlayers"
              value={event.malePlayers}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              rows={3}
              placeholder="Enter names, separated by commas"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Female Players (comma-separated):</label>
            <textarea
              name="femalePlayers"
              value={event.femalePlayers}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              rows={3}
              placeholder="Enter names, separated by commas"
              required
            />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
            Create Tournament Event
          </button>
        </form>
      </div>
    </div>
  );
}
