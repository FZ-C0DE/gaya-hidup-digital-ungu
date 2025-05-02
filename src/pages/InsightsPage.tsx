import { useState, useEffect } from "react";
import AppLayout from "@/components/Layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Habit, Category, Achievement } from "@/lib/types";
import { defaultHabits, defaultCategories, defaultAchievements, getCurrentDate, getDatesInMonth } from "@/lib/data";

const InsightsPage = () => {
  const [habits] = useLocalStorage<Habit[]>("habits", defaultHabits);
  const [categories] = useLocalStorage<Category[]>("categories", defaultCategories);
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>("achievements", defaultAchievements);
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "all">("week");

  // Update achievements based on habits data
  useEffect(() => {
    const updatedAchievements = [...achievements];
    
    // Pemula Tekun - 7 consecutive days
    const longestStreakHabit = habits.reduce(
      (max, habit) => (habit.streakLongest > max ? habit.streakLongest : max),
      0
    );
    
    updatedAchievements[0] = {
      ...updatedAchievements[0],
      progress: longestStreakHabit,
      unlocked: longestStreakHabit >= updatedAchievements[0].target!,
    };
    
    // Developer Rajin - 10 videos
    const videosHabit = habits.find(h => h.name === "Video Pembelajaran");
    if (videosHabit) {
      const videosCompleted = Object.values(videosHabit.completed).filter(
        v => typeof v === "number" ? v > 0 : v === true
      ).length;
      
      updatedAchievements[1] = {
        ...updatedAchievements[1],
        progress: videosCompleted,
        unlocked: videosCompleted >= updatedAchievements[1].target!,
      };
    }
    
    // Pembaca Dahsyat - 5 hours (300 minutes)
    const readingHabit = habits.find(h => h.name === "Membaca");
    if (readingHabit) {
      const readingMinutes = Object.values(readingHabit.completed).reduce(
        (sum, value) => sum + (typeof value === "number" ? value : 0),
        0
      );
      
      updatedAchievements[2] = {
        ...updatedAchievements[2],
        progress: readingMinutes,
        unlocked: readingMinutes >= updatedAchievements[2].target!,
      };
    }
    
    // Programmer Produktif - 5 projects
    const projectsHabit = habits.find(h => h.name === "Project Coding");
    if (projectsHabit) {
      const projectsCompleted = Object.values(projectsHabit.completed).filter(
        v => typeof v === "number" ? v > 0 : v
      ).length;
      
      updatedAchievements[3] = {
        ...updatedAchievements[3],
        progress: projectsCompleted,
        unlocked: projectsCompleted >= updatedAchievements[3].target!,
      };
    }
    
    // Konsisten Ibadah - 30 consecutive days of prayer
    const prayerHabit = habits.find(h => h.name === "Shalat 5 Waktu");
    if (prayerHabit) {
      updatedAchievements[4] = {
        ...updatedAchievements[4],
        progress: prayerHabit.streakLongest,
        unlocked: prayerHabit.streakLongest >= updatedAchievements[4].target!,
      };
    }
    
    setAchievements(updatedAchievements);
  }, [habits]);
  
  // Get dates for the selected period
  const getDatesForPeriod = () => {
    const now = new Date();
    const today = now.getDate();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    if (selectedPeriod === "week") {
      // Get dates for the last 7 days
      const dates = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split("T")[0]);
      }
      return dates;
    } else if (selectedPeriod === "month") {
      // Get dates for the current month
      return getDatesInMonth(currentYear, currentMonth);
    } else {
      // Get all dates with habit data
      const allDates = new Set<string>();
      habits.forEach((habit) => {
        Object.keys(habit.completed).forEach((date) => {
          allDates.add(date);
        });
      });
      
      return Array.from(allDates).sort();
    }
  };
  
  // Get habit completion data for selected period
  const getHabitCompletionData = () => {
    const dates = getDatesForPeriod();
    
    const completionData = dates.map((date) => {
      const dateObj = new Date(date);
      const formattedDate = dateObj.getDate().toString();
      
      // Count completed habits for this date
      const completedCount = habits.filter((habit) => {
        const value = habit.completed[date];
        return value === true || (typeof value === "number" && value > 0);
      }).length;
      
      // Calculate percentage
      const percentage = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;
      
      return {
        date: formattedDate,
        fullDate: date,
        completed: completedCount,
        total: habits.length,
        percentage: Math.round(percentage),
      };
    });
    
    return completionData;
  };
  
  // Get category distribution data
  const getCategoryDistribution = () => {
    const categoryData: { name: string; value: number; color: string }[] = [];
    
    categories.forEach((category) => {
      const habitsInCategory = habits.filter((h) => h.category === category.id);
      
      if (habitsInCategory.length > 0) {
        // Count total completions in this category
        let completions = 0;
        habitsInCategory.forEach((habit) => {
          Object.values(habit.completed).forEach((value) => {
            if (value === true || (typeof value === "number" && value > 0)) {
              completions++;
            }
          });
        });
        
        categoryData.push({
          name: category.name,
          value: completions,
          color: category.color,
        });
      }
    });
    
    return categoryData;
  };
  
  const habitCompletionData = getHabitCompletionData();
  const categoryDistribution = getCategoryDistribution();
  
  // Get total streaks
  const totalCurrentStreak = habits.reduce(
    (sum, habit) => sum + habit.streakCurrent,
    0
  );
  
  const totalLongestStreak = habits.reduce(
    (sum, habit) => sum + habit.streakLongest,
    0
  );
  
  const unlockedAchievements = achievements.filter((a) => a.unlocked).length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gradient">Wawasan &amp; Pencapaian</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-habit-dark-card glass-effect card-hover">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center space-y-2">
                <h2 className="text-xl font-bold text-habit-purple">{totalCurrentStreak}</h2>
                <p className="text-sm text-muted-foreground">Total Streak Saat Ini</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-habit-dark-card glass-effect card-hover">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center space-y-2">
                <h2 className="text-xl font-bold text-habit-purple">{totalLongestStreak}</h2>
                <p className="text-sm text-muted-foreground">Total Streak Terpanjang</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-habit-dark-card glass-effect card-hover">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center space-y-2">
                <h2 className="text-xl font-bold text-habit-purple">
                  {unlockedAchievements}/{achievements.length}
                </h2>
                <p className="text-sm text-muted-foreground">Pencapaian Terbuka</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="bg-habit-dark-card glass-effect">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Tren Penyelesaian</CardTitle>
              <div className="flex space-x-2">
                <Badge
                  onClick={() => setSelectedPeriod("week")}
                  className={`cursor-pointer transition-colors hover:bg-habit-purple/40 ${
                    selectedPeriod === "week"
                      ? "bg-habit-purple"
                      : "bg-secondary"
                  }`}
                >
                  Minggu Ini
                </Badge>
                <Badge
                  onClick={() => setSelectedPeriod("month")}
                  className={`cursor-pointer transition-colors hover:bg-habit-purple/40 ${
                    selectedPeriod === "month"
                      ? "bg-habit-purple"
                      : "bg-secondary"
                  }`}
                >
                  Bulan Ini
                </Badge>
                <Badge
                  onClick={() => setSelectedPeriod("all")}
                  className={`cursor-pointer transition-colors hover:bg-habit-purple/40 ${
                    selectedPeriod === "all"
                      ? "bg-habit-purple"
                      : "bg-secondary"
                  }`}
                >
                  Semua
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={habitCompletionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis
                  stroke="#888"
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, "Penyelesaian"]}
                  labelFormatter={(label: string, items: any) => {
                    const item = items[0].payload;
                    return `Tanggal ${label}: ${item.completed}/${item.total} kebiasaan`;
                  }}
                  contentStyle={{ backgroundColor: "#1A1F2C", borderColor: "#333" }}
                />
                <Bar
                  dataKey="percentage"
                  name="Penyelesaian"
                  fill="#9b87f5"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-habit-dark-card glass-effect">
            <CardHeader>
              <CardTitle>Distribusi Kategori</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {categoryDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [value, "Penyelesaian"]}
                      contentStyle={{
                        backgroundColor: "#1A1F2C",
                        borderColor: "#333",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Belum ada data yang cukup.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-habit-dark-card glass-effect">
            <CardHeader>
              <CardTitle>Pencapaian</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement) => {
                  const progress = achievement.progress || 0;
                  const target = achievement.target || 1;
                  const percentage = Math.min(100, Math.round((progress / target) * 100));
                  
                  return (
                    <div key={achievement.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`text-xl ${
                            achievement.unlocked
                              ? "animate-pulse-soft"
                              : "opacity-50"
                          }`}
                        >
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium">
                              {achievement.name}{" "}
                              {achievement.unlocked && (
                                <Badge className="bg-habit-purple ml-2">
                                  Terbuka
                                </Badge>
                              )}
                            </h3>
                            <span className="text-xs text-muted-foreground">
                              {progress}/{target}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-1" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default InsightsPage;
