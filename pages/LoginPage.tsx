
import React, { useState } from 'react';
import { GOOGLE_SCRIPT_URL, IS_CONFIGURED } from '../constants';
import { Lock, User, Loader2, AlertCircle, UserPlus, BadgeCheck, Fingerprint, Settings } from 'lucide-react';

const LOGO_URL = "https://i.ibb.co/FbHJbvVT/images.png";

interface LoginPageProps {
  onLoginSuccess: (cedula: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [matricula, setMatricula] = useState('');

  const resetMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!IS_CONFIGURED) {
      setError("Error: El sistema no tiene un ID de despliegue válido en constants.ts");
      return;
    }
    setLoading(true);
    resetMessages();
    try {
      // Para Google Apps Script, usamos GET para leer datos y evitar problemas de CORS pre-flight
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=login&user=${encodeURIComponent(cedula)}&pass=${encodeURIComponent(password)}`, {
        method: 'GET'
      });
      
      if (!response.ok) throw new Error("Servidor no disponible");
      
      const data = await response.json();
      if (data.result === 'success') {
        localStorage.setItem('user_cedula', cedula);
        onLoginSuccess(cedula);
      } else {
        setError(data.message || "Credenciales incorrectas.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Error de conexión o configuración del Script. Verifique el Deployment ID.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!IS_CONFIGURED) return;
    setLoading(true);
    resetMessages();
    try {
      const payload = { action: 'register', cedula, clave: password, nombre, matricula };
      // Usamos POST sin mode: no-cors para poder leer la respuesta JSON
      const response = await fetch(GOOGLE_SCRIPT_URL, { 
        method: 'POST', 
        body: JSON.stringify(payload) 
      });
      const data = await response.json();
      if (data.result === 'success') {
        setSuccess("¡Registro exitoso! Ya puede iniciar sesión.");
        setIsRegistering(false);
      } else {
        setError(data.message || "No se pudo completar el registro.");
      }
    } catch (err: any) {
      setError("Error al procesar el registro. Verifique permisos del Script.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-6 overflow-hidden relative">
      <div className="absolute top-0 -left-10 w-72 h-72 bg-blue-900 rounded-full blur-[120px] opacity-50"></div>
      <div className="absolute bottom-0 -right-10 w-96 h-96 bg-amber-900 rounded-full blur-[150px] opacity-30"></div>

      <div className="max-w-md w-full relative z-10 animate-in fade-in zoom-in duration-700">
        {!IS_CONFIGURED && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center space-x-3 text-amber-500">
            <Settings className="animate-spin-slow" size={24} />
            <div className="text-xs font-bold leading-tight">
              CONFIGURACIÓN REQUERIDA: <br/>
              <span className="opacity-80">Reemplace YOUR_DEPLOYMENT_ID en constants.ts</span>
            </div>
          </div>
        )}

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-[2rem] shadow-2xl mb-6 p-4">
            <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-1">Oficina Virtual</h1>
          <p className="text-amber-400 text-[10px] font-black uppercase tracking-[0.3em]">M. Beltrán Prieto Figueroa</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-10 space-y-8">
          <div className="flex p-1.5 bg-slate-100 rounded-2xl">
            <button 
              onClick={() => { setIsRegistering(false); resetMessages(); }}
              className={`flex-1 py-3 text-xs font-extrabold rounded-xl transition-all uppercase tracking-wider ${!isRegistering ? 'bg-white shadow-md text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Ingresar
            </button>
            <button 
              onClick={() => { setIsRegistering(true); resetMessages(); }}
              className={`flex-1 py-3 text-xs font-extrabold rounded-xl transition-all uppercase tracking-wider ${isRegistering ? 'bg-white shadow-md text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Unirse
            </button>
          </div>

          {(error || success) && (
            <div className={`p-4 rounded-2xl flex items-center space-x-3 text-xs font-bold animate-in slide-in-from-top-2 ${error ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
              {error ? <AlertCircle size={18} /> : <BadgeCheck size={18} />}
              <span className="flex-1">{error || success}</span>
            </div>
          )}

          <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-5">
            {isRegistering && (
              <div className="space-y-5 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">Nombre Completo</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input 
                      type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                      placeholder="Nombre del Representante"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">Matrícula</label>
                  <div className="relative group">
                    <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input 
                      type="text" required value={matricula} onChange={(e) => setMatricula(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                      placeholder="MBPF-2025-XXX"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">Cédula</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input 
                  type="text" required value={cedula} onChange={(e) => setCedula(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                  placeholder="V-00000000"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">Contraseña</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input 
                  type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center space-x-3 shadow-xl shadow-slate-900/10 disabled:bg-slate-300 mt-4 uppercase tracking-[0.15em] text-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Procesando</span>
                </>
              ) : (
                <>
                  {isRegistering ? <UserPlus size={18} /> : <Lock size={18} />}
                  <span>{isRegistering ? 'Crear Cuenta' : 'Acceder'}</span>
                </>
              )}
            </button>
          </form>

          {!isRegistering && (
            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
              Administración Escolar <br/> Maestro Beltrán Prieto Figueroa
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
