
// Types for our habit tracking app
export type Habit = {
  id: string;
  name: string;
  category: string;
  frequency: 'daily' | 'weekly';
  timeOfDay?: string;
  targetAmount?: number;
  targetUnit?: string;
  completed: Record<string, boolean | number>;
  streakCurrent: number;
  streakLongest: number;
  dateCreated: string;
};

export type Category = {
  id: string;
  name: string;
  color: string;
  icon?: string;
};

export type TodoItem = {
  id: string;
  text: string;
  completed: boolean;
  date: string;
  priority: 'low' | 'medium' | 'high';
};

export type JournalEntry = {
  id: string;
  date: string;
  content: string;
  mood?: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  target?: number;
};
