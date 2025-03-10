"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import Navbar from "@/app/components/Navbar";

export default function EventsView() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/eventsview");
        const data = await response.json();
        if (response.ok) {
          setEvents(data);
        } else {
          console.error("Failed to fetch events:", data?.error || "Unknown error");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p>Loading events...</p>;

  const handleSelectMenu = (menu: string) => {
    console.log("Selected menu:", menu);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header and Navbar */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Header />
          <Navbar onSelectMenu={handleSelectMenu}/>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Current Events</h1>
        <div className="w-full max-w-4xl p-6 bg-white shadow-lg rounded-lg">
          {/* <h2 className="text-2xl font-bold text-center mb-4">Golf Tournament Events</h2> */}
          {events.length === 0 ? (
            <p>No events found.</p>
          ) : (
            <div className="space-y-4">
              {events.map((event: any) => (
                <div key={event._id} className="border-b border-gray-300 pb-4">
                  <h2 className="text-xl font-semibold">Event Date: {event.date}</h2>
                  <p className="text-md font-medium">Time: {event.time}</p>
                  <p>Group Count: {event.group_count}</p>

                  {/* Render Groups */}
                  {event.groups && event.groups.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-bold">Groups</h3>
                      {event.groups.map((group: any) => (
                        <div key={group._id} className="mt-2 p-4 border rounded-md">
                          <p className="font-medium">Group Date: {group.date}</p>
                          <p className="font-medium">Group Time: {group.time}</p>

                          {/* Render Rounds */}
                            {Array.isArray(group.rounds) && group.rounds.length > 0 && (
                            <div className="mt-2">
                              <h4 className="font-semibold">Rounds</h4>
                              {group.rounds.map((round: any, roundIndex: number) => (
                                <div key={round._id || `round-${roundIndex}`} className="mt-2">
                                  <ul className="list-disc pl-5">
                                    {Array.isArray(round.members) &&
                                      round.members.map((member: any, memberIndex: number) => (
                                        <li
                                          key={member._id || `member-${roundIndex}-${memberIndex}`}
                                          className="flex justify-between items-center"
                                        >
                                          {/* Display member name and Front 9, Back 9 in the same row */}
                                          <span className="font-medium">{member.name} (ID: {member.id})</span>
                                          <span className="ml-4">
                                            Front: {round.front_9 ?? "N/A"}, Back: {round.back_9 ?? "N/A"}
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
