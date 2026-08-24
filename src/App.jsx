import { useState } from 'react';

const NOTES = ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab'];
const STRINGS = [
  { name: 'e', startNote: 'E' },
  { name: 'B', startNote: 'B' },
  { name: 'G', startNote: 'G' },
  { name: 'D', startNote: 'D' },
  { name: 'A', startNote: 'A' },
  { name: 'E', startNote: 'E' }
];
const FRETS = 15;

export default function App() {
  const [root, setRoot] = useState('A');
  const [quality, setQuality] = useState('dominant7');
  const [includeFifth, setIncludeFifth] = useState(false);

  const chordFormulas = {
    major7: { intervals: [0, 4, 11], labels: ['1', '3', '7'] },
    minor7: { intervals: [0, 3, 10], labels: ['1', 'b3', 'b7'] },
    dominant7: { intervals: [0, 4, 10], labels: ['1', '3', 'b7'] }
  };

  const getActiveStructure = () => {
    const base = { ...chordFormulas[quality] };
    if (includeFifth) {
      base.intervals = [...base.intervals, 7];
      base.labels = [...base.labels, '5'];
    }
    return base;
  };

  const activeStructure = getActiveStructure();
  const rootIndex = NOTES.indexOf(root);

  const getFretInterval = (stringStartNote, fretNumber) => {
    const stringStartIndex = NOTES.indexOf(stringStartNote);
    const absoluteNoteIndex = (stringStartIndex + fretNumber) % 12;
    
    let distanceFromRoot = absoluteNoteIndex - rootIndex;
    if (distanceFromRoot < 0) distanceFromRoot += 12;

    const intervalMatchIndex = activeStructure.intervals.indexOf(distanceFromRoot);
    
    if (intervalMatchIndex !== -1) {
      return activeStructure.labels[intervalMatchIndex];
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-8">
      <div className="p-6 bg-gray-900 text-white rounded-lg shadow-xl w-full max-w-5xl font-sans">
        
        <div className="flex gap-4 mb-8">
          <select 
            className="bg-gray-800 p-2 rounded border border-gray-700 focus:outline-none"
            value={root} 
            onChange={(e) => setRoot(e.target.value)}
          >
            {NOTES.map(note => <option key={note} value={note}>{note}</option>)}
          </select>

          <select 
            className="bg-gray-800 p-2 rounded border border-gray-700 focus:outline-none"
            value={quality} 
            onChange={(e) => setQuality(e.target.value)}
          >
            <option value="dominant7">Dominant 7</option>
            <option value="major7">Major 7</option>
            <option value="minor7">Minor 7</option>
          </select>

          <label className="flex items-center gap-2 cursor-pointer ml-4">
            <input 
              type="checkbox" 
              className="w-5 h-5 rounded accent-blue-500"
              checked={includeFifth} 
              onChange={(e) => setIncludeFifth(e.target.checked)} 
            />
            Include 5th (Acoustic Density)
          </label>
        </div>

        <div className="relative overflow-x-auto pb-4">
          <div className="min-w-[900px]">
            <div className="flex ml-8 mb-2">
              {[...Array(FRETS + 1)].map((_, i) => (
                <div key={i} className="flex-1 text-center text-gray-500 text-sm font-semibold">{i}</div>
              ))}
            </div>

            <div className="bg-amber-900/40 p-4 rounded-md border-2 border-amber-950 shadow-inner">
              {STRINGS.map((string, stringIndex) => (
                <div key={stringIndex} className="flex items-center mb-3 last:mb-0">
                  <div className="w-8 font-bold text-gray-400">{string.name}</div>
                  
                  {[...Array(FRETS + 1)].map((_, fretIndex) => {
                    const label = getFretInterval(string.startNote, fretIndex);
                    const isRoot = label === '1';
                    const isGuideTone = label === '3' || label === 'b3' || label === '7' || label === 'b7';
                    
                    return (
                      <div key={fretIndex} className="flex-1 flex justify-center relative h-8">
                        <div className="absolute w-full h-1 bg-gray-500/50 top-1/2 -translate-y-1/2 z-0"></div>
                        
                        {fretIndex > 0 && (
                          <div className="absolute right-0 w-1 h-10 -top-1 bg-gray-600/80 z-0 rounded-sm"></div>
                        )}

                        <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200
                          ${isRoot ? 'bg-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.8)] scale-110' 
                          : isGuideTone ? 'bg-blue-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.8)] scale-110'
                          : label === '5' ? 'bg-gray-600 text-gray-200 shadow-md'
                          : 'bg-transparent opacity-0 scale-90'}`}
                        >
                          {label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}