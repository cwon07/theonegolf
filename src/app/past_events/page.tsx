"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

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
  handicap: [number]
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

interface Event {
  _id: string;
  date: string;
  is_tourn: boolean;
  groups: Group[];
  [key: string]: any; 
}

export default function EventsView() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
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
        const response = await fetch("/api/past_events");
        const data = await response.json();
        if (response.ok) {
          setEvents(data);

          // Set default date to the latest event's date
          if (data.length > 0) {
            const latestEventDate: string = data.reduce(
              (latest: string, event: Event) => (event.date > latest ? event.date : latest),
              data[0].date
            );
            setSelectedDate(latestEventDate);
          }
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

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleSelectMenu = (menu: string) => {
    console.log("Selected menu:", menu);
  };

  if (loading) return <p>Loading events...</p>;

  // Find the selected event
  const selectedEvent = events.find((event) => event.date === selectedDate);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header & Navbar */}
      <div className="bg-white shadow-md relative z-50">
        <div className="container mx-auto flex items-center justify-between border-b border-gray-300 shadow-sm p-4">
          <Header />
          <Navbar onSelectMenu={handleSelectMenu} />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-8 bg-gray-100">
        <div className="w-full max-w-6xl p-6 bg-white shadow-lg rounded-lg">
          <h1 className="text-black text-2xl font-bold text-center mb-4">高爾夫賽事&球叙</h1>

          {/* Dropdown for selecting event date */}
          <div className="mb-4">
            <label className="font-bold text-xl mr-2 text-black">選擇日期:</label>
            <select
              value={selectedDate}
              onChange={handleDateChange}
              className="p-2 border rounded-md text-black"
            >
              {events.map((event) => (
                <option key={event._id} value={event.date} style={{ color: '#000000' }}>
                  {event.date}
                </option>
              ))}
            </select>
          </div>

          {selectedEvent ? (
            <div>
              <h2 className="text-black text-xl font-semibold">日期: {selectedEvent.date}</h2>
              <div className="mt-4">
                  {selectedEvent.is_tourn && (
                    <div className="text-gray-800 mt-4">
                      <h3 className="font-semibold text-lg text-yellow-600">月賽得獎名單</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mt-2">
                        {[
                          {
                            title: "總桿獎",
                            male: [{ label: "冠軍 (男）", key: "m_total_stroke" }],
                            female: [{ label: "冠軍 (女）", key: "w_total_stroke" }],
                          },
                          {
                            title: "遠桿獎",
                            male: [{ label: "遠桿獎 (男)", key: "m_long_drive" }],
                            female: [{ label: "遠桿獎 (女)", key: "w_long_drive" }],
                          },
                          {
                            title: "净桿獎",
                            male: [
                              { label: "冠軍 (男)", key: "m_net_stroke_1" },
                              { label: "亞軍 (男)", key: "m_net_stroke_2" },
                              { label: "季軍 (男)", key: "m_net_stroke_3" },
                              { label: "殿軍 (男)", key: "m_net_stroke_4" },
                              { label: "老五 (男)", key: "m_net_stroke_5" },
                            ],
                            female: [
                              { label: "冠軍 (女)", key: "w_net_stroke_1" },
                              { label: "亞軍 (女)", key: "w_net_stroke_2" },
                            ],
                          },
                          {
                            title: "近洞獎",
                            male: [
                              { label: "第2洞 (男)", key: "m_close_pin_2" },
                              { label: "第6洞 (男)", key: "m_close_pin_6" },
                              { label: "第7洞 (男)", key: "m_close_pin_7" },
                              { label: "第12洞 (男)", key: "m_close_pin_12" },
                            ],
                            female: [
                              { label: "第7洞 (女)", key: "w_close_pin_7" },
                              { label: "第12洞 (女)", key: "w_close_pin_12" },
                            ],
                          },
                          {
                            title: "近中獎",
                            male: [{ label: <span className="text-purple-700">近中獎 <span className="text-green-700">(長青)</span></span>, key: "close_to_center" }],
                            female: [],
                          },
                          {
                            title: "BB獎",
                            male: [{ label: "BB獎 (男)", key: "m_bb" }],
                            female: [{ label: "BB獎 (女)", key: "w_bb" }],
                          },
                        ].map((group, idx) => (
                          <div key={`event-details-group-${idx}`} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                            <h4 className="font-bold text-left text-lg mb-2 text-yellow-600">{group.title}</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                {group.male.map(({ label, key }) => (
                                  <p key={key} className="text-blue-800">
                                    <span className="font-bold">{label}: </span>
                                    {selectedEvent[key] ? `${selectedEvent[key].name} (ID: ${selectedEvent[key].id})` : ""}
                                  </p>
                                ))}
                              </div>
                              <div>
                                {group.female.map(({ label, key }) => (
                                  <p key={key} className="text-red-800">
                                    <span className="font-bold">{label}: </span>
                                    {selectedEvent[key] ? `${selectedEvent[key].name} (ID: ${selectedEvent[key].id})` : ""}
                                  </p>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>                  
                  )}
                </div>

              {/* Render Groups */}
              {selectedEvent.groups && selectedEvent.groups.length > 0 && (
                <div className="text-black mt-4">
                  <h3 className="font-semibold text-lg text-blue-800">球員分組 & 開球時間</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                    {selectedEvent.groups.map((group) => (
                      <div key={group._id} className="p-4 border rounded-md shadow-sm bg-gray-50">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-bold">日期: {group.date}</p>
                            <p className="font-bold">Tee Time: {group.time}</p>
                          </div>
                          {adminName && (
                            <button
                              onClick={() => router.push(`/admin/update_group?groupId=${group._id}`)}
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
                            {group.rounds.map((round) => (
                              <div key={round._id} className="mt-2">
                                <ul className="list-none space-y-1">
                                  {round.member && (
                                    <li className="grid grid-cols-[2fr,1fr,1fr,1fr] border-b pb-1 text-gray-800">
                                      <span className={`font-bold text-left ${round.member.sex === "Male" ? "text-blue-500" : "text-pink-500"}`}>
                                      <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                                          {round.member.id}
                                          </span> {round.member.name} ({round.member.handicap.at(-1)})
                                      </span>
                                      <span className="text-left w-16">{round.front_9 ?? ""}</span>
                                      <span className="text-left w-16">{round.back_9 ?? ""}</span>
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
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p>沒有找到賽事</p>
          )}
        </div>
      </div>
    </div>
  );
}
