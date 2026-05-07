import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/Navbar";
import elafLogo from "@/assets/elaf-logo.png";
import { ArabicQuote } from "@/components/IslamicDecorations";
import { Eye, EyeOff, LogIn, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ensureStudent } from "@/lib/store";

const TEACHER_EMAIL = "afshan@elaf.com";
const TEACHER_PASS = "elaf2024";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load saved credentials
  useEffect(() => {
    try {
      const saved = localStorage.getItem("elaf_remember");
      if (saved) {
        const { email: savedEmail, password: savedPass } = JSON.parse(saved);
        setEmail(savedEmail || "");
        setPassword(savedPass || "");
        setRememberMe(true);
      }
    } catch {}
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Save or clear remembered credentials
    if (rememberMe) {
      localStorage.setItem("elaf_remember", JSON.stringify({ email, password }));
    } else {
      localStorage.removeItem("elaf_remember");
    }

    setTimeout(() => {
      if (email.toLowerCase() === TEACHER_EMAIL && password === TEACHER_PASS) {
        localStorage.setItem("elaf_user", JSON.stringify({ role: "teacher", email, name: "Ustadha Afshan Imran" }));
        toast({ title: "Assalamu Alaikum, Ustadha! 🌙", description: "Welcome to your teacher dashboard." });
        navigate("/admin");
      } else if (email && password) {
        const name = email.split("@")[0];
        localStorage.setItem("elaf_user", JSON.stringify({ role: "student", email, name }));
        ensureStudent({ email, name });
        toast({ title: "Welcome back! 📖", description: "Continuing your Quranic journey..." });
        navigate("/dashboard");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-scale-in">
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <img src={elafLogo} alt="Elaf-ul-Quran" className="h-20 mx-auto mb-4 animate-float" />
              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-3 w-3 text-primary" />
              </div>
            </div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">Sign in to continue your Quranic journey</p>
          </div>

          <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-5 shadow-elegant">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-xl pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                Remember my email & password
              </Label>
            </div>

            <Button type="submit" variant="emerald" className="w-full h-11 rounded-xl text-base" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </span>
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">Register</Link>
            </div>
          </form>

          <ArabicQuote text="بسم الله الرحمن الرحيم" className="mt-6" />
        </div>
      </div>
    </div>
  );
}
