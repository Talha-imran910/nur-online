import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/Navbar";
import elafLogo from "@/assets/elaf-logo.png";
import { ArabicQuote } from "@/components/IslamicDecorations";
import { Eye, EyeOff, LogIn, Shield, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ensureStudent } from "@/lib/store";
import { supabase, isCurrentUserTeacher } from "@/integrations/supabase/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load saved credentials
  useEffect(() => {
    try {
      const saved = localStorage.getItem("elaf_remember");
      if (saved) {
        const { email: savedEmail } = JSON.parse(saved);
        setEmail(savedEmail || "");
        setRememberMe(true);
      }
    } catch {}
  }, []);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setResetLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: "Reset email sent",
        description: "Check your email inbox for a password reset link.",
      });
      setForgotMode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (rememberMe) {
      localStorage.setItem("elaf_remember", JSON.stringify({ email }));
    } else {
      localStorage.removeItem("elaf_remember");
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error || !data.user) {
      toast({
        title: "Sign-in failed",
        description: error?.message || "Check your email and password.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const isTeacher = await isCurrentUserTeacher();
    const name = (data.user.user_metadata?.name as string) || data.user.email!.split("@")[0];

    if (isTeacher) {
      localStorage.setItem("elaf_user", JSON.stringify({ role: "teacher", email: data.user.email, name: "Ustadha Afshan Imran" }));
      toast({ title: "Assalamu Alaikum, Ustadha! 🌙", description: "Welcome to your teacher dashboard." });
      navigate("/admin");
    } else {
      localStorage.setItem("elaf_user", JSON.stringify({ role: "student", email: data.user.email, name }));
      ensureStudent({ email: data.user.email!, name });
      toast({ title: "Welcome back! 📖", description: "Continuing your Quranic journey..." });
      navigate("/dashboard");
    }
    setLoading(false);
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

          <form onSubmit={forgotMode ? handleForgotPassword : handleSubmit} className="glass-card rounded-2xl p-8 space-y-5 shadow-elegant">
            {forgotMode ? (
              <>
                <div className="text-center space-y-1">
                  <h2 className="font-serif text-xl font-semibold text-foreground">Reset Password</h2>
                  <p className="text-sm text-muted-foreground">Enter the email address for your account and we'll send a reset link.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email Address</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="your@email.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="h-11 rounded-xl"
                    required
                  />
                </div>
                <Button type="submit" variant="emerald" className="w-full h-11 rounded-xl text-base" disabled={resetLoading}>
                  {resetLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Send Reset Link
                    </span>
                  )}
                </Button>
                <div className="text-center text-sm">
                  <button type="button" onClick={() => setForgotMode(false)} className="text-primary font-medium hover:underline">
                    Back to Sign In
                  </button>
                </div>
              </>
            ) : (
              <>
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <button
                      type="button"
                      onClick={() => { setResetEmail(email); setForgotMode(true); }}
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
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
              </>
            )}
          </form>

          <ArabicQuote text="بسم الله الرحمن الرحيم" className="mt-6" />
        </div>
      </div>
    </div>
  );
}
