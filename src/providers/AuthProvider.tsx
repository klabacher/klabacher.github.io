import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '../services/supabaseClient';
import { setError, setLoading, setSession } from '../store/slices/authSlice';
import type { PropsWithChildren } from 'react';

export function AuthProvider({ children }: PropsWithChildren) {
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      dispatch(setLoading());
      const { data, error } = await supabase.auth.getSession();
      if (!isMounted) return;
      if (error) {
        dispatch(setError(error.message));
      } else {
        dispatch(setSession(data.session));
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      dispatch(setSession(session));
      if (event === 'SIGNED_OUT') {
        dispatch(setError(null));
      }
    });

    return () => {
      isMounted = false;
      listener?.subscription.unsubscribe();
    };
  }, [dispatch]);

  return children;
}

export default AuthProvider;
