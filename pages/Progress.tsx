import React from 'react';
import { useStore } from '../services/store';
import { ViewState } from '../types';
import { 
  Award, TrendingUp, Zap, Sparkles, CheckCircle2, Lock, 
  ArrowRight, Stethoscope, Flame, Calendar, CheckSquare, ShieldCheck
} from 'lucide-react';
import { Button } from '../components/Button';

export const Progress: React.FC = () => {
  const { user, lessons, badges, setView, viewUserDiagnostics } = useStore();

  if (!user) return null;

  // Calculate Course Progress Metrics
  const totalLessons = lessons.length;
  const completedLessons = lessons.filter(l => l.isCompleted).length;

  const totalBlocks = lessons.reduce((acc, l) => acc + (l.blocks?.length || 0), 0);
  const completedBlocks = lessons.reduce((acc, l) => acc + (l.completedBlockIds?.length || 0), 0);
  const overallPercentage = totalBlocks > 0 ? Math.round((completedBlocks / totalBlocks) * 100) : 0;

  // Render Badge Icon/Emoji/Symbol helper
  const getBadgeIcon = (badgeName: string) => {
    switch (badgeName) {
      case 'Инициация': return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'Проводник': return <CheckSquare className="w-5 h-5 text-indigo-400" />;
      case 'Алхимик': return <Award className="w-5 h-5 text-emerald-400" />;
      default: return <Award className="w-5 h-5 text-purple-400" />;
    }
  };

  // Diagnostic Status check
  const isDiagnosticsCompleted = user.diagnosticsStatus === 'completed';

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header section with minimal & premium aesthetic */}
      <div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Оцифровка вашего здоровья</h2>
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">Прогресс трансформации</h1>
        <p className="text-gray-400 text-sm mt-2 max-w-2xl">
          Отслеживайте ваше продвижение по урокам Академии смысла, накапливайте баллы осознанности и отслеживайте эволюцию вашего психосоматического профиля.
        </p>
      </div>

      {/* Main Grid: Course Progress & Stats/Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Total Course Progress (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-[#120a2c]/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] text-purple-400 font-black uppercase tracking-widest block mb-1">Учебная программа</span>
                <span className="text-lg font-bold text-white block">Интенсивность прохождения</span>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                  {overallPercentage}%
                </span>
                <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wide">выполнено</span>
              </div>
            </div>

            {/* Glowing Custom Gradient Progress Bar */}
            <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden mb-6 border border-white/5 relative">
              <div 
                className="progress-bar-glow bg-gradient-to-r from-purple-600 to-indigo-500 h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${overallPercentage}%` }}
              ></div>
            </div>

            {/* Summary counters */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-white/5 pt-6">
              <div>
                <span className="text-gray-500 text-xs block">Завершено блоков</span>
                <span className="text-white text-xl font-extrabold">{completedBlocks} <span className="text-xs text-gray-400 font-medium">/ {totalBlocks}</span></span>
              </div>
              <div>
                <span className="text-gray-500 text-xs block">Доступно уроков</span>
                <span className="text-white text-xl font-extrabold">{totalLessons}</span>
              </div>
              <div className="col-span-2 md:col-span-1">
                <span className="text-gray-500 text-xs block">Статус обучения</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 mt-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full text-xs font-bold leading-normal">
                  Активный рост
                </span>
              </div>
            </div>
          </div>

          {/* Granular progression through all lessons */}
          <div className="bg-[#120a2c]/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Детализация по урокам</h3>
            <div className="divide-y divide-white/5 space-y-4">
              {lessons.map((lesson, idx) => {
                const lessonTotalBlocks = lesson.blocks?.length || 0;
                const lessonCompletedBlocks = lesson.completedBlockIds?.length || 0;
                const lessonPct = lessonTotalBlocks > 0 ? Math.round((lessonCompletedBlocks / lessonTotalBlocks) * 100) : 0;
                
                return (
                  <div key={lesson.id} className="pt-4 first:pt-0 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] text-gray-500 font-extrabold uppercase">Шаг {idx + 1}</span>
                        {lessonPct === 100 ? (
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-black uppercase">Пройден</span>
                        ) : lessonPct > 0 ? (
                          <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded font-black uppercase">В процессе</span>
                        ) : (
                          <span className="text-[10px] bg-white/5 text-gray-500 border border-white/5 px-1.5 py-0.5 rounded font-black uppercase">Не начат</span>
                        )}
                      </div>
                      <h4 className="text-white text-sm font-bold truncate">{lesson.title}</h4>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{lesson.description}</p>
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end gap-1">
                      <span className="text-white text-sm font-black tracking-wide">
                        {lessonCompletedBlocks}/{lessonTotalBlocks} <span className="text-[10px] text-gray-500 font-normal">блоков</span>
                      </span>
                      <div className="w-20 bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="bg-purple-500 h-full rounded-full transition-all duration-700"
                          style={{ width: `${lessonPct}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: points, Level Cards & Badges (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Level and Activity Points Widget */}
          <div className="bg-[#120a2c]/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Активность и Опыт (XP)</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              
              {/* Score / XP block */}
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-indigo-400" /> Очки баланса
                </span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl font-black text-indigo-400">{user.xp}</span>
                  <span className="text-[10px] text-gray-400 font-bold">XP</span>
                </div>
              </div>

              {/* Streak Card */}
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-400" /> Регулярность
                </span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl font-black text-orange-400">{user.streak}</span>
                  <span className="text-[10px] text-gray-400 font-bold">ДНЕЙ</span>
                </div>
              </div>

            </div>

            {/* Level card detailing experience to next rank */}
            <div className="p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 block font-medium">Ваш текущий уровень</span>
                <span className="text-white text-lg font-bold block">Уровень {user.level}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">Дзен-Мастер</span>
                <span className="text-xs text-gray-500 block">Опыт непрерывно растет</span>
              </div>
            </div>
          </div>

          {/* Achieved/Locked badges box */}
          <div className="bg-[#120a2c]/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Достижения</h3>
                <span className="text-xs text-slate-500 font-bold">
                  {badges.filter(b => b.unlocked).length} / {badges.length}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {badges.map((badge) => (
                  <div 
                    key={badge.id} 
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                      badge.unlocked 
                        ? 'bg-purple-500/5 border-purple-500/15' 
                        : 'bg-white/[0.02] border-white/5 opacity-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      badge.unlocked ? 'bg-purple-500/10' : 'bg-white/5 text-gray-500'
                    }`}>
                      {badge.unlocked ? getBadgeIcon(badge.name) : <Lock className="w-4 h-4 text-gray-600" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white truncate">{badge.name}</span>
                        {badge.unlocked && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center text-xs text-slate-500 pt-6 mt-4 border-t border-white/5">
              Выполняйте уроки и ведите дневник ежедневно, чтобы разблокировать новые награды на платформе.
            </div>
          </div>

        </div>

      </div>

      {/* BOTTOM SECTION: Diagnostic Profile Widget */}
      <div className="bg-gradient-to-r from-purple-950/20 via-[#120a2c]/65 to-indigo-950/20 backdrop-blur-md rounded-2xl p-8 border border-purple-500/20 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          
          <div className="flex items-start gap-4 flex-col sm:flex-row text-center sm:text-left">
            <div className="w-16 h-16 bg-teal-500/10 rounded-2xl flex items-center justify-center border border-teal-500/20 text-teal-400 shrink-0 mx-auto sm:mx-0">
              <Stethoscope className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-lg font-bold text-white">Карта здоровья и триггеров</span>
                {isDiagnosticsCompleted ? (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/25 px-2 py-0.5 rounded-full font-black uppercase">
                    <ShieldCheck className="w-3.5 h-3.5" /> Сформирован
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/25 px-2 py-0.5 rounded-full font-black uppercase">
                    Не заполнено
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-black text-white">Диагностический профиль</h3>
              <p className="text-gray-400 text-sm max-w-xl">
                {isDiagnosticsCompleted 
                  ? 'Ваш индивидуальный профиль психосоматических триггеров успешно составлен на основе анализа вашего анамнеза и ответов интерактивного теста.'
                  : 'Пройдите глубинное Мета-Сканирование, заполнив первичный диагностический опросник. Это позволит составить точечную терапевтическую программу лично под вас.'
                }
              </p>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            {isDiagnosticsCompleted ? (
              <Button 
                onClick={() => {
                  viewUserDiagnostics(user.id);
                  setView(ViewState.DIAGNOSTICS);
                }}
                className="w-full md:w-auto bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 border border-teal-500/20 text-white font-extrabold text-sm uppercase tracking-wider py-4 px-8 rounded-xl shadow-xl shadow-teal-950/20 transform hover:-translate-y-0.5 transition-all"
              >
                Открыть профиль <ArrowRight className="w-4 h-4 ml-2 inline-block" />
              </Button>
            ) : (
              <Button 
                onClick={() => {
                  setView(ViewState.DIAGNOSTICS);
                }}
                className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border border-purple-500/25 text-white font-extrabold text-sm uppercase tracking-wider py-4 px-8 rounded-xl shadow-xl shadow-purple-950/20 transform hover:-translate-y-0.5 transition-all"
              >
                Пройти диагностику <ArrowRight className="w-4 h-4 ml-2 inline-block" />
              </Button>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};
