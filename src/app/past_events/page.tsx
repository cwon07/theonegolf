"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import mongoose from 'mongoose';
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { calculateStrokes, setCalculatedStrokes } from "@/app/lib/database/calculateStrokes"; 


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
  is_new: boolean;
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
  const [selectedEvent, setSelectedEvent] = useState<Event>();
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState<string | null>(null);
  const router = useRouter();
  const [showRankings, setShowRankings] = useState(false);
  const [showAwards, setShowAwards] = useState(false);
  const [showStrokes, setShowStrokes] = useState(false);
  const [showGroups, setShowGroups] = useState(false);
  const [showRankingsNet, setShowRankingsNet] = useState(false);
  const [groupIndexInput, setGroupIndexInput] = useState(''); // For group ID input
  const [rankingsMale, setRankingsMale] = useState<any[]>([]); // State for rankings
  const [rankingsFemale, setRankingsFemale] = useState<any[]>([]); // State for rankings
  const [rankingsMaleNet, setRankingsMaleNet] = useState<any[]>([]); // State for rankings
  const [rankingsFemaleNet, setRankingsFemaleNet] = useState<any[]>([]); // State for rankings
  const [MStrokeWinner, setMStrokeWinner] = useState<any[]>([]); // State for rankings
  const [WStrokeWinner, setWStrokeWinner] = useState<any[]>([]); // State for rankings
  const [MNet1Winner, setMNet1Winner] = useState<any[]>([]); // State for rankings
  const [MNet2Winner, setMNet2Winner] = useState<any[]>([]); // State for rankings
  const [MNet3Winner, setMNet3Winner] = useState<any[]>([]); // State for rankings
  const [MNet4Winner, setMNet4Winner] = useState<any[]>([]); // State for rankings
  const [MNet5Winner, setMNet5Winner] = useState<any[]>([]); // State for rankings
  const [WNet1Winner, setWNet1Winner] = useState<any[]>([]); // State for rankings
  const [WNet2Winner, setWNet2Winner] = useState<any[]>([]); // State for rankings
  const [NewstrokeList, setNewStrokeList] = useState<any[]>([]); // State for rankings
  const [memberId, setMemberId] = useState(''); // For member ID input
  const [message, setMessage] = useState(''); // For success/error feedback
  const [isGreen0, setisGreen0] = useState(false);
  const [isGreen1, setisGreen1] = useState(false);
  const [isGreen2, setisGreen2] = useState(false);
  const [isGreen3, setisGreen3] = useState(false);
  const [isGreen4, setisGreen4] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(false);



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

  const handleToggleGroup = () => { 
    setShowGroups(true);
    setShowAwards(false);
    setShowRankings(false);
    setShowRankingsNet(false);
    setShowStrokes(false);
    setisGreen0(true);
    setisGreen1(false);
    setisGreen2(false);
    setisGreen3(false);
    setisGreen4(false);
  };

  const handleToggleAward = () => { 
    setShowGroups(false);
    setShowAwards(true);
    setShowRankings(false);
    setShowRankingsNet(false);
    setShowStrokes(false);
    setisGreen0(false);
    setisGreen1(true);
    setisGreen2(false);
    setisGreen3(false);
    setisGreen4(false);
  };

  const handleToggleStroke = () => {    
    setShowGroups(false);
    setShowStrokes(true);
    setShowRankings(false);
    setShowRankingsNet(false);
    setShowAwards(false);
    setisGreen0(false);
    setisGreen1(false);
    setisGreen2(true);
    setisGreen3(false);
    setisGreen4(false);
  };

  const handleToggle = () => {    
    setShowGroups(false);
    setShowRankings(true);
    setShowRankingsNet(false);
    setShowAwards(false);
    setShowStrokes(false);
    setisGreen0(false);
    setisGreen1(false);
    setisGreen2(false);
    setisGreen3(true);
    setisGreen4(false);
  };

  const handleToggleNet = () => { 
    setShowGroups(false);
    setShowRankingsNet(true);
    setShowRankings(false);
    setShowAwards(false);
    setShowStrokes(false);
    setisGreen0(false);
    setisGreen1(false);
    setisGreen2(false);
    setisGreen3(false);
    setisGreen4(true);
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
              is_new: round.member.is_new,
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
              is_new: round.member.is_new,
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

  if (loading) return <p>Loading events...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header & Navbar */}
      <div className="bg-white shadow-md relative z-50 w-full">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between border-b border-gray-300 shadow-sm p-4">
          <div className="flex justify-center md:justify-start">
            <Header />
          </div>
          <div className="flex justify-center md:justify-start md:flex-nowrap">
            <Navbar onSelectMenu={handleSelectMenu} />
          </div>
        </div>
      </div>
  
      <div className="flex flex-col items-center justify-center p-8 bg-gray-100">
        <div className="w-full max-w-6xl p-6 bg-white shadow-lg rounded-lg">
          <h1 className="text-black text-2xl font-bold text-center mb-4">高爾夫賽事&球叙</h1>
  
          {/* Dropdown for selecting event date */}
          <div className="mb-4">
            <label className="font-bold text-xl mr-2 text-black">日期:</label>
              <select
                value={selectedDate}
                onChange={handleDateChange}
                className="p-2 border rounded-md text-black"
              >
                {events.map((event) => (
                  <option key={event._id} value={event.date} style={{ color: '#000000' }}>
                    {event.date} {event.is_tourn ? '🏆' : ''}
                  </option>
                ))}
              </select>
            <button
              onClick={async () => {
                setLoadingEvent(true);
                try {
                  const res = await fetch(`/api/past_event_populate?date=${selectedDate}`);
                  if (!res.ok) throw new Error('Failed to fetch event');
                  const data = await res.json();
                  setSelectedEvent(data);
                  calculateRankings([data]);
                  calculateRankingsNet([data]);
                  setShowGroups(false);
                  setShowRankings(false);
                  setShowRankingsNet(false);
                  setShowAwards(false);
                  setShowStrokes(false);
                  setisGreen0(false);
                  setisGreen1(false);
                  setisGreen2(false);
                  setisGreen3(false);
                  setisGreen4(false);

                  const result = calculateStrokes([data]);
                  setCalculatedStrokes(result, {
                    setMStrokeWinner,
                    setWStrokeWinner,
                    setMNet1Winner,
                    setMNet2Winner,
                    setMNet3Winner,
                    setMNet4Winner,
                    setMNet5Winner,
                    setWNet1Winner,
                    setWNet2Winner,
                    setNewStrokeList,
                  });
                } catch (err) {
                  console.error('Error loading event:', err);
                } finally {
                  setLoadingEvent(false);
                }
              }}              
              className={`ml-2 px-2 py-1 rounded h-10 text-lg text-white transition-colors duration-300 bg-blue-500
              min-w-fit`}
              disabled={!selectedDate}
            >
              載入
            </button>
            {loadingEvent && (
              <p className="mt-2 text-gray-600 italic">載入中...</p>
            )}
          </div>
  
          {selectedEvent && (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-black text-xl font-semibold">日期: {selectedEvent.date}</h2>
              {selectedEvent.is_tourn ? (
                <div className="flex flex-wrap gap-1 md:flex-nowrap overflow-x-auto">
                  <button
                    onClick={handleToggleGroup}
                    className={`px-2 py-1 rounded h-10 text-lg text-white transition-colors duration-300 ${
                      isGreen0 ? 'bg-green-500' : 'bg-blue-500'
                    } min-w-fit`}
                  >
                    比賽排組
                  </button>
                  <button
                    onClick={handleToggleAward}
                    className={`px-2 py-1 rounded h-10 text-lg text-white transition-colors duration-300 ${
                      isGreen1 ? 'bg-green-500' : 'bg-blue-500'
                    } min-w-fit`}
                  >
                    得獎名單
                  </button>
                  <button
                    onClick={handleToggleStroke}
                    className={`px-2 py-1 rounded h-10 text-lg text-white transition-colors duration-300 ${
                      isGreen2 ? 'bg-green-500' : 'bg-blue-500'
                    } min-w-fit`}
                  >
                    調桿一覽
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1 md:flex-nowrap overflow-x-auto">
                  <button
                    onClick={handleToggleGroup}
                    className={`px-2 py-1 rounded h-10 text-lg text-white transition-colors duration-300 ${
                      isGreen0 ? 'bg-green-500' : 'bg-blue-500'
                    } min-w-fit`}
                  >
                    球叙排組
                  </button>
                </div>
              )}
            </div>
          )}
          <div className="mt-4 overflow-x-auto">
            {selectedEvent && showAwards &&(
              <div className="text-gray-800 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    {/* 總桿獎 */}
                    <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                      <h4 className="font-bold text-left text-lg mb-2 text-yellow-600">總桿獎</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <p className="text-blue-800 font-bold whitespace-nowrap">冠軍 (男士）:</p>
                          {selectedEvent.m_total_stroke ? (
                            <span className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                                {selectedEvent.m_total_stroke.id}
                              </span>
                              <span className="text-black">{selectedEvent.m_total_stroke.name}</span>
                            </span>
                          ) : (
                            <span className="text-black">暫無得獎者</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <p className="text-red-800 font-bold">冠軍 (女士）: </p>
                          {selectedEvent.w_total_stroke ? (
                            <span className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                                {selectedEvent.w_total_stroke.id}
                              </span>
                              <span className="text-black">{selectedEvent.w_total_stroke.name}</span>
                            </span>
                          ) : (
                            <span className="text-black">暫無得獎者</span>
                          )}
                        </div>
                      </div>
                    </div>                    

                    {/* 遠桿獎 */}
                    <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                      <h4 className="font-bold text-left text-lg mb-2 text-yellow-600">遠桿獎</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Male Long Drive Winner */}
                        <div className="flex items-center gap-2">
                          <p className="text-blue-800 font-bold">遠桿獎 (男士): </p>
                          {selectedEvent.m_long_drive ? (
                            <span className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                                {selectedEvent.m_long_drive.id}
                              </span>
                              <span className="text-black">{selectedEvent.m_long_drive.name}</span>
                            </span>
                          ) : (
                            <span className="text-black">暫無得獎者</span>
                          )}
                        </div>

                        {/* Female Long Drive Winner */}
                        <div className="flex items-center gap-2">
                          <p className="text-red-800 font-bold">遠桿獎 (女士): </p>
                          {selectedEvent.w_long_drive ? (
                            <span className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                                {selectedEvent.w_long_drive.id}
                              </span>
                              <span className="text-black">{selectedEvent.w_long_drive.name}</span>
                            </span>
                          ) : (
                            <span className="text-black">暫無得獎者</span>
                          )}
                        </div>
                      </div>
                    </div>
                  
                  {/* 净桿獎 */}
                  <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                    <h4 className="font-bold text-left text-lg mb-2 text-yellow-600">净桿獎</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Male Net Stroke Winners */}
                      <div>
                        {["m_net_stroke_1", "m_net_stroke_2", "m_net_stroke_3", "m_net_stroke_4", "m_net_stroke_5"].map((key, i) => {
                          const winner = selectedEvent[key];
                          return (
                            <p key={key} className="text-blue-800 flex items-center gap-2 mb-1">
                              <span className="font-bold">
                              {["冠軍 (男士)", "亞軍 (男士)", "季軍 (男士)", "殿軍 (男士)", "老五 (男士)"][i]}:
                              </span>{" "}                              
                              <span className="flex items-center gap-2">
                                {winner?.id && (
                                  <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                                    {winner.id}
                                  </span>
                                )}
                                <span className="text-black">{winner?.name ?? "暫無得獎者"}</span>
                              </span>
                            </p>
                          );
                        })}
                      </div>


                      {/* Female Net Stroke Winners */}
                      <div>
                        {["w_net_stroke_1", "w_net_stroke_2"].map((key, i) => {
                          const winner = selectedEvent[key];
                          return (
                            <p key={key} className="text-red-800 flex items-center gap-2 mb-1">
                              <span className="font-bold">
                                {["冠軍 (女士)", "亞軍 (女士)"][i]}:
                              </span>{" "}                              
                              <span className="flex items-center gap-2">
                                {winner?.id && (
                                  <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                                    {winner.id}
                                  </span>
                                )}
                                <span className="text-black">{winner?.name ?? "暫無得獎者"}</span>
                              </span>
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* 近洞獎 */}
                  <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                    <h4 className="font-bold text-left text-lg mb-2 text-yellow-600">近洞獎</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Male Close Pin Winners */}
                      <div>
                        {["m_close_pin_2", "m_close_pin_7", "m_close_pin_12", "m_close_pin_16"].map((key, i) => {
                          const winner = selectedEvent[key];
                          return (
                            <p key={key} className="text-blue-800 flex items-center gap-2 mb-1">
                              <span className="font-bold">第{[" 2", " 7", "12", "16"][i]}洞 (男士):</span>{" "}
                              <span className="flex items-center gap-2">
                                {winner?.id && (
                                  <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                                    {winner.id}
                                  </span>
                                )}
                                <span className="text-black">{winner?.name ?? "暫無得獎者"}</span>
                              </span>
                            </p>
                          );
                        })}
                      </div>

                      {/* Female Close Pin Winners */}
                      <div>
                        {["w_close_pin_7", "w_close_pin_12"].map((key, i) => {
                          const winner = selectedEvent[key];
                          return (
                            <p key={key} className="text-red-800 flex items-center gap-2 mb-1">
                              <span className="font-bold">第{[" 7", "12"][i]}洞 (女士):</span>{" "}
                              <span className="flex items-center gap-2">
                                {winner?.id && (
                                  <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                                    {winner.id}
                                  </span>
                                )}
                                <span className="text-black">{winner?.name ?? "暫無得獎者"}</span>
                              </span>
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* 近中獎 */}
                  <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                    <h4 className="font-bold text-left text-lg mb-2 text-yellow-600">近中獎</h4>
                    <div className="text-blue-800">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">
                          <span className="text-purple-700">近中獎 <span className="text-green-700">(長青男士)</span></span>:
                        </span>
                        <span className="flex items-center gap-2">
                            {selectedEvent.close_to_center?.id && (
                              <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                                {selectedEvent.close_to_center.id}
                              </span>
                            )}
                          <span className="text-black">{selectedEvent.close_to_center?.name ?? "暫無得獎者"}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* BB獎 */}
                  <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                    <h4 className="font-bold text-left text-lg mb-2 text-yellow-600">BB獎</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Male BB Winner */}
                      <div className="flex items-center gap-2">
                        <p className="text-blue-800 font-bold">BB獎 (男士): </p>
                        {selectedEvent.m_bb ? (
                          <span className="flex items-center gap-2">
                            <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                              {selectedEvent.m_bb.id}
                            </span>
                            <span className="text-black">{selectedEvent.m_bb.name}</span>
                          </span>
                        ) : (
                          <span className="text-black">暫無得獎者</span>
                        )}
                      </div>

                      {/* Female BB Winner */}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-red-800 font-bold">BB獎 (女士): </p>
                          {selectedEvent.w_bb ? (
                            <span className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                                {selectedEvent.w_bb.id}
                              </span>
                              <span className="text-black">{selectedEvent.w_bb.name}</span>
                            </span>
                          ) : (
                            <span className="text-black">暫無得獎者</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>


                    {/* 小鳥獎 */}
                    <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                      <h4 className="font-bold text-left text-lg mb-2 text-yellow-600">小鳥獎 (Birdies)</h4>
                      <div className="text-black">
                        {Array.isArray(selectedEvent.birdies) && selectedEvent.birdies.length > 0 ? (
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {Object.values(
                              (selectedEvent.birdies as { id: string | number; name: string }[]).reduce((acc, curr) => {
                                const key = `${curr.id}`;
                                if (acc[key]) {
                                  acc[key].count += 1;
                                } else {
                                  acc[key] = { ...curr, count: 1 };
                                }
                                return acc;
                              }, {} as Record<string, { id: string | number; name: string; count: number }>)
                            ).map((winner, i) => (
                              <span key={i} className="flex items-center gap-2">
                                <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                                  {winner.id}
                                </span>
                                <span className="text-black">
                                  {winner.name} {winner.count > 1 && `(${winner.count})`}
                                </span>
                              </span>
                            ))}
                          </div>
                        ) : (
                          "暫無得獎者"
                        )}
                      </div>
                    </div>


                    {/* 老鷹獎 */}
                      <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                      <h4 className="font-bold text-left text-lg mb-2 text-yellow-600">老鷹獎 (Eagles)</h4>
                      <div className="text-black">
                        {Array.isArray(selectedEvent.eagles) && selectedEvent.eagles.length > 0 ? (
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {Object.values(
                              (selectedEvent.eagles as { id: string | number; name: string }[]).reduce((acc, curr) => {
                                const key = `${curr.id}`;
                                if (acc[key]) {
                                  acc[key].count += 1;
                                } else {
                                  acc[key] = { ...curr, count: 1 };
                                }
                                return acc;
                              }, {} as Record<string, { id: string | number; name: string; count: number }>)
                            ).map((winner, i) => (
                              <span key={i} className="flex items-center gap-2">
                                <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                                  {winner.id}
                                </span>
                                <span className="text-black">
                                  {winner.name} {winner.count > 1 && `(${winner.count})`}
                                </span>
                              </span>
                            ))}
                          </div>
                        ) : (
                          "暫無得獎者"
                        )}
                      </div>
                    </div>

                    {/* 信天翁獎 */}
                    <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                      <h4 className="font-bold text-left text-lg mb-2 text-yellow-600">信天翁獎 (Albatrosses)</h4>
                      <div className="text-black">
                        {Array.isArray(selectedEvent.albatrosses) && selectedEvent.albatrosses.length > 0 ? (
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {Object.values(
                              (selectedEvent.albatrosses as { id: string | number; name: string }[]).reduce((acc, curr) => {
                                const key = `${curr.id}`;
                                if (acc[key]) {
                                  acc[key].count += 1;
                                } else {
                                  acc[key] = { ...curr, count: 1 };
                                }
                                return acc;
                              }, {} as Record<string, { id: string | number; name: string; count: number }>)
                            ).map((winner, i) => (
                              <span key={i} className="flex items-center gap-2">
                                <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                                  {winner.id}
                                </span>
                                <span className="text-black">
                                  {winner.name} {winner.count > 1 && `(${winner.count})`}
                                </span>
                              </span>
                            ))}
                          </div>
                        ) : (
                          "暫無得獎者"
                        )}
                      </div>
                    </div>
                </div>
              </div>
            )}
            {/* end of showAwards */}

            {/* handicap adjustment */}
            {showStrokes && (
                <div className="p-4 border rounded-lg shadow-sm bg-gray-50 mt-4">
                  <h4 className="font-bold text-left text-lg mb-2 text-blue-800">調桿一覽</h4>
                  <a href="/handicap_history">
                    <h4 className="text-left text-lg mb-2 text-blue-800 hover:underline">
                      請查詢調桿歷史
                    </h4>
                  </a>
                </div>  
              )}
            {/* end of show strokes */}  

            {/* Render Groups in 3 columns */}
            {selectedEvent && showGroups && selectedEvent.groups && selectedEvent.groups.length > 0 && (
              <div className="text-black mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                  {selectedEvent.groups
                    .slice()
                    .sort((a: any, b: any) => a.time.localeCompare(b.time))
                    .map((group: any, groupIndex: number) => (
                      <div
                        key={group._id || `group-${selectedEvent.event_id}-${groupIndex}`}
                        className="p-4 border rounded-md shadow-sm bg-gray-50"
                      >
                        <div className="flex justify-between items-start gap-2 flex-wrap">
                          <div>
                            <p className="font-bold text-lg text-blue-800">第 {groupIndex + 1} 組</p>
                            <p className="font-bold text-sm">日期: {group.date}</p>
                            <p className="font-bold text-sm">Tee Time: {group.time}</p>
                          </div>
                          {adminName && (
                            <button
                              onClick={() =>
                                router.push(`/admin/update_group?groupId=${group._id}`)
                              }
                              className="mt-2 sm:mt-0 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-sm"
                            >
                              球組更新
                            </button>
                          )}
                        </div>

                        {/* Render Rounds */}
                        {group.rounds && group.rounds.length > 0 && (
                          <div className="mt-4">
                            <div className="hidden sm:grid grid-cols-[3fr,1fr,1fr,1fr] border-b pb-1 text-gray-800 font-bold text-left">
                              <span>[ID] 姓名</span>
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
                                  {round.member && (
                                    <li
                                      key={round.member._id || `member-${round._id}-${Math.random()}`}
                                      className="grid sm:grid-cols-[3fr,1fr,1fr,1fr] grid-cols-1 border-b pb-2 text-gray-800 gap-1"
                                    >
                                      <span
                                        className={`font-bold text-left ${
                                          round.member.sex === 'Male'
                                            ? 'text-blue-800'
                                            : 'text-red-800'
                                        }`}
                                      >
                                        <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg mr-1">
                                          {round.member.id}
                                        </span>
                                        {round.member.name}
                                        {round.member.is_new ? '⭐' : ''}
                                      </span>

                                      <div className="flex sm:hidden text-sm text-gray-600 justify-between px-1">
                                        <span>前9洞: {round.front_9 ?? '-'}</span>
                                        <span>後9洞: {round.back_9 ?? '-'}</span>
                                        <span className="font-bold text-blue-800">
                                          總成績: 
                                          {round.front_9 && round.back_9
                                            ? Number(round.front_9) + Number(round.back_9)
                                            : '-'}
                                        </span>
                                      </div>

                                      {/* Desktop score columns */}
                                      <span className="hidden sm:block text-left w-12">
                                        {round.front_9 ?? ''}
                                      </span>
                                      <span className="hidden sm:block text-left w-12">
                                        {round.back_9 ?? ''}
                                      </span>
                                      <span className="hidden sm:block text-left w-12 font-bold text-xl text-blue-800">
                                        {round.front_9 && round.back_9
                                          ? Number(round.front_9) + Number(round.back_9)
                                          : ''}
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

        </div>
      </div>
    </div>
  );  
}
