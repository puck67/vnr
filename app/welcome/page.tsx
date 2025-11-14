'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthModal from '@/components/Auth/AuthModal';
import { 
  Play, 
  MapPin, 
  Trophy, 
  BookOpen, 
  Users, 
  Star,
  ArrowRight,
  Clock,
  Award,
  User,
  LogIn,
  Compass,
  Target,
  Zap
} from 'lucide-react';

interface UserProfile {
  points: number;
  level: number;
  badges: string[];
  completedQuizzes: string[];
  viewedEvents: string[];
  achievements: { id: string; unlockedAt: string; }[];
}

interface UserData {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  profile: UserProfile;
}

export default function WelcomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' as 'login' | 'register' });
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    setIsVisible(true);
    // Kiểm tra user đã đăng nhập
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        // Đảm bảo user có profile structure đúng
        if (userData && !userData.profile) {
          userData.profile = {
            points: 0,
            level: 1,
            badges: [],
            completedQuizzes: [],
            viewedEvents: [],
            achievements: []
          };
          localStorage.setItem('user', JSON.stringify(userData));
        }
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleAuthSuccess = () => {
    // Reload user data
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error loading user after auth:', error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const features = [
    {
      title: "Bản đồ tương tác",
      description: "Khám phá các sự kiện lịch sử trên bản đồ Việt Nam với giao diện trực quan và chi tiết",
      icon: <MapPin className="w-8 h-8" />,
      color: "blue"
    },
    {
      title: "Timeline chi tiết", 
      description: "Theo dõi dòng chảy lịch sử từ 1858-1930 với timeline tương tác và thông tin phong phú",
      icon: <Clock className="w-8 h-8" />,
      color: "indigo"
    },
    {
      title: "Hệ thống gamification",
      description: "Thu thập điểm, mở khóa huy hiệu và hoàn thành thử thách để học lịch sử một cách thú vị",
      icon: <Trophy className="w-8 h-8" />,
      color: "amber"
    },
    {
      title: "Kho tư liệu phong phú",
      description: "Hàng nghìn tài liệu, hình ảnh và thông tin chi tiết về các sự kiện lịch sử quan trọng",
      icon: <BookOpen className="w-8 h-8" />,
      color: "emerald"
    }
  ];

  const stats = [
    { number: "1000+", label: "Sự kiện lịch sử", icon: <Star className="w-6 h-6" /> },
    { number: "73", label: "Năm được bao phủ", icon: <Clock className="w-6 h-6" /> },
    { number: "50+", label: "Huy hiệu có thể mở khóa", icon: <Award className="w-6 h-6" /> },
    { number: "∞", label: "Kiến thức chờ khám phá", icon: <BookOpen className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Elegant Background Pattern */}
      <div className="fixed inset-0 opacity-3">
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Modern dot pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(30, 64, 175, 0.15) 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }}></div>
          {/* Subtle geometric shapes */}
          <div className="absolute top-20 right-20 w-2 h-32 bg-blue-200 rotate-45 rounded-full opacity-30"></div>
          <div className="absolute top-40 left-10 w-24 h-2 bg-indigo-200 rounded-full opacity-40"></div>
          <div className="absolute bottom-32 right-1/4 w-16 h-16 border-2 border-blue-200 rotate-12 opacity-20"></div>
          <div className="absolute bottom-20 left-1/3 w-8 h-8 bg-slate-200 rotate-45 opacity-30"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 bg-blue-600 rounded-3xl flex items-center justify-center shadow-xl animate-float">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-800">VietHistory Map</h1>
                <p className="text-slate-600 text-sm font-medium">Khám phá lịch sử Việt Nam</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="text-right bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg">
                    <p className="text-slate-800 font-bold">Xin chào, {user.username}!</p>
                    <p className="text-slate-600 text-sm font-medium">{user.profile?.points || 0} điểm</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-5 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <LogIn className="w-5 h-5" />
                    <span className="font-semibold">Đăng xuất</span>
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-slate-800 rounded-2xl hover:bg-slate-50 transition-all shadow-lg hover:shadow-xl border border-slate-200 font-semibold transform hover:scale-105"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Đăng nhập</span>
                  </button>
                  <button
                    onClick={() => setAuthModal({ isOpen: true, mode: 'register' })}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl font-semibold transform hover:scale-105"
                  >
                    <User className="w-5 h-5" />
                    <span>Đăng ký</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-24">
          <div className={`text-center transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold tracking-wide uppercase">
                Tương tác • Giáo dục • Lịch sử
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-tight tracking-tight">
              Hành trình qua
              <span className="block text-blue-600 mt-2">
                Lịch sử Việt Nam
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-16 max-w-4xl mx-auto leading-relaxed bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-slate-200/50">
              Khám phá <span className="font-bold text-slate-900">73 năm lịch sử hào hùng</span> của dân tộc Việt Nam (1858-1930) qua bản đồ tương tác, 
              timeline chi tiết và hệ thống gamification thú vị
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                href="/map"
                className="group relative flex items-center gap-4 px-12 py-5 bg-blue-600 text-white rounded-3xl hover:bg-blue-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 font-bold text-xl"
              >
                <Play className="w-8 h-8 group-hover:scale-110 transition-transform" />
                <span>Bắt đầu khám phá</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
              
              <Link 
                href="/timeline"
                className="group flex items-center gap-3 px-10 py-5 bg-white text-slate-800 rounded-3xl hover:bg-slate-50 transition-all shadow-xl hover:shadow-2xl border-2 border-slate-200 font-semibold text-lg transform hover:scale-105"
              >
                <Clock className="w-6 h-6 text-slate-600" />
                <span>Xem Timeline</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-6 py-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`text-center transform transition-all duration-700 delay-${index * 100} hover:scale-110 group ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-200 hover:shadow-3xl transition-all duration-300 group-hover:border-blue-300">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-lg">
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-black text-slate-900 mb-3">{stat.number}</div>
                  <div className="text-slate-600 font-semibold text-base group-hover:text-slate-900 transition-colors">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-6 py-24 bg-white/40 backdrop-blur-sm rounded-[3rem] mx-6 shadow-2xl border border-white/50">
          <div className="text-center mb-20">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold tracking-wide uppercase">
                Tính năng nổi bật
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Tại sao chọn VietHistory Map?</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Trải nghiệm học lịch sử hoàn toàn mới với <span className="font-bold text-slate-900">công nghệ hiện đại</span> và phương pháp giáo dục tương tác
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {features.map((feature, index) => {
              const colorClasses = {
                blue: {
                  bg: 'bg-blue-50',
                  bgHover: 'group-hover:bg-blue-100',
                  iconBg: 'bg-blue-100',
                  iconBgHover: 'group-hover:bg-blue-600',
                  iconText: 'text-blue-600',
                  titleHover: 'group-hover:text-blue-600',
                  accent: 'bg-blue-600'
                },
                indigo: {
                  bg: 'bg-indigo-50',
                  bgHover: 'group-hover:bg-indigo-100',
                  iconBg: 'bg-indigo-100',
                  iconBgHover: 'group-hover:bg-indigo-600',
                  iconText: 'text-indigo-600',
                  titleHover: 'group-hover:text-indigo-600',
                  accent: 'bg-indigo-600'
                },
                amber: {
                  bg: 'bg-amber-50',
                  bgHover: 'group-hover:bg-amber-100',
                  iconBg: 'bg-amber-100',
                  iconBgHover: 'group-hover:bg-amber-600',
                  iconText: 'text-amber-600',
                  titleHover: 'group-hover:text-amber-600',
                  accent: 'bg-amber-600'
                },
                emerald: {
                  bg: 'bg-emerald-50',
                  bgHover: 'group-hover:bg-emerald-100',
                  iconBg: 'bg-emerald-100',
                  iconBgHover: 'group-hover:bg-emerald-600',
                  iconText: 'text-emerald-600',
                  titleHover: 'group-hover:text-emerald-600',
                  accent: 'bg-emerald-600'
                }
              };
              
              const colors = colorClasses[feature.color as keyof typeof colorClasses];
              
              return (
                <div 
                  key={index}
                  className={`group relative bg-white rounded-3xl p-10 shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 ${colors.bg} rounded-full -translate-y-16 translate-x-16 ${colors.bgHover} transition-colors duration-500`} />
                  
                  <div className="relative z-10">
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${colors.iconBg} rounded-2xl mb-8 ${colors.iconText} ${colors.iconBgHover} group-hover:text-white transition-all duration-300 shadow-lg group-hover:scale-110`}>
                      {feature.icon}
                    </div>
                    <h3 className={`text-2xl font-bold text-slate-900 mb-4 ${colors.titleHover} transition-colors`}>{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed text-lg group-hover:text-slate-700 transition-colors">{feature.description}</p>
                  </div>

                  {/* Subtle accent line */}
                  <div className={`absolute bottom-0 left-0 w-full h-1 ${colors.accent} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-24">
          <div className="relative text-center bg-white/60 backdrop-blur-sm rounded-[3rem] p-20 shadow-2xl border border-white/50 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-100 rounded-full -translate-y-16 -translate-x-16" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-100 rounded-full translate-y-20 translate-x-20" />
            <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-cyan-100 rounded-full -translate-x-12 -translate-y-12 opacity-60" />
            
            <div className="relative z-10">
              <div className="inline-block mb-8">
                <span className="px-6 py-3 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold tracking-wide uppercase">
                  Bắt đầu hành trình
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8">
                Sẵn sàng khám phá lịch sử?
              </h2>
              <p className="text-2xl text-slate-600 mb-16 max-w-4xl mx-auto leading-relaxed">
                Tham gia cùng <span className="font-bold text-slate-900">hàng nghìn người</span> đã khám phá lịch sử Việt Nam một cách thú vị
              </p>
              <Link 
                href="/map"
                className="group relative inline-flex items-center gap-6 px-16 py-6 bg-blue-600 text-white rounded-3xl hover:bg-blue-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 hover:scale-110 text-2xl font-bold transform"
              >
                <Play className="w-10 h-10 group-hover:scale-125 transition-transform" />
                <span>Bắt đầu ngay</span>
                <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-12 border-t border-slate-200">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-2xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">VietHistory Map</span>
            </div>
            <p className="text-slate-600 font-medium">
              &copy; 2024 VietHistory Map. Được tạo với <span className="text-red-500">❤️</span> để khám phá lịch sử Việt Nam.
            </p>
          </div>
        </footer>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={() => setAuthModal(prev => ({ ...prev, isOpen: false }))}
        onSwitchMode={() => setAuthModal(prev => ({ 
          ...prev, 
          mode: prev.mode === 'login' ? 'register' : 'login' 
        }))}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
