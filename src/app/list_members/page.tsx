"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import Navbar from "@/app/components/Navbar";

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const response = await fetch("/api/list_members");
        const data = await response.json();
        if (response.ok) {
          setMembers(data);
        } else {
          console.error("Failed to fetch members:", data);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMembers();
  }, []);

  const handleSelectMenu = (menu: string) => {
    console.log("Selected menu:", menu);
  };
  

  return (
    <div className="min-h-screen bg-white">
    {/* Header & Navbar */}
    <div className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Header />
        <Navbar onSelectMenu={handleSelectMenu}/>
      </div>
    </div>

    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
      <div className="w-full max-w-5xl p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-4">All Members</h1>

        {loading ? (
          <p>Loading members...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {members.length > 0 ? (
              members.map((member: { id: number; name: string; sex: string }) => (
                <button
                  key={member.id}
                  className={`${
                    member.sex === "Female" ? "bg-pink-500" : "bg-blue-500"
                  } text-white p-2 rounded-md hover:bg-opacity-80 text-xl`}
                >
                  {member.id}: {member.name}
                </button>
              ))
            ) : (
              <p>No members found.</p>
            )}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}