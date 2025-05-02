import AppLayout from "@/components/Layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Habit, defaultHabits } from "@/lib/data";

interface Achievement {
  id: number;
  title: string;
  description: string;
  achieved: boolean;
  progress?: number;
}

const InsightsPage = () => {
  const [habits] = useLocalStorage<Habit[]>("habits", defaultHabits);
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 1,
      title: "Langkah Awal",
      description: "Selesaikan setidaknya satu kebiasaan.",
      achieved: false,
    },
    {
      id: 2,
      title: "Pembelajar Aktif",
      description: "Tonton 5 video pembelajaran.",
      achieved: false,
      progress: 0,
    },
    {
      id: 3,
      title: "Inisiator Proyek",
      description: "Selesaikan 2 proyek.",
      achieved: false,
      progress: 0,
    },
    {
      id: 4,
      title: "Gemar Membaca",
      description: "Membaca selama 30+ menit setiap hari selama 7 hari.",
      achieved: false,
      progress: 0,
    },
    {
      id: 5,
      title: "Konsisten",
      description: "Pertahankan semua kebiasaan Anda selama 30 hari.",
      achieved: false,
    },
  ]);
  
  useEffect(() => {
    // Create a deep copy of achievements to modify
    const updatedAchievements = [...achievements];
    
    // Achievement 1: Completing at least one habit
    const hasCompletedHabit = habits.some(habit => 
      Object.values(habit.completed).some(v => v === true || (typeof v === "number" && v > 0))
    );
    
    updatedAchievements[0] = {
      ...updatedAchievements[0],
      achieved: hasCompletedHabit
    };
    
    // Achievement 2: Complete 5 learning videos
    const videosHabit = habits.find(h => h.name === "Video Pembelajaran");
    if (videosHabit) {
      const videosCompleted = Object.values(videosHabit.completed).filter(
        v => typeof v === "number" ? v > 0 : v === true
      ).length;
      
      updatedAchievements[1] = {
        ...updatedAchievements[1],
        achieved: videosCompleted >= 5,
        progress: Math.min(videosCompleted / 5 * 100, 100)
      };
    }
    
    // Achievement 3: Complete 2 projects
    const projectsHabit = habits.find(h => h.name === "Menyelesaikan Proyek");
    if (projectsHabit) {
      const projectsCompleted = Object.values(projectsHabit.completed).filter(
        v => typeof v === "number" ? v > 0 : v === true
      ).length;
      
      updatedAchievements[2] = {
        ...updatedAchievements[2],
        achieved: projectsCompleted >= 2,
        progress: Math.min(projectsCompleted / 2 * 100, 100)
      };
    }
    
    // Achievement 4: Read 30+ minutes for 7 days
    const readingHabit = habits.find(h => h.name === "Membaca");
    if (readingHabit) {
      let daysWithEnoughReading = 0;
      
      Object.values(readingHabit.completed).forEach(value => {
        // Ensure we're only adding numerical values
        if (typeof value === "number" && value >= 30) {
          daysWithEnoughReading += 1;
        }
      });
      
      updatedAchievements[3] = {
        ...updatedAchievements[3],
        achieved: daysWithEnoughReading >= 7,
        progress: Math.min(daysWithEnoughReading / 7 * 100, 100)
      };
    }
    
    // Achievement 5: Maintain all habits for 30 days
    if (habits.length > 0) {
      let isConsistent = true;
      
      habits.forEach(habit => {
        const totalDays = 30;
        let completedDays = 0;
        
        Object.values(habit.completed).forEach(value => {
          if (value === true || (typeof value === "number" && value > 0)) {
            completedDays++;
          }
        });
        
        if (completedDays < totalDays) {
          isConsistent = false;
        }
      });
      
      updatedAchievements[4] = {
        ...updatedAchievements[4],
        achieved: isConsistent
      };
    }
    
    setAchievements(updatedAchievements);
  }, [habits]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gradient">Wawasan & Pencapaian</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <Card key={achievement.id} className="bg-habit-dark-card glass-effect border-habit-purple/10">
              <CardHeader>
                <CardTitle>{achievement.title}</CardTitle>
                <CardDescription>{achievement.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {achievement.progress !== undefined ? (
                  <div className="space-y-2">
                    <Progress value={achievement.progress} />
                    <p className="text-sm text-muted-foreground">
                      {achievement.achieved
                        ? "Selamat! Anda telah mencapai ini."
                        : `Progress: ${Math.round(achievement.progress)}%`}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {achievement.achieved
                      ? "Selamat! Anda telah mencapai ini."
                      : "Belum tercapai."}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default InsightsPage;
