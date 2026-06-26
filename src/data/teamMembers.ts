export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Saurav Sharma",
    role: "Senior Video Editor",
    image: "https://res.cloudinary.com/dgoclgj0u/image/upload/v1782465832/file_00000000274072089de387902cd31ad3_gjis5s.png",
  },
  {
    id: "2",
    name: "Adarsh kushwaha",
    role: "Senior Graphic Designer",
    image: "https://res.cloudinary.com/dgoclgj0u/image/upload/v1782466649/ChatGPT_Image_Jun_26_2026_03_02_50_PM_xevepw.png",
  },
  {
    id: "3",
    name: "Abhi",
    role: "Digital Marketer",
    image: "https://res.cloudinary.com/dgoclgj0u/image/upload/v1782467442/ChatGPT_Image_Jun_26_2026_03_17_55_PM_h2mc3c.png",
  },
  {
    id: "4",
    name: "Himanshu Kumar",
    role: "Full Stack Web Developer",
    image: "https://res.cloudinary.com/dgoclgj0u/image/upload/v1782467765/WhatsApp_Image_2026-06-26_at_3.25.31_PM_wg69pl.jpg",
  },
  // {
  //   id: "5",
  //   name: "Michael Chang",
  //   role: "Senior Strategist",
  //   image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800",
  // },
  // {
  //   id: "6",
  //   name: "Jessica Taylor",
  //   role: "Operations Lead",
  //   image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
  // },
  // {
  //   id: "7",
  //   name: "Ryan Gosling",
  //   role: "Frontend Developer",
  //   image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800",
  // },
];
