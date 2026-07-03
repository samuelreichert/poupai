import { AuthError } from '@supabase/supabase-js';

export type AuthValidationInput = {
  email: string;
  password: string;
  confirmPassword?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validateSignInInput({ email, password }: AuthValidationInput): string | null {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return 'Informe seu e-mail.';
  }

  if (!emailPattern.test(normalizedEmail)) {
    return 'Informe um e-mail válido.';
  }

  if (!password) {
    return 'Informe sua senha.';
  }

  return null;
}

export function validateSignUpInput(input: AuthValidationInput): string | null {
  const signInError = validateSignInInput(input);

  if (signInError) {
    return signInError;
  }

  if (input.password.length < 6) {
    return 'A senha precisa ter pelo menos 6 caracteres.';
  }

  if (input.password !== input.confirmPassword) {
    return 'As senhas precisam ser iguais.';
  }

  return null;
}

export function getAuthErrorMessage(error: AuthError): string {
  if (error.code === 'invalid_credentials' || error.message.includes('Invalid login credentials')) {
    return 'E-mail ou senha inválidos.';
  }

  if (error.message.includes('Email not confirmed')) {
    return 'Confirme seu e-mail antes de entrar.';
  }

  if (error.message.includes('User already registered')) {
    return 'Já existe uma conta com esse e-mail.';
  }

  if (error.message.includes('Password should be at least')) {
    return 'A senha precisa ter pelo menos 6 caracteres.';
  }

  return 'Não foi possível concluir. Tente novamente.';
}
