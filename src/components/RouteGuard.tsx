import { useEffect, useState, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { supabase, isCurrentUserTeacher } from "@/integrations/supabase/client";

type Mode = "auth" | "teacher" | "student" | "guest";

/**
 * RouteGuard — protects routes based on Supabase session + role.
 *  - "auth":    must be signed in
 *  - "teacher": must be signed in AND have role 'teacher'
 *  - "student": must be signed in AND NOT a teacher
 *  - "guest":   must be signed OUT (used for /login, /register)
 */
export default function RouteGuard({
  mode,
  children,
}: {
  mode: Mode;
  children: ReactNode;
}) {
  const [state, setState] = useState<"loading" | "allow" | "redirect">("loading");
  const [redirectTo, setRedirectTo] = useState("/login");

  useEffect(() => {
    let alive = true;
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const teacher = user ? await isCurrentUserTeacher() : false;
      if (!alive) return;

      // keep local cache in sync (defensive: if session gone, drop cache)
      if (!user) localStorage.removeItem("elaf_user");

      switch (mode) {
        case "guest":
          if (user) { 
            setRedirectTo(teacher ? "/admin" : "/dashboard"); 
            setState("redirect"); 
          }
          else setState("allow");
          break;
        case "auth":
          if (!user) { 
            setRedirectTo("/login"); 
            setState("redirect"); 
          }
          else setState("allow");
          break;
        case "teacher":
          if (!user) { 
            setRedirectTo("/login"); 
            setState("redirect"); 
          }
          else if (!teacher) { 
            setRedirectTo("/dashboard"); 
            setState("redirect"); 
          }
          else setState("allow");
          break;
        case "student":
          if (!user) { 
            setRedirectTo("/login"); 
            setState("redirect"); 
          }
          else if (teacher) { 
            setRedirectTo("/admin"); 
            setState("redirect"); 
          }
          else setState("allow");
          break;
      }
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => check());
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, [mode]);

  if (state === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }
  if (state === "redirect") return <Navigate to={redirectTo} replace />;
  return <>{children}</>;
}
