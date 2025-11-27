import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import Login from "./Login";

const Index = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'local_admin':
          navigate('/local-admin');
          break;
        case 'worker':
          navigate('/worker');
          break;
      }
    }
  }, [user, navigate]);

  return <Login />;
};

export default Index;
