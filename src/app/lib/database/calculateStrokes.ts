import mongoose from 'mongoose';

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

export const calculateStrokes = (eventsData: Event[]) => {
  const allRounds: any[] = [];

  eventsData.forEach((event) => {
    event.groups.forEach((group) => {
      group.rounds.forEach((round) => {
        if (round.front_9 && round.back_9) {
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

  const table1 = [
    [1, 2, 3, 4, 5, 6],
    [0, 1, 2, 3, 4, 5],
    [0, 0, 1, 2, 3, 4],
    [0, 0, 0, 1, 2, 3],
    [0, 0, 0, 0, 1, 2],
  ];

  const table2 = [
    [0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7],
    [0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6 ,6 ,7, 7, 7, 8, 8, 8, 9, 9, 9,10],
    [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9,10,10,11,11,12,12,13,13,14,14,15],
    [0, 1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 8, 8, 9,10,10,11,12,12,13,14,14,15,16,16,17,18,18,19,20],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29],
    [0, 1, 2, 3, 5, 6, 7, 8, 9,10,12,13,14,16,17,18,19,20,21,22,24,25,26,28,29,30,31,32,33,35],
  ];

  const getHandicapRangeIndex = (handicap: number): number => {
    if (handicap <= 9) return 0;
    if (handicap <= 15) return 1;
    if (handicap <= 21) return 2;
    if (handicap <= 26) return 3;
    if (handicap <= 32) return 4;
    return 5;
  };

  const clamp = (num: number, min: number, max: number) => Math.max(min, Math.min(num, max));

  const getNetStrokeAdjustment = (original: Member, placeIndex: number): any[] => {
    const handicap = original?.handicap?.at?.(-1);
    const parsedHandicap = handicap !== undefined ? Number(handicap) : undefined;
    const rangeIndex = parsedHandicap !== undefined ? getHandicapRangeIndex(parsedHandicap) : undefined;
    
    const round = allRounds.find((r) => r._id === original?._id);
    const totalScore = round?.totalScore ?? null; // fallback to null if undefined
  
    if (handicap === undefined || totalScore === undefined) {
      return [original, handicap, undefined, undefined, undefined];
    }
  
    const lookUpStroke = totalScore !== undefined && parsedHandicap !== undefined ? -1 * (totalScore - parsedHandicap - 68) : undefined;
    const clampedIndex = lookUpStroke !== undefined ? clamp(lookUpStroke, 0, 28) : undefined;
    
    const table1Value = (rangeIndex !== undefined && table1?.[placeIndex]?.[rangeIndex] !== undefined) ? table1[placeIndex][rangeIndex] : 0;
    const table2Value = (rangeIndex !== undefined && clampedIndex !== undefined && table2?.[rangeIndex]?.[clampedIndex] !== undefined) ? table2[rangeIndex][clampedIndex] : 0;
    
    const adjusted = parsedHandicap !== undefined ? parsedHandicap - table1Value - table2Value : undefined;
    
  
    return [original, handicap, table1Value, table2Value, adjusted];
  };

  const getNewStrokeAdjustment = (original: Member): any[] => {
    const handicap = original?.handicap?.at(-1);
    const parsedHandicap = Number(handicap);
    const rangeIndex = !isNaN(parsedHandicap) ? getHandicapRangeIndex(parsedHandicap) : undefined;
    const round = original?._id ? allRounds.find((r) => r._id === original._id) : undefined;
    const totalScore = round?.totalScore;

    if (handicap === undefined || totalScore === undefined) {
      return [original, handicap, undefined, undefined];
    }

    let table2Value = 0;
    let adjusted = parsedHandicap;

    const lookUpStroke = -1 * (totalScore - parsedHandicap - 68);
    if (lookUpStroke > 0) {
      const clampedIndex = clamp(lookUpStroke, 0, 28);
      table2Value = rangeIndex !== undefined ? table2?.[rangeIndex]?.[clampedIndex] ?? 0 : 0;
      adjusted = parsedHandicap - table2Value;
    }

    return [original, handicap, table2Value, adjusted];
  };

  const newMemberRounds = allRounds.filter((round) => round.is_new === true);
  const adjustedNewMember = newMemberRounds.map((round) => ({
    result: getNewStrokeAdjustment(round),
  }));

  const mOriginal = eventsData[0].m_total_stroke || null;
  const mHandicap = mOriginal?.handicap?.at(-1);
  const mAdjustedHandicap = mHandicap !== undefined ? Number(mHandicap) - 1 : undefined;
  const MWinner = [mOriginal, mHandicap, mAdjustedHandicap];

  const wOriginal = eventsData[0].w_total_stroke || null;
  const wHandicap = wOriginal?.handicap?.at(-1);
  const wAdjustedHandicap = wHandicap !== undefined ? Number(wHandicap) - 1 : undefined;
  const WWinner = [wOriginal, wHandicap, wAdjustedHandicap];

  const MNet1 = getNetStrokeAdjustment(eventsData[0].m_net_stroke_1, 0);
  const MNet2 = getNetStrokeAdjustment(eventsData[0].m_net_stroke_2, 1);
  const MNet3 = getNetStrokeAdjustment(eventsData[0].m_net_stroke_3, 2);
  const MNet4 = getNetStrokeAdjustment(eventsData[0].m_net_stroke_4, 3);
  const MNet5 = getNetStrokeAdjustment(eventsData[0].m_net_stroke_5, 4);

  const WNet1 = getNetStrokeAdjustment(eventsData[0].w_net_stroke_1, 0);
  const WNet2 = getNetStrokeAdjustment(eventsData[0].w_net_stroke_2, 1);

  return {
    MWinner,
    WWinner,
    MNet1,
    MNet2,
    MNet3,
    MNet4,
    MNet5,
    WNet1,
    WNet2,
    adjustedNewMember,
  };
};

type StrokeSetters = {
    setMStrokeWinner: (val: any) => void;
    setWStrokeWinner: (val: any) => void;
    setMNet1Winner: (val: any) => void;
    setMNet2Winner: (val: any) => void;
    setMNet3Winner: (val: any) => void;
    setMNet4Winner: (val: any) => void;
    setMNet5Winner: (val: any) => void;
    setWNet1Winner: (val: any) => void;
    setWNet2Winner: (val: any) => void;
    setNewStrokeList: (val: any) => void;
  };
  
  export const setCalculatedStrokes = (
    result: ReturnType<typeof calculateStrokes>,
    {
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
    }: StrokeSetters
  ) => {
    const {
      MWinner,
      WWinner,
      MNet1,
      MNet2,
      MNet3,
      MNet4,
      MNet5,
      WNet1,
      WNet2,
      adjustedNewMember,
    } = result;
  
    setMStrokeWinner(MWinner);
    setWStrokeWinner(WWinner);
    setMNet1Winner(MNet1);
    setMNet2Winner(MNet2);
    setMNet3Winner(MNet3);
    setMNet4Winner(MNet4);
    setMNet5Winner(MNet5);
    setWNet1Winner(WNet1);
    setWNet2Winner(WNet2);
    setNewStrokeList(adjustedNewMember);
  };
  
