'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Map, 
  Users, 
  Gamepad2, 
  Trophy,
  History,
  MessageCircle
} from 'lucide-react';

const navItems = [
  {
    href: '/map',
    label: 'Bản đồ',
    icon: Map,
    description: 'Khám phá lịch sử qua bản đồ tương tác'
  },
  {
    href: '/characters',
    label: 'Nhân vật',
    icon: Users,
    description: 'Tìm hiểu về các anh hùng dân tộc'
  },
  {
    href: '/events',
    label: 'Sự kiện',
    icon: History,
    description: 'Dòng chảy các sự kiện lịch sử'
  },
  {
    href: '/games',
    label: 'Mini Games',
    icon: Gamepad2,
    description: 'Trò chơi lịch sử multiplayer'
  },
  {
    href: '/leaderboard',
    label: 'Xếp hạng',
    icon: Trophy,
    description: 'Bảng xếp hạng và huy hiệu'
  }
];

export default function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <History className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-lg">VNR History</div>
              <div className="text-blue-200 text-xs">1858-1930</div>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 group relative ${
                      isActive 
                        ? 'bg-blue-500/30 text-white' 
                        : 'text-blue-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <IconComponent className="w-4 h-4" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                      {item.description}
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors duration-200">
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
