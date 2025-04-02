"use client";

import { FC, useState, useEffect, useRef } from "react";
import mongoose from 'mongoose';
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Header from "../components/Header"
import Navbar from "../components/Navbar";

// Define the types for the event structure
interface DecodedToken {
  id: string;
  username: string;
  email: string;
  exp: number;
}

interface Member {
  _id: mongoose.Types.ObjectId;
  id: number;
  handicap: [number]
  name: string;
  sex: string;
}

interface Round {
  _id:  mongoose.Types.ObjectId;
  member:  Member
  front_9?: string;
  back_9?: string;
}

interface Group {
  _id: mongoose.Types.ObjectId;
  date: string;
  time: string;
  rounds: Round[];
}

interface Event {
  _id: string;
  date: string;
  is_tourn: boolean;
  groups: Group[]
}

export default function EventsView() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState<string | null>(null);
  const router = useRouter();
  const [groupIndexInput, setGroupIndexInput] = useState(''); // For group ID input
  const [memberId, setMemberId] = useState(''); // For member ID input
  const [message, setMessage] = useState(''); // For success/error feedback

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

  //find groupId by groupIndex
  const findGroupIdByIndex = (index: number): string | null => {
    // Assuming we're working with the first event; adjust if you have multiple events
    const event = events[0]; // Modify this if you need to handle multiple events
    if (!event || !event.groups || index < 0 || index >= event.groups.length) {
      return null;
    }
    return event.groups[index]._id.toString();
  };

  // Function to find the current group ID of a member
  const findCurrentGroupId = (memberId: string): string | null => {
    for (const event of events) {
      for (const group of event.groups) {
        const round = group.rounds.find((r) => r.member.id.toString() === memberId);
        if (round) {
          return group._id.toString();
        }
      }
    }
    return null;
  };

  //function to find roundId by memberId
  const findRoundIdByMemberId = (memberId: string): string | null => {
    for (const event of events) {
      for (const group of event.groups) {
        const round = group.rounds.find((r) => r.member.id.toString() === memberId);
        if (round) {
          return round._id.toString();
        }
      }
    }
    return null;
  };

  
  // Function to add a round to a group
  const handleAddRound = async () => {
    if (!groupIndexInput || !memberId) {
      setMessage('請輸入組別編號和會員編號');
      return;
    }

    const groupId = findGroupIdByIndex(Number(groupIndexInput) - 1); // Subtract 1 since groupIndex starts at 1 in UI
    if (!groupId) {
      setMessage("無效的組別編號");
      return;
    }

    try {
      const response = await fetch('/api/current_event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId, memberId }),
      });

      if (response.ok) {
        setMessage('成功新增回合');
        setGroupIndexInput('');
        setMemberId('');
        const updatedEvents = await fetch("/api/current_event").then((res) => res.json());
        setEvents(updatedEvents);
        router.refresh();
      } else {
        setMessage('新增失敗');
      }
    } catch (error) {
      setMessage('發生錯誤，請稍後再試');
    }
  };

  // Function to move a round (e.g., to another group)
  const handleMoveRound = async () => {
    if (!groupIndexInput || !memberId) {
      setMessage('請輸入組別編號和會員編號');
      return;
    }

    const newGroupId = findGroupIdByIndex(Number(groupIndexInput) - 1); // Subtract 1 since groupIndex starts at 1 in UI
    if (!newGroupId) {
      setMessage("無效的組別編號");
      return;
    }

    const currentGroupId = findCurrentGroupId(memberId);
    if (!currentGroupId) {
      setMessage("找不到該會員的當前組別");
      return;
    }

    const roundId = findRoundIdByMemberId(memberId);
    if (!roundId) {
      setMessage("找不到該會員的回合");
      return;
    }

    try {
      const response = await fetch('/api/current_event', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roundId, currentGroupId, newGroupId }),
      });

      if (response.ok) {
        setMessage('成功移動回合');
        setGroupIndexInput('');
        setMemberId('');
        const updatedEvents = await fetch("/api/current_event").then((res) => res.json());
        setEvents(updatedEvents);
        router.refresh();
      } else {
        setMessage('移動失敗');
      }
    } catch (error) {
      setMessage('發生錯誤，請稍後再試');
    }
  };

  // Function to delete a round
  const handleDeleteRound = async () => {
    if (!groupIndexInput || !memberId) {
      setMessage('請輸入組別編號和會員編號');
      return;
    }

    const groupId = findGroupIdByIndex(Number(groupIndexInput) - 1); // Subtract 1 since groupIndex starts at 1 in UI
    if (!groupId) {
      setMessage("無效的組別編號");
      return;
    }

    const roundId = findRoundIdByMemberId(memberId);
    if (!roundId) {
      setMessage("找不到該會員的回合");
      return;
    }

    try {
      const response = await fetch('/api/current_event', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId, roundId }),
      });

      if (response.ok) {
        setMessage('成功刪除回合');
        setGroupIndexInput('');
        setMemberId('');
        const updatedEvents = await fetch("/api/current_event").then((res) => res.json());
        setEvents(updatedEvents);
        router.refresh();
      } else {
        setMessage('刪除失敗');
      }
    } catch (error) {
      setMessage('發生錯誤，請稍後再試');
    }
  };
  
  if (loading) return <p>Loading events...</p>;

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

        {events.length === 0 ? (
          <p>目前無賽事&球叙</p>
        ) : (
          <div className="space-y-4">
            {events.map((event: any, eventIndex: number) => (
              <div
                key={event.event_id || `event-${Math.random()}`}
                className={`${
                  eventIndex === events.length - 1 ? "" : "border-b border-gray-300 pb-4"
                }`}
              >
                <h2 className="text-black text-xl font-semibold">日期: {event.date}</h2>

                {/* Toggle for additional event details */}
                <div className="mt-4">
                  {event.is_tourn && (
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
                                    {event[key] ? `${event[key].name} (ID: ${event[key].id})` : ""}
                                  </p>
                                ))}
                              </div>
                              <div>
                                {group.female.map(({ label, key }) => (
                                  <p key={key} className="text-red-800">
                                    <span className="font-bold">{label}: </span>
                                    {event[key] ? `${event[key].name} (ID: ${event[key].id})` : ""}
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

                {/* Render Groups in 3 columns */}
                {event.groups && event.groups.length > 0 && (
                  <div className="text-black mt-4">
                    <h3 className="font-semibold text-lg text-blue-800">球員分組 & 開球時間</h3>
                    {adminName && (
                    <div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={groupIndexInput}
                          onChange={(e) => setGroupIndexInput(e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 h-10"
                          placeholder="組別編號輸入 (例如: 1, 2, 3)"
                        />
                        <input
                          type="text"
                          value={memberId}
                          onChange={(e) => setMemberId(e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 h-10"
                          placeholder="會員編號輸入"
                        />
                        <button
                          onClick={handleMoveRound}
                          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 h-10"
                        >
                          移動
                        </button>
                        <button
                          onClick={handleAddRound}
                          className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 h-10"
                        >
                          新增
                        </button>
                        <button
                          onClick={handleDeleteRound}
                          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 h-10"
                        >
                          刪除
                        </button>
                      </div>
                      {message && (
                        <p className="text-sm text-red-500 mt-2">{message}</p>
                      )}
                    </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                    {event.groups
                        .slice() // Create a copy to avoid mutating the original array
                        .sort((a: any, b: any) => a.time.localeCompare(b.time)) // Sort by time
                        .map((group: any, groupIndex: number) => (
                        <div
                          key={group._id || `group-${event.event_id}-${groupIndex}`}
                          className="p-4 border rounded-md shadow-sm bg-gray-50"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                             <p className="font-bold text-lg text-blue-800">第 {groupIndex+1} 組</p>
                              <p className="font-bold">日期: {group.date}</p>
                              <p className="font-bold">Tee Time: {group.time}</p>
                            </div>
                            {adminName && `group-${event.event_id}-${groupIndex}` && (
                              <button
                                onClick={() => router.push(`/admin/update_group?groupId=${group._id}`)}
                                className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                              >
                                球組更新
                              </button>
                            )}
                          </div>

                          {/* Render Rounds */}
                          {group.rounds && group.rounds.length > 0 && (
                            <div className="mt-4">
                              <div className="grid grid-cols-[2fr,1fr,1fr,1fr] border-b pb-1 text-gray-800 font-bold text-left">
                                <span>[ID] 姓名(差點）</span>
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
                                    {/* Render Member Data */}
                                    {round.member && (
                                      <li
                                        key={round.member._id || `member-${round._id}-${Math.random()}`}
                                        className="grid grid-cols-[2fr,1fr,1fr,1fr] border-b pb-1 text-gray-800"
                                      >
                                        {/* Conditional Styling for Member Name */}
                                        <span
                                          className={`font-bold text-left ${
                                            round.member.sex === "Male" ? "text-blue-500" : "text-pink-500"
                                          }`}
                                        >
                                          <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                                          {round.member.id}
                                          </span> {round.member.name} ({round.member.handicap.at(-1)})
                                        </span>

                                        {/* Scores with Alignment */}
                                        <span className="text-left w-16">{round.front_9 ?? ""}</span>
                                        <span className="text-left w-16">{round.back_9 ?? ""}</span>
                                        <span className="text-left w-16 font-bold text-xl text-blue-800">
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
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);  
}