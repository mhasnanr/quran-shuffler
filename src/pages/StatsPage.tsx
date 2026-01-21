import { useStats } from "@/hooks/useStats";
import { useReviewItems } from "@/hooks/useReviewItems";
import { Card } from "@/components/ui/card";
import { 
  Flame, 
  BookOpen, 
  ScrollText, 
  TrendingUp,
  AlertTriangle,
  Calendar
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";

const StatsPage = () => {
  const { stats, getTodayStats, getWeeklyStats } = useStats();
  const { reviewItems } = useReviewItems();
  
  const todayStats = getTodayStats();
  const weeklyStats = getWeeklyStats();
  
  // Aggregate weak spots from review items
  const weakSpotsFromReview = reviewItems.reduce((acc, item) => {
    const existing = acc.find(w => w.surahNumber === item.surahNumber);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({
        surahNumber: item.surahNumber,
        surahName: item.surahName,
        arabicName: item.arabicName,
        count: 1,
      });
    }
    return acc;
  }, [] as { surahNumber: number; surahName: string; arabicName: string; count: number }[]);
  
  // Combine with historical weak spots
  const combinedWeakSpots = [...stats.weakSpots];
  weakSpotsFromReview.forEach(wr => {
    const existing = combinedWeakSpots.find(w => w.surahNumber === wr.surahNumber);
    if (existing) {
      existing.reviewCount += wr.count;
    } else {
      combinedWeakSpots.push({
        surahNumber: wr.surahNumber,
        surahName: wr.surahName,
        arabicName: wr.arabicName,
        reviewCount: wr.count,
      });
    }
  });
  
  const sortedWeakSpots = combinedWeakSpots
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 5);
  
  // Format weekly chart data
  const chartData = weeklyStats.map(day => ({
    day: new Date(day.date).toLocaleDateString('id-ID', { weekday: 'short' }),
    ayat: day.ayatRead,
  }));
  
  const maxAyat = Math.max(...chartData.map(d => d.ayat), 1);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Progress Hafalan</h1>
        <p className="text-sm text-muted-foreground">Statistik dan pencapaianmu</p>
      </div>
      
      {/* Streak Card */}
      <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-orange-500/20">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/20">
            <Flame className="h-7 w-7 text-orange-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Current Streak</p>
            <p className="text-3xl font-bold text-foreground">{stats.currentStreak} <span className="text-lg font-normal text-muted-foreground">hari</span></p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Terpanjang</p>
            <p className="text-lg font-semibold text-foreground">{stats.longestStreak} hari</p>
          </div>
        </div>
      </Card>
      
      {/* Today Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <ScrollText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ayat Hari Ini</p>
              <p className="text-2xl font-bold text-foreground">{todayStats.ayatRead}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <BookOpen className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Surat Selesai</p>
              <p className="text-2xl font-bold text-foreground">{todayStats.surahsCompleted}</p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* All Time Stats */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-foreground">All-Time Progress</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-2xl font-bold text-foreground">{stats.totalAyatAllTime.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Ayat</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-2xl font-bold text-foreground">{stats.totalSurahsAllTime.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Surat</p>
          </div>
        </div>
      </Card>
      
      {/* Weekly Chart */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-foreground">Ayat Minggu Ini</h3>
        </div>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar dataKey="ayat" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={entry.ayat === maxAyat && entry.ayat > 0 
                      ? 'hsl(var(--primary))' 
                      : 'hsl(var(--primary) / 0.4)'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      {/* Weak Spots */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <h3 className="font-semibold text-foreground">Surat Perlu Latihan</h3>
        </div>
        {sortedWeakSpots.length > 0 ? (
          <div className="space-y-2">
            {sortedWeakSpots.map((spot, index) => (
              <div 
                key={spot.surahNumber}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-600">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{spot.surahName}</p>
                    <p className="text-xs text-muted-foreground font-arabic">{spot.arabicName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-amber-600">{spot.reviewCount}x</p>
                  <p className="text-[10px] text-muted-foreground">perlu review</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Belum ada surat yang perlu latihan khusus 🎉
          </p>
        )}
      </Card>
    </div>
  );
};

export default StatsPage;
