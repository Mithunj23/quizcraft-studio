import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Medal, Crown, TrendingUp } from "lucide-react";
import Header from "@/components/Header";

interface LeaderboardEntry {
  user_id: string | null;
  username: string | null;
  avatar_url: string | null;
  total_quizzes: number | null;
  total_score: number | null;
  avg_accuracy: number | null;
  best_streak: number | null;
}

const LeaderboardPage = () => {
  const [tab, setTab] = useState<"global" | "weekly">("global");
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const view = tab === "global" ? "leaderboard_global" : "leaderboard_weekly";
      const { data } = await supabase.from(view).select("*").limit(50);
      setData((data as LeaderboardEntry[]) || []);
      setLoading(false);
    };
    fetch();
  }, [tab]);

  const rankIcon = (i: number) => {
    if (i === 0) return <Crown className="w-5 h-5 text-warning" />;
    if (i === 1) return <Medal className="w-5 h-5 text-muted-foreground" />;
    if (i === 2) return <Medal className="w-5 h-5 text-warning/60" />;
    return <span className="text-sm font-mono text-muted-foreground w-5 text-center">{i + 1}</span>;
  };

  return (
    <div className="min-h-screen bg-background bg-grid">
      <Header />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="w-7 h-7 text-warning" />
          <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["global", "weekly"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "global" ? "All Time" : "This Week"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No scores yet. Be the first!</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="grid grid-cols-[48px_1fr_80px_80px_80px] gap-2 px-5 py-3 text-xs text-muted-foreground uppercase tracking-wider border-b border-border">
              <span>#</span>
              <span>Player</span>
              <span className="text-right">Score</span>
              <span className="text-right">Accuracy</span>
              <span className="text-right">Streak</span>
            </div>
            {data.map((entry, i) => (
              <motion.div
                key={entry.user_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`grid grid-cols-[48px_1fr_80px_80px_80px] gap-2 px-5 py-3 items-center border-b border-border last:border-0 ${
                  i < 3 ? "bg-primary/5" : ""
                }`}
              >
                <div className="flex items-center justify-center">{rankIcon(i)}</div>
                <div className="font-medium text-foreground truncate">{entry.username || "Anonymous"}</div>
                <div className="text-right font-bold text-foreground">{entry.total_score || 0}</div>
                <div className="text-right text-sm text-muted-foreground">{entry.avg_accuracy || 0}%</div>
                <div className="text-right text-sm text-warning font-medium">{entry.best_streak || 0}x</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
