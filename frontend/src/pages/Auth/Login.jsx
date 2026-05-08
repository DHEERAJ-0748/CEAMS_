import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Building, ArrowRight, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'club') navigate('/club/dashboard');
      if (user.role === 'faculty') navigate('/faculty/dashboard');
      if (user.role === 'admin') navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex w-full bg-surface-50">
      {/* Left Side: Branding / Marketing (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-brand-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-brand-500 rounded-full blur-3xl mix-blend-screen"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-brand-300 rounded-full blur-3xl mix-blend-screen"></div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <Building className="w-10 h-10 text-brand-300" />
          <span className="text-3xl font-bold tracking-wider">CEAMS</span>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Manage events with elegance.
          </h1>
          <p className="text-brand-200 text-lg leading-relaxed">
            A centralized, intelligent approval system designed specifically for modern academic institutions.
            Simplify event workflows from proposal to final authorization.
          </p>
        </div>

        <div className="relative z-10 text-brand-400 text-sm font-medium">
          © 2026 Centralized Event Approval and Management System
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-card border border-surface-200">
          
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-surface-900 mb-2">Welcome Back</h2>
            <p className="text-surface-500">Sign in to your CEAMS account to continue</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
               <div className="w-1.5 h-full absolute left-0 top-0 bottom-0 bg-red-500 rounded-l-lg"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-surface-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-11"
                  placeholder="name@institution.edu"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-surface-700">Password</label>
                <a href="#" className="text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-surface-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-11"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 mt-4 flex justify-center items-center gap-2 text-base shadow-lg shadow-brand-900/20"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-surface-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-800 transition-colors">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
