import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { quizzes } from "@/data/quizData";
import { Zap, ArrowRight, Brain, Trophy, Clock } from "lucide-react";

const colorMap = {
  primary: "border-primary/30 hover:border-primary/60 hover:glow-primary",
  accent: "border-accent/30 hover:border-accent/60 hover:glow-accent",
  warning: "border-warning/30 hover:border-warning/60",
  destructive: "border-destructive/30 hover:border-destructive/60 hover:glow-destructive",
};

const bgMap = {
  primary: "bg-primary/10",
  accent: "bg-accent/10",
  warning: "bg-warning/10",
  destructive: "bg-destructive/10",
};

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background bg-grid relative overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8"
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Instant Knowledge Check</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="text-gradient-primary">Quiz</span>
            <span className="text-foreground">Forge</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Challenge yourself with beautifully crafted quizzes. Track your progress, beat the clock, and climb the ranks.
          </p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-8 mt-10"
          >
            {[
              { icon: Brain, label: "Questions", value: "120" },
              { icon: Trophy, label: "Categories", value: "8" },
              { icon: Clock, label: "Avg Time", value: "5min" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <stat.icon className="w-5 h-5 text-muted-foreground" />
                <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Quiz Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {quizzes.map((quiz, i) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
              onClick={() => navigate(`/quiz/${quiz.id}`)}
              className={`group relative cursor-pointer rounded-xl border-2 ${colorMap[quiz.color]} bg-card p-6 transition-all duration-300 hover:translate-y-[-4px]`}
            >
              <div className={`w-14 h-14 rounded-lg ${bgMap[quiz.color]} flex items-center justify-center text-3xl mb-4`}>
                {quiz.icon}
              </div>

              <h3 className="text-xl font-bold text-foreground mb-2">{quiz.title}</h3>
              <p className="text-sm text-muted-foreground mb-6">{quiz.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{quiz.questions.length} questions</span>
                  <span>{quiz.timePerQuestion}s each</span>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
