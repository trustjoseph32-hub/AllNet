import React, { useState } from 'react';
import { useStore } from '../services/store';
import { ViewState, Lesson } from '../types';
import { Button } from '../components/Button';
import { 
  ArrowLeft, CheckCircle, Play, FileText, Stethoscope, Lock, 
  Calendar, Clock, Sparkles, BookOpen, AlertCircle, ChevronRight, CheckCircle2
} from 'lucide-react';

export const LessonView: React.FC = () => {
  const { 
    view, 
    lessons, 
    activeLessonId, 
    setView, 
    setActiveLesson, 
    markBlockComplete, 
    isLessonLocked,
    user 
  } = useStore();

  // Highlight week selection tab inside Lesson page
  const [selectedWeek, setSelectedWeek] = useState<number>(1);

  if (!user) return null;

  // Calculate current week of user based on joined date
  const getDaysSinceJoining = () => {
    const joined = new Date(user.joinedAt || Date.now());
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - joined.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysSinceJoining = getDaysSinceJoining();
  const userCurrentWeek = Math.min(4, Math.max(1, Math.ceil(daysSinceJoining / 7)));

  // Group lessons by weekNumber
  const getLessonsForWeek = (week: number) => {
    return lessons.filter(l => l.weekNumber === week || (!l.weekNumber && week === 1));
  };

  const completedLessonsCount = lessons.filter(l => l.isCompleted).length;
  const totalLessonsCount = lessons.length;

  // LIST OF LESSONS BY WEEK VIEW
  if (view === ViewState.LESSONS) {
    return (
      <div className="space-y-8 animate-fade-in text-white pb-20">
        
        {/* Weekly Header Banner */}
        <div className="relative glass-card p-6 md:p-8 overflow-hidden rounded-3xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-[0.25em] mb-2.5">
                <Sparkles className="w-4.5 h-4.5 animate-pulse" /> Расписание уроков AllergyNet
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">Терапевтическая Программа</h1>
              <p className="text-gray-400 text-sm mt-1 max-w-xl font-light leading-relaxed">
                Пошаговый календарь уроков и психотехник, запускающих механизм десенсибилизации и восстановления вегетативной стабильности.
              </p>
            </div>

            <div className="bg-[#120a2c] border border-white/10 px-5 py-3.5 rounded-2xl shrink-0 min-w-[200px] text-center md:text-right">
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-1">ОБЩИЙ ПРОГРЕСС КУРСА</span>
              <span className="text-2xl font-black text-purple-400">{completedLessonsCount} / {totalLessonsCount}</span>
              <span className="text-xs text-gray-400 font-bold ml-1.5 font-mono">завершено</span>
              <div className="w-full bg-white/5 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${totalLessonsCount > 0 ? (completedLessonsCount / totalLessonsCount) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-WEEK CALENDAR / SCHEDULE SELECTION TABS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((week) => {
            const isSelected = selectedWeek === week;
            const isUserWeek = userCurrentWeek === week;
            const isLocked = week > userCurrentWeek && user.role !== 'admin' && user.role !== 'super_admin';

            return (
              <button
                key={week}
                onClick={() => setSelectedWeek(week)}
                className={`p-4 rounded-2xl border transition-all relative overflow-hidden group select-none text-left
                  ${isSelected 
                    ? 'bg-purple-950/20 border-purple-500/50 shadow-[0_4px_25px_rgba(168,85,247,0.1)]' 
                    : 'bg-[#120a2c]/50 border-white/10 hover:border-white/20'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs font-black uppercase tracking-widest ${isSelected ? 'text-purple-400' : 'text-gray-400'}`}>
                    Неделя {week}
                  </span>
                  {isUserWeek && (
                    <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded text-[9px] font-black uppercase tracking-wider">
                      Текущая
                    </span>
                  )}
                  {isLocked && (
                    <Lock className="w-3.5 h-3.5 text-gray-600" />
                  )}
                </div>

                <h4 className="font-extrabold text-sm text-white group-hover:text-purple-300 transition-colors">
                  {week === 1 && "Диагностика и Код"}
                  {week === 2 && "Стирание Триггеров"}
                  {week === 3 && "Границы и Иммунитет"}
                  {week === 4 && "Полная Ремиссия"}
                </h4>

                <p className="text-[10px] text-gray-400 font-medium leading-relaxed mt-1.5 transition-colors group-hover:text-gray-300">
                  {week === 1 && "Выявление эмоциональных причин симптомов."}
                  {week === 2 && "Очистка памяти от сенсорных паттернов."}
                  {week === 3 && "Восстановление барьеров на коже и бронхах."}
                  {week === 4 && "Финальная интеграция всех систем."}
                </p>
                
                {isSelected && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* LESSONS CONTAINER FOR SELECTED WEEK */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-black uppercase tracking-tight">Расписание занятий: Неделя {selectedWeek}</h3>
          </div>

          <div className="grid gap-4">
            {getLessonsForWeek(selectedWeek).map((lesson) => {
              const lockStatus = isLessonLocked(lesson);
              const isLocked = lockStatus.locked;

              return (
                <div 
                  key={lesson.id}
                  onClick={() => {
                    if (!isLocked) {
                      setActiveLesson(lesson.id);
                    }
                  }}
                  className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group 
                    ${isLocked 
                      ? 'bg-white/[0.02] border-white/5 opacity-60 cursor-not-allowed' 
                      : 'bg-[#120a2c]/40 border-white/10 hover:border-purple-500/30 hover:bg-[#120a2c]/60 cursor-pointer'}`}
                >
                  {/* Lock glow element */}
                  {!isLocked && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  )}

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                    <div className="space-y-1.5 flex-1 select-none">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[9px] px-2 py-0.5 bg-purple-500/15 border border-purple-500/20 rounded text-purple-400 font-bold uppercase tracking-wider">
                          Урок {lesson.id + 1}
                        </span>
                        
                        {lesson.isCompleted && (
                          <span className="text-[9px] px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/20 rounded text-emerald-400 font-black uppercase tracking-wider flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Пройдено
                          </span>
                        )}

                        {isLocked && lockStatus.reason === 'drip' && (
                          <span className="text-[9px] px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-amber-500 font-bold uppercase tracking-wider flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Доступно {lockStatus.unlockDate}
                          </span>
                        )}

                        {isLocked && lockStatus.reason === 'purchase' && (
                          <span className="text-[9px] px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Требуется терапевтический доступ
                          </span>
                        )}
                      </div>

                      <h4 className={`font-black text-lg transition-colors 
                        ${isLocked ? 'text-gray-500' : 'text-white group-hover:text-purple-300'}`}>
                        {lesson.title}
                      </h4>

                      <p className="text-gray-400 text-xs font-light leading-relaxed max-w-2xl">
                        {lesson.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 mt-2 md:mt-0 select-none">
                      <div className="text-right hidden sm:block">
                        <span className="text-[10px] text-gray-500 font-black block uppercase tracking-wider">ДЛИТЕЛЬНОСТЬ</span>
                        <span className="text-xs font-bold text-gray-300 font-mono">{lesson.durationMinutes} минут</span>
                      </div>

                      <div className="h-4 w-px bg-white/10 hidden sm:block"></div>

                      <div>
                        {isLocked ? (
                          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center text-gray-500">
                            <Lock className="w-4 h-4" />
                          </div>
                        ) : lesson.isCompleted ? (
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <CheckCircle className="w-5 h-5" />
                          </div>
                        ) : (
                          <button className="w-10 h-10 rounded-xl bg-purple-600 hover:bg-purple-500 flex items-center justify-center text-white shadow-lg shadow-purple-900/30 transform active:scale-95 transition-all">
                            <Play className="w-4.5 h-4.5 fill-current ml-0.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {getLessonsForWeek(selectedWeek).length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-white/10 rounded-3xl space-y-4">
                <AlertCircle className="w-10 h-10 text-gray-500" />
                <div className="space-y-1">
                  <p className="font-extrabold text-base text-gray-400">В процессе наполнения</p>
                  <p className="text-xs text-gray-500 max-w-sm mt-1 leading-normal">
                    Кураторы и специалисты AllergyNet наполняют этот блок новыми видеоуроками и инструкциями.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    );
  }

  // INDIVIDUAL LESSON CONTENT / DETAIL VIEW
  const lesson = lessons.find(l => l.id === activeLessonId);
  if (!lesson) return <div className="text-white text-center py-20 font-bold">Урок не найден</div>;

  const handleMarkComplete = (blockId: string) => {
    markBlockComplete(lesson.id, blockId);
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in pb-30 text-white">
      
      {/* Back to schedule list link */}
      <button 
        onClick={() => setView(ViewState.LESSONS)}
        className="mb-6 flex items-center gap-2 text-xs font-black uppercase text-purple-400 hover:text-purple-300 transition-colors select-none tracking-wider"
      >
        <ArrowLeft className="w-4 h-4" /> Назад к расписанию
      </button>

      {/* Lesson Banner Card */}
      <div className="relative glass-card p-6 md:p-8 overflow-hidden rounded-3xl mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[70px] pointer-events-none"></div>
        
        <span className="text-[9px] px-2 py-0.5 bg-purple-500/15 border border-purple-500/20 rounded text-purple-400 font-bold uppercase tracking-widest leading-none">
          УРОК {lesson.id + 1}
        </span>
        <h1 className="text-3xl font-black text-white mt-3 leading-tight">{lesson.title}</h1>
        <p className="text-gray-400 text-sm mt-2 font-light leading-relaxed">{lesson.description}</p>
      </div>

      {/* Lesson Blocks Progress Accordion */}
      <div className="space-y-6">
        {lesson.blocks.map((block, index) => {
          const isCompleted = lesson.completedBlockIds.includes(block.id);
          const isDiagnosticsBlock = block.id === 'l0-b3' || block.title.includes('диагностика') || block.title.includes('Диагностический');

          return (
            <div 
              key={block.id} 
              className={`glass-card overflow-hidden transition-all duration-300 border
                ${isCompleted ? 'border-emerald-500/25 shadow-[0_4px_25px_rgba(16,185,129,0.03)]' : 'border-white/10'}`}
            >
              {/* Accordion / Block Header */}
              <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                <div className="flex items-center gap-3.5 select-none">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold border transition-all
                    ${isCompleted 
                      ? 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400' 
                      : 'bg-white/5 border-white/10 text-gray-400'}`}>
                    {index + 1}
                  </div>
                  <span className="font-bold text-sm tracking-wide text-gray-200">{block.title}</span>
                </div>
                {isCompleted && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
              </div>

              {/* Accordion / Block Content */}
              <div className="p-6 space-y-6">
                
                {/* Embedded Video Player Concept */}
                {block.type === 'video' && block.coverUrl && (
                  <div className="rounded-2xl overflow-hidden bg-black aspect-video relative group border border-white/5 shadow-2xl">
                    <img src={block.coverUrl} className="w-full h-full object-cover opacity-60 group-hover:scale-[1.02] transition-transform duration-500" alt="Video cover" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="w-16 h-16 bg-purple-600/90 hover:bg-purple-500 hover:scale-110 shadow-xl shadow-purple-900/40 rounded-full flex items-center justify-center transition-all duration-300">
                        <Play className="w-6 h-6 text-white fill-current ml-1" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Block Content Body */}
                <div className="text-gray-300 text-sm font-light leading-relaxed whitespace-pre-wrap">
                  {block.content}
                </div>

                {/* Assignment input area */}
                {block.hasAssignment && !isDiagnosticsBlock && (
                  <div className="bg-[#120a2c]/50 rounded-xl p-5 border border-purple-500/15">
                    <h4 className="font-extrabold text-xs text-purple-400 hover:text-purple-300 uppercase tracking-widest mb-3.5 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Ваше Практическое Задание
                    </h4>
                    <p className="text-xs text-gray-300 mb-4 leading-relaxed font-light">{block.assignmentDescription}</p>
                    <textarea 
                      className="w-full p-4 rounded-xl bg-[#070311] text-white border border-white/10 focus:border-purple-500/50 outline-none text-xs leading-relaxed font-light transition-all placeholder:text-gray-600"
                      rows={4}
                      placeholder="Напишите здесь ваши наблюдения, чувства или биологический ответ..."
                      defaultValue={block.userAnswer}
                    />
                  </div>
                )}

                {/* Specialized Diagnostics block redirection button */}
                {isDiagnosticsBlock && (
                  <div className="mt-6 flex justify-center">
                    <button 
                      onClick={() => {
                        setView(ViewState.DIAGNOSTICS);
                        if (!isCompleted) handleMarkComplete(block.id); 
                      }}
                      className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transform active:scale-95 transition-all shadow-xl shadow-purple-900/30"
                    >
                      <Stethoscope className="w-4 h-4" /> Начать Диагностику куратора
                    </button>
                  </div>
                )}

                {/* Completion Action button */}
                {!isCompleted && !isDiagnosticsBlock && (
                  <button 
                    onClick={() => handleMarkComplete(block.id)}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-black uppercase tracking-wider rounded-xl transition-all select-none hover:border-purple-500/30 active:scale-98"
                  >
                    Отметить раздел как пройденный
                  </button>
                )}

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
