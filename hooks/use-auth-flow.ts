import { Href, useRouter } from 'expo-router';
import { useState } from 'react';

import { useAuth } from '@/hooks/use-auth';
import {
  getAuthErrorMessage,
  normalizeEmail,
  validateSignInInput,
  validateSignUpInput,
} from '@/lib/auth-flow';

type AuthMode = 'sign-in' | 'sign-up';

export function useAuthFlow(mode: AuthMode) {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    const validationMessage =
      mode === 'sign-in'
        ? validateSignInInput({ email, password })
        : validateSignUpInput({ email, password, confirmPassword });

    if (validationMessage) {
      setMessage(validationMessage);
      return;
    }

    setLoading(true);
    setMessage(null);

    const normalizedEmail = normalizeEmail(email);
    const { data, error } =
      mode === 'sign-in'
        ? await signIn(normalizedEmail, password)
        : await signUp(normalizedEmail, password);

    setLoading(false);

    if (error) {
      setMessage(getAuthErrorMessage(error));
      return;
    }

    if (mode === 'sign-up' && !data.session) {
      router.replace(`/(auth)/check-email?email=${encodeURIComponent(normalizedEmail)}` as Href);
    }
  }

  return {
    email,
    password,
    confirmPassword,
    message,
    loading,
    setEmail,
    setPassword,
    setConfirmPassword,
    submit,
  };
}
