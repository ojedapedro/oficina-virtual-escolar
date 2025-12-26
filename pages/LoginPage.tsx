
import React, { useState } from 'react';
import { GOOGLE_SCRIPT_URL, IS_CONFIGURED, ENABLE_DEMO_MODE } from '../constants';
import { Lock, User, Loader2, AlertCircle, UserPlus, BadgeCheck, Fingerprint, Settings, PlayCircle } from 'lucide-react';

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

  const startDemo = () => {
    const demoUser = "V-DEMO-2025";
    localStorage.setItem('user_cedula', demoUser);
    localStorage.setItem('is_demo', 'true');
    onLoginSuccess(demoUser);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!IS_CONFIGURED) {
      setError("Falta configurar el ID de despliegue en constants.ts. Usa el botón de abajo para probar el Demo.");
      return;
    }
    setLoading(true);
    resetMessages();
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=login&user=${encodeURIComponent(cedula)}&pass=${encodeURIComponent(password)}`, {
        method: 'GET'
      });
      
      if (!response.ok) throw new Error("Servidor no disponible");
      
      const data = await response.json();
      if (data.result === 'success') {
        localStorage.setItem('user_cedula', cedula);
        localStorage.removeItem('is_demo');
        onLoginSuccess(cedula);
      } else {
        setError(data.message || "Cédula o clave incorrecta.");
      }
    } catch (err: any) {
      setError("Error de conexión. ¿Ya desplegaste el Script como Aplicación Web?");
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
      setError("Error al procesar el registro.");
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
          <div className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex flex-col space-y-3 text-amber-500 backdrop-blur-md">
            <div className="flex items-center space-x-3">
              <Settings className="animate-spin-slow" size={20} />
              <h4 className="text-xs font-black uppercase tracking-widest">Configuración Pendiente</h4>
            </div>
            <p className="text-[11px] font-medium leading-relaxed opacity-90">
              Para usar el sistema real, debes pegar tu <b>Deployment ID</b> de Google en <code className="bg-amber-500/20 px-1 rounded">constants.ts</code>.
            </p>
            {ENABLE_DEMO_MODE && (
              <button 
                onClick={startDemo}
                className="w-full py-2.5 bg-amber-500 text-amber-950 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-amber-400 transition-colors flex items-center justify-center space-x-2"
              >
                <PlayCircle size={14} />
                <span>Entrar en Modo Demo</span>
              </button>
            )}
          </div>
        )}

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-[1.8rem] shadow-2xl mb-4 p-4">
            <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight leading-none mb-1 uppercase">Oficina Virtual</h1>
          <p className="text-amber-400 text-[10px] font-black uppercase tracking-[0.3em]">M. Beltrán Prieto Figueroa</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-10 space-y-6">
          <div className="flex p-1 bg-slate-100 rounded-2xl">
            <button onClick={() => { setIsRegistering(false); resetMessages(); }} className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest ${!isRegistering ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Ingresar</button>
            <button onClick={() => { setIsRegistering(true); resetMessages(); }} className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest ${isRegistering ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Unirse</button>
          </div>

          {(error || success) && (
            <div className={`p-4 rounded-2xl flex items-center space-x-3 text-[11px] font-bold animate-in slide-in-from-top-2 ${error ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {error ? <AlertCircle size={16} /> : <BadgeCheck size={16} />}
              <span className="flex-1">{error || success}</span>
            </div>
          )}

          <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
            {isRegistering && (
              <>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 ml-1 uppercase tracking-widest">Nombre Completo</label>
                  <input type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 ml-1 uppercase tracking-widest">Matrícula</label>
                  <input type="text" required value={matricula} onChange={(e) => setMatricula(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 ml-1 uppercase tracking-widest">Cédula</label>
              <input type="text" required value={cedula} onChange={(e) => setCedula(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="V-00000000" />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 ml-1 uppercase tracking-widest">Contraseña</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center space-x-3 text-[10px] uppercase tracking-widest disabled:opacity-50 mt-4">
              {loading ? <Loader2 className="animate-spin" size={18} /> : <span>{isRegistering ? 'Crear Cuenta' : 'Acceder'}</span>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
