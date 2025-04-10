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
  is_new: boolean;
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
  m_total_stroke: Member;
  w_total_stroke: Member;
  m_net_stroke_1: Member;
  m_net_stroke_2: Member;
  m_net_stroke_3: Member;
  m_net_stroke_4: Member;
  m_net_stroke_5: Member;
  w_net_stroke_1: Member;
  w_net_stroke_2: Member;
  m_long_drive: Member;
  w_long_drive: Member;
  close_to_center: Member;
  m_close_pin_2: Member;
  m_close_pin_7: Member;
  m_close_pin_12: Member;
  m_close_pin_16: Member;
  w_close_pin_7: Member;
  w_close_pin_12: Member;
  m_bb: Member;
  w_bb: Member;
  birdies: Member[];
  eagles: Member[];
  albatrosses: Member[];
}

export default function EventsView() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState<string | null>(null);
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
  const [showRankings, setShowRankings] = useState(false);
  const [showStrokes, setShowStrokes] = useState(false);
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
          setEvents([data]);
          calculateRankings([data]);
          calculateRankingsNet([data]);
          calculateStrokes([data]);
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

  const handleToggleStroke = () => {    
    setShowStrokes((prev) => !prev);
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

  const calculateStrokes = (eventsData: Event[]) => {
    const allRounds: any[] = [];
  
    // Aggregate all rounds from all events and groups
    eventsData.forEach((event) => {
      event.groups.forEach((group) => {
        group.rounds.forEach((round) => {
          if (round.front_9 && round.back_9) { // Only include rounds with complete scores
            const totalScore = Number(round.front_9) + Number(round.back_9);
            allRounds.push({
              name: round.member.name,
              _id: round.member._id,
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

    const table1: number[][] = [
      // [0-9, 10-15, 16-21, 22-26, 27-32, 33-38]
      [1, 2, 3, 4, 5, 6], // 1st place (第1名)
      [0, 1, 2, 3, 4, 5], // 2nd place (第2名)
      [0, 0, 1, 2, 3, 4], // 3rd place (第3名)
      [0, 0, 0, 1, 2, 3], // 4th place (第4名)
      [0, 0, 0, 0, 1, 2], // 5th place (第5名)
    ];

    const table2: number[][] = [
      // [0-9, 10-15, 16-21, 22-26, 27-32, 33-38]
      [0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5], // handi 0-9
      [0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6 ,6 ,7], // handi 10-15
      [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10], // handi 16-21
      [1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 8, 8, 9, 10, 10, 11, 12, 12, 13, 14], // handi 22-26
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], // handi 27-32
      [1, 2, 3, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 19, 20, 21, 23, 24], // handi 33 - 38
    ];

    const getHandicapRangeIndex = (handicap: number): number => {
      if (handicap <= 9) return 0; // 0-9
      if (handicap <= 15) return 1; // 10-15
      if (handicap <= 21) return 2; // 16-21
      if (handicap <= 26) return 3; // 22-26
      if (handicap <= 32) return 4; // 27-32
      return 5; // 33-38
    };

    // Separate into male and female rankings with custom sorting
    const NewMemberRounds = allRounds.filter((round) => round.is_new === true);

    // Total stroke winner handicap change
    // Calculate updated handicaps for MWinner and WWinner
    const mOriginal = eventsData[0].m_total_stroke;
    const mHandicap = eventsData[0].m_total_stroke.handicap.at(-1);
    const mAdjustedHandicap = mHandicap !== undefined ? Number(mHandicap) - 1 : undefined;
    const MWinner: any[] = [mOriginal, mHandicap, mAdjustedHandicap];
    
    const wOriginal = eventsData[0].w_total_stroke;
    const wHandicap = eventsData[0].w_total_stroke.handicap.at(-1);
    const wAdjustedHandicap = wHandicap !== undefined ? Number(wHandicap) - 1 : undefined;
    const WWinner: any[] = [wOriginal, wHandicap, wAdjustedHandicap];

    //net stroke
     //M1
    const mN1Original = eventsData[0].m_net_stroke_1;
    const mN1Handicap = mN1Original.handicap.at(-1);
    const table1_value = table1[0][getHandicapRangeIndex(Number(mN1Handicap))];
    const mN1Round = allRounds.find((round) => round._id === mN1Original?._id);
    const mN1TotalScore = mN1Round?.totalScore;
    const look_up_stroke = mN1TotalScore !== undefined && mN1Handicap !== undefined
    ? -1 * (mN1TotalScore - mN1Handicap - 72)
    : 0;
    const table2_value = table2[getHandicapRangeIndex(Number(mN1Handicap))][look_up_stroke];
    console.log(table2_value, table2[getHandicapRangeIndex(Number(mN1Handicap))][look_up_stroke], getHandicapRangeIndex(Number(mN1Handicap)), look_up_stroke)
    const mN1AdjustedHandicap = mN1Handicap !== undefined && table1_value !== undefined && table2_value !== undefined
    ? Number(mN1Handicap) - table1_value - table2_value
    : undefined;    
    const MNet1: any[] = [mN1Original, mN1Handicap, table1_value, table2_value, mN1AdjustedHandicap];

    //M2
    const mN2Original = eventsData[0].m_net_stroke_2;
    const mN2Handicap = mN2Original.handicap.at(-1);
    const mN2table1_value = table1[1][getHandicapRangeIndex(Number(mN2Handicap))];
    const mN2Round = allRounds.find((round) => round._id === mN2Original?._id);
    const mN2TotalScore = mN2Round?.totalScore;
    const mN2look_up_stroke = mN2TotalScore !== undefined && mN2Handicap !== undefined
    ? -1 * (mN2TotalScore - mN2Handicap - 72)
    : 0;
    const mN2table2_value = table2[getHandicapRangeIndex(Number(mN2Handicap))][mN2look_up_stroke];
    const mN2AdjustedHandicap = mN2Handicap !== undefined && mN2table1_value !== undefined && mN2table2_value !== undefined
    ? Number(mN2Handicap) - mN2table1_value - mN2table2_value
    : undefined;    
    const MNet2: any[] = [mN2Original, mN2Handicap, mN2table1_value, mN2table2_value, mN2AdjustedHandicap];

    //M3
    const MNet3: any[] = [eventsData[0].m_net_stroke_3];
    const MNet4: any[] = [eventsData[0].m_net_stroke_4];
    const MNet5: any[] = [eventsData[0].m_net_stroke_5];

    const WNet1: any[] = [eventsData[0].w_net_stroke_1];
    const WNet2: any[] = [eventsData[0].w_net_stroke_2];
    // Update state with sorted rankings
    setMStrokeWinner(MWinner);
    setWStrokeWinner(WWinner);
    setMNet1Winner(MNet1);
    setMNet2Winner(MNet2);
    setMNet3Winner(MNet3);
    setMNet4Winner(MNet4);
    setMNet5Winner(MNet5);
    setWNet1Winner(WNet1);
    setWNet2Winner(WNet2);
    setNewStrokeList(NewMemberRounds);
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
        setEvents([updatedEvents]);
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
        setEvents([updatedEvents]);
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
        setEvents([updatedEvents]);
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
                            {showRankingsNet ? "隱藏净桿排名" : "顯示净桿排名"}
                          </button>
                          <button
                            onClick={handleToggleStroke}
                            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 h-10"
                          >
                            {showStrokes ? "隱藏調稈一覽" : "顯示調稈一覽"}
                          </button>
                          {adminName && (
                            <button
                              onClick={() => router.push(`/admin/update_winner?eventId=${event.event_id}`)}
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
                      <div className="flex items-center gap-2">
                          <p className="text-blue-800 font-bold whitespace-nowrap">冠軍 (男）:</p>
                          {event.m_total_stroke ? (
                            <span className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                                {event.m_total_stroke.id}
                              </span>
                              <span className="font-bold text-black">{event.m_total_stroke.name}</span>
                            </span>
                          ) : (
                            <span>N/A</span>
                          )}
                        </div>

                          <div className="flex items-center gap-2">
                          <p className="text-red-800 font-bold">冠軍 (女）: </p>
                          {event.w_total_stroke ? (
                            <span className="flex items-center gap-2">
                            <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                              {event.w_total_stroke.id}
                            </span>
                            <span className="font-bold text-black">{event.w_total_stroke.name}</span>
                          </span>
                          ) : (
                            "N/A"
                          )}

                        </div>
                      </div>
                    </div>

                    {/* 遠桿獎 */}
                    <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                      <h4 className="font-bold text-left text-lg mb-2 text-yellow-600">遠桿獎</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                          <p className="text-blue-800 font-bold">遠桿獎 (男): </p>
                          {event.m_long_drive ? (
                            <span className="flex items-center gap-2">
                            <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                              {event.m_long_drive.id}
                            </span>
                            <span className="font-bold text-black">{event.m_long_drive.name}</span>
                          </span>
                          ) : (
                            "N/A"
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                          <p className="text-red-800 font-bold">遠桿獎 (女): </p>
                          {event.w_long_drive ? (
                            <span className="flex items-center gap-2">
                            <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                              {event.w_long_drive.id}
                            </span>
                            <span className="font-bold text-black">{event.w_long_drive.name}</span>
                          </span>
                          ) : (
                            "N/A"
                          )}
                          </div>
                          </div>
                      </div>
                    </div>

                    {/* 净桿獎 */}
                    <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                      <h4 className="font-bold text-left text-lg mb-2 text-yellow-600">净桿獎</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          {["m_net_stroke_1", "m_net_stroke_2", "m_net_stroke_3", "m_net_stroke_4", "m_net_stroke_5"].map((key, i) => (
                            <p key={key} className="text-blue-800 flex items-center gap-2 mb-1">
                              <span className="font-bold">
                                {["冠軍 (男)", "亞軍 (男)", "季軍 (男)", "殿軍 (男)", "老五 (男)"][i]}:
                              </span>{" "}
                              {
                              <span className="flex items-center gap-2">
                                <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                                  {event[key].id}
                                </span>
                                <span className="font-bold text-black">{event[key].name}</span>
                              </span>
                              }
                            </p>
                          ))}
                        </div>
                        <div>
                          {["w_net_stroke_1", "w_net_stroke_2"].map((key, i) => (
                            <p key={key} className="text-red-800 flex items-center gap-2 mb-1">
                              <span className="font-bold">
                                {["冠軍 (女)", "亞軍 (女)"][i]}:
                              </span>{" "}
                              <span className="flex items-center gap-2">
                                <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                                  {event[key].id}
                                </span>
                                <span className="font-bold text-black">{event[key].name}</span>
                              </span>
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
                          {["m_close_pin_2", "m_close_pin_7", "m_close_pin_12", "m_close_pin_16"].map((key, i) => (
                            <p key={key} className="text-blue-800 flex items-center gap-2 mb-1">
                              <span className="font-bold">第{[" 2", " 7", "12", "16"][i]}洞 (男):</span>{" "}
                              <span className="flex items-center gap-2">
                                <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                                  {event[key].id}
                                </span>
                                <span className="font-bold text-black">{event[key].name}</span>
                              </span>
                            </p>
                          ))}                        
                        </div>
                        <div>
                          {["w_close_pin_7", "w_close_pin_12"].map((key, i) => (
                            <p key={key} className="text-red-800 flex items-center gap-2 mb-1">
                            <span className="font-bold">第{[" 7", "12"][i]}洞 (男):</span>{" "}
                            <span className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                                {event[key].id}
                              </span>
                              <span className="font-bold text-black">{event[key].name}</span>
                            </span>
                          </p>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 近中獎 */}
                    <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                      <h4 className="font-bold text-left text-lg mb-2 text-yellow-600">近中獎</h4>
                      <div className="text-blue-800">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">
                          <span className="text-purple-700">近中獎 <span className="text-green-700">(長青)</span></span>:
                        </span>{" "}
                        <span className="flex items-center gap-2">
                            <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                              {event.close_to_center.id}
                            </span>
                            <span className="font-bold text-black">{event.close_to_center.name}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* BB獎 */}
                    <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                      <h4 className="font-bold text-left text-lg mb-2 text-yellow-600">BB獎</h4>
                      <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                          <p className="text-blue-800 font-bold">BB獎 (男): </p>
                          {event.m_bb ? (
                            <span className="flex items-center gap-2">
                            <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                              {event.m_bb.id}
                            </span>
                            <span className="font-bold text-black">{event.m_bb.name}</span>
                          </span>
                          ) : (
                            "N/A"
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                          <p className="text-red-800 font-bold">BB獎 (女): </p>
                          {event.w_bb ? (
                            <span className="flex items-center gap-2">
                            <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                              {event.w_bb.id}
                            </span>
                            <span className="font-bold text-black">{event.w_bb.name}</span>
                          </span>
                          ) : (
                            "N/A"
                          )}
                          </div>
                          </div>
                      </div>
                    </div>

                    {/* 小鳥獎 */}
                    <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                      <h4 className="font-bold text-left text-lg mb-2 text-yellow-600">小鳥獎 (Birdies)</h4>
                      <div className="font-bold text-black">
                        {Array.isArray(event.birdies) && event.birdies.length > 0 ? (
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {Object.values(
                              (event.birdies as { id: string | number; name: string }[]).reduce((acc, curr) => {
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
                                <span className="font-bold text-black">
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
                      <div className="font-bold text-black">
                        {Array.isArray(event.eagles) && event.eagles.length > 0 ? (
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {Object.values(
                              (event.eagles as { id: string | number; name: string }[]).reduce((acc, curr) => {
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
                                <span className="font-bold text-black">
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
                      <div className="font-bold text-black">
                        {Array.isArray(event.albatrosses) && event.albatrosses.length > 0 ? (
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {Object.values(
                              (event.albatrosses as { id: string | number; name: string }[]).reduce((acc, curr) => {
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
                                <span className="font-bold text-black">
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

                {/* handicap adjustment */}
                {showStrokes && (
                <div className="p-4 border rounded-lg shadow-sm bg-gray-50 mt-4">
                      <h4 className="font-bold text-left text-lg mb-2 text-blue-800">調稈一覽</h4>
                        <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                          <h4 className="font-bold text-left text-lg mb-2 text-purple-800">總桿調稈</h4>
                          <h3 className="text-left text-ml mb-2 text-purple-800">冠軍調一稈</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <p className="font-bold text-blue-800">{MStrokeWinner[0].name} ({MStrokeWinner[1]}) - 1 = ({MStrokeWinner[2]})</p> 
                              <p className="font-bold text-red-800">{WStrokeWinner[0].name} ({WStrokeWinner[1]}) - 1 = ({WStrokeWinner[2]})</p> 
                            </div>
                        </div>
                        <div className="p-4 border rounded-lg shadow-sm bg-gray-50 mt-2">
                        <h4 className="font-bold text-left text-lg mb-2 text-purple-800">净桿調稈</h4>
                        <h3 className="text-left text-ml mb-2 text-purple-800">照表一&表二調稈 (請看差點調整詳解)</h3>
                            <div className="grid grid-cols-4 gap-4">
                                <p className="font-bold text-blue-800">{MNet1Winner[0].name} ({MNet1Winner[1]}) - {MNet1Winner[2]} - {MNet1Winner[3]} = ({MNet1Winner[4]})</p> 
                                <p className="font-bold text-blue-800">{MNet2Winner[0].name} ({MNet2Winner[1]}) - {MNet2Winner[2]} - {MNet2Winner[3]} = ({MNet2Winner[4]})</p> 
                                <p className="font-bold text-blue-800">{MNet3Winner[0].name}</p>
                                <p className="font-bold text-blue-800">{MNet4Winner[0].name}</p>
                                <p className="font-bold text-blue-800">{MNet5Winner[0].name}</p>
                                <p className="font-bold text-red-800">{WNet1Winner[0].name}</p>
                                <p className="font-bold text-red-800">{WNet2Winner[0].name}</p>
                            </div>
                        </div>
                        <div className="p-4 border rounded-lg shadow-sm bg-gray-50 mt-2">
                          <h4 className="font-bold text-left text-lg mb-2 text-purple-800">新會員調稈</h4>
                          <h3 className="text-left text-ml mb-2 text-purple-800">照表二調稈，下列新會員將成爲正式會員 （移除⭐)</h3>
                          {NewstrokeList.length > 0 ? (
                            <div className="grid grid-cols-4 gap-4">
                              {NewstrokeList.map((player, idx) => (
                                <div
                                  key={idx}
                                  className={`mt-2 ${
                                    player.sex === "Male" ? "font-bold text-blue-800" : "font-bold text-red-800"
                                  }`}
                                >
                                  {player.name} ({player.handicap})
                                  {player.is_new ? "⭐" : ""}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-600">無調稈數據</p>
                          )}
                        </div>                
                </div>
                )}


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
                                          <span className={`font-bold text-left ${player.sex === "Male" ? "text-blue-800" : "text-red-800"}`}>
                                            <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                                              {player.id}
                                            </span>{" "}
                                            {player.name} ({player.handicap}){player.is_new ? "⭐" : ""}
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
                                          <span className={`font-bold text-left ${player.sex === "Male" ? "text-blue-800" : "text-red-800"}`}>
                                            <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                                              {player.id}
                                            </span>{" "}
                                            {player.name} ({player.handicap}){player.is_new ? "⭐" : ""}
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
                                          <span className={`font-bold text-left ${player.sex === "Male" ? "text-blue-800" : "text-red-800"}`}>
                                            <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                                              {player.id}
                                            </span>{" "}
                                            {player.name} ({player.handicap}){player.is_new ? "⭐" : ""}
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
                                          <span className={`font-bold text-left ${player.sex === "Male" ? "text-blue-800" : "text-red-800"}`}>
                                            <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                                              {player.id}
                                            </span>{" "}
                                            {player.name} ({player.handicap}){player.is_new ? "⭐" : ""}
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
                              <div className="grid grid-cols-[3fr,1fr,1fr,1fr] border-b pb-1 text-gray-800 font-bold text-left">
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
                                        className="grid grid-cols-[3fr,1fr,1fr,1fr] border-b pb-1 text-gray-800"
                                      >
                                        {/* Conditional Styling for Member Name */}
                                        <span
                                          className={`font-bold text-left ${
                                            round.member.sex === "Male" ? "text-blue-800" : "text-red-800"
                                          }`}
                                        >
                                          <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
                                          {round.member.id}
                                          </span> {round.member.name} ({round.member.handicap.at(-1)}){round.member.is_new ? "⭐" : ""}
                                        </span>

                                        {/* Scores with Alignment */}
                                        <span className="text-left w-12">{round.front_9 ?? ""}</span>
                                        <span className="text-left w-12">{round.back_9 ?? ""}</span>
                                        <span className="text-left w-12 font-bold text-xl text-blue-800">
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