import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, Target, Zap, TrendingUp, Clock, Brain } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Header from "@/components/Header";

interface AttemptRow {
  score: number;
  total_questions: number;
  accuracy: number;
  best_streak: number;
  category_id: string;
  difficulty: string | null;
  completed_at: string | null;
  categories: { name: string } | null;
}

const CHART_COLORS = [
  "hsl(168, 80%, 50%)",
  "hsl(280, 70%, 60%)",
  "hsl(35, 95%, 55%)",
  "hsl(0, 75%, 55%)",
  "hsl(200, 80%, 60%)",
  "hsl(145, 70%, 45%)",
];

const DashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState<AttemptRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    const fetchAttempts = async () => {
      const { data } = await supabase
        .from("quiz_attempts")
        .select("score, total_questions, accuracy, best_streak, category_id, difficulty, completed_at, categories(name)")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });
      setAttempts((data as any) || []);
      setLoading(false);
    };
    fetchAttempts();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const totalQuizzes = attempts.length;
  const totalCorrect = attempts.reduce((s, a) => s + a.score, 0);
  const totalQuestions = attempts.reduce((s, a) => s + a.total_questions, 0);
  const avgAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const bestStreak = attempts.reduce((max, a) => Math.max(max, a.best_streak), 0);

  // Category performance
  const categoryMap = new Map<string, { correct: number; total: number }>();
  attempts.forEach((a) => {
    const name = a.categories?.name || "Unknown";
    const existing = categoryMap.get(name) || { correct: 0, total: 0 };
    categoryMap.set(name, { correct: existing.correct + a.score, total: existing.total + a.total_questions });
  });
  const categoryData = Array.from(categoryMap.entries()).map(([name, { correct, total }]) => ({
    name: name.length > 12 ? name.slice(0, 12) + "…" : name,
    accuracy: Math.round((correct / total) * 100),
    quizzes: total,
  }));

  // Strongest/weakest
  const sorted = [...categoryData].sort((a, b) => b.accuracy - a.accuracy);
  const strongest = sorted[0]?.name || "—";
  const weakest = sorted.length > 1 ? sorted[sorted.length - 1]?.name : "—";

  // Pie data for difficulty distribution
  const diffMap = new Map<string, number>();
  attempts.forEach((a) => {
    const d = a.difficulty || "mixed";
    diffMap.set(d, (diffMap.get(d) || 0) + 1);
  });
  const pieData = Array.from(diffMap.entries()).map(([name, value]) => ({ name, value }));

  return (
    <div className="min-h-screen bg-background bg-grid">
      <Header />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          <BarChart3 className="inline w-7 h-7 mr-2 text-primary" />
          Analytics Dashboard
        </h1>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Brain, label: "Quizzes Taken", value: totalQuizzes, color: "text-primary" },
            { icon: Target, label: "Avg Accuracy", value: `${avgAccuracy}%`, color: "text-success" },
            { icon: Zap, label: "Best Streak", value: bestStreak, color: "text-warning" },
            { icon: TrendingUp, label: "Total Correct", value: totalCorrect, color: "text-accent" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-5"
            >
              <s.icon className={`w-5 h-5 mb-2 ${s.color}`} />
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Strong/Weak */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          <div className="rounded-xl border border-success/30 bg-success/5 p-5">
            <div className="text-sm text-success font-medium mb-1">💪 Strongest Topic</div>
            <div className="text-xl font-bold text-foreground">{strongest}</div>
          </div>
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
            <div className="text-sm text-destructive font-medium mb-1">📉 Needs Improvement</div>
            <div className="text-xl font-bold text-foreground">{weakest}</div>
          </div>
        </div>

        {totalQuizzes > 0 && (
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {/* Bar chart */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Accuracy by Category</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={categoryData}>
                  <XAxis dataKey="name" tick={{ fill: "hsl(220,10%,55%)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "hsl(220,10%,55%)", fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ background: "hsl(240,12%,13%)", border: "1px solid hsl(240,8%,22%)", borderRadius: 8 }}
                    labelStyle={{ color: "hsl(210,20%,95%)" }}
                  />
                  <Bar dataKey="accuracy" fill="hsl(168,80%,50%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie chart */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Difficulty Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "hsl(240,12%,13%)", border: "1px solid hsl(240,8%,22%)", borderRadius: 8 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Recent attempts */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" /> Recent Quizzes
            </h3>
          </div>
          {attempts.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">
              No quizzes attempted yet. Go take one!
            </div>
          ) : (
            <div className="divide-y divide-border">
              {attempts.slice(0, 10).map((a, i) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground text-sm">{a.categories?.name || "Quiz"}</div>
                    <div className="text-xs text-muted-foreground">
                      {a.difficulty || "mixed"} · {a.completed_at ? new Date(a.completed_at).toLocaleDateString() : "—"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-foreground">{a.score}/{a.total_questions}</div>
                    <div className="text-xs text-muted-foreground">{a.accuracy}%</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
