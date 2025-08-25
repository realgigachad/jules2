/**
 * @fileoverview This file defines the client component for the admin login page.
 * It provides a form for authentication and a link to the forgot password functionality.
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminTranslations } from '@/components/admin/AdminTranslationsProvider';

/**
 * The main component for the admin login page.
 */
export default function AdminLoginPage() {
  // State for form fields, error messages, and submission status.
  const [username, setUsername] = useState('fonok');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { t } = useAdminTranslations();

  /**
   * Handles the login form submission.
   * It calls the login API and redirects the user upon success.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      // If the user's `forcePasswordChange` flag is true, redirect to the change password page.
      if (data.user.forcePasswordChange) {
        router.push('/fonok/change-password');
      } else {
        // Otherwise, redirect to the admin dashboard.
        router.push('/fonok/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles the "Forgot Password" action.
   * It calls the forgot-password API and displays the result message.
   */
  const handleForgotPassword = async () => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      // Displays the generic success message from the API.
      setSuccess(t.login.forgotPasswordSuccess);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">{t.login.title}</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="text-sm font-medium text-gray-700">{t.login.usernameLabel}</label>
            <input id="username" name="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="mt-1 block w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label htmlFor="password"className="text-sm font-medium text-gray-700">{t.login.passwordLabel}</label>
            <input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border rounded-md" />
          </div>
          {/* Display error or success messages */}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          <div className="flex items-center justify-between">
            <button type="button" onClick={handleForgotPassword} className="text-sm text-cyan-600 hover:underline">
              {t.login.forgotPassword}
            </button>
          </div>
          <div>
            <button type="submit" disabled={isSubmitting} className="w-full px-4 py-2 text-white bg-cyan-600 rounded-md disabled:bg-gray-400">
              {isSubmitting ? t.login.signingIn : t.login.button}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
