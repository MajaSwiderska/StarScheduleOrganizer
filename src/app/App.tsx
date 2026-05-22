import { useState, useEffect } from 'react';
import Stars from './components/Stars';
import { signIn, signOut, getSession } from '../utils/supabase';
import { signUp } from '../utils/api';
import ScheduleOrganizer from './components/ScheduleOrganizer';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const session = await getSession();
      if (session?.access_token) {
        setAccessToken(session.access_token);
      }
    } catch (err) {
      console.error('Session check error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isSignUp) {
        await signUp(email, password, name);
        const data = await signIn(email, password);
        setAccessToken(data.session.access_token);
      } else {
        const data = await signIn(email, password);
        setAccessToken(data.session.access_token);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      console.error('Auth error:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setAccessToken(null);
      setEmail('');
      setPassword('');
      setName('');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  if (loading) {
    return (
      <div className="size-full flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2]">
        <Stars />
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (accessToken) {
    return <ScheduleOrganizer accessToken={accessToken} onSignOut={handleSignOut} />;
  }

  return (
    <div className="size-full flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] relative">
      <Stars />
      <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-2xl border border-border backdrop-blur-sm relative z-10">
        <h1 className="mb-6 text-center text-card-foreground">
          {isSignUp ? 'Sign Up' : 'Login'}
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label htmlFor="name" className="block mb-2 text-card-foreground">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full px-4 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-[#667eea] text-black"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block mb-2 text-card-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-[#667eea] text-black"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-card-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-[#667eea] text-black"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-md hover:scale-105 hover:shadow-xl transition-all duration-200 ease-in-out"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-muted-foreground hover:text-[#667eea] transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}