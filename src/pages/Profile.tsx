import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { getStudents, saveStudents, ensureStudent } from "@/lib/store";
import { User as UserIcon } from "lucide-react";

interface ProfileExtras {
  phone?: string;
  bio?: string;
  avatar?: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("elaf_user") || "null");
    if (!u) {
      navigate("/login");
      return;
    }
    setUser(u);
    ensureStudent(u);
    const students = getStudents();
    const me = students.find((s) => s.email.toLowerCase() === u.email.toLowerCase());
    setName(me?.name || u.name || "");
    const extras: ProfileExtras = JSON.parse(localStorage.getItem(`elaf_profile_${u.email.toLowerCase()}`) || "{}");
    setPhone(extras.phone || u.phone || "");
    setBio(extras.bio || "");
    setAvatar(extras.avatar || "");
  }, [navigate]);

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      toast({ title: "Image too large", description: "Please pick an image under 1 MB.", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!user) return;
    const trimmed = name.trim();
    if (!trimmed) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }
    // Update student record
    const students = getStudents();
    const idx = students.findIndex((s) => s.email.toLowerCase() === user.email.toLowerCase());
    if (idx >= 0) {
      students[idx].name = trimmed;
      saveStudents(students);
    }
    // Update user blob
    const updatedUser = { ...user, name: trimmed, phone };
    localStorage.setItem("elaf_user", JSON.stringify(updatedUser));
    // Save extras
    const extras: ProfileExtras = { phone, bio, avatar };
    localStorage.setItem(`elaf_profile_${user.email.toLowerCase()}`, JSON.stringify(extras));
    setUser(updatedUser);
    toast({ title: "Profile updated ✨", description: "Your changes have been saved." });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-2xl">
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">My Profile</h1>
        <p className="text-sm text-muted-foreground mb-6">Customize how you appear in the academy.</p>

        <Card className="p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-muted overflow-hidden flex items-center justify-center border-2 border-primary/20">
              {avatar ? (
                <img src={avatar} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <UserIcon className="h-10 w-10 text-muted-foreground" />
              )}
            </div>
            <div>
              <Label htmlFor="avatar" className="cursor-pointer text-sm text-primary hover:underline">
                Change picture
              </Label>
              <Input id="avatar" type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
              <p className="text-xs text-muted-foreground mt-1">Max 1 MB</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email (cannot be changed)</Label>
            <Input value={user.email} disabled className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} placeholder="+92 300 1234567" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">About you (optional)</Label>
            <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={300} rows={4} placeholder="Share a little about yourself…" />
            <p className="text-xs text-muted-foreground text-right">{bio.length}/300</p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="emerald" onClick={handleSave} className="flex-1">Save Changes</Button>
            <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
