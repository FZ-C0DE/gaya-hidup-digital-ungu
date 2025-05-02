import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import AppLayout from "@/components/Layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Edit, Plus } from "lucide-react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { JournalEntry } from "@/lib/types";
import { getCurrentDate, formatDate } from "@/lib/data";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const JournalPage = () => {
  const [entries, setEntries] = useLocalStorage<JournalEntry[]>("journal-entries", []);
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<JournalEntry["mood"]>("neutral");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const { toast } = useToast();

  const addEntry = () => {
    if (content.trim() === "") return;

    if (editingEntry) {
      // Update existing entry
      setEntries(
        entries.map((entry) =>
          entry.id === editingEntry.id
            ? { ...entry, content, mood, date: getCurrentDate() }
            : entry
        )
      );

      toast({
        title: "Catatan diperbarui",
        description: "Catatan Anda telah berhasil diperbarui",
      });
    } else {
      // Add new entry
      const newEntry: JournalEntry = {
        id: uuidv4(),
        date: getCurrentDate(),
        content,
        mood,
      };

      setEntries([newEntry, ...entries]);

      toast({
        title: "Catatan ditambahkan",
        description: "Catatan baru telah berhasil disimpan",
      });
    }

    setContent("");
    setMood("neutral");
    setIsDialogOpen(false);
    setEditingEntry(null);
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id));
    toast({
      variant: "destructive",
      title: "Catatan dihapus",
      description: "Catatan telah dihapus dari jurnal Anda",
    });
  };

  const editEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setContent(entry.content);
    setMood(entry.mood || "neutral");
    setIsDialogOpen(true);
  };

  const getMoodEmoji = (mood?: JournalEntry["mood"]) => {
    switch (mood) {
      case "great":
        return "😃";
      case "good":
        return "🙂";
      case "neutral":
        return "😐";
      case "bad":
        return "😔";
      case "terrible":
        return "😣";
      default:
        return "😐";
    }
  };

  const getMoodText = (mood?: JournalEntry["mood"]) => {
    switch (mood) {
      case "great":
        return "Luar Biasa";
      case "good":
        return "Baik";
      case "neutral":
        return "Biasa";
      case "bad":
        return "Buruk";
      case "terrible":
        return "Sangat Buruk";
      default:
        return "Biasa";
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gradient">Catatan Harian</h1>
          <Button
            onClick={() => {
              setEditingEntry(null);
              setContent("");
              setMood("neutral");
              setIsDialogOpen(true);
            }}
            className="bg-habit-purple hover:bg-habit-purple/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Catatan
          </Button>
        </div>

        {entries.length === 0 ? (
          <Card className="bg-habit-dark-card glass-effect border-habit-purple/10">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4 text-center">
                Belum ada catatan harian. Mulai catat perjalanan kebiasaan Anda.
              </p>
              <Button
                onClick={() => {
                  setEditingEntry(null);
                  setContent("");
                  setMood("neutral");
                  setIsDialogOpen(true);
                }}
                className="bg-habit-purple hover:bg-habit-purple/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Catatan Pertama
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {entries.map((entry) => (
              <Card
                key={entry.id}
                className="bg-habit-dark-card glass-effect border-habit-purple/10"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-md flex items-center gap-2">
                      <span className="text-xl" aria-hidden="true">
                        {getMoodEmoji(entry.mood)}
                      </span>
                      <span>{formatDate(entry.date)}</span>
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => editEntry(entry)}
                        className="text-habit-purple hover:text-habit-light-purple hover:bg-habit-purple/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-habit-dark-card">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus catatan?</AlertDialogTitle>
                          </AlertDialogHeader>
                          <div className="py-3">
                            Apakah Anda yakin ingin menghapus catatan ini? Tindakan ini tidak dapat dibatalkan.
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-500 hover:bg-red-600"
                              onClick={() => deleteEntry(entry.id)}
                            >
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="whitespace-pre-wrap">
                  <p className="text-sm text-muted-foreground mb-2">
                    Perasaan: {getMoodText(entry.mood)}
                  </p>
                  <p className="text-foreground">{entry.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-habit-dark-card">
          <DialogHeader>
            <DialogTitle>
              {editingEntry ? "Edit Catatan" : "Tambah Catatan Baru"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Perasaan Hari Ini</label>
              <Select
                value={mood}
                onValueChange={(value: any) => setMood(value)}
              >
                <SelectTrigger className="w-full bg-secondary/50">
                  <SelectValue placeholder="Pilih perasaan Anda" />
                </SelectTrigger>
                <SelectContent className="bg-habit-dark-card">
                  <SelectItem value="great">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">😃</span>
                      <span>Luar Biasa</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="good">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🙂</span>
                      <span>Baik</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="neutral">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">😐</span>
                      <span>Biasa</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="bad">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">😔</span>
                      <span>Buruk</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="terrible">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">😣</span>
                      <span>Sangat Buruk</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Catatan</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tulis catatan harian Anda..."
                className="min-h-[200px] bg-secondary/50"
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={addEntry} className="bg-habit-purple hover:bg-habit-purple/90">
              {editingEntry ? "Perbarui" : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default JournalPage;
