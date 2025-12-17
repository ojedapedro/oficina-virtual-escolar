
import React, { useState } from 'react';
import { GOOGLE_SCRIPT_URL } from '../constants';
import { GraduationCap, Lock, User, Loader2, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (cedula: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes("YOUR_DEPLOYMENT_ID")) {
        throw new Error("El sistema no está configurado (Falta URL de Script).");
      }

      const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=login&user=${encodeURIComponent(cedula)}&pass=${encodeURIComponent(password)}`);
      const data = await response.json();

      if (data.result === 'success') {
        localStorage.setItem('user_cedula', cedula);
        onLoginSuccess(cedula);
      } else {
        setError(data.message || "Credenciales incorrectas.");
      }
    } catch (err: any) {
      setError("Error al conectar con el servidor. Intente más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 text-white rounded-3xl shadow-xl shadow-blue-200">
            <GraduationCap size={40} />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Oficina Virtual</h1>
            <p className="text-slate-500">Sistema de Control de Pagos - Colegio San José</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-start space-x-3 text-sm">
              <AlertCircle size={18} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Cédula del Representante</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  required
                  placeholder="Ej: V-12345678"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Clave Asignada</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:bg-slate-300"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Verificando...</span>
                </>
              ) : (
                <span>Ingresar al Sistema</span>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 leading-relaxed">
            Si no tiene sus credenciales, por favor contacte al departamento de administración del colegio.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
