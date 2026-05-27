// Supabase configuration - reads from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://mycmuoriwwqfemuxmrly.supabase.co"
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15Y211b3Jpd3dxZmVtdXhtcmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0MzEyMTUsImV4cCI6MjA5NTAwNzIxNX0.6FByMhwZE6sPH-ePTF2aDzhWP-_n4oMZu5n0auDqHbk"

export const projectId = supabaseUrl.split('//')[1]?.split('.')[0] || "mycmuoriwwqfemuxmrly"
export const publicAnonKey = supabaseAnonKey
