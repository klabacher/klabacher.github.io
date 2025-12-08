import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { supabase } from '../services/supabaseClient';
import { setError, setLoading, setSession } from '../store/slices/authSlice';

export default function AuthCallback() {
  const [message, setMessage] = useState('Finalizando login...');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handledRef = useRef(false);

  useEffect(() => {
    const run = async () => {
      if (handledRef.current) return;
      handledRef.current = true;

      const errorParam = searchParams.get('error');
      if (errorParam) {
        const description = searchParams.get('error_description') || 'Erro no retorno do GitHub.';
        setMessage(description);
        dispatch(setError(description));
        return;
      }

      const code = searchParams.get('code');
      if (!code) {
        setMessage('Código de autorização ausente.');
        dispatch(setError('Código de autorização ausente.'));
        return;
      }

      dispatch(setLoading());
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        setMessage(error.message);
        dispatch(setError(error.message));
        return;
      }

      dispatch(setSession(data.session));
      setMessage('Login concluído. Redirecionando...');
      navigate('/dashboard', { replace: true });
    };

    run();
  }, [dispatch, navigate, searchParams]);

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-950 text-white">
      <div className="px-6 py-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.35)]">
        <p className="text-sm font-semibold tracking-wide text-orange-200/90">{message}</p>
      </div>
    </div>
  );
}
