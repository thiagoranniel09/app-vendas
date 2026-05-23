import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cewnlpxoougozkheswlr.supabase.co";

const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNld25scHhvb3Vnb3praGVzd2xyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NTY5NzMsImV4cCI6MjA5NTEzMjk3M30.2UHCmSjlgOv6GWOShu7Le8zJhZvSQgpnCHxekomwrlw";

export const supabase = createClient(supabaseUrl, supabaseKey);