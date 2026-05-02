import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.warn("404: route not found:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <h1 className="font-serif mb-3 text-7xl font-bold text-primary">404</h1>
        <p className="mb-6 text-lg text-muted-foreground">
          Oops! This page doesn't exist.
        </p>
        <Link to="/">
          <Button variant="emerald" className="gap-2">
            <Home className="h-4 w-4" /> Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
