import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import {
  FiMail,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiUserPlus,
  FiCheckCircle,
  FiPhone,
  FiArrowRight,
  FiScissors,
} from 'react-icons/fi';

const SignUp = () => {
  const navigate = useNavigate();

  // =========================================================
  // RENDER BACKEND URL
  // =========================================================

  const API_URL = (
    import.meta.env.VITE_API_URL ||
    'http://localhost:5001'
  ).replace(/\/+$/, '');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    shopName: '',
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focused, setFocused] = useState('');

  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =========================================================
  // PASSWORD STRENGTH
  // =========================================================

  const passwordStrength = useMemo(() => {
    const password = formData.password;

    let score = 0;

    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return Math.min(score, 4);
  }, [formData.password]);

  const strengthText = ['', 'Weak', 'Fair', 'Good', 'Strong'][
    passwordStrength
  ];

  // =========================================================
  // SIGN UP
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // -------------------------------------------------------
    // VALIDATION
    // -------------------------------------------------------

    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }

    if (!formData.password) {
      toast.error('Password is required');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // -------------------------------------------------------
    // START LOADING
    // -------------------------------------------------------

    setLoading(true);

    try {
      // -----------------------------------------------------
      // API REQUEST
      //
      // Local:
      // http://localhost:5001/api/auth/signup
      //
      // Production:
      // https://tailor-mitra.onrender.com/api/auth/signup
      // -----------------------------------------------------

      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),

          password: formData.password,

          role: 'tailor',

          profile: {
            name: formData.name.trim(),
            phone: formData.phone.trim(),
          },

          shopDetails: {
            shopName: formData.shopName.trim(),
          },
        }),
      });

      // -----------------------------------------------------
      // GET RESPONSE
      // -----------------------------------------------------

      let data;

      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error(
          'Server returned an invalid response'
        );
      }

      // -----------------------------------------------------
      // HANDLE ERROR RESPONSE
      // -----------------------------------------------------

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Signup failed with status ${response.status}`
        );
      }

      // -----------------------------------------------------
      // CHECK TOKEN
      // -----------------------------------------------------

      if (!data?.token) {
        throw new Error(
          'Account created but authentication token was not received'
        );
      }

      // -----------------------------------------------------
      // SAVE LOGIN INFORMATION
      // -----------------------------------------------------

      localStorage.setItem('token', data.token);

      localStorage.setItem(
        'user',
        JSON.stringify(data.user)
      );

      localStorage.setItem(
        'userRole',
        data.user?.role || 'tailor'
      );

      // -----------------------------------------------------
      // SUCCESS
      // -----------------------------------------------------

      toast.success('Account created successfully! 🎉');

      // -----------------------------------------------------
      // REDIRECT
      // -----------------------------------------------------

      navigate('/');

    } catch (error) {
      console.error('Signup error:', error);

      // -----------------------------------------------------
      // NETWORK ERROR
      // -----------------------------------------------------

      if (
        error instanceof TypeError &&
        error.message.includes('fetch')
      ) {
        toast.error(
          'Network error. Please check your connection and API URL.'
        );

        return;
      }

      // -----------------------------------------------------
      // SERVER / API ERROR
      // -----------------------------------------------------

      toast.error(
        error.message ||
          'Signup failed. Please try again.'
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INPUT CLASS
  // =========================================================

  const fieldClass = (name) =>
    `w-full rounded-2xl border bg-white/70 py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 ${
      focused === name
        ? 'border-[#622B14] bg-white shadow-[0_0_0_4px_rgba(98,43,20,0.08)]'
        : 'border-slate-200 hover:border-[#c9a18f]'
    }`;

  // =========================================================
  // UI
  // =========================================================

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f4f1] px-4 py-6 sm:px-6 lg:px-8">

      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <motion.div
          animate={{
            x: [0, 35, 0],
            y: [0, -25, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-orange-200/30 blur-3xl"
        />

      </div>

      {/* Main Card */}
      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center justify-center">

        <motion.section
          initial={{
            opacity: 0,
            y: 24,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.65,
            ease: 'easeOut',
          }}
          className="grid w-full overflow-hidden rounded-[2rem] border border-white/80 bg-white/70 shadow-[0_30px_90px_rgba(55,35,25,0.14)] backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr]"
        >

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div className="relative hidden min-h-[760px] overflow-hidden bg-[#120d0a] lg:block">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(245,158,11,0.20),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.08),transparent_30%)]" />

            {/* Center Illustration */}

            <motion.div
              animate={{
                y: [0, -12, 0],
                rotate: [-2, 2, -2],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute left-1/2 top-[38%] z-10 -translate-x-1/2"
            >

              <div className="relative flex h-48 w-48 items-center justify-center rounded-full bg-gradient-to-br from-amber-200/20 to-transparent shadow-[0_0_80px_rgba(245,158,11,0.12)]">

                <div className="text-[6.5rem] drop-shadow-2xl">
                  🧑‍🎨
                </div>

              </div>

            </motion.div>

            {/* Floating Icons */}

            {[
              ['✂️', 'left-12 top-28'],
              ['🧵', 'right-14 top-48'],
              ['📏', 'left-20 bottom-36'],
              ['👔', 'right-20 bottom-24'],
            ].map(([icon, position], index) => (

              <motion.div
                key={icon}
                animate={{
                  y: [0, -10, 0],
                  rotate: [
                    0,
                    index % 2 ? 5 : -5,
                    0,
                  ],
                }}
                transition={{
                  duration: 3.5 + index,
                  repeat: Infinity,
                  delay: index * 0.4,
                  ease: 'easeInOut',
                }}
                className={`absolute ${position} flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-xl shadow-lg backdrop-blur-md`}
              >
                {icon}
              </motion.div>

            ))}

            {/* Left Bottom Text */}

            <div className="absolute inset-x-0 bottom-0 p-10">

              <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-amber-300">

                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />

                TailorMitra

              </div>

              <h1 className="max-w-md text-4xl font-bold leading-tight text-white xl:text-5xl">

                Build your shop{' '}

                <span className="text-amber-400">
                  workspace.
                </span>

              </h1>

              <p className="mt-4 max-w-md text-sm leading-6 text-white/55">

                Create your account and bring your tailoring
                business into one organized workspace.

              </p>

            </div>

          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="flex items-center justify-center px-5 py-8 sm:px-10 sm:py-12 lg:px-14">

            <div className="w-full max-w-md">

              {/* Header */}

              <div className="mb-7 text-center sm:text-left">

                <motion.div
                  initial={{
                    scale: 0.8,
                    opacity: 0,
                  }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                  }}
                  transition={{
                    delay: 0.15,
                  }}
                  className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#622B14] text-2xl text-white shadow-lg shadow-[#622B14]/20"
                >
                  <FiScissors />
                </motion.div>

                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Create account
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Set up your tailor profile in less than a minute.
                </p>

              </div>

              {/* Form */}

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >

                {/* Name + Shop */}

                <div className="grid gap-4 sm:grid-cols-2">

                  {/* Name */}

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Full name
                    </label>

                    <div className="relative">

                      <FiUser
                        className={`absolute left-4 top-1/2 z-10 -translate-y-1/2 ${
                          focused === 'name'
                            ? 'text-[#622B14]'
                            : 'text-slate-400'
                        }`}
                      />

                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocused('name')}
                        onBlur={() => setFocused('')}
                        required
                        autoComplete="name"
                        className={fieldClass('name')}
                        placeholder="Your name"
                      />

                    </div>

                  </div>

                  {/* Shop Name */}

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Shop name
                    </label>

                    <div className="relative">

                      <FiScissors
                        className={`absolute left-4 top-1/2 z-10 -translate-y-1/2 ${
                          focused === 'shopName'
                            ? 'text-[#622B14]'
                            : 'text-slate-400'
                        }`}
                      />

                      <input
                        type="text"
                        name="shopName"
                        value={formData.shopName}
                        onChange={handleChange}
                        onFocus={() => setFocused('shopName')}
                        onBlur={() => setFocused('')}
                        className={fieldClass('shopName')}
                        placeholder="Your shop"
                      />

                    </div>

                  </div>

                </div>

                {/* Email */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email address
                  </label>

                  <div className="relative">

                    <FiMail
                      className={`absolute left-4 top-1/2 z-10 -translate-y-1/2 ${
                        focused === 'email'
                          ? 'text-[#622B14]'
                          : 'text-slate-400'
                      }`}
                    />

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

                {/* Phone */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">

                    Phone number{' '}

                    <span className="font-normal text-slate-400">
                      (optional)
                    </span>

                  </label>

                  <div className="relative">

                    <FiPhone
                      className={`absolute left-4 top-1/2 z-10 -translate-y-1/2 ${
                        focused === 'phone'
                          ? 'text-[#622B14]'
                          : 'text-slate-400'
                      }`}
                    />

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={() => setFocused('phone')}
                      onBlur={() => setFocused('')}
                      autoComplete="tel"
                      className={fieldClass('phone')}
                      placeholder="+91 98765 43210"
                    />

                  </div>

                </div>

                {/* Password */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Password
                  </label>

                  <div className="relative">

                    <FiLock
                      className={`absolute left-4 top-1/2 z-10 -translate-y-1/2 ${
                        focused === 'password'
                          ? 'text-[#622B14]'
                          : 'text-slate-400'
                      }`}
                    />

                    <input
                      type={
                        showPassword
                          ? 'text'
                          : 'password'
                      }
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setFocused('password')}
                      onBlur={() => setFocused('')}
                      required
                      autoComplete="new-password"
                      className={fieldClass('password')}
                      placeholder="Create a strong password"
                    />

                    <button
                      type="button"
                      aria-label={
                        showPassword
                          ? 'Hide password'
                          : 'Show password'
                      }
                      onClick={() =>
                        setShowPassword(
                          (value) => !value
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-[#622B14]"
                    >
                      {showPassword ? (
                        <FiEyeOff />
                      ) : (
                        <FiEye />
                      )}
                    </button>

                  </div>

                  {/* Password Strength */}

                  {formData.password && (

                    <div className="mt-2">

                      <div className="flex gap-1">

                        {[0, 1, 2, 3].map(
                          (item) => (

                            <span
                              key={item}
                              className={`h-1 flex-1 rounded-full transition ${
                                item <
                                passwordStrength
                                  ? 'bg-[#622B14]'
                                  : 'bg-slate-200'
                              }`}
                            />

                          )
                        )}

                      </div>

                      <p className="mt-1 text-[11px] text-slate-400">

                        Password strength:{' '}

                        <span className="font-semibold text-slate-600">
                          {strengthText}
                        </span>

                      </p>

                    </div>

                  )}

                </div>

                {/* Confirm Password */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Confirm password
                  </label>

                  <div className="relative">

                    <FiCheckCircle
                      className={`absolute left-4 top-1/2 z-10 -translate-y-1/2 ${
                        focused ===
                        'confirmPassword'
                          ? 'text-[#622B14]'
                          : 'text-slate-400'
                      }`}
                    />

                    <input
                      type={
                        showConfirmPassword
                          ? 'text'
                          : 'password'
                      }
                      name="confirmPassword"
                      value={
                        formData.confirmPassword
                      }
                      onChange={handleChange}
                      onFocus={() =>
                        setFocused(
                          'confirmPassword'
                        )
                      }
                      onBlur={() =>
                        setFocused('')
                      }
                      required
                      autoComplete="new-password"
                      className={fieldClass(
                        'confirmPassword'
                      )}
                      placeholder="Repeat your password"
                    />

                    <button
                      type="button"
                      aria-label={
                        showConfirmPassword
                          ? 'Hide password'
                          : 'Show password'
                      }
                      onClick={() =>
                        setShowConfirmPassword(
                          (value) => !value
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-[#622B14]"
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff />
                      ) : (
                        <FiEye />
                      )}
                    </button>

                  </div>

                  {formData.confirmPassword && (

                    <motion.p
                      initial={{
                        opacity: 0,
                        y: -3,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className={`mt-1.5 text-xs font-medium ${
                        formData.password ===
                        formData.confirmPassword
                          ? 'text-green-600'
                          : 'text-red-500'
                      }`}
                    >

                      {formData.password ===
                      formData.confirmPassword
                        ? '✓ Passwords match'
                        : 'Passwords do not match'}

                    </motion.p>

                  )}

                </div>

                {/* Submit */}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#622B14] px-5 py-3.5 font-semibold text-white shadow-xl shadow-[#622B14]/20 transition hover:bg-[#4c210f] disabled:cursor-not-allowed disabled:opacity-70"
                >

                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                      Creating account...
                    </>
                  ) : (
                    <>
                      <FiUserPlus />

                      Create account

                      <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}

                </motion.button>

              </form>

              {/* Sign In */}

              <p className="mt-6 text-center text-sm text-slate-500">

                Already have an account?{' '}

                <Link
                  to="/signin"
                  className="font-bold text-[#622B14] transition hover:text-amber-700"
                >
                  Sign in
                </Link>

              </p>

            </div>

          </div>

        </motion.section>

      </div>

    </main>
  );
};

export default SignUp;





// import React, { useMemo, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { signUp } from '../api';
// import toast from 'react-hot-toast';
// import {
//   FiMail,
//   FiLock,
//   FiUser,
//   FiEye,
//   FiEyeOff,
//   FiUserPlus,
//   FiCheckCircle,
//   FiPhone,
//   FiArrowRight,
//   FiScissors,
// } from 'react-icons/fi';

// const SignUp = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     confirmPassword: '',
//     name: '',
//     phone: '',
//     shopName: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [focused, setFocused] = useState('');

//   const handleChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const passwordStrength = useMemo(() => {
//     const password = formData.password;
//     let score = 0;
//     if (password.length >= 6) score++;
//     if (password.length >= 10) score++;
//     if (/[A-Z]/.test(password)) score++;
//     if (/[0-9]/.test(password)) score++;
//     if (/[^A-Za-z0-9]/.test(password)) score++;
//     return Math.min(score, 4);
//   }, [formData.password]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (formData.password !== formData.confirmPassword) {
//       toast.error('Passwords do not match');
//       return;
//     }
//     if (formData.password.length < 6) {
//       toast.error('Password must be at least 6 characters');
//       return;
//     }
//     if (!formData.email) {
//       toast.error('Email is required');
//       return;
//     }
//     if (!formData.name) {
//       toast.error('Name is required');
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await signUp({
//         email: formData.email,
//         password: formData.password,
//         role: 'tailor',
//         profile: {
//           name: formData.name,
//           phone: formData.phone || '',
//         },
//         shopDetails: {
//           shopName: formData.shopName || '',
//         },
//       });

//       const { data } = response;

//       if (data.token) {
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('user', JSON.stringify(data.user));
//         localStorage.setItem('userRole', data.user.role || 'tailor');
//         toast.success('Account created successfully! 🎉');
//         navigate('/');
//       } else {
//         toast.error('Signup failed. Please try again.');
//       }
//     } catch (error) {
//       console.error('Signup error:', error);
//       if (error.response) {
//         if (error.response.status === 400) {
//           toast.error(error.response.data?.message || 'Invalid input. Please check your details.');
//         } else if (error.response.status === 409 || error.response.status === 500) {
//           toast.error(error.response.data?.message || 'User already exists. Please login instead.');
//         } else {
//           toast.error(error.response.data?.message || 'Signup failed. Please try again.');
//         }
//       } else if (error.request) {
//         toast.error('Network error. Please check your connection and try again.');
//       } else {
//         toast.error('An error occurred. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fieldClass = (name) =>
//     `w-full rounded-2xl border bg-white/70 py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 ${
//       focused === name
//         ? 'border-[#622B14] bg-white shadow-[0_0_0_4px_rgba(98,43,20,0.08)]'
//         : 'border-slate-200 hover:border-[#c9a18f]'
//     }`;

//   const strengthText = ['', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength];

//   return (
//     <main className="relative min-h-screen overflow-hidden bg-[#f7f4f1] px-4 py-6 sm:px-6 lg:px-8">
//       <div className="pointer-events-none absolute inset-0 overflow-hidden">
//         <motion.div
//           animate={{ x: [0, 35, 0], y: [0, -25, 0] }}
//           transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
//           className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl"
//         />
//         <motion.div
//           animate={{ x: [0, -30, 0], y: [0, 25, 0] }}
//           transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
//           className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-orange-200/30 blur-3xl"
//         />
//       </div>

//       <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center justify-center">
//         <motion.section
//           initial={{ opacity: 0, y: 24 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.65, ease: 'easeOut' }}
//           className="grid w-full overflow-hidden rounded-[2rem] border border-white/80 bg-white/70 shadow-[0_30px_90px_rgba(55,35,25,0.14)] backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr]"
//         >
//           <div className="relative hidden min-h-[760px] overflow-hidden bg-[#120d0a] lg:block">
//             <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(245,158,11,0.20),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.08),transparent_30%)]" />

//             <motion.div
//               animate={{ y: [0, -12, 0], rotate: [-2, 2, -2] }}
//               transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
//               className="absolute left-1/2 top-[38%] z-10 -translate-x-1/2"
//             >
//               <div className="relative flex h-48 w-48 items-center justify-center rounded-full bg-gradient-to-br from-amber-200/20 to-transparent shadow-[0_0_80px_rgba(245,158,11,0.12)]">
//                 <div className="text-[6.5rem] drop-shadow-2xl">🧑‍🎨</div>
//               </div>
//             </motion.div>

//             {[
//               ['✂️', 'left-12 top-28'],
//               ['🧵', 'right-14 top-48'],
//               ['📏', 'left-20 bottom-36'],
//               ['👔', 'right-20 bottom-24'],
//             ].map(([icon, position], index) => (
//               <motion.div
//                 key={icon}
//                 animate={{ y: [0, -10, 0], rotate: [0, index % 2 ? 5 : -5, 0] }}
//                 transition={{ duration: 3.5 + index, repeat: Infinity, delay: index * 0.4, ease: 'easeInOut' }}
//                 className={`absolute ${position} flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-xl shadow-lg backdrop-blur-md`}
//               >
//                 {icon}
//               </motion.div>
//             ))}

//             <div className="absolute inset-x-0 bottom-0 p-10">
//               <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-amber-300">
//                 <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> TailorMitra
//               </div>
//               <h1 className="max-w-md text-4xl font-bold leading-tight text-white xl:text-5xl">
//                 Build your shop <span className="text-amber-400">workspace.</span>
//               </h1>
//               <p className="mt-4 max-w-md text-sm leading-6 text-white/55">
//                 Create your account and bring your tailoring business into one organized workspace.
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center justify-center px-5 py-8 sm:px-10 sm:py-12 lg:px-14">
//             <div className="w-full max-w-md">
//               <div className="mb-7 text-center sm:text-left">
//                 <motion.div
//                   initial={{ scale: 0.8, opacity: 0 }}
//                   animate={{ scale: 1, opacity: 1 }}
//                   transition={{ delay: 0.15 }}
//                   className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#622B14] text-2xl text-white shadow-lg shadow-[#622B14]/20"
//                 >
//                   <FiScissors />
//                 </motion.div>
//                 <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Create account</h2>
//                 <p className="mt-2 text-sm leading-6 text-slate-500">Set up your tailor profile in less than a minute.</p>
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="grid gap-4 sm:grid-cols-2">
//                   <div>
//                     <label className="mb-2 block text-sm font-semibold text-slate-700">Full name</label>
//                     <div className="relative">
//                       <FiUser className={`absolute left-4 top-1/2 z-10 -translate-y-1/2 ${focused === 'name' ? 'text-[#622B14]' : 'text-slate-400'}`} />
//                       <input type="text" name="name" value={formData.name} onChange={handleChange} onFocus={() => setFocused('name')} onBlur={() => setFocused('')} required autoComplete="name" className={fieldClass('name')} placeholder="Your name" />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="mb-2 block text-sm font-semibold text-slate-700">Shop name</label>
//                     <div className="relative">
//                       <FiScissors className={`absolute left-4 top-1/2 z-10 -translate-y-1/2 ${focused === 'shopName' ? 'text-[#622B14]' : 'text-slate-400'}`} />
//                       <input type="text" name="shopName" value={formData.shopName} onChange={handleChange} onFocus={() => setFocused('shopName')} onBlur={() => setFocused('')} className={fieldClass('shopName')} placeholder="Your shop" />
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
//                   <div className="relative">
//                     <FiMail className={`absolute left-4 top-1/2 z-10 -translate-y-1/2 ${focused === 'email' ? 'text-[#622B14]' : 'text-slate-400'}`} />
//                     <input type="email" name="email" value={formData.email} onChange={handleChange} onFocus={() => setFocused('email')} onBlur={() => setFocused('')} required autoComplete="email" className={fieldClass('email')} placeholder="you@example.com" />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm font-semibold text-slate-700">Phone number <span className="font-normal text-slate-400">(optional)</span></label>
//                   <div className="relative">
//                     <FiPhone className={`absolute left-4 top-1/2 z-10 -translate-y-1/2 ${focused === 'phone' ? 'text-[#622B14]' : 'text-slate-400'}`} />
//                     <input type="tel" name="phone" value={formData.phone} onChange={handleChange} onFocus={() => setFocused('phone')} onBlur={() => setFocused('')} autoComplete="tel" className={fieldClass('phone')} placeholder="+91 98765 43210" />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
//                   <div className="relative">
//                     <FiLock className={`absolute left-4 top-1/2 z-10 -translate-y-1/2 ${focused === 'password' ? 'text-[#622B14]' : 'text-slate-400'}`} />
//                     <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} onFocus={() => setFocused('password')} onBlur={() => setFocused('')} required autoComplete="new-password" className={fieldClass('password')} placeholder="Create a strong password" />
//                     <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-[#622B14]">
//                       {showPassword ? <FiEyeOff /> : <FiEye />}
//                     </button>
//                   </div>
//                   {formData.password && (
//                     <div className="mt-2">
//                       <div className="flex gap-1">
//                         {[0, 1, 2, 3].map((item) => (
//                           <span key={item} className={`h-1 flex-1 rounded-full transition ${item < passwordStrength ? 'bg-[#622B14]' : 'bg-slate-200'}`} />
//                         ))}
//                       </div>
//                       <p className="mt-1 text-[11px] text-slate-400">Password strength: <span className="font-semibold text-slate-600">{strengthText}</span></p>
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm font-semibold text-slate-700">Confirm password</label>
//                   <div className="relative">
//                     <FiCheckCircle className={`absolute left-4 top-1/2 z-10 -translate-y-1/2 ${focused === 'confirmPassword' ? 'text-[#622B14]' : 'text-slate-400'}`} />
//                     <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} onFocus={() => setFocused('confirmPassword')} onBlur={() => setFocused('')} required autoComplete="new-password" className={fieldClass('confirmPassword')} placeholder="Repeat your password" />
//                     <button type="button" aria-label={showConfirmPassword ? 'Hide password' : 'Show password'} onClick={() => setShowConfirmPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-[#622B14]">
//                       {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
//                     </button>
//                   </div>
//                   {formData.confirmPassword && (
//                     <motion.p initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} className={`mt-1.5 text-xs font-medium ${formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
//                       {formData.password === formData.confirmPassword ? '✓ Passwords match' : 'Passwords do not match'}
//                     </motion.p>
//                   )}
//                 </div>

//                 <motion.button
//                   type="submit"
//                   disabled={loading}
//                   whileHover={{ y: -2 }}
//                   whileTap={{ scale: 0.98 }}
//                   className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#622B14] px-5 py-3.5 font-semibold text-white shadow-xl shadow-[#622B14]/20 transition hover:bg-[#4c210f] disabled:cursor-not-allowed disabled:opacity-70"
//                 >
//                   {loading ? (
//                     <>
//                       <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
//                       Creating account...
//                     </>
//                   ) : (
//                     <>
//                       <FiUserPlus /> Create account
//                       <FiArrowRight className="transition-transform group-hover:translate-x-1" />
//                     </>
//                   )}
//                 </motion.button>
//               </form>

//               <p className="mt-6 text-center text-sm text-slate-500">
//                 Already have an account?{' '}
//                 <Link to="/signin" className="font-bold text-[#622B14] transition hover:text-amber-700">Sign in</Link>
//               </p>
//             </div>
//           </div>
//         </motion.section>
//       </div>
//     </main>
//   );
// };

// export default SignUp;






