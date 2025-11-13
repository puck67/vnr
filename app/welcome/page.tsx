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
  LogIn
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
        }
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user'); // Xóa data lỗi
      }
    }
  }, []);

  const handleAuthOpen = (mode: 'login' | 'register') => {
    setAuthModal({ isOpen: true, mode });
  };

  const handleAuthClose = () => {
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  const handleAuthSwitch = () => {
    setAuthModal(prev => ({ 
      ...prev, 
      mode: prev.mode === 'login' ? 'register' : 'login' 
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Bản đồ tương tác",
      description: "Khám phá lịch sử Việt Nam qua bản đồ chi tiết với hơn 1000 sự kiện",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Timeline lịch sử", 
      description: "Theo dõi dòng thời gian từ 1858-1930 với giao diện hiện đại",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Hệ thống gamification",
      description: "Kiếm điểm, mở khóa huy hiệu khi khám phá và làm quiz",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Quiz tương tác",
      description: "Kiểm tra kiến thức với các câu hỏi thú vị về từng sự kiện",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const stats = [
    { number: "1000+", label: "Sự kiện lịch sử", icon: <Star className="w-6 h-6" /> },
    { number: "73", label: "Năm được bao phủ", icon: <Clock className="w-6 h-6" /> },
    { number: "50+", label: "Huy hiệu có thể mở khóa", icon: <Award className="w-6 h-6" /> },
    { number: "∞", label: "Kiến thức chờ khám phá", icon: <BookOpen className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fixed Mountain Background */}
      <div 
        className="fixed inset-0 bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(/background.png)',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Dark overlay for better text readability */}
      <div className="fixed inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center animate-pulse-glow animate-float">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">VietHistory Map</h1>
                <p className="text-slate-300 text-sm">Khám phá lịch sử Việt Nam</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl text-white">
                    <User className="w-5 h-5" />
                    <span>{user.username}</span>
                    <div className="ml-2 px-2 py-1 bg-yellow-500 rounded-full text-xs font-bold">
                      {user.profile?.points || 0} điểm
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 text-white hover:text-red-300 transition-colors"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => handleAuthOpen('register')}
                    className="flex items-center gap-2 px-4 py-2 text-white hover:text-blue-300 transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span>Đăng ký</span>
                  </button>
                  <button 
                    onClick={() => handleAuthOpen('login')}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Đăng nhập</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20">
          <div className={`text-center transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
              Hành trình qua
              <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent drop-shadow-lg">
                {" "}Lịch sử Việt Nam
              </span>
            </h1>
            
            <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-lg bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              Khám phá 73 năm lịch sử hào hùng của dân tộc Việt Nam (1858-1930) qua bản đồ tương tác, 
              timeline chi tiết và hệ thống gamification thú vị
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                href="/map"
                className="group relative flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white rounded-2xl hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/30 hover:scale-105 transform"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <Play className="w-7 h-7 group-hover:scale-110 transition-transform relative z-10" />
                <span className="text-xl font-bold relative z-10">Bắt đầu khám phá</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform relative z-10" />
              </Link>
              
              <Link 
                href="/timeline"
                className="group relative flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-md text-white rounded-2xl hover:from-white/20 hover:via-white/10 hover:to-white/20 transition-all duration-300 border border-white/30 hover:border-white/50 hover:scale-105 transform"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <Clock className="w-7 h-7 relative z-10" />
                <span className="text-xl font-bold relative z-10">Xem Timeline</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`text-center transform transition-all duration-700 delay-${index * 100} hover:scale-110 group ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500/40 via-blue-500/40 to-purple-500/40 backdrop-blur-md rounded-3xl mb-6 text-cyan-300 group-hover:from-cyan-400/50 group-hover:via-blue-400/50 group-hover:to-purple-400/50 transition-all duration-300 border border-white/20 group-hover:border-white/40 shadow-lg">
                  {stat.icon}
                </div>
                <div className="text-5xl font-black text-white drop-shadow-lg mb-3">{stat.number}</div>
                <div className="text-white/80 font-medium text-lg group-hover:text-white transition-colors drop-shadow-md">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Tại sao chọn VietHistory Map?</h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto drop-shadow-md">
              Trải nghiệm học lịch sử hoàn toàn mới với công nghệ hiện đại
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`group relative p-10 bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-md rounded-3xl border border-white/20 hover:border-white/30 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Icon */}
                <div className={`relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${feature.color} rounded-3xl mb-8 text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg group-hover:shadow-xl`}>
                  {feature.icon}
                  <div className="absolute inset-0 bg-white/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                {/* Content */}
                <h3 className="relative text-3xl font-black bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent mb-6 group-hover:from-cyan-200 group-hover:via-blue-200 group-hover:to-purple-200 transition-all duration-300">{feature.title}</h3>
                <p className="relative text-slate-300 text-lg leading-relaxed group-hover:text-slate-200 transition-colors">{feature.description}</p>
                
                {/* Subtle shine effect */}
                <div className="absolute top-0 -left-4 w-2 h-full bg-gradient-to-b from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[400%] transition-transform duration-1000" />
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="relative text-center bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-purple-600/20 backdrop-blur-md rounded-3xl p-16 border border-white/20 overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10" />
            <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-5xl font-black bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent mb-8">
                Sẵn sàng khám phá lịch sử?
              </h2>
              <p className="text-2xl text-slate-200 mb-12 max-w-3xl mx-auto leading-relaxed">
                Tham gia cùng hàng nghìn người đã khám phá lịch sử Việt Nam một cách thú vị
              </p>
              <Link 
                href="/map"
                className="group relative inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white rounded-3xl hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/40 hover:scale-110 text-2xl font-bold transform"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <Play className="w-8 h-8 group-hover:scale-125 transition-transform relative z-10" />
                <span className="relative z-10">Bắt đầu ngay</span>
                <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform relative z-10" />
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-8 border-t border-white/10">
          <div className="text-center text-slate-400">
            <p>&copy; 2024 VietHistory Map. Được tạo với ❤️ để khám phá lịch sử Việt Nam.</p>
          </div>
        </footer>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={handleAuthClose}
        mode={authModal.mode}
        onSwitchMode={handleAuthSwitch}
      />
    </div>
  );
}
