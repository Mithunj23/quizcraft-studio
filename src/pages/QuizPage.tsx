import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { quizzes } from "@/data/quizData";
import { Clock, ArrowRight, CheckCircle2, XCircle, Zap } from "lucide-react";

const optionLabels = ["A", "B", "C", "D"];

const optionColors = [
  "border-primary/40 hover:border-primary hover:bg-primary/10",
  "border-accent/40 hover:border-accent hover:bg-accent/10",
  "border-warning/40 hover:border-warning hover:bg-warning/10",
  "border-destructive/40 hover:border-destructive hover:bg-destructive/10",
];

const optionLabelBg = [
  "bg-primary/20 text-primary",
  "bg-accent/20 text-accent",
  "bg-warning/20 text-warning",
  "bg-destructive/20 text-destructive",
];

const QuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const quiz = quizzes.find((q) => q.id === quizId);

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(quiz?.timePerQuestion || 20);
  const [streak, setStreak] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  const question = quiz?.questions[currentQ];

  const handleNext = useCallback(() => {
    if (!quiz) return;
    if (currentQ < quiz.questions.length - 1) {
      setCurrentQ((p) => p + 1);
      setSelected(null);
      setShowResult(false);
      setTimeLeft(quiz.timePerQuestion);
    } else {
      navigate(`/results/${quiz.id}`, {
        state: { score, total: quiz.questions.length, answers, streak },
      });
    }
  }, [currentQ, quiz, navigate, score, answers, streak]);

  const handleSelect = (idx: number) => {
    if (selected !== null || !question) return;
    setSelected(idx);
    setShowResult(true);
    const correct = idx === question.correctIndex;
    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
    setAnswers((a) => [...a, idx]);
    setTimeout(handleNext, 1500);
  };

  // Timer
  useEffect(() => {
    if (selected !== null) return;
    if (timeLeft <= 0) {
      setSelected(-1);
      setShowResult(true);
      setStreak(0);
      setAnswers((a) => [...a, null]);
      setTimeout(handleNext, 1500);
      return;
    }
    const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, selected, handleNext]);

  if (!quiz || !question) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Quiz not found</p>
      </div>
    );
  }

  const progress = ((currentQ + 1) / quiz.questions.length) * 100;
  const timerPercent = (timeLeft / quiz.timePerQuestion) * 100;
  const timerColor = timeLeft <= 5 ? "bg-destructive" : "bg-primary";

  return (
    <div className="min-h-screen bg-background bg-grid relative overflow-hidden flex flex-col">
      <div className="fixed top-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Exit
          </button>
          <div className="flex items-center gap-3">
            {streak >= 2 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-warning/10 border border-warning/30"
              >
                <Zap className="w-3 h-3 text-warning" />
                <span className="text-xs font-bold text-warning">{streak}x</span>
              </motion.div>
            )}
            <span className="text-sm font-mono text-muted-foreground">
              {currentQ + 1}/{quiz.questions.length}
            </span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="max-w-2xl w-full mx-auto px-6 py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {/* Timer */}
              <div className="flex items-center gap-3 mb-6">
                <Clock className={`w-4 h-4 ${timeLeft <= 5 ? "text-destructive" : "text-muted-foreground"}`} />
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${timerColor}`}
                    initial={{ width: "100%" }}
                    animate={{ width: `${timerPercent}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className={`text-sm font-mono font-bold ${timeLeft <= 5 ? "text-destructive" : "text-muted-foreground"}`}>
                  {timeLeft}s
                </span>
              </div>

              {/* Question */}
              <div className="mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  {question.category} · {question.difficulty}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 leading-snug">
                {question.question}
              </h2>

              {/* Options */}
              <div className="grid gap-3">
                {question.options.map((opt, idx) => {
                  let borderClass = optionColors[idx];
                  if (showResult) {
                    if (idx === question.correctIndex) {
                      borderClass = "border-success bg-success/10 glow-success";
                    } else if (idx === selected) {
                      borderClass = "border-destructive bg-destructive/10 glow-destructive";
                    } else {
                      borderClass = "border-border opacity-40";
                    }
                  }

                  return (
                    <motion.button
                      key={idx}
                      whileHover={selected === null ? { scale: 1.01 } : {}}
                      whileTap={selected === null ? { scale: 0.99 } : {}}
                      onClick={() => handleSelect(idx)}
                      disabled={selected !== null}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${borderClass} ${selected === null ? "cursor-pointer" : "cursor-default"}`}
                    >
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${showResult ? (idx === question.correctIndex ? "bg-success/20 text-success" : idx === selected ? "bg-destructive/20 text-destructive" : "bg-muted text-muted-foreground") : optionLabelBg[idx]}`}>
                        {showResult && idx === question.correctIndex ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : showResult && idx === selected ? (
                          <XCircle className="w-4 h-4" />
                        ) : (
                          optionLabels[idx]
                        )}
                      </span>
                      <span className="text-foreground font-medium">{opt}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
