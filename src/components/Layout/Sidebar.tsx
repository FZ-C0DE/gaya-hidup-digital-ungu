
import { 
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader 
} from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { CalendarDays, CheckSquare, Home, BarChart, BookOpen, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    {
      title: "Beranda",
      path: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Kebiasaan",
      path: "/habits",
      icon: <CheckSquare className="h-5 w-5" />,
    },
    {
      title: "Kalender",
      path: "/calendar",
      icon: <CalendarDays className="h-5 w-5" />,
    },
    {
      title: "Catatan",
      path: "/journal",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Daftar Tugas",
      path: "/todos",
      icon: <BookOpen className="h-5 w-5" />,
      badge: true,
    },
    {
      title: "Wawasan",
      path: "/insights",
      icon: <BarChart className="h-5 w-5" />,
    },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out bg-habit-dark-card border-r border-white/5 md:relative",
      isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
    )}>
      <SidebarComponent>
        <SidebarHeader className="flex items-center justify-between p-4 border-b border-white/5">
          <h2 className="text-xl font-bold text-gradient">TechHabit</h2>
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5 text-habit-purple" />
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 hover:bg-habit-purple/10 rounded-md",
                    currentPath === item.path && "bg-habit-purple/20 text-habit-purple"
                  )}
                  onClick={() => handleNavigate(item.path)}
                >
                  {item.icon}
                  <span>{item.title}</span>
                  {item.badge && (
                    <Badge className="ml-auto bg-habit-purple text-xs">Baru</Badge>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </SidebarComponent>
    </div>
  );
};

export default Sidebar;
