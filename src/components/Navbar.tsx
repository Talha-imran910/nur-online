import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import elafLogo from "@/assets/elaf-logo.png";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Courses", path: "/courses" },
  { label: "About", path: "/about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Check if user is logged in
  const currentUser = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("elaf_user") || "null"); } catch { return null; }
  }, [location.pathname]); // re-check on route change

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("elaf_user");
    window.location.href = "/";
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      scrolled ? "bg-background/95 backdrop-blur-xl shadow-elegant" : "bg-background/70 backdrop-blur-md"
    } border-b border-border/30`}>
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src={elafLogo}
            alt="Elaf-ul-Quran"
            className="h-11 w-11 object-contain transition-transform duration-500 group-hover:scale-110"
          />
          <div className="flex flex-col leading-tight">
            <span className="font-serif text-lg font-bold text-primary tracking-wide">Elaf-ul-Quran</span>
            <span className="text-[10px] text-muted-foreground tracking-widest uppercase">Academy</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className={`relative text-sm font-medium transition-colors hover:text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-gold after:transition-all after:duration-300 ${
                location.pathname === l.path
                  ? "text-primary after:w-full"
                  : "text-muted-foreground after:w-0 hover:after:w-full"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <>
              <Link to={currentUser.role === "teacher" ? "/admin" : "/dashboard"}>
                <Button variant="ghost" size="sm">My Dashboard</Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5">
                <LogOut className="h-3.5 w-3.5" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button variant="emerald" size="sm" className="animate-pulse-glow">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 pb-4 animate-slide-up">
          {navLinks.map((l) => (
            <Link key={l.path} to={l.path} onClick={() => setOpen(false)}
              className="block py-3 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <div className="flex gap-2 mt-3">
            {currentUser ? (
              <>
                <Link to={currentUser.role === "teacher" ? "/admin" : "/dashboard"} className="flex-1">
                  <Button variant="outline" className="w-full" size="sm" onClick={() => setOpen(false)}>Dashboard</Button>
                </Link>
                <Button variant="ghost" className="flex-1" size="sm" onClick={handleLogout}>
                  <LogOut className="h-3.5 w-3.5 mr-1" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex-1">
                  <Button variant="outline" className="w-full" size="sm">Sign In</Button>
                </Link>
                <Link to="/register" className="flex-1">
                  <Button variant="emerald" className="w-full" size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
