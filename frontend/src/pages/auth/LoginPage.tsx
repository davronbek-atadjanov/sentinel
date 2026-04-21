import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/app/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      // Error handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3" />

      <div className="w-full max-w-md space-y-8 relative z-10 glass-panel p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
        <div className="flex flex-col items-center justify-center space-y-3 relative z-10">
          <div className="relative mb-2">
            <Shield className="w-12 h-12 text-primary relative z-10 drop-shadow-[0_0_15px_rgba(33,150,243,0.5)]" />
            <div className="absolute inset-0 bg-primary/40 blur-xl rounded-full" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground font-headline">Welcome Back</h2>
          <p className="text-sm text-muted-foreground text-center">
            Sign in to continue to Sentinel Security Scanner.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground">Email</label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50 border-border/50 h-12 focus-visible:ring-primary/50" 
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none text-foreground">Password</label>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50 border-border/50 h-12 focus-visible:ring-primary/50" 
              />
            </div>
          </div>
          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(33,150,243,0.3)] transition-all"
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground relative z-10">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-primary hover:text-primary/80">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
