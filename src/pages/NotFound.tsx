
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-purple">
      <div className="text-center space-y-4 max-w-md p-6 glass-effect rounded-lg bg-black/30">
        <div className="text-habit-purple text-7xl font-bold">404</div>
        <h1 className="text-2xl font-semibold text-foreground">Halaman Tidak Ditemukan</h1>
        <p className="text-muted-foreground mb-4">
          Maaf, halaman yang Anda cari tidak dapat ditemukan.
        </p>
        <Button 
          onClick={() => navigate("/")} 
          className="bg-habit-purple hover:bg-habit-purple/90"
        >
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
