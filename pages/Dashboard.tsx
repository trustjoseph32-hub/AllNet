import React, { useState } from 'react';
import { useStore } from '../services/store';
import { ViewState, Lesson, DiaryEntry } from '../types';
import { ProgressBar } from '../components/ProgressBar';
import { Button } from '../components/Button';
import { 
  Sparkles, Zap, Brain, ArrowUpRight, Target, Activity, 
  Shield, CheckCircle2, BookOpen, ChefHat, ClipboardList, 
  Heart, Calendar, Milestone, ArrowRight, CheckSquare, Square, Apple, Flame
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, lessons, diaryEntries, setView, setActiveLesson } = useStore();
  
  // Local state for interactive daily tasks game
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({
    diary: false,
    lesson: false,
    breathing: false,
    diet: false,
  });

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => {
      const updated = { ...prev, [taskId]: !prev[taskId] };
      // Show some gamified reward alert concept or just update state
      return updated;
    });
  };

  // State for selected roadmap step
  const [activeRoadmapStep, setActiveRoadmapStep] = useState<number>(0);

  // Calculate academic stats
  const totalLessons = lessons.length;
  const completedLessons = lessons.filter(l => l.isCompleted).length;
  const lessonProgressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Calculate diary health trends
  const lastDiary = diaryEntries[diaryEntries.length - 1];
  const averageSymptom = diaryEntries.length > 0 
    ? (diaryEntries.reduce((acc, curr) => acc + curr.symptomLevel, 0) / diaryEntries.length).toFixed(1)
    : '0.0';
  const averageEmotion = diaryEntries.length > 0 
    ? (diaryEntries.reduce((acc, curr) => acc + curr.emotionLevel, 0) / diaryEntries.length).toFixed(1)
    : '0.0';

  // Weekly lessons (first 3 lessons or incomplete ones to guide user)
  const weeklyLessons = lessons.slice(0, 3);

  // Inflammation-reducing Anti-inflammatory recipes (ImmunoChef AI recommendations)
  const antiInflammatoryRecipes = [
    {
      title: "Антиоксидантный смузи «ИммуноЩит»",
      tag: "Противовоспалительный хит",
      time: "5 минут",
      ingredients: ["Шпинат свежий — 1 пучок", "Семена льна молотые — 1 ст.л.", "Спелое авокадо — 1/2 шт.", "Свежий огурец — 1 шт.", "Корень имбиря — 1 см", "Вода фильтрованная — 200 мл"],
      description: "Богат очищающим хлорофиллом, калием и омега-3 жирными кислотами. Активирует клеточный детокс и мгновенно снижает нагрузку на иммунную систему."
    },
    {
      title: "Тыквенный суп-крем с семенами тыквы",
      tag: "Протокол «Чистая кожа»",
      time: "25 минут",
      ingredients: ["Мякоть тыквы — 400 г", "Кокосовое молоко — 150 мл", "Корень куркумы свежий — 0.5 ч.л.", "Морковь — 1 шт.", "Очищенные семена тыквы — 2 ст.л.", "Зелень петрушки"],
      description: "Высокая концентрация бета-каротина ускоряет регенерацию эпидермиса при дерматитах, а куркумин блокирует синтез провоспалительных цитокинов."
    }
  ];

  // Roadmap details of AllergyNet Eco-system
  const ecosystemRoadmap = [
    {
       title: "1. Экспресс-Диагностика",
       tag: "Вход и Тестирование",
       desc: "Аналитическое исследование симптоматики и психосоматических триггеров. Интеграция опросника на 120 клинических вопросов для выявления подавленных эмоций, влияющих на воспалительные процессы.",
       status: user?.diagnosticsStatus === 'completed' ? 'Изучено' : 'В процессе',
       color: "from-cyan-500 to-blue-500"
    },
    {
       title: "2. Образовательная академия",
       tag: "Нейрофизиология и уроки",
       desc: "Пошаговый курс из интерактивных видеолекций с квиз-тестами и заданиями. Вы обучаетесь распознавать и гасить очаги хронического напряжения в коре больших полушарий головного мозга.",
       status: completedLessons > 0 ? 'Изучено' : 'Открыть',
       color: "from-purple-500 to-indigo-500"
    },
    {
       title: "3. Био-Мониторинг состояний",
       tag: "Дневник психосоматики",
       desc: "Ежедневная экологичная фиксация симптомов, уровня стресса, пищевых триггеров и психологических инсайтов. Позволяет верифицировать взаимосвязь состояния нервной системы и кожных/астматических реакций.",
       status: diaryEntries.length > 0 ? 'Активно' : 'Начать',
       color: "from-emerald-500 to-teal-500"
    },
    {
       title: "4. Нутрициологическая коррекция",
       tag: "Иммуношеф Нутрициология",
       desc: "Антивоспалительный протокол питания, регулирующий выработку гистамина и поддерживающий систему детоксикации печени и кишечника через индивидуальные рекомендации ИИ.",
       status: 'Активно',
       color: "from-amber-500 to-orange-500"
    },
    {
       title: "5. Интегративная Ремиссия",
       tag: "Свобода от аллергии!",
       desc: "Слияние биологической защиты и психотехнологий. Выход на стойкую безмедикаментозную ремиссию через восстановление иммунной толерантности.",
       status: 'Цель',
       color: "from-rose-500 to-pink-500"
    }
  ];

  return (
    <div className="space-y-10 animate-fade-in text-white pb-20">
      
      {/* HEADER SECTION */}
      <div className="relative pt-6 pb-2 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-1">
              Привет, <span className="meta-gradient-text">{user?.name.split(' ')[0]}</span>
            </h1>
          </div>
          

        </div>
      </div>

      {/* CORE 2-COLUMN GRID (LEFT: PROGRESS & LESSONS, RIGHT: DIET & ROADMAP) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6">
        
        {/* LEFT COLUMN: VISUALIZATIONS, TASKS & ACADEMICS (Col Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* PROGRESS & DIARY MONITORING CARD */}
          <div className="glass-card p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-[60px] pointer-events-none"></div>
            
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-black text-[#0f172a]">Состояние</h3>
              </div>
              <Activity className="w-5 h-5 text-teal-500" />
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">День</span>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="text-xl font-black text-teal-600">
                    {(() => {
                      if (!user?.joinedAt) return 1;
                      const joinedDate = new Date(user.joinedAt);
                      const currentDate = new Date();
                      const start = Date.UTC(joinedDate.getFullYear(), joinedDate.getMonth(), joinedDate.getDate());
                      const current = Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
                      const diffDays = Math.floor((current - start) / (1000 * 60 * 60 * 24)) + 1;
                      const calculated = diffDays > 0 ? diffDays : 1;
                      return Math.min(calculated, 64);
                    })()}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Эмоции</span>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="text-xl font-black text-indigo-500">{averageEmotion}</span>
                  <span className="text-[10px] text-slate-400 font-bold">/10</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Тело</span>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="text-xl font-black text-rose-500">{averageSymptom}</span>
                  <span className="text-[10px] text-slate-400 font-bold">/10</span>
                </div>
              </div>

            </div>

            {/* Diary CTA */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-teal-50/50 p-3.5 rounded-xl border border-teal-100/50">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-700">Каждый день важен для ремиссии</div>
                  <div className="text-[10px] text-slate-500">Фиксируйте самочувствие, чтобы выявить ваш прогресс</div>
                </div>
                <button 
                  onClick={() => setView(ViewState.DIARY)}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-black rounded-lg uppercase tracking-wider transition-all shadow-md shadow-teal-600/15 text-center shrink-0"
                >
                  Заполнить дневник состояния
                </button>
              </div>
            </div>
          </div>

          {/* ACTIONS / TODAY'S TASK LIST */}
          <div className="glass-card p-6 relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-[10px] font-black tracking-widest text-[#a855f7] uppercase">ПЛАН ДЕЙСТВИЙ</span>
                <h3 className="text-xl font-black mt-1 text-white">Рекомендованные задания на сегодня</h3>
              </div>
              <ClipboardList className="w-5 h-5 text-purple-400" />
            </div>
            
            <p className="text-xs text-gray-400 mb-6 font-light leading-relaxed">
              Выполняйте ежедневные задания для закрепления биологической толерантности и нейронных изменений. Каждое действие повышает ваш XP.
            </p>

            <div className="space-y-3">
              
              <div 
                onClick={() => toggleTask('diary')}
                className={`flex gap-4 p-4 rounded-xl border cursor-pointer select-none transition-all duration-300 items-start
                  ${completedTasks.diary 
                    ? 'bg-purple-950/15 border-purple-500/30 text-gray-400' 
                    : 'bg-[#120a2c]/40 border-white/5 text-white hover:border-white/10 hover:bg-[#120a2c]/60'}`}
              >
                <div className="pt-0.5">
                  {completedTasks.diary ? (
                    <CheckCircle2 className="w-5 h-5 text-purple-400" />
                  ) : (
                    <div className="w-5 h-5 rounded-md border border-white/20 hover:border-purple-500 flex items-center justify-center transition-all"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-bold text-xs ${completedTasks.diary ? 'line-through text-gray-500' : ''}`}>Заполнить интерактивный Календарь-Дневник состояния</div>
                  <div className="text-[10px] text-gray-500 font-medium mt-1">Необходимо для фиксации психофизиологической связи и влияния стресса</div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setView(ViewState.DIARY); }}
                  className="px-2.5 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold rounded-lg uppercase tracking-wide shrink-0 ml-2"
                >
                  Перейти
                </button>
              </div>

              <div 
                onClick={() => toggleTask('lesson')}
                className={`flex gap-4 p-4 rounded-xl border cursor-pointer select-none transition-all duration-300 items-start
                  ${completedTasks.lesson 
                    ? 'bg-purple-950/15 border-purple-500/30 text-gray-400' 
                    : 'bg-[#120a2c]/40 border-white/5 text-white hover:border-white/10 hover:bg-[#120a2c]/60'}`}
              >
                <div className="pt-0.5">
                  {completedTasks.lesson ? (
                    <CheckCircle2 className="w-5 h-5 text-purple-400" />
                  ) : (
                    <div className="w-5 h-5 rounded-md border border-white/20 hover:border-purple-500 flex items-center justify-center transition-all"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-bold text-xs ${completedTasks.lesson ? 'line-through text-gray-500' : ''}`}>Пройти текущий обучающий видеоурок этой недели</div>
                  <div className="text-[10px] text-gray-500 font-medium mt-1">Освойте психотехнологию для гашения доминантного очага гистамина</div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setView(ViewState.LESSONS); }}
                  className="px-2.5 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 text-[10px] font-bold rounded-lg uppercase tracking-wide shrink-0 ml-2"
                >
                  Уроки
                </button>
              </div>

              <div 
                onClick={() => toggleTask('breathing')}
                className={`flex gap-4 p-4 rounded-xl border cursor-pointer select-none transition-all duration-300 items-start
                  ${completedTasks.breathing 
                    ? 'bg-purple-950/15 border-purple-500/30 text-gray-400' 
                    : 'bg-[#120a2c]/40 border-white/5 text-white hover:border-white/10 hover:bg-[#120a2c]/60'}`}
              >
                <div className="pt-0.5">
                  {completedTasks.breathing ? (
                    <CheckCircle2 className="w-5 h-5 text-purple-400" />
                  ) : (
                    <div className="w-5 h-5 rounded-md border border-white/20 hover:border-purple-500 flex items-center justify-center transition-all"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-bold text-xs ${completedTasks.breathing ? 'line-through text-gray-500' : ''}`}>Сделать диагностику или обратиться к ИИ-Проводнику</div>
                  <div className="text-[10px] text-gray-500 font-medium mt-1">Задайте вопрос Проводнику для индивидуальной психологической поддержки</div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setView(ViewState.AI_CHAT); }}
                  className="px-2.5 py-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 text-[10px] font-bold rounded-lg uppercase tracking-wide shrink-0 ml-2"
                >
                  Задать вопрос
                </button>
              </div>

            </div>
          </div>

          {/* WEEK'S CURRICULUM CARD */}
          <div className="glass-card p-6 relative overflow-hidden">
            <div className="flex justify-between items-center mb-5">
              <div>
                <span className="text-[10px] font-black tracking-widest text-[#3b82f6] uppercase">КЛЮЧЕВЫЕ МАТЕРИАЛЫ</span>
                <h3 className="text-xl font-black mt-1 text-white">Уроки этой недели</h3>
              </div>
              <BookOpen className="w-5 h-5 text-blue-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weeklyLessons.map((lesson: Lesson) => (
                <div 
                  key={lesson.id} 
                  onClick={() => {
                    if (!lesson.isLocked) {
                      setActiveLesson(lesson.id);
                    }
                  }}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all duration-300 relative overflow-hidden group 
                    ${lesson.isLocked 
                      ? 'bg-[#120a2c]/20 border-white/5 opacity-50 cursor-not-allowed' 
                      : 'bg-[#120a2c]/40 border-white/10 hover:border-purple-500/30 hover:bg-[#120a2c]/60 cursor-pointer'}`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] px-2 py-0.5 bg-purple-500/15 border border-purple-500/20 rounded text-purple-400 font-bold uppercase tracking-wider">
                        Блок {lesson.blockId}
                      </span>
                      <span className="text-[9px] text-gray-500 font-mono font-bold uppercase">{lesson.durationMinutes} минут</span>
                    </div>

                    <h4 className="font-bold text-xs text-white leading-snug group-hover:text-purple-300 transition-colors pt-1">
                      {lesson.title}
                    </h4>
                    <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                      {lesson.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                    {lesson.isCompleted ? (
                      <span className="text-[10px] text-emerald-400 font-black uppercase flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Пройдено
                      </span>
                    ) : lesson.isLocked ? (
                      <span className="text-[10px] text-gray-500 font-bold uppercase">Заблокировано</span>
                    ) : (
                      <span className="text-[10px] text-purple-400 font-black uppercase group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Начать <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-5 text-center">
              <button 
                onClick={() => setView(ViewState.LESSONS)}
                className="text-xs font-black uppercase text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1.5 mx-auto"
              >
                Открыть всю учебную программу <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ROADMAP & DIET (Col Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* ANTI-INFLAMMATORY IMMUNOCHEF RECOMMENDATIONS CARD */}
          <div className="glass-card p-6 relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-[60px] pointer-events-none"></div>
            
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-[10px] font-black tracking-widest text-[#f59e0b] uppercase">ПИТАНИЕ И БИОХИМИЯ</span>
                <h3 className="text-xl font-black mt-1 text-white">Терапевтический рацион</h3>
              </div>
              <ChefHat className="w-5 h-5 text-amber-500" />
            </div>

            <p className="text-xs text-gray-400 mb-5 leading-relaxed font-light">
              Рекомендации и нутрицевтики от <strong>ImmunoChef AI</strong> для снижения выработки гистамина и подавления системных медиаторов воспаления:
            </p>

            <div className="space-y-4">
              {antiInflammatoryRecipes.map((recipe, index) => (
                <div key={index} className="bg-[#120a2c]/50 p-4 border border-white/5 rounded-xl space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[8px] px-2 py-0.5 bg-yellow-400/10 border border-yellow-400/20 text-yellow-500 font-bold uppercase tracking-wider rounded">
                      {recipe.tag}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono font-medium shrink-0">{recipe.time}</span>
                  </div>

                  <h4 className="font-bold text-sm text-yellow-500 leading-tight">
                    {recipe.title}
                  </h4>
                  
                  <p className="text-[11px] text-gray-400 font-light leading-relaxed">
                    {recipe.description}
                  </p>

                  <div className="pt-2">
                    <div className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">Ключевые ингредиенты:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {recipe.ingredients.slice(0, 3).map((ing, i) => (
                        <span key={i} className="text-[9px] px-2 py-0.5 bg-white/5 rounded text-gray-300 font-medium border border-white/5 leading-none">
                          {ing.split(' — ')[0]}
                        </span>
                      ))}
                      {recipe.ingredients.length > 3 && (
                        <span className="text-[9px] text-gray-500 font-bold">+{recipe.ingredients.length - 3} еще</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 text-center">
              <button 
                onClick={() => setView(ViewState.NUTRITION)}
                className="w-full py-2.5 bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 text-amber-500 rounded-xl text-xs font-black uppercase tracking-wider transition-all transform active:scale-95"
              >
                Открыть ImmunoChef AI
              </button>
            </div>
          </div>

          {/* INTERACTIVE CLUB ROADMAP CARD */}
          <div className="glass-card p-6 relative overflow-hidden">
            <div className="flex justify-between items-center mb-5">
              <div>
                <span className="text-[10px] font-black tracking-widest text-[#ec4899] uppercase">КАРТА ПРОЕКТА</span>
                <h3 className="text-xl font-black mt-1 text-white">Дорожная карта AllergyNet</h3>
              </div>
              <Milestone className="w-5 h-5 text-pink-500" />
            </div>

            <p className="text-xs text-gray-400 mb-5 leading-relaxed font-light">
              Целостный концепт нашей немедикаментозной экосистемы. Пройдите все этапы для устойчивого восстановления иммунной регуляции:
            </p>

            <div className="space-y-2">
              {ecosystemRoadmap.map((step, idx) => {
                const isActive = activeRoadmapStep === idx;
                return (
                  <div 
                    key={idx}
                    onClick={() => setActiveRoadmapStep(idx)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left relative overflow-hidden group
                    ${isActive 
                      ? 'bg-[#120a2c] border-purple-500/30 shadow-[0_4px_25px_rgba(168,85,247,0.1)]' 
                      : 'bg-[#120a2c]/30 border-white/5 hover:border-white/10'}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-tr ${step.color} shadow-lg`} />
                        <span className={`text-xs font-bold leading-none ${isActive ? 'text-white' : 'text-gray-300'}`}>
                          {step.title}
                        </span>
                      </div>
                      
                      <span className={`text-[9px] font-mono font-bold uppercase rounded px-1.5 py-0.5 leading-none border
                        ${step.status === 'Изучено' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : ''}
                        ${step.status === 'В процессе' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 animate-pulse' : ''}
                        ${step.status === 'Активно' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' : ''}
                        ${step.status === 'Цель' ? 'bg-pink-500/10 border-pink-500/20 text-pink-400' : ''}
                        ${step.status === 'Открыть' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : ''}
                      `}>
                        {step.status}
                      </span>
                    </div>

                    {isActive && (
                      <div className="mt-3 text-xs text-gray-300 leading-relaxed font-light pl-5 animate-fade-in space-y-1.5">
                        <div className="text-[10px] text-gray-400 uppercase font-mono font-bold tracking-wider">
                          Раздел: {step.tag}
                        </div>
                        <p>{step.desc}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
