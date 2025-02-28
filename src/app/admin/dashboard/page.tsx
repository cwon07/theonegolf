"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [tournament, setTournament] = useState({
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

    // Optionally, you can verify the token with your API to check its validity
    // You can use `fetch` to verify the token against your backend before allowing access
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTournament({ ...tournament, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Tournament Created:", tournament);
    alert("Tournament created successfully!");
    // TODO: Send this data to a backend (e.g., API call to save in a database)
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
              value={tournament.date} 
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
              value={tournament.time} 
              onChange={handleChange} 
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Male Players (comma-separated):</label>
            <textarea 
              name="malePlayers" 
              value={tournament.malePlayers} 
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
              value={tournament.femalePlayers} 
              onChange={handleChange} 
              className="w-full p-2 border rounded-md" 
              rows={3} 
              placeholder="Enter names, separated by commas"
              required
            />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
            Create Tournament
          </button>
        </form>
      </div>
    </div>
  );
}
