"use client";

import { FC, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
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
  id: number;
  name: string;
  sex: string;
}

interface Round {
  _id: string;
  members: number;
  front_9?: string;
  back_9?: string;
}

interface Group {
  _id: string;
  date: string;
  time: string;
  rounds: Round[];
}

interface Event {
  _id: string;
  date: string;
  groups: Group[];
}

// Define a type for a round and its associated group
interface RoundWithGroup {
  round: Round;
  group: Group;
}

export default function EventsView() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState<string | null>(null);
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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/current_event");
        const data = await response.json();
        if (response.ok) {
          setEvents(data);
        } else {
          console.error("Failed to fetch events:", data.error);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleSelectMenu = (menu: string) => {
    console.log("Selected menu:", menu);
  };
  
  if (loading) return <p>Loading events...</p>;

  return (
  <div className="min-h-screen bg-gray-100">
      {/* Header & Navbar */}
      <div className="bg-white shadow-md relative z-50">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Header />
          <Navbar onSelectMenu={handleSelectMenu} />
        </div>
      </div>

    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-6xl p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-4">高爾夫賽事&球叙</h1>

        {events.length === 0 ? (
          <p>目前無賽事&球叙</p>
        ) : (
          <div className="space-y-4">
            {events.map((event: any, eventIndex: number) => (
              <div
                key={event._id || `event-${Math.random()}`}
                className={`${
                  eventIndex === events.length - 1 ? "" : "border-b border-gray-300 pb-4"
                }`}
              >
                <h2 className="text-xl font-semibold">日期: {event.date}</h2>

                {/* Render Groups in 3 columns */}
                {event.groups && event.groups.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-bold">球組</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                      {event.groups.map((group: any, groupIndex: number) => (
                        <div
                          key={group._id || `group-${event._id}-${groupIndex}`}
                          className="p-4 border rounded-md shadow-sm bg-gray-50"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-bold">日期: {group.date}</p>
                              <p className="font-bold">Tee Time: {group.time}</p>
                            </div>
                            {adminName && `group-${event._id}-${groupIndex}` && (
                              <button
                                onClick={() => router.push(`/admin/update_group?groupId=${group._doc._id}`)}
                                className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                              >
                                Update
                              </button>
                            )}
                          </div>

                          {/* Render Rounds */}
                          {group.rounds && group.rounds.length > 0 && (
                            <div className="mt-4">
                              <div className="grid grid-cols-[2fr,1fr,1fr,1fr] border-b pb-1 text-gray-800 font-bold text-left">
                                <span>姓名 (ID)</span>
                                <span>前9洞</span>
                                <span>後9洞</span>
                                <span>總成績</span>
                              </div>
                              {group.rounds.map((round: any) => (
                                <div
                                  key={round._id || `round-${group._id}-${Math.random()}`}
                                  className="mt-2"
                                >
                                  <ul className="list-none space-y-1">
                                    {/* Member Data */}
                                    {round.members &&
                                      round.members.map((member: any) => (
                                        <li
                                          key={member._id || `member-${round._id}-${Math.random()}`}
                                          className="grid grid-cols-[2fr,1fr,1fr,1fr] border-b pb-1 text-gray-800"
                                        >
                                          {/* Conditional Styling for Member Name */}
                                          <span
                                            className={`font-bold text-left ${
                                              member.sex === "Male" ? "text-blue-500" : "text-pink-500"
                                            }`}
                                          >
                                            {member.name} (ID: {member.id})
                                          </span>

                                          {/* Scores with Alignment */}
                                          <span className="text-left w-16">{round.front_9 ?? ""}</span>
                                          <span className="text-left w-16">{round.back_9 ?? ""}</span>
                                          <span className="text-left w-16">
                                            {round.front_9 && round.back_9
                                              ? Number(round.front_9) + Number(round.back_9)
                                              : ""}
                                          </span>
                                        </li>
                                      ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
  );
}