import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../config/supabase';

const SUPABASE_URL = `https://${projectId}.supabase.co`;

export const supabase = createClient(SUPABASE_URL, publicAnonKey);

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Sign in error:', error);
    throw error;
  }

  return data;
};

// Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

// Get current session
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Get session error:', error);
    throw error;
  }

  return data.session;
};

// Get access token from current session
export const getAccessToken = async (): Promise<string | null> => {
  const session = await getSession();
  return session?.access_token || null;
};
