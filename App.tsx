
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { 
  Home, 
  CreditCard, 
  ClipboardCheck, 
  HelpCircle, 
  Menu, 
  X,
  GraduationCap,
  History,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import HomePage from './pages/HomePage';
import PaymentForm from './pages/PaymentForm';
import AccountsPage from './pages/AccountsPage';
import SupportPage from './pages/SupportPage';
import HistoryPage from './pages/HistoryPage';
import LoginPage from './pages/LoginPage';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<string | null>(localStorage.getItem('user_cedula'));

  const logout = () => {
    localStorage.removeItem('user_cedula');
    setUser(null);
  };

  const NavLink = ({ to, icon: Icon, children, onClick }: any) => (
    <Link 
      to={to} 
      onClick={onClick}
      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors"
    >
      <Icon size={20} />
      <span className="font-medium">{children}</span>
    </Link>
  );

  // Si no hay usuario, mostrar login
  if (!user) {
    return <LoginPage onLoginSuccess={(cedula) => setUser(cedula)} />;
  }

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b px-4 py-3 flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center space-x-2">
            <GraduationCap className="text-blue-600" size={28} />
            <h1 className="text-lg font-bold text-slate-800">Oficina Virtual</h1>
          </div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </header>

        {/* Sidebar Navigation */}
        <aside className={`
          fixed inset-0 z-40 bg-white border-r transform transition-transform md:relative md:translate-x-0 w-64
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="h-full flex flex-col p-6">
            <div className="hidden md:flex items-center space-x-2 mb-8">
              <GraduationCap className="text-blue-600" size={32} />
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">Oficina Virtual</h1>
            </div>

            {/* Perfil de Usuario */}
            <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <UserIcon size={16} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Representante</p>
                  <p className="text-sm font-bold text-slate-700 truncate">{user}</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 space-y-2">
              <NavLink to="/" icon={Home} onClick={() => setIsMenuOpen(false)}>Inicio</NavLink>
              <NavLink to="/cuentas" icon={CreditCard} onClick={() => setIsMenuOpen(false)}>Datos de Pago</NavLink>
              <NavLink to="/registro" icon={ClipboardCheck} onClick={() => setIsMenuOpen(false)}>Registrar Pago</NavLink>
              <NavLink to="/historial" icon={History} onClick={() => setIsMenuOpen(false)}>Mis Reportes</NavLink>
              <NavLink to="/soporte" icon={HelpCircle} onClick={() => setIsMenuOpen(false)}>Asistente Escolar</NavLink>
            </nav>

            <button 
              onClick={logout}
              className="mt-6 flex items-center space-x-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors w-full text-left"
            >
              <LogOut size={20} />
              <span className="font-medium">Cerrar Sesión</span>
            </button>

            <div className="mt-auto pt-6 border-t text-xs text-slate-400 text-center">
              © 2025 Colegio San José
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          <div className="max-w-4xl mx-auto">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cuentas" element={<AccountsPage />} />
              <Route path="/registro" element={<PaymentForm userCedula={user} />} />
              <Route path="/historial" element={<HistoryPage userCedula={user} />} />
              <Route path="/soporte" element={<SupportPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
