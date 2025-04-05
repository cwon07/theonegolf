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
  const [rankingsMale, setRankingsMale] = useState<any[]>([]); // State for rankings
  const [rankingsFemale, setRankingsFemale] = useState<any[]>([]); // State for rankings
  const [rankingsMaleNet, setRankingsMaleNet] = useState<any[]>([]); // State for rankings
  const [rankingsFemaleNet, setRankingsFemaleNet] = useState<any[]>([]); // State for rankings
  const [showRankings, setShowRankings] = useState(false);
  const [showRankingsNet, setShowRankingsNet] = useState(false);
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
          calculateRankings(data);
          calculateRankingsNet(data);
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

  const handleToggle = () => {    
    setShowRankings((prev) => !prev);
  };

  const handleToggleNet = () => { 
    setShowRankingsNet((prev) => !prev);
  };

  const calculateRankings = (eventsData: Event[]) => {
    const allRounds: any[] = [];
  
    // Aggregate all rounds from all events and groups
    eventsData.forEach((event) => {
      event.groups.forEach((group) => {
        group.rounds.forEach((round) => {
          if (round.front_9 && round.back_9) { // Only include rounds with complete scores
            const totalScore = Number(round.front_9) + Number(round.back_9);
            allRounds.push({
              name: round.member.name,
              id: round.member.id,
              front_9: round.front_9,
              back_9: round.back_9,
              totalScore,
              handicap: round.member.handicap,
              sex: round.member.sex,
            });
          }
        });
      });
    });
  
    // Custom sort function for multi-level sorting
    const sortRounds = (a: any, b: any) => {
      // First, sort by totalScore
      if (a.totalScore !== b.totalScore) {
          return a.totalScore - b.totalScore;  // Ascending order
      }
      
      if (a.handicap !== b.handicap) {
        return b.handicap - a.handicap; // Note the reversal for descending order
      }
      
      // If back_9 scores are equal, sort by front_9
      return a.front_9 - b.front_9;  // Ascending order
    };

    // Separate into male and female rankings with custom sorting
    const maleRounds = allRounds.filter((round) => round.sex === "Male").sort(sortRounds);
    const femaleRounds = allRounds.filter((round) => round.sex === "Female").sort(sortRounds);
    // Update state with sorted rankings
    setRankingsMale(maleRounds);
    setRankingsFemale(femaleRounds);
  };

  const calculateRankingsNet = (eventsData: Event[]) => {
    const allRounds: any[] = [];
  
    // Aggregate all rounds from all events and groups
    eventsData.forEach((event) => {
      event.groups.forEach((group) => {
        group.rounds.forEach((round) => {
          if (round.front_9 && round.back_9) { // Only include rounds with complete scores
            const totalScore = Number(round.front_9) + Number(round.back_9);
            const netScore = totalScore - Number(round.member.handicap); // Calculate net score
            allRounds.push({
              name: round.member.name,
              id: round.member.id,
              front_9: Number(round.front_9),
              back_9: Number(round.back_9),
              totalScore,
              netScore,  // Add netScore to the object
              handicap: Number(round.member.handicap),
              sex: round.member.sex,
            });
          }
        });
      });
    });
  
    // Custom sort function for multi-level sorting
    const sortRounds = (a: any, b: any) => {
        // 1. Sort by netScore (ascending - lowest first)
        if (a.netScore !== b.netScore) {
            return a.netScore - b.netScore;
        }
        
        // 2. If netScores tie, sort by handicap (ascending - lower first)
        if (a.handicap !== b.handicap) {
            return a.handicap - b.handicap;  // Note: NOT reversed for ascending order
        }
        
        // 3. If handicaps tie, sort by back_9 (ascending)
        if (a.back_9 !== b.back_9) {
            return a.back_9 - b.back_9;
        }
        
        // 4. If back_9 ties, sort by front_9 (ascending)
        return a.front_9 - b.front_9;
    };

    // Separate into male and female rankings with custom sorting
    const maleRounds = allRounds.filter((round) => round.sex === "Male").sort(sortRounds);
    const femaleRounds = allRounds.filter((round) => round.sex === "Female").sort(sortRounds);
    
    // Update state with sorted rankings
    setRankingsMaleNet(maleRounds);
    setRankingsFemaleNet(femaleRounds);
  };

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
                     <div className="flex items-center justify-between w-full">
                        <h3 className="font-semibold text-lg text-yellow-600">月賽得獎名單</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={handleToggle}
                            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 h-10"
                          >
                            {showRankings ? "隱藏總桿排名" : "顯示總桿排名"}
                          </button>
                          <button
                            onClick={handleToggleNet}
                            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 h-10"
                          >
                            {showRankings ? "隱藏净桿排名" : "顯示净桿排名"}
                          </button>
                          {adminName && (
                            <button
                              //onClick={handleRecordWinners}
                              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 h-10"
                            >
                              記錄得獎名單
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mt-2">

                    {/* 總桿獎 */}
                    <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                      <h4 className="font-bold text-left text-lg mb-2 text-yellow-600">總桿獎</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-blue-800 font-bold">冠軍 (男）: </p>
                          {event.m_total_stroke && `${event.m_total_stroke.name} (ID: ${event.m_total_stroke.id})`}
                        </div>
                        <div>
                          <p className="text-red-800 font-bold">冠軍 (女）: </p>
                          {event.w_total_stroke && `${event.w_total_stroke.name} (ID: ${event.w_total_stroke.id})`}
                        </div>
                      </div>
                    </div>

                    {/* 遠桿獎 */}
                    <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                      <h4 className="font-bold text-left text-lg mb-2 text-yellow-600">遠桿獎</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-blue-800 font-bold">遠桿獎 (男): </p>
                          {event.m_long_drive && `${event.m_long_drive.name} (ID: ${event.m_long_drive.id})`}
                        </div>
                        <div>
                          <p className="text-red-800 font-bold">遠桿獎 (女): </p>
                          {event.w_long_drive && `${event.w_long_drive.name} (ID: ${event.w_long_drive.id})`}
                        </div>
                      </div>
                    </div>

                    {/* 净桿獎 */}
                    <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                      <h4 className="font-bold text-left text-lg mb-2 text-yellow-600">净桿獎</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          {["m_net_stroke_1", "m_net_stroke_2", "m_net_stroke_3", "m_net_stroke_4", "m_net_stroke_5"].map((key, i) => (
                            <p key={key} className="text-blue-800">
                              <span className="font-bold">
                                {["冠軍 (男)", "亞軍 (男)", "季軍 (男)", "殿軍 (男)", "老五 (男)"][i]}:
                              </span>{" "}
                              {event[key] && `${event[key].name} (ID: ${event[key].id})`}
                            </p>
                          ))}
                        </div>
                        <div>
                          {["w_net_stroke_1", "w_net_stroke_2"].map((key, i) => (
                            <p key={key} className="text-red-800">
                              <span className="font-bold">
                                {["冠軍 (女)", "亞軍 (女)"][i]}:
                              </span>{" "}
                              {event[key] && `${event[key].name} (ID: ${event[key].id})`}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 近洞獎 */}
                    <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                      <h4 className="font-bold text-left text-lg mb-2 text-yellow-600">近洞獎</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          {["m_close_pin_2", "m_close_pin_6", "m_close_pin_7", "m_close_pin_12"].map((key, i) => (
                            <p key={key} className="text-blue-800">
                              <span className="font-bold">第{[2, 6, 7, 12][i]}洞 (男):</span>{" "}
                              {event[key] && `${event[key].name} (ID: ${event[key].id})`}
                            </p>
                          ))}
                        </div>
                        <div>
                          {["w_close_pin_7", "w_close_pin_12"].map((key, i) => (
                            <p key={key} className="text-red-800">
                              <span className="font-bold">第{[7, 12][i]}洞 (女):</span>{" "}
                              {event[key] && `${event[key].name} (ID: ${event[key].id})`}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 近中獎 */}
                    <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                      <h4 className="font-bold text-left text-lg mb-2 text-yellow-600">近中獎</h4>
                      <div className="text-blue-800">
                        <span className="font-bold">
                          <span className="text-purple-700">近中獎 <span className="text-green-700">(長青)</span></span>:
                        </span>{" "}
                        {event.close_to_center && `${event.close_to_center.name} (ID: ${event.close_to_center.id})`}
                      </div>
                    </div>

                    {/* BB獎 */}
                    <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                      <h4 className="font-bold text-left text-lg mb-2 text-yellow-600">BB獎</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-blue-800 font-bold">BB獎 (男): </p>
                          {event.m_bb && `${event.m_bb.name} (ID: ${event.m_bb.id})`}
                        </div>
                        <div>
                          <p className="text-red-800 font-bold">BB獎 (女): </p>
                          {event.w_bb && `${event.w_bb.name} (ID: ${event.w_bb.id})`}
                        </div>
                      </div>
                    </div>

                    {/* 小鳥獎 */}
                    <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                        <h4 className="font-bold text-left text-lg mb-2 text-yellow-600">小鳥獎 (Birdies)</h4>
                        <div className="text-blue-800">
                          <span className="font-bold text-purple-700">小鳥獎:</span>{" "}
                          {Array.isArray(event.birdies) && event.birdies.length > 0 ? (
                            (event.birdies as { name: string; id: string | number }[]).map((winner, i) => (
                              <span key={i} className="block">{`${winner.name} (ID: ${winner.id})`}</span>
                            ))
                          ) : (
                            "暫無得獎者"
                          )}
                        </div>
                      </div>

                    {/* 老鷹獎 */}
                    <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                        <h4 className="font-bold text-left text-lg mb-2 text-yellow-600">老鷹獎 (Eagles)</h4>
                        <div className="text-blue-800">
                          <span className="font-bold text-purple-700">老鷹獎:</span>{" "}
                          {Array.isArray(event.eagles) && event.eagles.length > 0 ? (
                            (event.eagles as { name: string; id: string | number }[]).map((winner, i) => (
                              <span key={i} className="block">{`${winner.name} (ID: ${winner.id})`}</span>
                            ))
                          ) : (
                            "暫無得獎者"
                          )}
                        </div>
                      </div>

                    {/* 信天翁獎 */}
                      <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                        <h4 className="font-bold text-left text-lg mb-2 text-yellow-600">信天翁獎 (Albatrosses)</h4>
                        <div className="text-blue-800">
                          <span className="font-bold text-purple-700">信天翁獎:</span>{" "}
                          {Array.isArray(event.albatrosses) && event.albatrosses.length > 0 ? (
                            (event.albatrosses as { name: string; id: string | number }[]).map((winner, i) => (
                              <span key={i} className="block">{`${winner.name} (ID: ${winner.id})`}</span>
                            ))
                          ) : (
                            "暫無得獎者"
                          )}
                        </div>
                      </div>
</div>

    

                      {showRankings && (
                        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                          <h4 className="font-bold text-lg text-blue-800">當前總桿排名</h4>
                          <h2 className="font-bold text-medium text-purple-800">總桿同桿決勝規則優先排序：</h2>
                          <h1 className="font-bold text-medium text-purple-800">1. 差點高者 2. 後九洞 3. 年長者 </h1>
                          {rankingsMale.length > 0 || rankingsFemale.length > 0 ? (
                            <div className="mt-4">
                              {/* Header Row */}
                              <div className="grid grid-cols-2 gap-4">
                                {/* Male Header */}
                                <div className="grid grid-cols-[2fr,1fr,1fr,1fr] border-b pb-1 text-gray-800 font-bold text-left">
                                  <span>[ID] 姓名 (差點)</span>
                                  <span>前9洞</span>
                                  <span>後9洞</span>
                                  <span>總成績</span>                                  
                                </div>
                                {/* Female Header */}
                                <div className="grid grid-cols-[2fr,1fr,1fr,1fr] border-b pb-1 text-gray-800 font-bold text-left">
                                  <span>[ID] 姓名 (差點)</span>
                                  <span>前9洞</span>
                                  <span>後9洞</span>
                                  <span>總成績</span>                                  
                                </div>
                              </div>

                              {/* Rankings Data */}
                              <div className="grid grid-cols-2 gap-4 mt-2">
                                {/* Male Rankings */}
                                <div>
                                  {rankingsMale.map((player, idx) => (
                                    <div key={idx} className="mt-2">
                                      <ul className="list-none space-y-1">
                                        <li className="grid grid-cols-[2fr,1fr,1fr,1fr] border-b pb-1 text-gray-800">
                                          <span className={`font-bold text-left ${player.sex === "Male" ? "text-blue-500" : "text-pink-500"}`}>
                                            <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                                              {player.id}
                                            </span>{" "}
                                            {player.name} ({player.handicap})
                                          </span>
                                          <span className="text-left w-16">{player.front_9}</span>
                                          <span className="text-left w-16">{player.back_9}</span>
                                          <span className="text-left w-16 font-bold text-xl text-blue-800">
                                            {player.totalScore}
                                          </span>
                                        </li>
                                      </ul>
                                    </div>
                                  ))}
                                </div>

                                {/* Female Rankings */}
                                <div>
                                  {rankingsFemale.map((player, idx) => (
                                    <div key={idx} className="mt-2">
                                      <ul className="list-none space-y-1">
                                        <li className="grid grid-cols-[2fr,1fr,1fr,1fr] border-b pb-1 text-gray-800">
                                          <span className={`font-bold text-left ${player.sex === "Male" ? "text-blue-500" : "text-pink-500"}`}>
                                            <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                                              {player.id}
                                            </span>{" "}
                                            {player.name} ({player.handicap})
                                          </span>
                                          <span className="text-left w-16">{player.front_9}</span>
                                          <span className="text-left w-16">{player.back_9}</span>
                                          <span className="text-left w-16 font-bold text-xl text-blue-800">
                                            {player.totalScore}
                                          </span>
                                        </li>
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-600">無完整成績數據可供排名</p>
                          )}
                        </div>
                      )}

                      {showRankingsNet && (
                        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                          <h4 className="font-bold text-lg text-blue-800">當前净桿排名</h4>
                          <h2 className="font-bold text-medium text-purple-800">净桿同桿決勝規則優先排序：</h2>
                          <h1 className="font-bold text-medium text-purple-800">1. 差點低者 2. 年長者 3. 後九洞 4. 前九洞</h1>
                          {rankingsMaleNet.length > 0 || rankingsFemaleNet.length > 0 ? (
                            <div className="mt-4">
                              {/* Header Row */}
                              <div className="grid grid-cols-2 gap-4">
                                {/* Male Header */}
                                <div className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr] border-b pb-1 text-gray-800 font-bold text-left">
                                  <span>[ID] 姓名 (差點)</span>
                                  <span>前9洞</span>
                                  <span>後9洞</span>
                                  <span>總成績</span>
                                  <span>净成績</span>
                                </div>
                                {/* Female Header */}
                                <div className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr] border-b pb-1 text-gray-800 font-bold text-left">
                                  <span>[ID] 姓名 (差點)</span>
                                  <span>前9洞</span>
                                  <span>後9洞</span>
                                  <span>總成績</span>
                                  <span>净成績</span>
                                </div>
                              </div>

                              {/* Rankings Data */}
                              <div className="grid grid-cols-2 gap-4 mt-2">
                                {/* Male Rankings */}
                                <div>
                                  {rankingsMaleNet.map((player, idx) => (
                                    <div key={idx} className="mt-2">
                                      <ul className="list-none space-y-1">
                                        <li className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr] border-b pb-1 text-gray-800">
                                          <span className={`font-bold text-left ${player.sex === "Male" ? "text-blue-500" : "text-pink-500"}`}>
                                            <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                                              {player.id}
                                            </span>{" "}
                                            {player.name} ({player.handicap})
                                          </span>
                                          <span className="text-left w-16">{player.front_9}</span>
                                          <span className="text-left w-16">{player.back_9}</span>
                                          <span className="text-left w-16">{player.totalScore}</span>
                                          <span className="text-left w-16 font-bold text-xl text-blue-800">
                                            {player.netScore}  {/* Changed from NetScore to netScore */}
                                          </span>
                                        </li>
                                      </ul>
                                    </div>
                                  ))}
                                </div>

                                {/* Female Rankings */}
                                <div>
                                  {rankingsFemaleNet.map((player, idx) => (
                                    <div key={idx} className="mt-2">
                                      <ul className="list-none space-y-1">
                                        <li className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr] border-b pb-1 text-gray-800">
                                          <span className={`font-bold text-left ${player.sex === "Male" ? "text-blue-500" : "text-pink-500"}`}>
                                            <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                                              {player.id}
                                            </span>{" "}
                                            {player.name} ({player.handicap})
                                          </span>
                                          <span className="text-left w-16">{player.front_9}</span>
                                          <span className="text-left w-16">{player.back_9}</span>
                                          <span className="text-left w-16">{player.totalScore}</span>
                                          <span className="text-left w-16 font-bold text-xl text-blue-800">
                                            {player.netScore}  {/* Changed from NetScore to netScore */}
                                          </span>
                                        </li>
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-600">無完整成績數據可供排名</p>
                          )}
                        </div>
                      )}                      
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
                                <span>[ID] 姓名 (差點）</span>
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