import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  BookOpen, 
  HelpCircle, 
  Sparkles,
  Trophy,
  Globe2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../services/api';
import { useAccessibility } from '../context/AccessibilityContext';
import { useToast } from '../context/ToastContext';

export const LearningCentrePage: React.FC = () => {
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [progress, setProgress] = useState<any | null>(null);

  const { language, setLanguage } = useAccessibility();
  const { showToast } = useToast();

  useEffect(() => {
    fetchLessons();
    fetchUserProgress();
  }, []);

  const fetchLessons = async () => {
    try {
      const res = await api.get('/learning/lessons');
      if (res.data.success) {
        setLessons(res.data.lessons);
        if (res.data.lessons.length > 0 && !selectedLesson) {
          setSelectedLesson(res.data.lessons[0]);
        }
      }
    } catch {
      // Ignored
    }
  };

  const fetchUserProgress = async () => {
    try {
      const res = await api.get('/learning/progress');
      if (res.data.success) {
        setProgress(res.data.progress);
      }
    } catch {
      // Ignored
    }
  };

  const handleSelectLesson = (lesson: any) => {
    setSelectedLesson(lesson);
    setUserAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const handleOptionSelect = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleQuizSubmit = async () => {
    if (!selectedLesson) return;

    let score = 0;
    selectedLesson.quiz.forEach((q: any, idx: number) => {
      if (userAnswers[idx] === q.correctIndex) {
        score++;
      }
    });

    setQuizScore(score);
    setQuizSubmitted(true);

    if (score === selectedLesson.quiz.length) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      showToast('Perfect Score!', 'Mastery badge unlocked for this topic!', 'success');
    } else {
      showToast('Quiz Completed', `You scored ${score} out of ${selectedLesson.quiz.length}`, 'info');
    }

    try {
      await api.post('/learning/quiz', {
        lessonId: selectedLesson.id,
        score,
        totalQuestions: selectedLesson.quiz.length
      });
      fetchUserProgress();
    } catch {
      // Ignored
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return progress?.completedLessons?.includes(lessonId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" />
          Priority Feature 5 • Cyber Learning Centre
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Campus Cybersecurity Awareness & Interactive Quizzes
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
          Seven targeted modules addressing the most common cyber threats on campus.
          Learn safe cyber hygiene and test your defense skills with interactive quizzes.
        </p>
      </div>

      {/* Language Toggle & Progress Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Globe2 className="w-4 h-4 text-cyan-400" />
          <span>Language:</span>
          <div className="inline-flex rounded-lg bg-cyber-secondary p-1 border border-cyber-border">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                language === 'en' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('te')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                language === 'te' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              తెలుగు (Telugu)
            </button>
          </div>
        </div>

        {progress && (
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyber-secondary border border-cyber-border text-slate-300">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Completed: <strong>{progress.completedLessons?.length || 0}</strong> / {lessons.length}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyber-secondary border border-cyber-border text-cyan-300">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Badges: <strong>{progress.badgesEarned?.length || 0}</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* Main Layout: Lessons List + Active Lesson View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Lesson Modules List (4 Cols) */}
        <div className="lg:col-span-4 space-y-2.5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Curriculum Modules ({lessons.length})
          </h3>

          <div className="space-y-2">
            {lessons.map(lesson => {
              const isSelected = selectedLesson?.id === lesson.id;
              const isDone = isLessonCompleted(lesson.id);

              return (
                <button
                  key={lesson.id}
                  onClick={() => handleSelectLesson(lesson)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between text-xs ${
                    isSelected
                      ? 'bg-cyber-card border-cyan-400 shadow-cyan-glow text-white'
                      : 'bg-cyber-secondary border-cyber-border hover:border-slate-600 text-slate-300'
                  }`}
                >
                  <div className="space-y-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-cyan-400 font-mono">Module {lesson.order}</span>
                      {isDone && (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                          Completed
                        </span>
                      )}
                    </div>
                    <div className="font-bold truncate text-white">
                      {language === 'te' ? lesson.titleTe : lesson.title}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{lesson.readTime}</span>
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-cyan-400 translate-x-1' : 'text-slate-500'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Lesson Detail & Quiz (8 Cols) */}
        {selectedLesson && (
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-cyber-secondary border border-cyber-border shadow-glass space-y-6 text-xs">
            {/* Title & Category */}
            <div className="pb-4 border-b border-cyber-border space-y-1">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider font-mono">
                Module {selectedLesson.order} • {selectedLesson.category}
              </span>
              <h2 className="text-xl font-bold text-white">
                {language === 'te' ? selectedLesson.titleTe : selectedLesson.title}
              </h2>
              <p className="text-slate-300 text-xs leading-relaxed pt-1">
                {language === 'te' ? selectedLesson.descriptionTe : selectedLesson.description}
              </p>
            </div>

            {/* Realistic Example Card */}
            <div className="p-4 rounded-2xl bg-cyber-card border border-cyber-border space-y-2">
              <div className="text-amber-400 font-bold flex items-center gap-1.5 text-xs">
                <Sparkles className="w-4 h-4" />
                {language === 'te' ? 'వాస్తవ ఉదాహరణ (Realistic Campus Scenario):' : 'Realistic Campus Threat Scenario:'}
              </div>
              <p className="text-slate-200 text-xs italic leading-relaxed">
                "{language === 'te' ? selectedLesson.realisticExampleTe : selectedLesson.realisticExample}"
              </p>
            </div>

            {/* Safety Tips */}
            <div className="p-5 rounded-2xl bg-cyber-card border border-cyber-border space-y-3">
              <div className="text-cyan-400 font-bold flex items-center gap-1.5 text-xs">
                <ShieldCheck className="w-4 h-4" />
                {language === 'te' ? 'భద్రతా సూచనలు (Mandatory Safety Guidelines):' : 'Essential Security Defense Rules:'}
              </div>
              <ul className="space-y-2 text-slate-300 text-xs">
                {(language === 'te' ? selectedLesson.safetyTipsTe : selectedLesson.safetyTips).map((tip: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interactive Quiz Section */}
            <div className="pt-4 border-t border-cyber-border space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-cyan-400" />
                  Interactive Knowledge Verification Quiz
                </h3>
                {quizSubmitted && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      quizScore === selectedLesson.quiz.length
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    Score: {quizScore} / {selectedLesson.quiz.length}
                  </span>
                )}
              </div>

              {selectedLesson.quiz.map((q: any, qIdx: number) => {
                const selectedOpt = userAnswers[qIdx];
                const isCorrect = selectedOpt === q.correctIndex;

                return (
                  <div key={qIdx} className="p-5 rounded-2xl bg-cyber-card border border-cyber-border space-y-3">
                    <p className="font-bold text-white text-xs leading-relaxed">
                      Q{qIdx + 1}: {language === 'te' ? q.questionTe : q.question}
                    </p>

                    <div className="space-y-2">
                      {(language === 'te' ? q.optionsTe : q.options).map((opt: string, optIdx: number) => {
                        let optStyle = 'bg-cyber-darker border-cyber-border hover:border-cyan-500/50 text-slate-300';
                        if (selectedOpt === optIdx) {
                          optStyle = 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-semibold';
                        }
                        if (quizSubmitted) {
                          if (optIdx === q.correctIndex) {
                            optStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                          } else if (selectedOpt === optIdx) {
                            optStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={quizSubmitted}
                            onClick={() => handleOptionSelect(qIdx, optIdx)}
                            className={`w-full text-left p-3 rounded-xl border text-xs transition-colors flex items-center justify-between ${optStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && optIdx === q.correctIndex && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="p-3 rounded-xl bg-cyber-darker text-[11px] text-slate-300 leading-relaxed border border-cyber-border/70">
                        <strong className="text-cyan-400">Explanation: </strong>
                        {language === 'te' ? q.explanationTe : q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}

              {!quizSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(userAnswers).length < selectedLesson.quiz.length}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-cyan-glow hover:opacity-95 transition-opacity disabled:opacity-50"
                >
                  Submit Quiz Answers
                </button>
              ) : (
                <button
                  onClick={() => {
                    setQuizSubmitted(false);
                    setUserAnswers({});
                  }}
                  className="w-full py-2.5 rounded-xl bg-cyber-card hover:bg-cyber-cardHover border border-cyber-border text-cyan-300 font-bold text-xs transition-colors"
                >
                  Retake Quiz
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

