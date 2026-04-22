import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/AuthContext"
import { AuthService } from "@/services/auth.service"
import { Shield } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Parollar mos kelmadi");
      return;
    }

    setLoading(true);
    try {
      await AuthService.register({ email, username, password, password_confirm: confirmPassword });
      toast.success("Ro'yxatdan o'tish muvaffaqiyatli! Tizimga kiritilmoqdasiz...");
      // Auto login
      await login({ email, password });
      navigate("/app/dashboard", { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.message || "Ro'yxatdan o'tishda xatolik yuz berdi";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/3" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] translate-y-1/2 translate-x-1/3" />

      <div className="w-full max-w-md space-y-8 relative z-10 glass-panel p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
        <div className="flex flex-col items-center justify-center space-y-3 relative z-10">
          <div className="relative mb-2">
            <Shield className="w-12 h-12 text-primary relative z-10 drop-shadow-[0_0_15px_rgba(33,150,243,0.5)]" />
            <div className="absolute inset-0 bg-primary/40 blur-xl rounded-full" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground font-headline">Akkaunt yaratish</h2>
          <p className="text-sm text-muted-foreground text-center">
            Raqamli aktivlaringizni himoyalash uchun ro'yxatdan o'ting.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground">Elektron pochta</label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50 border-border/50 h-10 focus-visible:ring-primary/50" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground">Foydalanuvchi nomi</label>
              <Input 
                id="username" 
                type="text" 
                placeholder="johndoe" 
                required 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-background/50 border-border/50 h-10 focus-visible:ring-primary/50" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground">Parol</label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50 border-border/50 h-10 focus-visible:ring-primary/50" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground">Parolni tasdiqlash</label>
              <Input 
                id="confirmPassword" 
                type="password" 
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-background/50 border-border/50 h-10 focus-visible:ring-primary/50" 
              />
            </div>
          </div>
          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(33,150,243,0.3)] transition-all"
          >
            {loading ? "Akkaunt yaratilmoqda..." : "Ro'yxatdan o'tish"}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground relative z-10">
          Akkauntingiz bormi?{" "}
          <Link to="/login" className="font-semibold text-primary hover:text-primary/80">
            Tizimga kirish
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
