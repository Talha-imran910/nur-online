import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import CoursePlayer from "./pages/CoursePlayer";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import RouteGuard from "./components/RouteGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />
          <Route path="/player/:courseId" element={<CoursePlayer />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<RouteGuard mode="guest"><Login /></RouteGuard>} />
          <Route path="/register" element={<RouteGuard mode="guest"><Register /></RouteGuard>} />
          <Route path="/dashboard" element={<RouteGuard mode="student"><StudentDashboard /></RouteGuard>} />
          <Route path="/admin" element={<RouteGuard mode="teacher"><AdminDashboard /></RouteGuard>} />
          <Route path="/profile" element={<RouteGuard mode="auth"><Profile /></RouteGuard>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;