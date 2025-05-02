
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarCheck, FileText, TrendingUp } from "lucide-react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Habit, Category, TodoItem, Achievement } from "@/lib/types";
import { defaultHabits, defaultCategories, defaultTodos, defaultAchievements, getTodayStats, getCurrentDate, formatDate } from "@/lib/data";
import AppLayout from "@/components/Layout/AppLayout";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [habits, setHabits] = useLocalStorage<Habit[]>("habits", defaultHabits);
  const [categories] = useLocalStorage<Category[]>("categories", defaultCategories);
  const [todos] = useLocalStorage<TodoItem[]>("todos", defaultTodos);
  const [achievements] = useLocalStorage<Achievement[]>("achievements", defaultAchievements);
  const [todayStats, setTodayStats] = useState({ total: 0, completed: 0, percentage: 0 });
  
  const { toast } = useToast();
  const today = getCurrentDate();
  
  useEffect(() => {
    setTodayStats(getTodayStats(habits));
  }, [habits]);
  
  const todosDue = todos.filter(todo => !todo.completed).length;
  const achievementsUnlocked = achievements.filter(a => a.unlocked).length;

  const toggleHabitCompletion = (habitId: string) => {
    setHabits(prevHabits => 
      prevHabits.map(habit => {
        if (habit.id === habitId) {
          const isCompleted = !!habit.completed[today];
          const updatedCompleted = { 
            ...habit.completed, 
            [today]: !isCompleted 
          };
          
          toast({
            title: isCompleted ? "Kebiasaan dibatalkan" : "Kebiasaan diselesaikan!",
            description: isCompleted ? "Tetap semangat!" : "Pertahankan konsistensi!",
            variant: isCompleted ? "destructive" : "default",
          });
          
          return {
            ...habit,
            completed: updatedCompleted,
            streakCurrent: !isCompleted ? habit.streakCurrent + 1 : Math.max(0, habit.streakCurrent - 1),
            streakLongest: !isCompleted ? Math.max(habit.streakLongest, habit.streakCurrent + 1) : habit.streakLongest,
          };
        }
        return habit;
      })
    );
  };

  // Get habits by category
  const getHabitsByCategory = (categoryId: string) => {
    return habits.filter(habit => habit.category === categoryId);
  };

  // Recent activity for today
  const recentHabits = habits
    .filter(habit => habit.completed[today] !== undefined)
    .slice(0, 5);

  return (
    <AppLayout>
      <div className="space-y-6">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gradient">Selamat Datang!</h1>
            <p className="text-sm text-muted-foreground">{formatDate(today)}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-habit-dark-card glass-effect card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Progress Hari Ini</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-habit-purple">{todayStats.percentage}%</p>
                    <p className="text-sm text-muted-foreground">
                      {todayStats.completed}/{todayStats.total} kebiasaan
                    </p>
                  </div>
                  <Progress value={todayStats.percentage} className="h-2 bg-secondary" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-habit-dark-card glass-effect card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Tugas</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold text-habit-purple">{todosDue}</p>
                  <p className="text-xs text-muted-foreground">Tugas belum selesai</p>
                </div>
                <FileText className="text-habit-light-purple h-12 w-12 opacity-50" />
              </CardContent>
            </Card>
            
            <Card className="bg-habit-dark-card glass-effect card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Pencapaian</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold text-habit-purple">{achievementsUnlocked}</p>
                  <p className="text-xs text-muted-foreground">Dari {achievements.length}</p>
                </div>
                <TrendingUp className="text-habit-light-purple h-12 w-12 opacity-50" />
              </CardContent>
            </Card>
          </div>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CalendarCheck className="text-habit-purple" size={24} />
            <span>Aktivitas Hari Ini</span>
          </h2>
          
          <Tabs defaultValue={categories[0].id} className="w-full">
            <TabsList className="bg-habit-dark-card mb-4 overflow-x-auto flex whitespace-nowrap w-full">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="data-[state=active]:text-habit-purple data-[state=active]:shadow-habit-purple/20"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="space-y-4">
                {getHabitsByCategory(category.id).length > 0 ? (
                  getHabitsByCategory(category.id).map((habit) => {
                    const isCompleted = !!habit.completed[today];
                    return (
                      <Card key={habit.id} className={`bg-habit-dark-card glass-effect card-hover ${isCompleted ? 'border-habit-purple/50' : 'border-white/5'}`}>
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex flex-col">
                            <p className="font-medium">{habit.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Target: {habit.targetAmount} {habit.targetUnit} {habit.frequency === 'weekly' ? '/ minggu' : '/ hari'}
                            </p>
                          </div>
                          <Button 
                            onClick={() => toggleHabitCompletion(habit.id)} 
                            variant={isCompleted ? "default" : "outline"}
                            className={isCompleted ? "bg-habit-purple hover:bg-habit-purple/90" : ""}
                          >
                            {isCompleted ? "Selesai ✓" : "Tandai Selesai"}
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Belum ada kebiasaan di kategori ini.
                  </p>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Aktivitas Terakhir</h2>
          {recentHabits.length > 0 ? (
            <div className="space-y-2">
              {recentHabits.map((habit) => {
                const category = categories.find(c => c.id === habit.category);
                const isCompleted = !!habit.completed[today];
                return (
                  <div key={habit.id} className="flex items-center gap-2 text-sm p-2 rounded-md bg-habit-dark-card/50">
                    <div className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="font-medium">{habit.name}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{category?.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">Hari ini</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              Belum ada aktivitas hari ini.
            </p>
          )}
        </section>
      </div>
    </AppLayout>
  );
};

export default Index;
