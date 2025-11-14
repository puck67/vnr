'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onSwitchMode: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, mode, onSwitchMode, onSuccess }: AuthModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (mode === 'register') {
        if (formData.password !== formData.confirmPassword) {
          setMessage('Mật khẩu xác nhận không khớp');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password
          })
        });

        const result = await response.json();
        if (result.success) {
          setMessage('Đăng ký thành công! Bạn có thể đăng nhập ngay.');
          // Đảm bảo user có profile structure đúng
          const userData = {
            ...result.user,
            profile: result.user.profile || {
              points: 0,
              level: 1,
              badges: [],
              completedQuizzes: [],
              viewedEvents: [],
              achievements: []
            }
          };
          localStorage.setItem('user', JSON.stringify(userData));
          setTimeout(() => {
            onClose();
            if (onSuccess) onSuccess();
            router.push('/map');
          }, 1000);
        } else {
          setMessage(result.message);
        }
      } else {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        const result = await response.json();
        if (result.success) {
          setMessage('Đăng nhập thành công!');
          // Đảm bảo user có profile structure đúng
          const userData = {
            ...result.user,
            profile: result.user.profile || {
              points: 0,
              level: 1,
              badges: [],
              completedQuizzes: [],
              viewedEvents: [],
              achievements: []
            }
          };
          localStorage.setItem('user', JSON.stringify(userData));
          setTimeout(() => {
            onClose();
            if (onSuccess) onSuccess();
            router.push('/map');
          }, 1000);
        } else {
          setMessage(result.message);
        }
      }
    } catch (error) {
      setMessage('Có lỗi xảy ra. Vui lòng thử lại.');
    }

    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-scale-in border border-slate-200/50">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-6 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full -translate-y-16 translate-x-16 opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-700 rounded-full translate-y-12 -translate-x-12 opacity-20"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                {mode === 'login' ? <User className="w-5 h-5 text-white" /> : <Mail className="w-5 h-5 text-white" />}
              </div>
              <h2 className="text-2xl font-bold text-white">
                {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Tên đăng nhập
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white hover:border-slate-300 shadow-sm focus:shadow-md"
                  placeholder="Nhập tên đăng nhập"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Email
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white hover:border-slate-300 shadow-sm focus:shadow-md"
                placeholder="Nhập email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Mật khẩu
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-12 pr-12 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white hover:border-slate-300 shadow-sm focus:shadow-md"
                placeholder="Nhập mật khẩu"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-100 rounded-full transition-all duration-200 hover:scale-110"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-slate-500 hover:text-slate-700" />
                ) : (
                  <Eye className="w-5 h-5 text-slate-500 hover:text-slate-700" />
                )}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Xác nhận mật khẩu
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white hover:border-slate-300 shadow-sm focus:shadow-md"
                  placeholder="Nhập lại mật khẩu"
                  required
                />
              </div>
            </div>
          )}

          {message && (
            <div className={`p-4 rounded-2xl text-sm font-medium flex items-center gap-3 ${
              message.includes('thành công') 
                ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-200' 
                : 'bg-red-50 text-red-800 border-2 border-red-200'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                message.includes('thành công') ? 'bg-emerald-500' : 'bg-red-500'
              }`}></div>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                {mode === 'login' ? <User className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                <span>{mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}</span>
              </>
            )}
          </button>

          <div className="text-center pt-4 border-t border-slate-100">
            <p className="text-slate-600 text-sm mb-2">
              {mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
            </p>
            <button
              type="button"
              onClick={onSwitchMode}
              className="text-blue-600 hover:text-blue-700 font-semibold transition-all duration-200 hover:scale-105 underline-offset-4 hover:underline"
            >
              {mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập ngay'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
