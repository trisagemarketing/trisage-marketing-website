import { createClient } from "@supabase/supabase-js";
const supabase = createClient("https://ujjmtmdtdagshbkyqmto.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqam10bWR0ZGFnc2hia3lxbXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxODcwMDEsImV4cCI6MjA5Nzc2MzAwMX0.na56GxRWQhJaK-K_jvPCP7ceqJ027tUQGb711I_f-FQ");
supabase.from("blogs").select("id, title, status").then(res => console.log("DATA:", res.data, "ERROR:", res.error));
