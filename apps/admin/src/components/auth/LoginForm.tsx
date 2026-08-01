'use client';

import React, { useState, type FormEvent } from 'react';
import { Mail, Lock } from 'lucide-react';
import FormInput from './FormInput';
import { useAppDispatch } from '../../store';
import { setCredentials } from '../../store/slices/authSlice';

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        let msg = 'Invalid credentials';
        try {
          const data = await response.json();
          if (data.message) msg = Array.isArray(data.message) ? data.message[0] : data.message;
        } catch {}
        throw new Error(msg);
      }

      const data = await response.json();

      if (data.access_token && typeof window !== 'undefined') {
        localStorage.setItem('access_token', data.access_token);
      }

      dispatch(
        setCredentials({
          user: data.user || { id: '1', email, name: email.split('@')[0], role: 'ADMIN' },
          token: data.access_token || 'access-token',
        })
      );

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 rounded-[var(--radius-sm)] bg-[#FBECEC] p-3 text-[12.5px] font-medium text-[#B84343]">
          {error}
        </div>
      )}

      <FormInput
        label="Email"
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="you@store.com"
        icon={<Mail className="h-4 w-4" strokeWidth={1.6} />}
      />

      <FormInput
        label="Password"
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        placeholder="••••••••"
        icon={<Lock className="h-4 w-4" strokeWidth={1.6} />}
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-[24px] w-full rounded-[var(--radius-sm)] bg-[var(--accent)] py-[12px] text-[14px] font-[650] text-white shadow-[0_1px_2px_rgba(28,27,25,.06)] transition-all duration-150 hover:bg-[var(--accent-hover)] disabled:opacity-70"
      >
        {loading ? 'Logging in...' : 'Log in'}
      </button>
    </form>
  );
}
