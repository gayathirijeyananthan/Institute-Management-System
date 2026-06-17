import { yupResolver } from '@hookform/resolvers/yup';
import { GraduationCap } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { login, registerInstitute } from '../features/authSlice.js';
import { buildFormData } from '../utils/forms.js';

const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required()
});

const registerSchema = yup.object({
  instituteName: yup.string().required(),
  email: yup.string().email().required(),
  phone: yup.string().required(),
  password: yup.string().min(6).required(),
  address: yup.string().required(),
  logo: yup.mixed()
});

function AuthShell({ title, subtitle, children }) {
  const { user } = useSelector((state) => state.auth);
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[0.9fr_1.1fr]">
      <section className="flex flex-col justify-between bg-ink p-8 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-white text-brand">
            <GraduationCap size={24} />
          </div>
          <div>
            <p className="font-bold">Institute Management System</p>
            <p className="text-sm text-slate-300">Multi-tenant operations portal</p>
          </div>
        </div>
        <div className="mt-16 max-w-xl">
          <h1 className="text-4xl font-bold leading-tight">{title}</h1>
          <p className="mt-4 text-slate-300">{subtitle}</p>
        </div>
        <p className="mt-12 text-sm text-slate-400">Manage centers, cohorts, students, staff, activities, attendance, and announcements from one focused workspace.</p>
      </section>
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </div>
  );
}

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(loginSchema) });

  const submit = async (values) => {
    const result = await dispatch(login(values));
    if (login.fulfilled.match(result)) {
      toast.success('Welcome back');
      navigate('/dashboard');
    } else {
      toast.error(result.payload);
    }
  };

  return (
    <AuthShell title="Run your institute with calm, accurate data." subtitle="Sign in to access your institute dashboard and operational modules.">
      <h2 className="text-2xl font-bold text-ink">Login</h2>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(submit)}>
        <div>
          <label className="label">Email</label>
          <input className="input" {...register('email')} />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" {...register('password')} />
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
        </div>
        <button className="btn-primary w-full" disabled={loading}>Login</button>
      </form>
      <p className="mt-5 text-sm text-slate-500">
        New institute? <Link className="font-semibold text-brand" to="/register">Create account</Link>
      </p>
    </AuthShell>
  );
}

export function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(registerSchema) });

  const submit = async (values) => {
    const payload = buildFormData(values, ['logo']);
    const result = await dispatch(registerInstitute(payload));
    if (registerInstitute.fulfilled.match(result)) {
      toast.success('Institute account created');
      navigate('/dashboard');
    } else {
      toast.error(result.payload);
    }
  };

  return (
    <AuthShell title="Create your institute workspace." subtitle="Registration creates a private tenant boundary for your operational data.">
      <h2 className="text-2xl font-bold text-ink">Register</h2>
      <form className="mt-6 grid gap-4" onSubmit={handleSubmit(submit)}>
        {[
          ['instituteName', 'Institute Name'],
          ['email', 'Email'],
          ['phone', 'Phone Number'],
          ['password', 'Password'],
          ['address', 'Address']
        ].map(([name, label]) => (
          <div key={name}>
            <label className="label">{label}</label>
            <input className="input" type={name === 'password' ? 'password' : 'text'} {...register(name)} />
            {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name].message}</p>}
          </div>
        ))}
        <div>
          <label className="label">Logo</label>
          <input className="input" type="file" accept="image/*" {...register('logo')} />
        </div>
        <button className="btn-primary w-full" disabled={loading}>Create Account</button>
      </form>
      <p className="mt-5 text-sm text-slate-500">
        Already registered? <Link className="font-semibold text-brand" to="/login">Login</Link>
      </p>
    </AuthShell>
  );
}
