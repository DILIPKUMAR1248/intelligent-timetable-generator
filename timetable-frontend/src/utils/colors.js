// Subject color mapping with vibrant gradients
export const subjectColors = {
  physics: {
    from: '#0ea5e9',
    to: '#38bdf8',
    bg: 'from-sky-500 to-sky-400',
    text: 'text-sky-600',
    badge: 'bg-sky-100 text-sky-700',
  },
  mathematics: {
    from: '#8b5cf6',
    to: '#a78bfa',
    bg: 'from-violet-500 to-violet-400',
    text: 'text-violet-600',
    badge: 'bg-violet-100 text-violet-700',
  },
  chemistry: {
    from: '#ec4899',
    to: '#f472b6',
    bg: 'from-pink-500 to-pink-400',
    text: 'text-pink-600',
    badge: 'bg-pink-100 text-pink-700',
  },
  'computer science': {
    from: '#10b981',
    to: '#34d399',
    bg: 'from-emerald-500 to-emerald-400',
    text: 'text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  biology: {
    from: '#22c55e',
    to: '#4ade80',
    bg: 'from-green-500 to-green-400',
    text: 'text-green-600',
    badge: 'bg-green-100 text-green-700',
  },
  english: {
    from: '#f59e0b',
    to: '#fbbf24',
    bg: 'from-amber-500 to-amber-400',
    text: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-700',
  },
  history: {
    from: '#ef4444',
    to: '#f87171',
    bg: 'from-red-500 to-red-400',
    text: 'text-red-600',
    badge: 'bg-red-100 text-red-700',
  },
  economics: {
    from: '#6366f1',
    to: '#818cf8',
    bg: 'from-indigo-500 to-indigo-400',
    text: 'text-indigo-600',
    badge: 'bg-indigo-100 text-indigo-700',
  },
  default: {
    from: '#64748b',
    to: '#94a3b8',
    bg: 'from-slate-500 to-slate-400',
    text: 'text-slate-600',
    badge: 'bg-slate-100 text-slate-700',
  },
};

// Get subject color by name (case-insensitive)
export const getSubjectColor = (subjectName) => {
  if (!subjectName) return subjectColors.default;
  const name = subjectName.toLowerCase();
  
  for (const [key, value] of Object.entries(subjectColors)) {
    if (name.includes(key)) {
      return value;
    }
  }
  return subjectColors.default;
};

// Generate color from string hash
export const generateColorFromString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    { from: '#0ea5e9', to: '#38bdf8' },
    { from: '#8b5cf6', to: '#a78bfa' },
    { from: '#ec4899', to: '#f472b6' },
    { from: '#10b981', to: '#34d399' },
    { from: '#f59e0b', to: '#fbbf24' },
    { from: '#ef4444', to: '#f87171' },
    { from: '#6366f1', to: '#818cf8' },
    { from: '#14b8a6', to: '#2dd4bf' },
  ];
  
  return colors[Math.abs(hash) % colors.length];
};
