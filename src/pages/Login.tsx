import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { workers } from "@/data/workers";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState<'staff' | 'citizen'>('staff');
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Citizen login
    if (loginType === 'citizen') {
      if (username.trim() && password.trim()) {
        setUser({ name: username, phone: password, role: "citizen" as any });
        toast.success(`Welcome, ${username}!`);
        navigate("/citizen");
        return;
      }
      toast.error("Please enter your name and phone number.");
      return;
    }

    // Admin login
    if (username === "admin" && password === "admin") {
      setUser({ name: "Main Admin", phone: "", role: "admin" });
      toast.success("Welcome, Main Admin!");
      navigate("/admin");
      return;
    }

    // Local Admin login
    if (username === "localadmin" && password === "localadmin") {
      setUser({ name: "Local Admin", phone: "", role: "local_admin" });
      toast.success("Welcome, Local Admin!");
      navigate("/local-admin");
      return;
    }

    // Worker login - check against workers list
    const worker = workers.find(
      (w) => w.name.toLowerCase() === username.toLowerCase() && w.phone === password
    );

    if (worker) {
      setUser({ name: worker.name, phone: worker.phone, role: "worker" });
      toast.success(`Welcome, ${worker.name}!`);
      navigate("/worker");
      return;
    }

    toast.error("Invalid credentials. Please try again.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

      <div className="glass-card w-full max-w-md p-8 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">HazGuard</h1>
          <p className="text-muted-foreground">Disaster Relief Management System</p>
        </div>

        {/* Login Type Toggle */}
        <div className="flex mb-6 p-1 rounded-full bg-muted/30">
          <button
            type="button"
            onClick={() => setLoginType('staff')}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
              loginType === 'staff' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Staff Login
          </button>
          <button
            type="button"
            onClick={() => setLoginType('citizen')}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
              loginType === 'citizen' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Citizen Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {loginType === 'citizen' ? 'Your Name' : 'Username'}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={loginType === 'citizen' ? 'Enter your name' : 'Enter username'}
              className="w-full h-12 px-4 rounded-full glass-input text-foreground placeholder:text-muted-foreground outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {loginType === 'citizen' ? 'Phone Number' : 'Password / Phone'}
            </label>
            <input
              type={loginType === 'citizen' ? 'tel' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={loginType === 'citizen' ? 'Enter your phone number' : 'Enter password or phone number'}
              className="w-full h-12 px-4 rounded-full glass-input text-foreground placeholder:text-muted-foreground outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-full glass-button text-primary-foreground font-semibold text-lg"
          >
            {loginType === 'citizen' ? 'Track Relief Workers' : 'Login'}
          </button>
        </form>

        {loginType === 'staff' && (
          <div className="mt-6 p-4 rounded-xl bg-muted/30 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-2">Demo Credentials:</p>
            <p>• Admin: admin / admin</p>
            <p>• Local Admin: localadmin / localadmin</p>
            <p>• Worker: [Name] / [Phone from list]</p>
          </div>
        )}

        {loginType === 'citizen' && (
          <div className="mt-6 p-4 rounded-xl bg-muted/30 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-2">Citizen Access:</p>
            <p>Enter your name and phone to track nearby relief workers and get emergency assistance.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
