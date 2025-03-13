"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/app/components/Header";
import Navbar from "@/app/components/Navbar";

const UpdateGroupPage = () => {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");

  const [group, setGroup] = useState<any>(null);

  useEffect(() => {
    if (groupId) {
      const fetchGroupData = async () => {
        try {
          const response = await fetch(`/api/groups/${groupId}`);
          const data = await response.json();
          setGroup(data);
        } catch (error) {
          console.error("Error fetching group data:", error);
        }
      };
      fetchGroupData();
    }
  }, [groupId]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header + Navbar */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Header />
          <Navbar onSelectMenu={() => {}} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
        <div className="w-full max-w-2xl p-6 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-center mb-4">Update Group</h1>
          <p className="text-center mb-4">Group ID: {groupId}</p>

          {group ? (
            <div>
              <p className="font-semibold">Event ID: {group.event_id}</p>
              <p className="font-semibold">Date: {group.date}</p>
              <p className="font-semibold">Time: {group.time}</p>
              <p className="font-semibold">Rounds: {group.rounds.length}</p>
            </div>
          ) : (
            <p>Loading group data...</p>
          )}
        </div>
      </div>
    </div>
  );
};

// ✅ Wrap the page with Suspense to prevent Next.js errors
export default function PageWrapper() {
  return (
    <Suspense fallback={<p>Loading page...</p>}>
      <UpdateGroupPage />
    </Suspense>
  );
}
