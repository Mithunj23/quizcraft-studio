
DROP VIEW IF EXISTS public.leaderboard_global;
DROP VIEW IF EXISTS public.leaderboard_weekly;

CREATE VIEW public.leaderboard_global
WITH (security_invoker=on) AS
SELECT 
  qa.user_id,
  p.username,
  p.avatar_url,
  COUNT(*) as total_quizzes,
  SUM(qa.score) as total_score,
  ROUND(AVG(qa.accuracy), 1) as avg_accuracy,
  MAX(qa.best_streak) as best_streak
FROM public.quiz_attempts qa
JOIN public.profiles p ON p.user_id = qa.user_id
GROUP BY qa.user_id, p.username, p.avatar_url
ORDER BY total_score DESC;

CREATE VIEW public.leaderboard_weekly
WITH (security_invoker=on) AS
SELECT 
  qa.user_id,
  p.username,
  p.avatar_url,
  COUNT(*) as total_quizzes,
  SUM(qa.score) as total_score,
  ROUND(AVG(qa.accuracy), 1) as avg_accuracy,
  MAX(qa.best_streak) as best_streak
FROM public.quiz_attempts qa
JOIN public.profiles p ON p.user_id = qa.user_id
WHERE qa.completed_at >= date_trunc('week', now())
GROUP BY qa.user_id, p.username, p.avatar_url
ORDER BY total_score DESC;
