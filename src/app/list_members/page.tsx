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
  const [genderFilter, setGenderFilter] = useState<"All" | "Male" | "Female">("All");

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
  
  const filteredMembers = members.filter(
    (member) => genderFilter === "All" || member.sex === genderFilter
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header & Navbar */}
      <div className="bg-white shadow-md relative z-50">
        <div className="container mx-auto flex items-center justify-between border-b border-gray-300 shadow-sm p-4">
          <Header />
          <Navbar onSelectMenu={handleSelectMenu} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-5xl p-6 bg-white shadow-lg rounded-lg relative">
          {/* Title and Gender Toggle */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">會員總覽</h1>

            {/* Gender Filter Toggle */}
            <div className="flex items-center space-x-3">
              <label className="text-lg font-semibold text-gray-700"> <span className="text-blue-800"> 男士 </span> / <span className="text-red-800"> 女士 </span>:</label>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value as "All" | "Male" | "Female")}
                className="p-3 border rounded-md text-gray-900 text-lg font-semibold bg-gray-100"
              >
                <option value="All">全部</option>
                <option value="Male">男士</option>
                <option value="Female">女士</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p className="text-center text-gray-600">Loading members...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className={`relative flex flex-col items-center justify-center h-19 rounded-lg shadow-md transition-transform transform hover:scale-105 ${
                      member.sex === "Female" ? "bg-pink-100" : "bg-blue-100"
                    }`}
                    onMouseEnter={() => setHoveredMember(member)}
                    onMouseLeave={() => setHoveredMember(null)}
                  >
                    {/* Member Name */}
                    <span
                      className={`text-lg font-semibold ${
                        member.sex === "Male" ? "text-blue-800" : "text-pink-800"
                      }`}
                    >
                      {member.name}
                    </span>

                    {/* ID Badge */}
                    <span className="mt-1 px-3 py-1 text-sm font-semibold text-gray-800 bg-gray-200 rounded-full">
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
                          差點:{" "}
                          <span className="font-semibold">
                            {member.handicap.length > 0
                              ? member.handicap[member.handicap.length - 1]
                              : "N/A"}
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
                <p className="text-center text-gray-600 col-span-full">無會員.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
