import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

import { supabase } from '../services/supabaseClient';

export type AuthChangeCallback = (payload: {
  event: AuthChangeEvent;
  session: Session | null;
}) => void;

class SocialAuth {
  async loginWithGitHub(redirectTo?: string) {
    const callbackUrl =
      redirectTo || import.meta.env.VITE_GITHUB_CALLBACK_URL || window.location.origin;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: callbackUrl,
        scopes: 'read:user repo',
      },
    });

    if (error) throw error;
    return data;
  }

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  }

  async isAuthenticated() {
    const session = await this.getSession();
    return Boolean(session);
  }

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  onAuthStateChange(callback: AuthChangeCallback) {
    return supabase.auth.onAuthStateChange((event, session) => callback({ event, session }));
  }
}

const socialAuth = new SocialAuth();

export default socialAuth;
