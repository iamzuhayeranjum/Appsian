/**
 * Hero iPhone Demo Call Transcript and Phase Timings
 * Single source of truth for the synchronized plumbing call recording.
 */

export interface TranscriptWord {
  0: string; // displayed word
  1: number; // word start time (seconds)
  2: number; // word end time (seconds)
}

export interface TranscriptLine {
  speaker: 'ai' | 'caller';
  start: number;
  end: number;
  text: string;
  words?: Array<[string, number, number]>;
}

export interface JobDetailItem {
  time: number;
  value?: string;
}

export interface JobDetailsData {
  issue?: JobDetailItem;
  callerName?: JobDetailItem;
  address?: JobDetailItem;
  appointment?: JobDetailItem;
  booked?: JobDetailItem;
  [key: string]: JobDetailItem | undefined;
}

export interface PhasesData {
  answered: number;
  qualified: number;
  booked: number;
}

export const durationSeconds = 53.9;

/**
 * Global transcript offset in seconds.
 * Positive = show lines LATER; Negative = EARLIER.
 * Applied across all timestamps when the phone component reads them.
 */
export const TRANSCRIPT_OFFSET = 0;

export const phases: PhasesData = {
  answered: 1.0,
  qualified: 31.5,
  booked: 53.3,
};

export const jobDetails: JobDetailsData = {
  issue: { time: 20.0, value: 'Leaky pipe, under the sink' },
  callerName: { time: 25.0, value: 'Zach Phillips' },
  address: { time: 31.1, value: '55 Seashell Lane, North Myrtle Beach, SC' },
  appointment: { time: 42.5, value: 'Tomorrow, 10:00 AM' },
  booked: { time: 53.3, value: 'Booked' },
};

export const lines: TranscriptLine[] = [
  {
    speaker: 'ai',
    start: 0.78,
    end: 4.42,
    text: "Hello. My name is Allison. I'm a representative of New York Plumbing. How can I assist you today?",
    words: [
      ['Hello.', 0.78, 1.02],
      ['My', 1.14, 1.22],
      ['name', 1.24, 1.32],
      ['is', 1.34, 1.42],
      ['Allison.', 1.46, 1.8],
      ["I'm", 1.96, 2.04],
      ['a', 2.06, 2.1],
      ['representative', 2.12, 2.6],
      ['of', 2.64, 2.72],
      ['New', 2.74, 2.82],
      ['York', 2.84, 2.96],
      ['Plumbing.', 3.0, 3.28],
      ['How', 3.52, 3.6],
      ['can', 3.64, 3.72],
      ['I', 3.78, 3.8],
      ['assist', 3.84, 4.04],
      ['you', 4.08, 4.14],
      ['today?', 4.18, 4.42],
    ],
  },
  {
    speaker: 'caller',
    start: 4.78,
    end: 11.52,
    text: 'Hey, Allison. I have a leaky pipe in my bathroom right now, and I need someone to come out and help me right now.',
    words: [
      ['Hey,', 4.78, 4.88],
      ['Allison.', 4.92, 5.28],
      ['I', 5.48, 5.56],
      ['have', 5.62, 5.92],
      ['a', 6.04, 6.28],
      ['leaky', 6.36, 6.68],
      ['pipe', 6.86, 7.34],
      ['in', 7.62, 8.12],
      ['my', 8.2, 8.66],
      ['bathroom', 8.72, 9.3],
      ['right', 9.5, 9.64],
      ['now,', 9.7, 9.8],
      ['and', 9.88, 9.94],
      ['I', 10.0, 10.02],
      ['need', 10.06, 10.18],
      ['someone', 10.22, 10.38],
      ['to', 10.42, 10.48],
      ['come', 10.5, 10.62],
      ['out', 10.68, 10.76],
      ['and', 10.78, 10.86],
      ['help', 10.9, 11.04],
      ['me', 11.06, 11.12],
      ['right', 11.22, 11.32],
      ['now.', 11.38, 11.52],
    ],
  },
  {
    speaker: 'ai',
    start: 11.96,
    end: 17.88,
    text: "So you have a leaky pipe in your bathroom. Can you tell me more about the issue? Is it a faucet, toilet, or somewhere else in the bathroom that's leaking?",
    words: [
      ['So', 11.96, 12.02],
      ['you', 12.06, 12.1],
      ['have', 12.12, 12.2],
      ['a', 12.24, 12.28],
      ['leaky', 12.32, 12.52],
      ['pipe', 12.56, 12.72],
      ['in', 12.74, 12.78],
      ['your', 12.82, 12.88],
      ['bathroom.', 12.92, 13.28],
      ['Can', 13.52, 13.6],
      ['you', 13.64, 13.7],
      ['tell', 13.74, 13.84],
      ['me', 13.88, 13.96],
      ['more', 14.0, 14.08],
      ['about', 14.12, 14.28],
      ['the', 14.32, 14.38],
      ['issue?', 14.44, 14.72],
      ['Is', 15.0, 15.06],
      ['it', 15.08, 15.12],
      ['a', 15.16, 15.2],
      ['faucet,', 15.24, 15.54],
      ['toilet,', 15.68, 16.0],
      ['or', 16.46, 16.52],
      ['somewhere', 16.58, 16.78],
      ['else', 16.82, 16.92],
      ['in', 16.96, 17.0],
      ['the', 17.02, 17.06],
      ['bathroom', 17.1, 17.4],
      ["that's", 17.42, 17.56],
      ['leaking?', 17.6, 17.88],
    ],
  },
  {
    speaker: 'caller',
    start: 18.54,
    end: 20.02,
    text: "Yeah. It's under the sink.",
    words: [
      ['Yeah.', 18.54, 18.7],
      ["It's", 18.86, 19.08],
      ['under', 19.18, 19.4],
      ['the', 19.44, 19.5],
      ['sink.', 19.7, 20.02],
    ],
  },
  {
    speaker: 'ai',
    start: 20.56,
    end: 22.98,
    text: "I'd be happy to help you with that. Can you please tell me your full name?",
    words: [
      ["I'd", 20.56, 20.6],
      ['be', 20.64, 20.7],
      ['happy', 20.72, 20.9],
      ['to', 20.92, 20.96],
      ['help', 21.0, 21.12],
      ['you', 21.16, 21.2],
      ['with', 21.24, 21.32],
      ['that.', 21.36, 21.56],
      ['Can', 21.82, 21.92],
      ['you', 21.94, 22.0],
      ['please', 22.04, 22.22],
      ['tell', 22.28, 22.38],
      ['me', 22.42, 22.48],
      ['your', 22.5, 22.58],
      ['full', 22.62, 22.74],
      ['name?', 22.8, 22.98],
    ],
  },
  {
    speaker: 'caller',
    start: 23.96,
    end: 25.02,
    text: 'Yeah. It is Zach Phillips.',
    words: [
      ['Yeah.', 23.96, 24.1],
      ['It', 24.22, 24.26],
      ['is', 24.3, 24.4],
      ['Zach', 24.44, 24.62],
      ['Phillips.', 24.66, 25.02],
    ],
  },
  {
    speaker: 'ai',
    start: 25.58,
    end: 26.86,
    text: 'Can you please tell me your service address?',
    words: [
      ['Can', 25.58, 25.66],
      ['you', 25.7, 25.76],
      ['please', 25.78, 25.94],
      ['tell', 25.98, 26.06],
      ['me', 26.08, 26.14],
      ['your', 26.18, 26.24],
      ['service', 26.3, 26.5],
      ['address?', 26.54, 26.86],
    ],
  },
  {
    speaker: 'caller',
    start: 27.28,
    end: 31.08,
    text: "Yeah. It's 55 Seashell Lane, North Myrtle Beach, South Carolina.",
    words: [
      ['Yeah.', 27.28, 27.52],
      ["It's", 27.6, 27.82],
      ['55', 28.0, 28.48],
      ['Seashell', 28.54, 28.94],
      ['Lane,', 29.02, 29.36],
      ['North', 29.7, 29.88],
      ['Myrtle', 29.98, 30.14],
      ['Beach,', 30.2, 30.4],
      ['South', 30.48, 30.62],
      ['Carolina.', 30.68, 31.08],
    ],
  },
  {
    speaker: 'ai',
    start: 31.52,
    end: 35.34,
    text: 'All right. Let me check what times we have available to get someone out there to help with leaky pipe under the sink.',
    words: [
      ['All', 31.52, 31.58],
      ['right.', 31.62, 31.82],
      ['Let', 32.1, 32.16],
      ['me', 32.2, 32.26],
      ['check', 32.3, 32.44],
      ['what', 32.48, 32.56],
      ['times', 32.6, 32.78],
      ['we', 32.8, 32.86],
      ['have', 32.88, 32.94],
      ['available', 32.98, 33.26],
      ['to', 33.3, 33.34],
      ['get', 33.38, 33.46],
      ['someone', 33.5, 33.68],
      ['out', 33.72, 33.82],
      ['there', 33.84, 33.96],
      ['to', 34.0, 34.04],
      ['help', 34.08, 34.2],
      ['with', 34.22, 34.32],
      ['leaky', 34.34, 34.56],
      ['pipe', 34.6, 34.8],
      ['under', 34.86, 35.0],
      ['the', 35.04, 35.1],
      ['sink.', 35.16, 35.34],
    ],
  },
  {
    speaker: 'ai',
    start: 36.72,
    end: 41.1,
    text: 'Okay. We have someone available tomorrow at 10:00 a.m., Wednesday at 2:00 p.m., or Thursday at 9:00 a.m.',
    words: [
      ['Okay.', 36.72, 36.84],
      ['We', 37.0, 37.06],
      ['have', 37.08, 37.18],
      ['someone', 37.22, 37.38],
      ['available', 37.42, 37.7],
      ['tomorrow', 37.74, 37.98],
      ['at', 38.02, 38.08],
      ['10:00', 38.1, 38.28],
      ['a.m.,', 38.3, 38.38],
      ['Wednesday', 38.92, 39.2],
      ['at', 39.22, 39.28],
      ['2:00', 39.4, 39.44],
      ['p.m.,', 39.48, 39.62],
      ['or', 40.12, 40.2],
      ['Thursday', 40.26, 40.54],
      ['at', 40.56, 40.6],
      ['9:00', 40.72, 40.78],
      ['a.m.', 40.82, 40.98],
    ],
  },
  {
    speaker: 'caller',
    start: 41.14,
    end: 43.06,
    text: 'Yeah, tomorrow at 10:00 a.m. sounds good.',
    words: [
      ['Yeah,', 41.14, 41.22],
      ['tomorrow', 41.32, 41.68],
      ['at', 41.98, 42.04],
      ['10:00', 42.08, 42.22],
      ['a.m.', 42.26, 42.42],
      ['sounds', 42.52, 42.7],
      ['good.', 42.78, 43.06],
    ],
  },
  {
    speaker: 'ai',
    start: 43.5,
    end: 52.78,
    text: 'All right. Here are your appointment details. Your requested appointment time is tomorrow at 10:00 a.m. at 55 Seashell Lane, North Myrtle Beach, South Carolina, for a leaky pipe under the sink. Is that all correct?',
    words: [
      ['All', 43.5, 43.56],
      ['right.', 43.6, 43.72],
      ['Here', 44.14, 44.24],
      ['are', 44.26, 44.36],
      ['your', 44.4, 44.48],
      ['appointment', 44.52, 44.84],
      ['details.', 44.88, 45.24],
      ['Your', 45.56, 45.62],
      ['requested', 45.64, 45.96],
      ['appointment', 46.0, 46.3],
      ['time', 46.34, 46.56],
      ['is', 46.6, 46.68],
      ['tomorrow', 46.72, 47.0],
      ['at', 47.02, 47.12],
      ['10:00', 47.14, 47.28],
      ['a.m.', 47.32, 47.48],
      ['at', 47.9, 47.98],
      ['55', 48.12, 48.48],
      ['Seashell', 48.54, 48.82],
      ['Lane,', 48.88, 49.1],
      ['North', 49.36, 49.52],
      ['Myrtle', 49.58, 49.74],
      ['Beach,', 49.82, 50.0],
      ['South', 50.08, 50.22],
      ['Carolina,', 50.28, 50.7],
      ['for', 51.1, 51.18],
      ['a', 51.22, 51.24],
      ['leaky', 51.28, 51.48],
      ['pipe', 51.52, 51.66],
      ['under', 51.7, 51.82],
      ['the', 51.86, 51.94],
      ['sink.', 51.98, 52.18],
      ['Is', 52.28, 52.34],
      ['that', 52.36, 52.44],
      ['all', 52.48, 52.56],
      ['correct?', 52.58, 52.78],
    ],
  },
  {
    speaker: 'caller',
    start: 53.18,
    end: 53.56,
    text: "Yes, ma'am.",
    words: [
      ['Yes,', 53.18, 53.28],
      ["ma'am.", 53.32, 53.56],
    ],
  },
];

// Validation once at load (dev console warning only)
if (import.meta.env.DEV) {
  for (let i = 0; i < lines.length; i++) {
    const cur = lines[i];
    if (i > 0 && cur.start < lines[i - 1].start) {
      console.warn(`[demoTranscript] Warning: Line ${i} start (${cur.start}) is before previous line start (${lines[i - 1].start})`);
    }
    if (cur.end > durationSeconds + 0.5) {
      console.warn(`[demoTranscript] Warning: Line ${i} end (${cur.end}) exceeds durationSeconds + 0.5 (${durationSeconds + 0.5})`);
    }
    if (i > 0 && cur.speaker === lines[i - 1].speaker && cur.start < lines[i - 1].end) {
      console.warn(`[demoTranscript] Warning: Line ${i} overlaps previous line from same speaker "${cur.speaker}"`);
    }
  }
}
