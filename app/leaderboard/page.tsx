'use client';

import MainNav from '@/components/Navigation/MainNav';
import Leaderboard from '@/components/Games/Leaderboard';

export default function LeaderboardPage() {
  return (
    <>
      <MainNav />
      <div className="pt-16">
        <Leaderboard />
      </div>
    </>
  );
}
