import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Calendar, Menu, X, User } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'club') return '/club/dashboard';
    if (user.role === 'faculty') return '/faculty/dashboard';
    if (user.role === 'admin') return '/admin/dashboard';
    return '/';
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children }) => (
    <Link 
      to={to} 
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
        isActive(to) 
          ? 'bg-brand-50 text-brand-700 shadow-sm border border-brand-100/50' 
          : 'text-surface-600 hover:text-brand-600 hover:bg-brand-50/50'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/80 backdrop-blur-lg shadow-sm border-b border-surface-200/50 py-2' 
        : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center">
            <Link to={getDashboardLink()} className="flex items-center gap-3 group">
              <div className="bg-gradient-to-br from-brand-500 to-brand-700 p-2.5 rounded-xl shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-all duration-300 group-hover:scale-105">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-surface-900 to-surface-600 tracking-tight">
                CEAMS
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            {user ? (
              <>
                <div className="flex bg-surface-100/50 p-1 rounded-2xl border border-surface-200/50 mr-4 backdrop-blur-sm">
                  {user.role === 'club' && (
                    <>
                      <NavLink to="/club/dashboard">Dashboard</NavLink>
                      <NavLink to="/club/my-events">My Events</NavLink>
                    </>
                  )}
                  
                  {user.role === 'faculty' && (
                    <>
                      <NavLink to="/faculty/dashboard">Dashboard</NavLink>
                      <NavLink to="/faculty/pending-events">Pending Events</NavLink>
                    </>
                  )}
                  
                  {user.role === 'admin' && (
                    <>
                      <NavLink to="/admin/dashboard">Dashboard</NavLink>
                      <NavLink to="/admin/events">All Events</NavLink>
                    </>
                  )}
                </div>

                {user.role === 'club' && (
                  <Link to="/club/create-event" className="btn-primary py-2 text-sm mr-4 shadow-brand-500/20">
                    + Create Event
                  </Link>
                )}

                <div className="flex items-center gap-3 pl-4 border-l border-surface-200">
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-surface-200 shadow-sm">
                    <div className="bg-brand-100 p-1 rounded-lg">
                      <User className="w-4 h-4 text-brand-600" />
                    </div>
                    <span className="text-sm font-semibold text-surface-700">{user.name}</span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="p-2 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-surface-600 hover:text-brand-600 font-medium px-4 py-2 transition-colors">Log in</Link>
                <Link to="/register" className="btn-primary py-2">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-surface-600 hover:bg-surface-100 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 py-4 bg-white/95 backdrop-blur-xl border-b border-surface-200 shadow-lg space-y-2">
          {user ? (
            <>
              <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl mb-4">
                <div className="bg-brand-100 p-2 rounded-lg">
                  <User className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm text-surface-500">Signed in as</p>
                  <p className="font-semibold text-surface-900">{user.name}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                {user.role === 'club' && (
                  <>
                    <Link to="/club/dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-base font-medium text-surface-700 hover:bg-brand-50 hover:text-brand-600">Dashboard</Link>
                    <Link to="/club/my-events" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-base font-medium text-surface-700 hover:bg-brand-50 hover:text-brand-600">My Events</Link>
                    <Link to="/club/create-event" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-base font-medium text-brand-600 bg-brand-50">Create Event</Link>
                  </>
                )}
                {/* Add mobile links for faculty and admin similarly */}
                {user.role === 'faculty' && (
                  <>
                    <Link to="/faculty/dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-base font-medium text-surface-700 hover:bg-brand-50 hover:text-brand-600">Dashboard</Link>
                    <Link to="/faculty/pending-events" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-base font-medium text-surface-700 hover:bg-brand-50 hover:text-brand-600">Pending Events</Link>
                  </>
                )}
                {user.role === 'admin' && (
                  <>
                    <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-base font-medium text-surface-700 hover:bg-brand-50 hover:text-brand-600">Dashboard</Link>
                    <Link to="/admin/events" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-base font-medium text-surface-700 hover:bg-brand-50 hover:text-brand-600">All Events</Link>
                  </>
                )}
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-3 rounded-xl text-base font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                Log Out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3 pt-2">
              <Link to="/login" onClick={() => setIsOpen(false)} className="btn-secondary text-center w-full">Log In</Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="btn-primary text-center w-full">Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
