import { supabase } from './supabase';

export type AppRole = 'main_admin' | 'member' | null;

type AccessProfileRow = {
  email: string;
  role: string;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function mapDbRole(role: string | null | undefined): AppRole {
  const normalized = (role ?? '').trim().toLowerCase();
  if (normalized === 'admin') return 'main_admin';
  if (normalized === 'member') return 'member';
  return null;
}

export async function getRoleForEmail(email: string): Promise<AppRole> {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return null;

  const res = await supabase.from('admin_profiles').select('email, role').ilike('email', normalizedEmail).limit(1);
  if (res.error) throw res.error;
  const row = (res.data?.[0] as AccessProfileRow | undefined) ?? null;
  // Default role: if no profile exists yet, treat as member.
  if (!row) return 'member';
  return mapDbRole(row.role);
}

export async function validateEmailAccess(email: string): Promise<{ ok: true; role: AppRole } | { ok: false; message: string }> {
  try {
    const role = await getRoleForEmail(email);
    if (role) return { ok: true, role };
    return {
      ok: false,
      message: 'This account has an invalid role setup. Only "admin" or "member" are supported.',
    };
  } catch {
    return {
      ok: false,
      message: 'Unable to verify account access from Supabase. Please try again.',
    };
  }
}
