'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminTranslations } from '@/components/admin/AdminTranslationsProvider';

export function ChangePasswordSection({ isSection = false }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { t } = useAdminTranslations();

  // This is a simple check to see if the user was forced here.
  // A more robust solution might use a query param or state management.
  const isForced = typeof window !== 'undefined' && window.history.length <= 2;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError(t.changePassword.errorMatch);
      return;
    }
    if (newPassword.length < 6) {
      setError(t.changePassword.errorLength);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword: isForced ? '' : oldPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      setSuccess(t.changePassword.success);
      setTimeout(() => {
        router.push('/fonok/dashboard');
      }, 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formContent = (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center text-gray-900">
        {isForced && !isSection ? t.changePassword.title : t.changePassword.titleLoggedIn}
      </h1>
      {isForced && !isSection && <p className="text-center text-sm text-gray-600">{t.changePassword.intro}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        {!isForced && (
          <div>
            <label htmlFor="oldPassword"className="text-sm font-medium text-gray-700">Current Password</label>
            <input id="oldPassword" name="oldPassword" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border rounded-md" />
          </div>
        )}
        <div>
          <label htmlFor="newPassword"className="text-sm font-medium text-gray-700">{t.changePassword.newPasswordLabel}</label>
          <input id="newPassword" name="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label htmlFor="confirmPassword"className="text-sm font-medium text-gray-700">{t.changePassword.confirmPasswordLabel}</label>
          <input id="confirmPassword" name="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border rounded-md" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}
        <div>
          <button type="submit" disabled={isSubmitting} className="w-full px-4 py-2 text-white bg-cyan-600 rounded-md disabled:bg-gray-400">
            {isSubmitting ? 'Saving...' : t.changePassword.button}
          </button>
        </div>
      </form>
    </div>
  );

  if (isSection) {
    return formContent;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {formContent}
    </div>
  );
}

export default ChangePasswordSection;
