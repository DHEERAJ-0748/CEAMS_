import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Building, ArrowRight, Loader2, Users, Briefcase, ShieldCheck } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'club', // default
    club_name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'club') navigate('/club/dashboard');
      if (user.role === 'faculty') navigate('/faculty/dashboard');
      if (user.role === 'admin') navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(formData);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex w-full bg-surface-50">
      
      {/* Left Side: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-card border border-surface-200">
          
          <div className="mb-8 text-center lg:text-left">
            <div className="flex justify-center lg:hidden mb-6">
               <Building className="w-12 h-12 text-brand-900" />
            </div>
            <h2 className="text-3xl font-bold text-surface-900 mb-2">Create an Account</h2>
            <p className="text-surface-500">Join CEAMS and streamline your workflow.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-surface-400">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field pl-11"
                  placeholder="Jane Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-surface-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-11"
                  placeholder="name@institution.edu"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-surface-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  minLength="6"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-11"
                  placeholder="Min. 8 characters"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-2">Select Your Role</label>
              <select
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="input-field bg-white cursor-pointer"
              >
                <option value="club">Club Representative</option>
                <option value="faculty">Faculty Member</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {formData.role === 'club' && (
              <div className="animate-fade-in">
                <label className="block text-sm font-semibold text-surface-700 mb-2">Club Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-surface-400">
                    <Users className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    name="club_name"
                    required
                    value={formData.club_name}
                    onChange={handleChange}
                    className="input-field pl-11"
                    placeholder="E.g. Computer Science Society"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 mt-6 flex justify-center items-center gap-2 text-base shadow-lg shadow-brand-900/20"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-surface-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-800 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side: Information / Features (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-surface-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
           <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-brand-400 rounded-full blur-[100px] mix-blend-screen"></div>
           <div className="absolute bottom-[10%] right-[10%] w-80 h-80 bg-surface-400 rounded-full blur-[80px] mix-blend-screen"></div>
        </div>

        <div className="relative z-10 flex items-center justify-end gap-3">
          <span className="text-3xl font-bold tracking-wider">CEAMS</span>
          <Building className="w-10 h-10 text-brand-300" />
        </div>

        <div className="relative z-10 max-w-md self-end text-right">
          <h2 className="text-4xl font-bold leading-tight mb-8">
            Digitize your event workflows.
          </h2>
          
          <div className="space-y-6 mt-10">
             <div className="flex items-center justify-end gap-4 bg-surface-800/50 p-4 rounded-xl border border-surface-700/50 backdrop-blur-sm">
                <div className="text-right">
                   <h4 className="text-white font-medium">Clubs & Societies</h4>
                   <p className="text-surface-400 text-sm">Submit and track comprehensive proposals instantly.</p>
                </div>
                <div className="bg-brand-900/50 p-3 rounded-lg"><Users className="w-6 h-6 text-brand-300" /></div>
             </div>

             <div className="flex items-center justify-end gap-4 bg-surface-800/50 p-4 rounded-xl border border-surface-700/50 backdrop-blur-sm">
                <div className="text-right">
                   <h4 className="text-white font-medium">Faculty Advisors</h4>
                   <p className="text-surface-400 text-sm">Review, request changes, and approve seamlessly.</p>
                </div>
                <div className="bg-surface-700/50 p-3 rounded-lg"><Briefcase className="w-6 h-6 text-surface-300" /></div>
             </div>

             <div className="flex items-center justify-end gap-4 bg-surface-800/50 p-4 rounded-xl border border-surface-700/50 backdrop-blur-sm">
                <div className="text-right">
                   <h4 className="text-white font-medium">Administration</h4>
                   <p className="text-surface-400 text-sm">Final authorizations and system-wide visibility.</p>
                </div>
                <div className="bg-brand-800/50 p-3 rounded-lg"><ShieldCheck className="w-6 h-6 text-brand-200" /></div>
             </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Register;
