
import React from 'react';
import { Lesson } from '../types';
import { Lock, CheckCircle, PlayCircle, Clock } from 'lucide-react';
import { useStore } from '../services/store';

interface LessonCardProps {
  lesson: Lesson;
  onClick: () => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({ lesson, onClick }) => {
  const { isLessonLocked } = useStore();
  const lockStatus = isLessonLocked(lesson);

  return (
    <div 
      onClick={() => onClick()}
      className={`
        relative p-4 rounded-xl border transition-all duration-200
        ${lockStatus.locked 
          ? 'bg-gray-50 border-gray-200 opacity-80' 
          : 'bg-white border-gray-200 hover:border-green-500 hover:shadow-md cursor-pointer'
        }
      `}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">
              Урок {lesson.id}
            </span>
            {lesson.isCompleted && <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs">Завершено</span>}
            {lesson.weekNumber && <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-xs">Неделя {lesson.weekNumber}</span>}
          </div>
          <h3 className={`font-semibold text-lg mb-1 ${lockStatus.locked ? 'text-gray-500' : 'text-gray-900'}`}>
            {lesson.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {lesson.description}
          </p>
        </div>
        <div className="ml-4 mt-1">
          {lockStatus.locked ? (
            lockStatus.reason === 'drip' ? (
              <div className="flex flex-col items-center text-indigo-500">
                 <Clock className="w-5 h-5" />
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
            )
          ) : lesson.isCompleted ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <PlayCircle className="w-6 h-6 text-green-500" />
          )}
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>{lesson.durationMinutes} мин</span>
        {lockStatus.locked && lockStatus.reason === 'drip' && (
          <span className="text-indigo-600 font-medium">Доступно с: {lockStatus.unlockDate}</span>
        )}
        {lockStatus.locked && lockStatus.reason === 'purchase' && (
           <span className="text-blue-600 font-medium uppercase">Требуется покупка</span>
        )}
      </div>
    </div>
  );
};
