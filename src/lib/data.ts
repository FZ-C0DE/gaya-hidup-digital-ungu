
import { Habit, Category, TodoItem, Achievement } from './types';

// Default categories
export const defaultCategories: Category[] = [
  { id: '1', name: 'Pemrograman', color: '#9b87f5' },
  { id: '2', name: 'Ibadah', color: '#38B2AC' },
  { id: '3', name: 'Kesehatan', color: '#4299E1' },
  { id: '4', name: 'Pendidikan', color: '#ED8936' },
  { id: '5', name: 'Lain-lain', color: '#A0AEC0' },
];

// Default habits
export const defaultHabits: Habit[] = [
  {
    id: '1',
    name: 'Video Pembelajaran',
    category: '1',
    frequency: 'daily',
    targetAmount: 5,
    targetUnit: 'video',
    completed: {},
    streakCurrent: 0,
    streakLongest: 0,
    dateCreated: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Project Coding',
    category: '1',
    frequency: 'weekly',
    targetAmount: 2,
    targetUnit: 'project',
    completed: {},
    streakCurrent: 0,
    streakLongest: 0,
    dateCreated: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Membaca',
    category: '4',
    frequency: 'daily',
    targetAmount: 45,
    targetUnit: 'menit',
    completed: {},
    streakCurrent: 0,
    streakLongest: 0,
    dateCreated: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Shalat 5 Waktu',
    category: '2',
    frequency: 'daily',
    targetAmount: 5,
    targetUnit: 'kali',
    completed: {},
    streakCurrent: 0,
    streakLongest: 0,
    dateCreated: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Minum Air',
    category: '3',
    frequency: 'daily',
    targetAmount: 8,
    targetUnit: 'gelas',
    completed: {},
    streakCurrent: 0,
    streakLongest: 0,
    dateCreated: new Date().toISOString(),
  },
];

// Default todos
export const defaultTodos: TodoItem[] = [
  {
    id: '1',
    text: 'Selesaikan video tutorial React',
    completed: false,
    date: new Date().toISOString(),
    priority: 'high',
  },
  {
    id: '2',
    text: 'Commit project ke GitHub',
    completed: false,
    date: new Date().toISOString(),
    priority: 'medium',
  },
  {
    id: '3',
    text: 'Baca dokumentasi TypeScript',
    completed: false,
    date: new Date().toISOString(),
    priority: 'medium',
  },
];

// Achievements
export const defaultAchievements: Achievement[] = [
  {
    id: '1',
    name: 'Pemula Tekun',
    description: 'Selesaikan 7 hari berturut-turut kebiasaan apa pun',
    icon: '🏆',
    unlocked: false,
    progress: 0,
    target: 7,
  },
  {
    id: '2',
    name: 'Developer Rajin',
    description: 'Selesaikan 10 video pembelajaran',
    icon: '🎓',
    unlocked: false,
    progress: 0,
    target: 10,
  },
  {
    id: '3',
    name: 'Pembaca Dahsyat',
    description: 'Baca total 5 jam',
    icon: '📚',
    unlocked: false,
    progress: 0,
    target: 300,
  },
  {
    id: '4',
    name: 'Programmer Produktif',
    description: 'Selesaikan 5 project',
    icon: '💻',
    unlocked: false,
    progress: 0,
    target: 5,
  },
  {
    id: '5',
    name: 'Konsisten Ibadah',
    description: 'Shalat 5 waktu selama 30 hari berturut-turut',
    icon: '🕌',
    unlocked: false,
    progress: 0,
    target: 30,
  },
];

// Get formatted current date
export const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};

// Get formatted date for display
export const formatDate = (date: string | Date) => {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  };
  return d.toLocaleDateString('id-ID', options);
};

// Get dates for the current month
export const getDatesInMonth = (year: number, month: number) => {
  const dates = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d).toISOString().split('T')[0]);
  }
  
  return dates;
};

// Generate today's stats
export const getTodayStats = (habits: Habit[]) => {
  const today = getCurrentDate();
  const total = habits.length;
  const completed = habits.filter(habit => {
    const value = habit.completed[today];
    if (typeof value === "boolean") return value;
    if (typeof value === "number" && habit.targetAmount) return value >= habit.targetAmount;
    return false;
  }).length;
  
  return {
    total,
    completed,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0
  };
};
