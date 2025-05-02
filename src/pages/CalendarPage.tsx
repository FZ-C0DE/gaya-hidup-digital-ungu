
import { useState } from "react";
import AppLayout from "@/components/Layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Habit, Category } from "@/lib/types";
import useLocalStorage from "@/hooks/useLocalStorage";
import { defaultHabits, defaultCategories, formatDate } from "@/lib/data";

const CalendarPage = () => {
  const [habits] = useLocalStorage<Habit[]>("habits", defaultHabits);
  const [categories] = useLocalStorage<Category[]>("categories", defaultCategories);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      setSelectedDate(date.toISOString().split("T")[0]);
    }
  };

  const getCompletedHabitsForDate = (dateStr: string) => {
    return habits.filter((habit) => {
      const completed = habit.completed[dateStr];
      return completed === true || (typeof completed === "number" && completed > 0);
    });
  };

  const completedHabitsForSelectedDate = getCompletedHabitsForDate(selectedDate);
  
  // Generate calendar day modifier to show dots on days with completed habits
  const daysWithHabits: Record<string, { className: string; tooltip: string }> = {};
  habits.forEach((habit) => {
    Object.keys(habit.completed).forEach((dateStr) => {
      const value = habit.completed[dateStr];
      if (value === true || (typeof value === "number" && value > 0)) {
        const date = new Date(dateStr);
        const dateKey = date.toISOString().split("T")[0];
        
        if (!daysWithHabits[dateKey]) {
          daysWithHabits[dateKey] = {
            className: "relative bg-habit-purple/20 rounded-md",
            tooltip: "Kebiasaan telah dicatat pada tanggal ini"
          };
        }
      }
    });
  });
  
  // A function to format date strings to a more human-readable format
  const formatDateForDisplay = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gradient">Kalender Kebiasaan</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-habit-dark-card glass-effect border-habit-purple/10">
            <CardHeader>
              <CardTitle>Pilih Tanggal</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                className="rounded-md bg-habit-dark-card border border-white/10"
                modifiers={{ 
                  highlighted: daysWithHabits 
                }}
                modifiersClassNames={{
                  highlighted: "relative bg-habit-purple/20 rounded-md",
                }}
              />
            </CardContent>
          </Card>
          
          <Card className="bg-habit-dark-card glass-effect border-habit-purple/10">
            <CardHeader>
              <CardTitle>
                Aktivitas untuk {formatDateForDisplay(selectedDate)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {completedHabitsForSelectedDate.length > 0 ? (
                <div className="space-y-4">
                  {completedHabitsForSelectedDate.map((habit) => {
                    const category = categories.find((c) => c.id === habit.category);
                    return (
                      <div
                        key={habit.id}
                        className="p-3 rounded-md bg-habit-dark-card/50 glass-effect border border-white/5"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{habit.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {category?.name}
                            </p>
                          </div>
                          <Badge className="bg-habit-purple hover:bg-habit-purple/90">
                            Selesai
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Tidak ada aktivitas yang dicatat pada tanggal ini.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Card className="bg-habit-dark-card glass-effect border-habit-purple/10">
          <CardHeader>
            <CardTitle>Ikhtisar Bulanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => {
                  const habitsInCategory = habits.filter(
                    (h) => h.category === category.id
                  );
                  
                  if (habitsInCategory.length === 0) return null;
                  
                  // Count completed days in current month for this category
                  const now = new Date();
                  const currentMonth = now.getMonth();
                  const currentYear = now.getFullYear();
                  
                  let totalDaysCompleted = 0;
                  habitsInCategory.forEach((habit) => {
                    Object.keys(habit.completed).forEach((dateStr) => {
                      const date = new Date(dateStr);
                      if (
                        date.getMonth() === currentMonth &&
                        date.getFullYear() === currentYear &&
                        (habit.completed[dateStr] === true ||
                          (typeof habit.completed[dateStr] === "number" &&
                            habit.completed[dateStr] > 0))
                      ) {
                        totalDaysCompleted++;
                      }
                    });
                  });
                  
                  return (
                    <Card
                      key={category.id}
                      className="bg-habit-dark-card/50 glass-effect border border-white/5"
                    >
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-2">{category.name}</h3>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Jumlah kebiasaan:
                            </span>
                            <span>{habitsInCategory.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Hari tercatat bulan ini:
                            </span>
                            <span>{totalDaysCompleted}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CalendarPage;
