
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { formatDate, getCurrentDate } from "@/lib/data";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  return (
    <header className="bg-habit-dark-card glass-effect border-b border-white/5 p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onMenuClick}>
          <Menu className="h-5 w-5 text-habit-purple" />
        </Button>
        <h2 className="text-lg font-medium text-habit-purple hidden sm:block">
          {formatDate(getCurrentDate())}
        </h2>
      </div>
      <div>
        <h1 className="text-lg font-semibold text-gradient">TechHabit Tracker</h1>
      </div>
    </header>
  );
};

export default Navbar;
