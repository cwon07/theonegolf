"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import Navbar from "@/app/components/Navbar";

interface Member {
  id: number;
  name: string;
  sex: string;
  eng_name?: string;
  handicap: number[];
  is_new: boolean;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredMember, setHoveredMember] = useState<Member | null>(null);

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
    <div className="min-h-screen bg-gray-100">
      {/* Header & Navbar */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Header />
          <Navbar onSelectMenu={handleSelectMenu} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-5xl p-6 bg-white shadow-lg rounded-lg relative">
          <h1 className="text-2xl font-bold text-center mb-6">All Members</h1>

          {loading ? (
            <p className="text-center text-gray-600">Loading members...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {members.length > 0 ? (
                members.map((member) => (
                  <div
                    key={member.id}
                    className={`relative flex flex-col items-center justify-center p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 ${
                      member.sex === "Female" ? "bg-pink-100" : "bg-blue-100"
                    }`}
                    onMouseEnter={() => setHoveredMember(member)}
                    onMouseLeave={() => setHoveredMember(null)}
                  >
                    {/* Member Name */}
                    <span
                      className={`text-lg font-semibold ${
                        member.sex === "Female" ? "text-pink-700" : "text-blue-700"
                      }`}
                    >
                      {member.name}
                    </span>

                    {/* ID Badge */}
                    <span className="mt-1 px-3 py-1 text-sm font-medium text-gray-800 bg-gray-200 rounded-full">
                      ID: {member.id}
                    </span>

                    {/* Hover Pop-up */}
                    {hoveredMember?.id === member.id && (
                      <div className="absolute bottom-full mb-3 w-64 bg-white shadow-lg rounded-lg p-4 text-md text-gray-800 z-10 transition-opacity duration-200 border border-gray-300">
                        <p 
                          className={`font-bold text-lg ${
                            member.sex === "Male" ? "text-blue-600" : "text-pink-600"
                          }`}
                        >
                          {member.eng_name || "No English Name"}
                        </p>

                        <p className="mt-2 font-semibold">
                          Handicap:{" "}
                          <span className="font-normal">
                            {member.handicap.length > 0 ? member.handicap[member.handicap.length - 1] : "N/A"}
                          </span>
                        </p>

                        <p className="mt-2 text-sm text-gray-600">
                          {member.is_new ? "⭐ New Member" : ""}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600 col-span-full">No members found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
