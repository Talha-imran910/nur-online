import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import elafLogo from "@/assets/elaf-logo.png";
import { ArabicQuote } from "@/components/IslamicDecorations";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addStudent, getStudents, getCourses } from "@/lib/store";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Check if student already exists
    const existing = getStudents().find((s) => s.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      toast({ title: "Account already exists", description: "Try signing in instead.", variant: "destructive" });
      setLoading(false);
      return;
    }

    // Get free courses to auto-enroll
    const freeCourses = getCourses().filter((c) => c.isFree).map((c) => c.id);

    setTimeout(() => {
      // Add student to the shared store
      addStudent({
        id: `s-${Date.now()}`,
        name,
        email,
        enrolledCourses: freeCourses,
        progress: Object.fromEntries(freeCourses.map((id) => [id, 0])),
        joinedDate: new Date().toISOString().split("T")[0],
      });

      localStorage.setItem("elaf_user", JSON.stringify({ role: "student", email, name, phone }));
      toast({ title: "Account Created! 🎉", description: "Welcome to Elaf-ul-Quran Academy." });
      navigate("/dashboard");
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-scale-in">
          <div className="text-center mb-8">
            <img src={elafLogo} alt="Elaf-ul-Quran" className="h-20 mx-auto mb-4 animate-float" />
            <h1 className="font-serif text-3xl font-bold text-foreground">Join Elaf-ul-Quran</h1>
            <p className="text-muted-foreground mt-2">Start your journey of Quranic knowledge</p>
          </div>

          <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-5 shadow-elegant">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} className="h-11 rounded-xl" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-xl" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone / WhatsApp Number *</Label>
              <Input id="phone" type="tel" placeholder="+92 300 1234567" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11 rounded-xl" required />
              <p className="text-xs text-muted-foreground">We'll use this to send class reminders</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input id="password" type="password" placeholder="Min 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 rounded-xl" minLength={8} required />
            </div>
            <Button type="submit" variant="emerald" className="w-full h-11 rounded-xl text-base" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Create Account
                </span>
              )}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
            </div>
          </form>
          <ArabicQuote text="بسم الله الرحمن الرحيم" className="mt-6" />
        </div>
      </div>
    </div>
  );
}
