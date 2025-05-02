
import { useState } from "react";
import AppLayout from "@/components/Layout/AppLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2 } from "lucide-react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Habit, Category } from "@/lib/types";
import { defaultHabits, defaultCategories, getCurrentDate } from "@/lib/data";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { v4 as uuidv4 } from 'uuid';

const HabitsPage = () => {
  const [habits, setHabits] = useLocalStorage<Habit[]>("habits", defaultHabits);
  const [categories] = useLocalStorage<Category[]>("categories", defaultCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      name: "",
      category: "",
      frequency: "daily" as "daily" | "weekly",
      targetAmount: 1,
      targetUnit: ""
    }
  });
  
  const onSubmit = (data: any) => {
    if (editingHabit) {
      // Update existing habit
      setHabits(prevHabits => 
        prevHabits.map(habit => 
          habit.id === editingHabit.id 
            ? { ...habit, ...data } 
            : habit
        )
      );
      
      toast({
        title: "Kebiasaan diperbarui",
        description: `${data.name} telah diperbarui`,
      });
    } else {
      // Add new habit
      const newHabit: Habit = {
        id: uuidv4(),
        name: data.name,
        category: data.category,
        frequency: data.frequency,
        targetAmount: data.targetAmount,
        targetUnit: data.targetUnit,
        completed: {},
        streakCurrent: 0,
        streakLongest: 0,
        dateCreated: new Date().toISOString(),
      };
      
      setHabits(prevHabits => [...prevHabits, newHabit]);
      
      toast({
        title: "Kebiasaan baru ditambahkan",
        description: `${data.name} telah ditambahkan ke daftar kebiasaan`,
      });
    }
    
    setIsDialogOpen(false);
    setEditingHabit(null);
    form.reset();
  };
  
  const deleteHabit = (id: string) => {
    const habitToDelete = habits.find(h => h.id === id);
    if (habitToDelete) {
      setHabits(prevHabits => prevHabits.filter(habit => habit.id !== id));
      
      toast({
        title: "Kebiasaan dihapus",
        description: `${habitToDelete.name} telah dihapus dari daftar kebiasaan`,
        variant: "destructive",
      });
    }
  };
  
  const editHabit = (habit: Habit) => {
    setEditingHabit(habit);
    form.reset({
      name: habit.name,
      category: habit.category,
      frequency: habit.frequency,
      targetAmount: habit.targetAmount || 1,
      targetUnit: habit.targetUnit || "",
    });
    setIsDialogOpen(true);
  };
  
  const today = getCurrentDate();
  
  const toggleHabitCompletion = (habitId: string) => {
    setHabits(prevHabits => 
      prevHabits.map(habit => {
        if (habit.id === habitId) {
          const isCompleted = !!habit.completed[today];
          const updatedCompleted = { 
            ...habit.completed, 
            [today]: !isCompleted 
          };
          
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
  
  const getHabitsByCategory = (categoryId: string) => {
    return habits.filter(habit => habit.category === categoryId);
  };
  
  const openNewHabitDialog = () => {
    setEditingHabit(null);
    form.reset({
      name: "",
      category: categories[0].id,
      frequency: "daily",
      targetAmount: 1,
      targetUnit: ""
    });
    setIsDialogOpen(true);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gradient">Kebiasaan</h1>
          <Button onClick={openNewHabitDialog} className="bg-habit-purple hover:bg-habit-purple/90">
            <Plus className="mr-1 h-4 w-4" />
            Tambah Kebiasaan
          </Button>
        </div>
        
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
                      <CardHeader className="pb-2">
                        <CardTitle>{habit.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Target:</span>
                            <span>{habit.targetAmount} {habit.targetUnit} {habit.frequency === 'weekly' ? '/ minggu' : '/ hari'}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Streak saat ini:</span>
                            <span>{habit.streakCurrent} hari</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Streak terpanjang:</span>
                            <span>{habit.streakLongest} hari</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-habit-purple border-habit-purple/20 hover:bg-habit-purple/10"
                            onClick={() => editHabit(habit)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-red-500 border-red-500/20 hover:bg-red-500/10">
                                <Trash2 className="h-4 w-4 mr-1" />
                                Hapus
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-habit-dark-card">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus kebiasaan?</AlertDialogTitle>
                              </AlertDialogHeader>
                              <div className="py-3">
                                Apakah Anda yakin ingin menghapus kebiasaan "{habit.name}"? Tindakan ini tidak dapat dibatalkan.
                              </div>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={() => deleteHabit(habit.id)}>
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                        
                        <Button 
                          onClick={() => toggleHabitCompletion(habit.id)} 
                          variant={isCompleted ? "default" : "outline"}
                          size="sm"
                          className={isCompleted ? "bg-habit-purple hover:bg-habit-purple/90" : ""}
                        >
                          {isCompleted ? "Selesai ✓" : "Tandai Selesai"}
                        </Button>
                      </CardFooter>
                    </Card>
                  )
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Belum ada kebiasaan di kategori ini.</p>
                  <Button onClick={openNewHabitDialog} className="bg-habit-purple hover:bg-habit-purple/90">
                    <Plus className="mr-1 h-4 w-4" />
                    Tambah Kebiasaan
                  </Button>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-habit-dark-card">
          <DialogHeader>
            <DialogTitle>{editingHabit ? "Edit Kebiasaan" : "Tambah Kebiasaan Baru"}</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Kebiasaan</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama kebiasaan" {...field} className="bg-secondary/50" />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-secondary/50">
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-habit-dark-card">
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frekuensi</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-secondary/50">
                          <SelectValue placeholder="Pilih frekuensi" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-habit-dark-card">
                        <SelectItem value="daily">Harian</SelectItem>
                        <SelectItem value="weekly">Mingguan</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="targetAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Jumlah</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1} 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value))}
                          className="bg-secondary/50" 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="targetUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Satuan</FormLabel>
                      <FormControl>
                        <Input placeholder="video, project, kali, dll" {...field} className="bg-secondary/50" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="submit" className="bg-habit-purple hover:bg-habit-purple/90">
                  {editingHabit ? "Perbarui" : "Tambah"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default HabitsPage;
