
import { formatDate, getCurrentDate } from "@/lib/data";
import { NavLink } from "react-router-dom";
import { Home, Calendar, LineChart, ListTodo } from "lucide-react";

const Navbar = () => {
  return (
    <header className="bg-habit-dark-card glass-effect border-b border-white/5 p-2">
      <div className="container mx-auto">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-habit-purple">
              {formatDate(getCurrentDate())}
            </h2>
            <h1 className="text-lg font-semibold text-gradient">TechHabit Tracker</h1>
          </div>
          
          <nav className="flex justify-around items-center pt-1">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `flex flex-col items-center gap-1 px-4 py-1 rounded-md transition-colors ${
                  isActive ? 'text-habit-purple' : 'text-white/70 hover:text-habit-purple'
                }`
              }
            >
              <Home className="h-5 w-5" />
              <span className="text-xs">Beranda</span>
            </NavLink>
            <NavLink 
              to="/calendar" 
              className={({ isActive }) => 
                `flex flex-col items-center gap-1 px-4 py-1 rounded-md transition-colors ${
                  isActive ? 'text-habit-purple' : 'text-white/70 hover:text-habit-purple'
                }`
              }
            >
              <Calendar className="h-5 w-5" />
              <span className="text-xs">Kalender</span>
            </NavLink>
            <NavLink 
              to="/todos" 
              className={({ isActive }) => 
                `flex flex-col items-center gap-1 px-4 py-1 rounded-md transition-colors ${
                  isActive ? 'text-habit-purple' : 'text-white/70 hover:text-habit-purple'
                }`
              }
            >
              <ListTodo className="h-5 w-5" />
              <span className="text-xs">Tugas</span>
            </NavLink>
            <NavLink 
              to="/insights" 
              className={({ isActive }) => 
                `flex flex-col items-center gap-1 px-4 py-1 rounded-md transition-colors ${
                  isActive ? 'text-habit-purple' : 'text-white/70 hover:text-habit-purple'
                }`
              }
            >
              <LineChart className="h-5 w-5" />
              <span className="text-xs">Wawasan</span>
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
