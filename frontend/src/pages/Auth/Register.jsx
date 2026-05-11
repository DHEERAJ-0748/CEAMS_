import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Sparkles, ArrowRight, Loader2, Users, Briefcase, ShieldCheck, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'club',
    club_name: '',
    institution_id: '',
    department: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'club') navigate('/club/dashboard');
      if (user.role === 'faculty') navigate('/faculty/dashboard');
      if (user.role === 'admin') navigate('/admin/dashboard');
      if (user.role === 'principal') navigate('/principal/dashboard');
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

  const roleOptions = [
    { value: 'club', label: 'Club Rep', icon: Users, desc: 'Submit and manage event proposals' },
    { value: 'faculty', label: 'Faculty', icon: Briefcase, desc: 'Review and recommend proposals' },
    { value: 'admin', label: 'Admin', icon: ShieldCheck, desc: 'Institutional oversight' },
    { value: 'principal', label: 'Principal', icon: Sparkles, desc: 'Final authorizations' },
  ];

  return (
    <div className="min-h-screen flex w-full bg-surface-50">
      {/* Left Side: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2.5 mb-10 justify-center">
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-surface-900 tracking-tight">CEAMS</span>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-surface-900 mb-1.5 tracking-tight">Create an account</h2>
            <p className="text-surface-500 text-sm">Join CEAMS and streamline your workflow</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-3 animate-slide-down">
              <div className="w-1 h-full min-h-[20px] bg-red-400 rounded-full shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-semibold text-surface-700 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-surface-400">
                  <User className="h-[18px] w-[18px]" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-surface-700 mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-surface-400">
                  <Mail className="h-[18px] w-[18px]" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="name@institution.edu"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-surface-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-surface-400">
                  <Lock className="h-[18px] w-[18px]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  minLength="6"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-10 pr-11"
                  placeholder="Min. 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-surface-400 hover:text-surface-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-surface-700 mb-2">Role</label>
              <div className="grid grid-cols-4 gap-2">
                {roleOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: opt.value })}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                      formData.role === opt.value
                        ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm'
                        : 'border-surface-100 text-surface-500 hover:border-surface-200 hover:bg-surface-50'
                    }`}
                  >
                    <opt.icon className="w-5 h-5" />
                    <span className="text-[11px] font-semibold leading-tight">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {formData.role === 'club' && (
              <div className="animate-fade-in">
                <label className="block text-[13px] font-semibold text-surface-700 mb-2">Club Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-surface-400">
                    <Users className="h-[18px] w-[18px]" />
                  </div>
                  <input
                    type="text"
                    name="club_name"
                    required
                    value={formData.club_name}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="E.g. Computer Science Society"
                  />
                </div>
              </div>
            )}

            {formData.role === 'principal' && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-[13px] font-semibold text-surface-700 mb-2">Institution ID / Employee ID</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-surface-400">
                      <ShieldCheck className="h-[18px] w-[18px]" />
                    </div>
                    <input
                      type="text"
                      name="institution_id"
                      required
                      value={formData.institution_id}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="E.g. EMP12345"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-surface-700 mb-2">Department (Optional)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-surface-400">
                      <Briefcase className="h-[18px] w-[18px]" />
                    </div>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="E.g. Computer Science"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 mt-3 flex justify-center items-center gap-2 text-sm"
            >
              {loading ? (
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-surface-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side: Information */}
      <div className="hidden lg:flex w-1/2 bg-surface-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-brand-500 rounded-full blur-[120px] opacity-15" />
          <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-surface-500 rounded-full blur-[100px] opacity-10" />
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }} />
        </div>

        <div className="relative z-10 flex items-center justify-end gap-2.5">
          <span className="text-2xl font-extrabold tracking-tight">CEAMS</span>
          <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="relative z-10 max-w-md self-end text-right">
          <h2 className="text-3xl xl:text-4xl font-extrabold leading-[1.1] mb-10 tracking-tight">
            Digitize your<br />
            <span className="text-brand-300">event workflows.</span>
          </h2>
          
          <div className="space-y-3 mt-8">
            {roleOptions.map(opt => (
              <div key={opt.value} className="flex items-center justify-end gap-4 bg-white/5 p-4 rounded-2xl border border-white/[0.06] backdrop-blur-sm">
                <div className="text-right">
                  <h4 className="text-white font-semibold text-sm">{opt.label}</h4>
                  <p className="text-white/40 text-xs mt-0.5">{opt.desc}</p>
                </div>
                <div className="bg-white/10 p-2.5 rounded-xl shrink-0">
                  <opt.icon className="w-5 h-5 text-brand-300" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10" />
      </div>
    </div>
  );
};

export default Register;
