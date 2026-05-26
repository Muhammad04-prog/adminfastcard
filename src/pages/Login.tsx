import React, { useState } from 'react';
import logoImg from '@/assets/Group 1116606595 (5).png';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import type { RootState } from '../store';
import { useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

type AuthMode = 'login' | 'forgot-password' | 'reset-password';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // View state: 'login' | 'forgot-password' | 'reset-password'
  const [mode, setMode] = useState<AuthMode>('login');

  // Eye toggle state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Formik validation schemas
  const loginFormik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t('validation_email') || 'Invalid email')
        .required(t('validation_required') || 'Required'),
      password: Yup.string()
        .min(6, t('validation_password_min') || 'Must be at least 6 characters')
        .required(t('validation_required') || 'Required'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        dispatch(
          setCredentials({
            user: {
              name: values.email.split('@')[0].toUpperCase(),
              email: values.email,
            },
            token: 'mock-jwt-token-fastcard-admin-xyz-12345',
          })
        );
        setSubmitting(false);
        navigate('/');
      }, 600);
    },
  });

  const forgotFormik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t('validation_email') || 'Invalid email')
        .required(t('validation_required') || 'Required'),
    }),
    onSubmit: (_, { setSubmitting }) => {
      setTimeout(() => {
        setSubmitting(false);
        // Transition to reset-password state on mock request success
        setMode('reset-password');
      }, 600);
    },
  });

  const resetFormik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(6, t('validation_password_min') || 'Must be at least 6 characters')
        .required(t('validation_required') || 'Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required(t('validation_required') || 'Required'),
    }),
    onSubmit: (_, { setSubmitting }) => {
      setTimeout(() => {
        setSubmitting(false);
        // Reset complete, take back to login view
        setMode('login');
      }, 600);
    },
  });

  // Redirect to Dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row overflow-hidden bg-white select-none">
      
      {/* Left panel: Gradient backgrounds and Welcome logo */}
      <div className="w-full md:w-[45%] lg:w-[40%] bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-black flex flex-col justify-center items-center md:items-start p-12 md:p-16 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.12),transparent_60%)] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center md:items-start gap-4">
          <p className="text-slate-300 text-xl md:text-2xl font-semibold tracking-tight text-center md:text-left">
            Welcome to admin panel
          </p>
          <div className="flex items-center">
            <img src={logoImg} alt="fastcart" className="h-14 md:h-16 w-auto object-contain select-none" />
          </div>
        </div>
      </div>

      {/* Right panel: dynamic auth forms matching screen layouts */}
      <div className="flex-1 bg-white flex flex-col justify-center items-center p-8 md:p-16 overflow-y-auto">
        <div className="w-full max-w-sm flex flex-col gap-6">
          
          {/* LOGIN MODE */}
          {mode === 'login' && (
            <>
              <h2 className="text-3xl font-bold tracking-tight text-[#0f172a] mb-2 select-none">
                Log in
              </h2>
              <form onSubmit={loginFormik.handleSubmit} className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <input
                      name="email"
                      type="email"
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 placeholder-slate-400 focus:outline-none text-sm transition-all duration-150"
                      placeholder="Email"
                      value={loginFormik.values.email}
                      onChange={loginFormik.handleChange}
                      onBlur={loginFormik.handleBlur}
                    />
                    {loginFormik.touched.email && loginFormik.errors.email && (
                      <p className="mt-1 text-xs text-red-500 font-medium">{loginFormik.errors.email}</p>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      className="w-full pl-4 pr-12 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 placeholder-slate-400 focus:outline-none text-sm transition-all duration-150"
                      placeholder="Password"
                      value={loginFormik.values.password}
                      onChange={loginFormik.handleChange}
                      onBlur={loginFormik.handleBlur}
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                    {loginFormik.touched.password && loginFormik.errors.password && (
                      <p className="mt-1 text-xs text-red-500 font-medium">{loginFormik.errors.password}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-center py-2">
                  <button
                    type="button"
                    onClick={() => {
                      forgotFormik.resetForm();
                      setMode('forgot-password');
                    }}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-all duration-150"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={loginFormik.isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-semibold text-sm shadow-md shadow-blue-500/10 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150"
                >
                  {loginFormik.isSubmitting ? 'Loading...' : 'Log in'}
                </Button>
              </form>
            </>
          )}

          {/* FORGOT PASSWORD MODE */}
          {mode === 'forgot-password' && (
            <>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="self-start flex items-center gap-2 text-slate-500 hover:text-slate-700 font-medium text-sm transition-all duration-150 mb-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Log in
              </button>
              <h2 className="text-3xl font-bold tracking-tight text-[#0f172a] mb-2 select-none">
                Forgot password
              </h2>
              <form onSubmit={forgotFormik.handleSubmit} className="space-y-4">
                <div>
                  <input
                    name="email"
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 placeholder-slate-400 focus:outline-none text-sm transition-all duration-150"
                    placeholder="Email"
                    value={forgotFormik.values.email}
                    onChange={forgotFormik.handleChange}
                    onBlur={forgotFormik.handleBlur}
                  />
                  {forgotFormik.touched.email && forgotFormik.errors.email && (
                    <p className="mt-1 text-xs text-red-500 font-medium">{forgotFormik.errors.email}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={forgotFormik.isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-semibold text-sm shadow-md shadow-blue-500/10 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150"
                >
                  {forgotFormik.isSubmitting ? 'Sending...' : 'Send reset link'}
                </Button>
              </form>
            </>
          )}

          {/* RESET PASSWORD MODE */}
          {mode === 'reset-password' && (
            <>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="self-start flex items-center gap-2 text-slate-500 hover:text-slate-700 font-medium text-sm transition-all duration-150 mb-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Log in
              </button>
              <h2 className="text-3xl font-bold tracking-tight text-[#0f172a] mb-2 select-none">
                Forgot password
              </h2>
              <form onSubmit={resetFormik.handleSubmit} className="space-y-4">
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      className="w-full pl-4 pr-12 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 placeholder-slate-400 focus:outline-none text-sm transition-all duration-150"
                      placeholder="Password"
                      value={resetFormik.values.password}
                      onChange={resetFormik.handleChange}
                      onBlur={resetFormik.handleBlur}
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                    {resetFormik.touched.password && resetFormik.errors.password && (
                      <p className="mt-1 text-xs text-red-500 font-medium">{resetFormik.errors.password}</p>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="w-full pl-4 pr-12 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 placeholder-slate-400 focus:outline-none text-sm transition-all duration-150"
                      placeholder="Confirm password"
                      value={resetFormik.values.confirmPassword}
                      onChange={resetFormik.handleChange}
                      onBlur={resetFormik.handleBlur}
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                    {resetFormik.touched.confirmPassword && resetFormik.errors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-500 font-medium">{resetFormik.errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={resetFormik.isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-semibold text-sm shadow-md shadow-blue-500/10 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150"
                >
                  {resetFormik.isSubmitting ? 'Resetting...' : 'Reset'}
                </Button>
              </form>
            </>
          )}

        </div>
      </div>

    </div>
  );
};

export default Login;
