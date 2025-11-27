import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 navbar-glass z-50 flex items-center justify-between px-6">
      <h1 className="text-xl font-bold text-primary">HazGuard</h1>
      
      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="text-sm text-muted-foreground">
              {user.name} ({user.role.replace('_', ' ')})
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
