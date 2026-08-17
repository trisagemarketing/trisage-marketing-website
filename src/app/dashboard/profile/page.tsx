"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  FileText,
  MapPin,
  Shield,
  Key,
  Save,
  ArrowLeft,
  Camera,
  CheckCircle2,
  Building,
  BadgeCheck,
  AlertCircle,
  PhoneCall
} from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  bio?: string;
  address?: string;
  emergency_contact?: string;
  role: string;
  employee_id: string;
  avatar_url?: string;
  is_active: boolean;
  departments?: {
    code: string;
    name: string;
  };
}

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Hidden File Input Reference
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [address, setAddress] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Password Fields
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Fetch Current User Profile
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/profile");
      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error("Session expired. Please log in.");
        router.push("/login");
        return;
      }

      const p: UserProfile = data.profile;
      setProfile(p);
      setFullName(p.full_name || "");
      setEmail(p.email || "");
      setPhone(p.phone || "");
      setBio(p.bio || "");
      setAddress(p.address || "");
      setEmergencyContact(p.emergency_contact || "");
      setAvatarUrl(p.avatar_url || "");
    } catch (err) {
      console.error("Profile fetch error:", err);
      toast.error("Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Direct File Upload to Supabase Storage Bucket with Client-side Compression
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    let file = files[0];
    setIsUploadingAvatar(true);
    const toastId = toast.loading("Optimizing photo & uploading to Supabase Storage...");

    try {
      // Client-side Image Optimization & Compression (Max 600x600, 0.85 quality)
      const imageCompression = (await import("browser-image-compression")).default;
      const options = {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 600,
        useWebWorker: true,
      };

      try {
        const compressedFile = await imageCompression(file, options);
        file = new File([compressedFile], file.name, { type: compressedFile.type });
      } catch (compressErr) {
        console.warn("Compression fallback:", compressErr);
      }

      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch("/api/auth/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || "Avatar upload failed.", { id: toastId });
        setIsUploadingAvatar(false);
        return;
      }

      toast.success("Optimized avatar uploaded to Supabase Storage!", { id: toastId });
      setAvatarUrl(data.avatarUrl);
      if (profile) {
        setProfile({ ...profile, avatar_url: data.avatarUrl });
      }
    } catch (err) {
      console.error("Avatar upload error:", err);
      toast.error("Network error during image upload.", { id: toastId });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Submit Profile & Security Updates
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Full Name cannot be empty.");
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        toast.error("New password must be at least 6 characters.");
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error("New passwords do not match.");
        return;
      }
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving profile & security changes...");

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          bio,
          address,
          emergencyContact,
          avatarUrl,
          ...(newPassword ? { newPassword } : {}),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || "Failed to update profile.", { id: toastId });
        setIsSaving(false);
        return;
      }

      toast.success("Profile updated successfully!", { id: toastId });
      setProfile(data.profile);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Save profile error:", err);
      toast.error("Network error while saving profile.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-[#141b29] flex items-center justify-center text-slate-900 dark:text-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-3 border-secondary-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold tracking-wide">Loading Profile Settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#141b29] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 selection:bg-secondary-500 selection:text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-[#1f2a3e]/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href={profile?.role === 'hr' || profile?.role === 'admin' ? "/admin/dashboard" : "/dashboard"}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="h-5 w-px bg-slate-300 dark:bg-slate-700 hidden xs:block" />
          <span className="hidden xs:inline-block text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">
            Profile Settings
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Profile Card Header Banner */}
        <div className="relative bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar Upload / Preview */}
          <div className="relative group shrink-0">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarFileChange}
              accept="image/*"
              className="hidden"
            />

            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-white font-extrabold text-3xl shadow-lg overflow-hidden relative">
              {isUploadingAvatar ? (
                <div className="w-8 h-8 border-3 border-secondary-500 border-t-transparent rounded-full animate-spin" />
              ) : avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={fullName}
                  fill
                  sizes="112px"
                  className="object-contain object-center p-1.5"
                />
              ) : (
                fullName.substring(0, 2).toUpperCase() || "EM"
              )}
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="absolute -bottom-1 -right-1 p-2.5 rounded-2xl bg-secondary-500 hover:bg-secondary-600 text-white shadow-lg cursor-pointer transition-all active:scale-95 disabled:opacity-50"
              title="Upload new avatar to Supabase Storage"
            >
              <Camera className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Profile Overview Details */}
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white font-sans tracking-normal [letter-spacing:-0.03em]">
                {profile?.full_name || "Employee Profile"}
              </h1>
              <span className="px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <BadgeCheck className="w-3.5 h-3.5" />
                Active Staff
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {bio || "No employee bio set yet. Add a short summary below."}
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap font-medium pt-1">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-secondary-500" />
                Emp ID: <strong className="text-slate-800 dark:text-slate-200">{profile?.employee_id || "TR-EMP"}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-secondary-500" />
                Dept: <strong className="text-slate-800 dark:text-slate-200">{profile?.departments?.name || "General"}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-secondary-500" />
                Role: <strong className="text-slate-800 dark:text-slate-200 uppercase">{profile?.role}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Dedicated Profile Settings Form */}
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* SECTION 1: PERSONAL INFORMATION */}
          <div className="bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="p-2 rounded-xl bg-secondary-500/10 text-secondary-500">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Personal Information
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Update your public employee profile details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#141b29] border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:border-secondary-500"
                  />
                </div>
              </div>

              {/* Work Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Work Email Address
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@trisagemarketing.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#141b29] border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:border-secondary-500"
                  />
                </div>
              </div>

              {/* Mobile Phone Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Mobile Phone Number
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#141b29] border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:border-secondary-500"
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Emergency Contact Person / Phone
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="Parent / Spouse - +91 98765 00000"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#141b29] border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:border-secondary-500"
                  />
                </div>
              </div>
            </div>

            {/* Short Bio */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Employee Bio / Short Description
              </label>
              <div className="relative">
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a short summary about your role, skills, or experience..."
                  className="w-full py-3 px-4 bg-slate-50 dark:bg-[#141b29] border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:border-secondary-500"
                />
              </div>
            </div>

            {/* Home Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Residential Address
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House / Flat No., Street, City, State"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#141b29] border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:border-secondary-500"
                />
              </div>
            </div>

            {/* Avatar URL */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Profile Avatar URL (Optional Image Link)
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <Camera className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#141b29] border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:border-secondary-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: SECURITY & PASSWORD CHANGE */}
          <div className="bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Security & Password Update
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Leave password fields blank if you do not wish to change it</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full py-3 px-4 bg-slate-50 dark:bg-[#141b29] border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:border-secondary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full py-3 px-4 bg-slate-50 dark:bg-[#141b29] border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:border-secondary-500"
                />
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex items-center justify-end gap-4 pt-2">
            <Link
              href="/dashboard"
              className="px-6 py-3.5 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 text-white font-extrabold text-xs uppercase tracking-wide shadow-lg shadow-primary-600/20 hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving Profile..." : "Save All Profile Settings"}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
