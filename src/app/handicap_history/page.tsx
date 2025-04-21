'use client';

import { useEffect, useState } from 'react';
import mongoose from 'mongoose';
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { calculateStrokes, setCalculatedStrokes } from "@/app/lib/database/calculateStrokes"; 

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
  event_id: string;
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

interface Log {
  createdAt: string;
  message: string;
  event?: Event | null;  // Event can be undefined or null
}

type StrokeWinner = { name: string; original: string; adjusted: string };
type NetWinner = { name: string; original: string; table1: string; table2: string; adjusted: string };
type NewMember = { name: string; original: string; value: string; adjusted: string };

function parseLogString(log: string) {
  const lines = log.split('\n').map(line => line.trim());
  const dateMatch = lines[0].match(/(\d{4}-\d{2}-\d{2})/);
  const date = dateMatch?.[1] ?? '';

  const strokeWinners: { men?: StrokeWinner; women?: StrokeWinner } = {};
  const netWinners: NetWinner[] = [];
  const newMembers: NewMember[] = [];

  let section = '';

  for (const line of lines) {
    if (line.includes('Stroke Winners')) section = 'stroke';
    else if (line.includes('Net Winners')) section = 'net';
    else if (line.includes('New Members Adjusted')) section = 'new';
    else if (line.startsWith('-')) {
      const content = line.replace(/^- /, '');
      switch (section) {
        case 'stroke': {
          const match = content.match(/^(.+?) \((\d+)\) - 1 = \((\d+)\)/);
          if (match) {
            const [_, name, original, adjusted] = match;
            if (line.includes('Men')) strokeWinners.men = { name, original, adjusted };
            if (line.includes('Women')) strokeWinners.women = { name, original, adjusted };
          }
          break;
        }

        case 'net': {
          const match = content.match(/^(.+?) \((\d+)\) - (\d+) - (\d+) = \((\d+)\)/);
          if (match) {
            const [_, name, original, table1, table2, adjusted] = match;
            netWinners.push({ name, original, table1, table2, adjusted });
          }
          break;
        }

        case 'new': {
          const match = content.match(/^(.+?) \((\d+)\) - (\d+) = \((\d+)\)/);
          if (match) {
            const [_, name, original, value, adjusted] = match;
            newMembers.push({ name, original, value, adjusted });
          }
          break;
        }
      }
    }
  }

  return { date, strokeWinners, netWinners, newMembers };
}

export default function LogTournPage() {
  const [logs, setLogs] = useState<Log[]>([]); // Explicitly type the logs as an array of Log
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Error state to show error messages
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString());
    };

    updateCurrentTime(); // Set time immediately
    const interval = setInterval(updateCurrentTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/handicap_history');
        if (!res.ok) {
          throw new Error(`Error fetching logs: ${res.statusText}`);
        }

        const text = await res.text();
        if (!text) {
          setError('No logs found. The response is empty.');
          return;
        }

        let data;
        try {
          data = JSON.parse(text);
        } catch (err) {
          setError('Failed to parse the response as JSON.');
          return;
        }

        if (data.logs && Array.isArray(data.logs)) {
          setLogs(data.logs); // logs are already strings (or contain message strings)
        } else {
          setError('Invalid data format: logs array not found.');
        }        

      } catch (err: any) {
        console.error('❌ Error fetching cron logs:', err);
        setError('An error occurred while fetching the logs.');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []); // Empty dependency array to fetch once when component mounts

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const convertToPST = (date: string): string => {
    const dateObj = new Date(date);
    dateObj.setHours(dateObj.getHours()); // Subtract 8 hours to convert to PST
    return dateObj.toLocaleString(); // Returns a human-readable format
  };

  const handleSelectMenu = (menu: string) => {
    console.log("Selected menu:", menu);
  };

  const renderLog = (message: string) => {
    const lines = message.split('\n'); // Split by newline character
    return lines.map((line, index) => {
      let textClass = 'text-black';
      if (line.includes('(男士)')) {
        textClass  = 'text-blue-800';
      } else if (line.includes('(女士)')) {
        textClass  = 'text-red-800';
      }
      return (
        <span key={index} className={textClass}>
          {line}
          <br />
        </span>
      );
    });
  };
  

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
  
      {/* Main Content */}
      <div className="min-h-screen bg-gray-300 p-8 flex flex-col items-center">
        <div className="max-w-4xl w-full bg-white shadow-lg rounded-xl p-6">
          <h1 className="text-black text-4xl font-extrabold text-center mb-8">
            調桿歷史
          </h1>
          <h2 className="text-black text-xl text-center mb-4">
            現在時間: {currentTime}
          </h2>
  
          <section className="space-y-4">
            {loading ? (
              <p className="text-center text-xl text-gray-600">Loading logs...</p>
            ) : error ? (
              <p className="text-center text-xl text-red-600">{error}</p>
            ) : logs.length > 0 ? (
              logs.map((log, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-4 rounded-md shadow-md text-black"
                >
                  <p className="font-semibold text-purple-700">調桿生效時日： {convertToPST(log.createdAt)}</p>
                  <p style={{ whiteSpace: 'pre-line' }}>
                    {renderLog(log.message)} {/* Dynamically render the message with colors */}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-xl text-red-600">No logs found.</p>
            )}
          </section>
          
        </div>
      </div>
    </div>
  );  
}
