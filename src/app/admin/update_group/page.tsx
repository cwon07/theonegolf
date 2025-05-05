"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/app/components/Header";
import Navbar from "@/app/components/Navbar";

// Define the types for the event structure
interface DecodedToken {
  id: string;
  username: string;
  email: string;
  exp: number;
}

interface Member {
  _id: string;
  id: number;
  handicap: number[];
  name: string;
  sex: string;
}

interface Round {
  _id: string;
  member: Member;
  front_9?: string;
  back_9?: string;
}

interface Group {
  _id: string;
  date: string;
  time: string;
  rounds: Round[];
}

// Separate component for content that uses useSearchParams
function GroupContent() {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");
  const router = useRouter();

  const [group, setGroup] = useState<Group | null>(null);
  const [groupData, setGroupData] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    console.log("Retrieved token:", token);

    if (!token) {
      router.push("/admin/login");
      return;
    }

    if (!groupId) {
      setError("No group ID provided");
      setLoading(false);
      return;
    }

    const convertTo24Hour = (timeStr: string): string => {
      if (!timeStr) return "";
      const [time, period] = timeStr.split(" ");
      if (!period || !time) return timeStr.slice(0, 5) || "";

      let [hours, minutes] = time.split(":").map(Number);
      if (period.toUpperCase() === "PM" && hours !== 12) {
        hours += 12;
      } else if (period.toUpperCase() === "AM" && hours === 12) {
        hours = 0;
      }
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
    };

    const fetchGroup = async () => {
      try {
        const response = await fetch(`/api/update_group?groupId=${groupId}`);
        const data = await response.json();
        if (response.ok) {
          setGroup(data);
          const normalizedTime = convertTo24Hour(data.time);
          setGroupData({
            ...data,
            time: normalizedTime,
            rounds: data.rounds.map((round: Round) => ({
              ...round,
              front_9: round.front_9 || "",
              back_9: round.back_9 || "",
            })),
          });
        } else {
          setError(data.error || "Failed to fetch group");
        }
      } catch (error) {
        setError("Error fetching group");
        console.error("Error fetching group:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [groupId, router]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupData((prev) => (prev ? { ...prev, time: e.target.value } : null));
  };

  const handleScoreChange = (
    roundId: string,
    field: "front_9" | "back_9",
    value: string
  ) => {
    setGroupData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        rounds: prev.rounds.map((round) =>
          round._id === roundId ? { ...round, [field]: value } : round
        ),
      };
    });
  };

  const handleSave = async () => {
    if (!groupData) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/update_group?groupId=${groupId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(groupData),
      });
      if (response.ok) {
        router.push("/current_event");
      } else {
        const errorData = await response.json();
        alert(`保存失敗: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("保存失敗: 網絡錯誤");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!group || !groupData) {
    return <div>No group data found</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-100 text-black">
      <div className="w-full max-w-2xl p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6">開球時間 & 成績更新</h1>
        <div className="space-y-6">
          <div className="grid gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">時間:</label>
              <input
                type="time"
                value={groupData.time}
                onChange={handleTimeChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">回合:</label>
            {groupData.rounds && groupData.rounds.length > 0 ? (
              <div className="mt-4">
                <div className="grid grid-cols-[2fr,1fr,1fr,1fr] border-b pb-1 text-gray-800 font-bold text-left">
                  <span>[ID] 姓名(差點)</span>
                  <span>前9洞</span>
                  <span>後9洞</span>
                  <span>總成績</span>
                </div>
                {groupData.rounds.map((round) => (
                  <div key={round._id} className="mt-2">
                    <ul className="list-none space-y-1">
                      {round.member && (
                        <li
                          key={round.member._id}
                          className="grid grid-cols-[2fr,1fr,1fr,1fr] border-b pb-1 text-gray-800"
                        >
                          <span
                            className={`font-bold text-left ${
                              round.member.sex === "Male" ? "text-blue-500" : "text-pink-500"
                            }`}
                          >
                            <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                              {round.member.id}
                            </span>{" "}
                            {round.member.name} ({round.member.handicap.at(-1)})
                          </span>
                          <input
                            type="number"
                            value={round.front_9}
                            onChange={(e) =>
                              handleScoreChange(round._id, "front_9", e.target.value)
                            }
                            className="text-left w-16 p-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="前9"
                          />
                          <input
                            type="number"
                            value={round.back_9}
                            onChange={(e) =>
                              handleScoreChange(round._id, "back_9", e.target.value)
                            }
                            className="text-left w-16 p-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="後9"
                          />
                          <span className="text-left w-16">
                            {round.front_9 && round.back_9
                              ? Number(round.front_9) + Number(round.back_9)
                              : ""}
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full p-2 border rounded-md bg-gray-50 text-gray-600 text-center">
                沒有找到回合
              </div>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleSave}
              disabled={loading}
              className={`px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "儲存中..." : "儲存"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function UpdateGroupPage() {
  const handleSelectMenu = (menu: string) => {
    console.log("Selected menu:", menu);
  };

  return (
    <div className="bg-white shadow-md relative z-50 w-full">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between border-b border-gray-300 shadow-sm p-4">
        <div className="flex justify-center md:justify-start">
          <Header />
        </div>
        <div className="flex justify-center md:justify-start md:flex-nowrap">
          <Navbar onSelectMenu={handleSelectMenu} />
        </div>
      </div>
      <Suspense fallback={<div>Loading group data...</div>}>
        <GroupContent />
      </Suspense>
    </div>
  );
}
