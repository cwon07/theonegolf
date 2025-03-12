"use client";

import React from 'react'
import { useEffect, useState } from "react";
import Header from "../components/Header"
import Navbar from "../components/Navbar"

export default function EventsView() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/past_events");
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
  


  return (

    <div className="min-h-screen bg-gray-100">
    {/* Header & Navbar */}
    <div className="bg-white shadow-md relative z-50">
      <div className="container mx-auto flex items-center justify-between border-b border-gray-300 shadow-sm p-4">
        <Header />
        <Navbar onSelectMenu={handleSelectMenu} />
      </div>
    </div>

    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-6xl p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Past Golf Tournament Events</h1>
        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          <div className="space-y-4">
            {events.map((event: any) => (
              <div key={event._id || `event-${Math.random()}`} className="border-b border-gray-300 pb-4">
                <h2 className="text-xl font-semibold">Golf Event Date: {event.date}</h2>
                
                {/* Render Groups in 3 columns */}
                {event.groups && event.groups.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-bold">Groups</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                      {event.groups.map((group: any, groupIndex: number) => (
                        <div key={group._id || `group-${event._id}-${groupIndex}`} className="p-4 border rounded-md shadow-sm bg-gray-50">
                          <p className="font-medium">Date: {group.date}</p>
                          <p className="font-medium">Tee Time: {group.time}</p>

                          {/* Render Rounds */}
                          {group.rounds && group.rounds.length > 0 && (
                            <div className="mt-2">
                              {group.rounds.map((round: any) => (
                                <div key={round._id || `round-${group._id}-${Math.random()}`} className="mt-2">
                                  <ul className="list-none space-y-1">
                                    {round.members &&
                                      round.members.map((member: any) => (
                                        <li key={member._id || `member-${round._id}-${Math.random()}`} className="flex justify-between items-center border-b pb-1">
                                          {/* Conditional Styling for Member Name */}
                                          <span
                                            className={`font-medium ${
                                              member.sex === "Male" ? "text-blue-500" : "text-pink-500"
                                            }`}
                                          >
                                            {member.name} (ID: {member.id})
                                          </span>
                                          <span className="ml-4">
                                            {round.front_9 && round.back_9
                                              ? `${round.front_9} ${round.back_9}`
                                              : "N/A N/A"}
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