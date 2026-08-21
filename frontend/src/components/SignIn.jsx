import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signIn } from '../api';
import toast from 'react-hot-toast';
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiLogIn,
  FiArrowRight,
  FiShield,
} from 'react-icons/fi';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await signIn(formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (name) =>
    `w-full rounded-2xl border bg-white/70 py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 ${
      focused === name
        ? 'border-[#622B14] bg-white shadow-[0_0_0_4px_rgba(98,43,20,0.08)]'
        : 'border-slate-200 hover:border-[#c9a18f]'
    }`;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f4f1] px-4 py-6 sm:px-6 lg:px-8">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 35, 0], y: [0, -25, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 25, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-orange-200/30 blur-3xl"
        />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center justify-center">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="grid w-full overflow-hidden rounded-[2rem] border border-white/80 bg-white/70 shadow-[0_30px_90px_rgba(55,35,25,0.14)] backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr]"
        >
          {/* Interactive visual panel */}
          <div className="relative hidden min-h-[680px] overflow-hidden bg-[#120d0a] lg:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(245,158,11,0.20),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.08),transparent_30%)]" />

            <motion.div
              animate={{ y: [0, -12, 0], rotate: [-2, 2, -2] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-1/2 top-[39%] z-10 -translate-x-1/2"
            >
              <div className="relative flex h-48 w-48 items-center justify-center rounded-full bg-gradient-to-br from-amber-200/20 to-transparent shadow-[0_0_80px_rgba(245,158,11,0.12)]">
                <div className="text-[6.5rem] drop-shadow-2xl">🧑‍🎨</div>
              </div>
            </motion.div>

            {/* Floating tailoring elements */}
            {[
              ['✂️', 'left-12 top-28', 0],
              ['🧵', 'right-14 top-48', 1],
              ['📏', 'left-20 bottom-36', 2],
              ['👔', 'right-20 bottom-24', 3],
            ].map(([icon, position, index]) => (
              <motion.div
                key={icon}
                animate={{ y: [0, -10, 0], rotate: [0, index % 2 ? 5 : -5, 0] }}
                transition={{ duration: 3.5 + index, repeat: Infinity, delay: index * 0.4, ease: 'easeInOut' }}
                className={`absolute ${position} flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-xl shadow-lg backdrop-blur-md`}
              >
                {icon}
              </motion.div>
            ))}

            <div className="absolute inset-x-0 bottom-0 p-10">
              <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-amber-300">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> TailorMitra
              </div>
              <h1 className="max-w-md text-4xl font-bold leading-tight text-white xl:text-5xl">
                Your shop. <br />Your craft. <span className="text-amber-400">Simplified.</span>
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/55">
                Manage customers, orders, measurements and payments from one simple workspace.
              </p>
            </div>
          </div>

          {/* Form panel */}
          <div className="flex items-center justify-center px-5 py-8 sm:px-10 sm:py-12 lg:px-14">
            <div className="w-full max-w-md">
              <div className="mb-8 text-center sm:text-left">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#622B14] text-2xl shadow-lg shadow-[#622B14]/20"
                >
                  ✂️
                </motion.div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Welcome back</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">Sign in to continue managing your tailor shop.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
                  <div className="relative">
                    <FiMail className={`absolute left-4 top-1/2 z-10 -translate-y-1/2 transition-colors ${focused === 'email' ? 'text-[#622B14]' : 'text-slate-400'}`} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused('')}
                      required
                      autoComplete="email"
                      className={fieldClass('email')}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-700">Password</label>
                    <button type="button" className="text-xs font-semibold text-[#622B14] transition hover:text-amber-700"></button>
                  </div>
                  <div className="relative">
                    <FiLock className={`absolute left-4 top-1/2 z-10 -translate-y-1/2 transition-colors ${focused === 'password' ? 'text-[#622B14]' : 'text-slate-400'}`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setFocused('password')}
                      onBlur={() => setFocused('')}
                      required
                      autoComplete="current-password"
                      className={fieldClass('password')}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-[#622B14]"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-500">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-[#622B14]" />
                  Keep me signed in
                </label>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#622B14] px-5 py-3.5 font-semibold text-white shadow-xl shadow-[#622B14]/20 transition hover:bg-[#4c210f] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <FiLogIn /> Sign In
                      <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="my-7 flex items-center gap-4">
                <span className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-medium uppercase tracking-widest text-slate-400">or</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <p className="text-center text-sm text-slate-500">
                Don't have an account?{' '}
                <Link to="/signup" className="font-bold text-[#622B14] transition hover:text-amber-700">Create one</Link>
              </p>

              <div className="mt-7 flex items-center justify-center gap-2 text-xs text-slate-400">
                <FiShield className="text-green-600" /> Secure and encrypted login
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
};

export default SignIn;






