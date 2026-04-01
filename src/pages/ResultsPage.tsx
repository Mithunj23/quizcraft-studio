import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { quizzes } from "@/data/quizData";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Trophy, RotateCcw, Home, Star, Target, Zap, BarChart3 } from "lucide-react";

const ResultsPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const quiz = quizzes.find((q) => q.id === quizId);
  const { score = 0, total = 0, streak = 0, answers = [] } = (location.state as any) || {};
  const [saved, setSaved] = useState(false);

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  // Save to database
  useEffect(() => {
    if (!user || saved || total === 0) return;
    const save = async () => {
      // Find category - try to match quiz title to a category
      const { data: categories } = await supabase
        .from("categories")
        .select("id, name");
      
      let categoryId: string | null = null;
      if (categories && quiz) {
        const match = categories.find(c => c.name.toLowerCase() === quiz.title.toLowerCase());
        if (match) categoryId = match.id;
      }

      if (categoryId) {
        await supabase.from("quiz_attempts").insert({
          user_id: user.id,
          category_id: categoryId,
          score,
          total_questions: total,
          accuracy: percentage,
          best_streak: streak,
          answers: answers,
        });
      }
      setSaved(true);
    };
    save();
  }, [user, saved]);

  const getMessage = () => {
    if (percentage === 100) return { text: "Perfect Score!", emoji: "🏆", color: "text-warning" };
    if (percentage >= 75) return { text: "Excellent!", emoji: "🔥", color: "text-success" };
    if (percentage >= 50) return { text: "Good effort!", emoji: "👍", color: "text-primary" };
    return { text: "Keep practicing!", emoji: "💪", color: "text-accent" };
  };

  const msg = getMessage();

  return (
    <div className="min-h-screen bg-background bg-grid relative overflow-hidden flex items-center justify-center">
      <div className="fixed top-[-20%] left-[20%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[20%] w-[400px] h-[400px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="relative z-10 max-w-md w-full mx-6"
      >
        <div className="rounded-2xl border-2 border-border bg-card p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="text-6xl mb-4"
          >
            {msg.emoji}
          </motion.div>

          <h1 className={`text-3xl font-bold mb-2 ${msg.color}`}>{msg.text}</h1>
          <p className="text-muted-foreground mb-8">{quiz?.title || "Quiz"} completed</p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative w-40 h-40 mx-auto mb-8"
          >
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
              <motion.circle
                cx="60" cy="60" r="50" fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={314}
                initial={{ strokeDashoffset: 314 }}
                animate={{ strokeDashoffset: 314 - (314 * percentage) / 100 }}
                transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-foreground">{percentage}%</span>
              <span className="text-xs text-muted-foreground">{score}/{total}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            {[
              { icon: Target, label: "Correct", value: score },
              { icon: Star, label: "Score", value: `${percentage}%` },
              { icon: Zap, label: "Best Streak", value: streak },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1 p-3 rounded-lg bg-muted/50">
                <s.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-lg font-bold text-foreground">{s.value}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</span>
              </div>
            ))}
          </motion.div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/quiz/${quizId}`)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-primary/30 bg-primary/5 text-primary font-semibold hover:bg-primary/10 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Retry
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </button>
          </div>

          <button
            onClick={() => navigate("/")}
            className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ResultsPage;
