
import { useState } from "react";
import AppLayout from "@/components/Layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { TodoItem } from "@/lib/types";
import useLocalStorage from "@/hooks/useLocalStorage";
import { defaultTodos, getCurrentDate } from "@/lib/data";
import { v4 as uuidv4 } from 'uuid';

const TodosPage = () => {
  const [todos, setTodos] = useLocalStorage<TodoItem[]>("todos", defaultTodos);
  const [newTodo, setNewTodo] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const { toast } = useToast();

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim() === "") return;

    const todo: TodoItem = {
      id: uuidv4(),
      text: newTodo,
      completed: false,
      date: new Date().toISOString(),
      priority,
    };

    setTodos([...todos, todo]);
    setNewTodo("");
    toast({
      title: "Tugas ditambahkan",
      description: "Tugas baru telah ditambahkan ke daftar Anda",
    });
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          const newStatus = !todo.completed;
          
          // Show toast for completion/undoing
          if (newStatus) {
            toast({
              title: "Tugas selesai!",
              description: "Selamat, Anda telah menyelesaikan tugas ini",
            });
          }
          
          return { ...todo, completed: newStatus };
        }
        return todo;
      })
    );
  };

  const deleteTodo = (id: string) => {
    const todoToDelete = todos.find(todo => todo.id === id);
    if (!todoToDelete) return;
    
    setTodos(todos.filter((todo) => todo.id !== id));
    toast({
      variant: "destructive",
      title: "Tugas dihapus",
      description: "Tugas telah dihapus dari daftar Anda",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 border-red-500/30 text-red-400";
      case "medium":
        return "bg-yellow-500/20 border-yellow-500/30 text-yellow-400";
      case "low":
        return "bg-green-500/20 border-green-500/30 text-green-400";
      default:
        return "bg-habit-purple/20 border-habit-purple/30 text-habit-purple";
    }
  };

  const completedTodos = todos.filter((todo) => todo.completed);
  const pendingTodos = todos.filter((todo) => !todo.completed);

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gradient">Daftar Tugas</h1>

        <Card className="bg-habit-dark-card glass-effect border-habit-purple/20">
          <CardHeader>
            <CardTitle className="text-lg">Tambah Tugas Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addTodo} className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Tambahkan tugas baru..."
                  className="flex-1 bg-secondary/50"
                />
                <div className="flex gap-2">
                  <Select
                    value={priority}
                    onValueChange={(value: any) => setPriority(value)}
                  >
                    <SelectTrigger className="w-[140px] bg-secondary/50">
                      <SelectValue placeholder="Prioritas" />
                    </SelectTrigger>
                    <SelectContent className="bg-habit-dark-card">
                      <SelectItem value="low">Rendah</SelectItem>
                      <SelectItem value="medium">Sedang</SelectItem>
                      <SelectItem value="high">Tinggi</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button type="submit" className="bg-habit-purple hover:bg-habit-purple/90">
                    Tambah
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Tugas Yang Perlu Dikerjakan ({pendingTodos.length})</h2>
            {pendingTodos.length > 0 ? (
              <div className="space-y-2">
                {pendingTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center gap-3 p-3 rounded-md bg-habit-dark-card glass-effect card-hover"
                  >
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id)}
                      className="border-habit-purple data-[state=checked]:bg-habit-purple"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{todo.text}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(todo.date).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded border ${getPriorityColor(
                        todo.priority
                      )}`}
                    >
                      {todo.priority === "high"
                        ? "Tinggi"
                        : todo.priority === "medium"
                        ? "Sedang"
                        : "Rendah"}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                Tidak ada tugas yang perlu dikerjakan. Selamat!
              </p>
            )}
          </div>

          {completedTodos.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Tugas Selesai ({completedTodos.length})</h2>
              <div className="space-y-2">
                {completedTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center gap-3 p-3 rounded-md bg-habit-dark-card/50 glass-effect opacity-70"
                  >
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id)}
                      className="border-habit-purple data-[state=checked]:bg-habit-purple"
                    />
                    <div className="flex-1">
                      <p className="font-medium line-through">{todo.text}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(todo.date).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default TodosPage;
