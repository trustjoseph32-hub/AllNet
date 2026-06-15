
import React, { useState } from 'react';
import { useStore } from '../services/store';
import { Button } from '../components/Button';
import { Calendar, Plus, Activity, Utensils, AlertTriangle } from 'lucide-react';
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export const Diary: React.FC = () => {
  const { diaryEntries, addDiaryEntry } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  
  // Form State
  const [symptomLevel, setSymptomLevel] = useState(5);
  const [emotionLevel, setEmotionLevel] = useState(5);
  const [diet, setDiet] = useState('');
  const [hasAttacks, setHasAttacks] = useState(false);
  const [attackSeverity, setAttackSeverity] = useState(5);
  const [triggers, setTriggers] = useState('');
  const [emotions, setEmotions] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDiaryEntry({
      date: new Date().toISOString().split('T')[0],
      symptomLevel: symptomLevel,
      emotionLevel: emotionLevel,
      triggers,
      emotions,
      notes,
      diet,
      hasAttacks,
      attackSeverity: hasAttacks ? attackSeverity : undefined
    });
    setIsAdding(false);
    // Reset
    setSymptomLevel(5);
    setEmotionLevel(5);
    setDiet('');
    setHasAttacks(false);
    setAttackSeverity(5);
    setTriggers('');
    setEmotions('');
    setNotes('');
  };

  // Chart Data
  const chartData = diaryEntries.slice(-14).map(e => {
    const d = new Date(e.date);
    const dayStr = d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    return {
      date: dayStr,
      physical: e.symptomLevel,
      emotional: e.emotionLevel,
      attack: e.hasAttacks ? (e.attackSeverity || 5) : 0
    };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Дневник состояния</h1>
        <Button onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Отмена' : <><Plus className="w-4 h-4 mr-2" /> Новая запись</>}
        </Button>
      </div>

      {isAdding && (
        <div className="bg-white rounded-2xl p-6 shadow-md border border-green-100 mb-6">
          <h2 className="text-lg font-semibold mb-4">Записать состояние на сегодня</h2>
          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            
            {/* Physical State Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Физическое состояние (1 — очень плохо / сильные симптомы, 10 — превосходно / симптомов нет)</label>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">Плохо</span>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={symptomLevel} 
                  onChange={(e) => setSymptomLevel(Number(e.target.value))} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
                <span className="text-sm text-gray-400">Отлично</span>
                <span className={`w-10 text-center text-xl font-bold ${symptomLevel < 4 ? 'text-red-500' : symptomLevel < 8 ? 'text-yellow-500' : 'text-teal-600'}`}>
                  {symptomLevel}
                </span>
              </div>
            </div>

            {/* Emotional State Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Эмоциональное состояние (1 — сильный стресс / тревога, 10 — абсолютное спокойствие / гармония)</label>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">Стресс</span>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={emotionLevel} 
                  onChange={(e) => setEmotionLevel(Number(e.target.value))} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <span className="text-sm text-gray-400">Спокоен</span>
                <span className={`w-10 text-center text-xl font-bold ${emotionLevel < 4 ? 'text-red-500' : emotionLevel < 8 ? 'text-yellow-500' : 'text-indigo-600'}`}>
                  {emotionLevel}
                </span>
              </div>
            </div>

            {/* Diet field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-emerald-500" /> Сегодняшний рацион питания
              </label>
              <input 
                type="text" 
                value={diet}
                onChange={(e) => setDiet(e.target.value)}
                placeholder="Что вы сегодня ели? напр., гречка, индейка, огурец..."
                className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Attacks today */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500" /> Были ли сегодня приступы с проявлением симптомов?
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setHasAttacks(true)}
                  className={`px-6 py-2 rounded-lg font-bold text-sm border transition-all ${
                    hasAttacks 
                      ? 'bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-500/25' 
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Да, были
                </button>
                <button
                  type="button"
                  onClick={() => setHasAttacks(false)}
                  className={`px-6 py-2 rounded-lg font-bold text-sm border transition-all ${
                    !hasAttacks 
                      ? 'bg-slate-500 border-slate-500 text-white shadow-md shadow-slate-500/25' 
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Нет, не было
                </button>
              </div>

              {hasAttacks && (
                <div className="mt-4 p-4 bg-rose-50/50 rounded-lg border border-rose-100/60 animate-fade-in space-y-2">
                  <label className="block text-sm font-semibold text-rose-800">
                    Оценка интенсивности приступа по субъективной шкале (1 — очень легкий, 10 — сильный/тяжелый приступ)
                  </label>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-rose-600 font-medium">Легкий</span>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={attackSeverity} 
                      onChange={(e) => setAttackSeverity(Number(e.target.value))} 
                      className="w-full h-2 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                    />
                    <span className="text-xs text-rose-600 font-medium">Тяжелый</span>
                    <span className="w-10 text-center text-lg font-black text-rose-600">
                      {attackSeverity}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Возможные триггеры</label>
                <input 
                  type="text" 
                  value={triggers}
                  onChange={(e) => setTriggers(e.target.value)}
                  placeholder="напр., Пыль, Шерсть, Стресс или Нет"
                  className="w-full p-2 rounded-lg border border-gray-300 focus:ring-teal-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Преобладающие эмоции</label>
                <input 
                  type="text" 
                  value={emotions}
                  onChange={(e) => setEmotions(e.target.value)}
                  placeholder="напр., Спокойствие, Решимость, Ожидание"
                  className="w-full p-2 rounded-lg border border-gray-300 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Заметки / Инсайты за день</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Контекст того, как прошел день, психологические наблюдения..."
                className="w-full p-2 rounded-lg border border-gray-300 focus:ring-teal-500"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit">Сохранить запись</Button>
            </div>
          </form>
        </div>
      )}

      {/* Correlation Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">Динамика оздоровления и корреляция приступов</h3>
          <p className="text-xs text-slate-500 mt-1">
            График наглядно отражает взаимосвязь: при росте эмоционального баланса и физического состояния (линии вверх), частота и тяжесть приступов аллергии снижаются до полного исчезновения (красные столбцы).
          </p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
               <CartesianGrid stroke="#f1f5f9" vertical={false} />
               <XAxis dataKey="date" tick={{fontSize: 11, fill: '#64748b'}} tickLine={false} />
               <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tick={{fontSize: 11, fill: '#64748b'}} tickLine={false} axisLine={false} />
               <Tooltip 
                 contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e1e8f0', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
                 labelStyle={{ fontWeight: 'bold', color: '#1e293b', fontSize: '12px' }}
                 itemStyle={{ fontSize: '12px', padding: '1px 0' }}
               />
               <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
               <Bar name="Интенсивность приступа" dataKey="attack" fill="#f43f5e" barSize={16} radius={[4, 4, 0, 0]} opacity={0.8} />
               <Line name="Физическое состояние (1-10)" type="monotone" dataKey="physical" stroke="#0d9488" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
               <Line name="Эмоциональное состояние (1-10)" type="monotone" dataKey="emotional" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* History List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-700">Недавние записи</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {[...diaryEntries].reverse().map((entry) => (
            <div key={entry.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start gap-4 flex-col sm:flex-row">
                <div className="flex-1 space-y-1.5">
                  <div className="font-medium text-gray-900">{new Date(entry.date).toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Триггеры:</span> {entry.triggers} • <span className="font-medium">Эмоции:</span> {entry.emotions}
                  </div>

                  {entry.diet && (
                    <div className="text-sm text-gray-600 flex items-start gap-1">
                      <span className="font-bold text-xs uppercase tracking-wider text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-100">Рацион:</span>
                      <span className="text-slate-700 italic">{entry.diet}</span>
                    </div>
                  )}

                  {entry.hasAttacks !== undefined && (
                    <div className="text-sm flex items-center gap-2">
                      <span className="font-medium text-slate-500">Приступы сегодня:</span>
                      {entry.hasAttacks ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-550 bg-rose-50 text-rose-750 text-rose-700 border border-rose-100 shadow-sm">
                          Да, интенсивность: {entry.attackSeverity || 5}/10
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          Нет
                        </span>
                      )}
                    </div>
                  )}

                  {entry.notes && <p className="mt-2 text-sm text-gray-500 italic border-l-2 border-slate-200 pl-2">"{entry.notes}"</p>}
                </div>
                <div className="flex gap-4 self-end sm:self-center shrink-0">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider">Физика</span>
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-1 shadow-sm
                      ${entry.symptomLevel < 4 ? 'bg-red-50 text-red-700 border border-red-200' : entry.symptomLevel < 8 ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 'bg-teal-50 text-teal-700 border border-teal-250 border-teal-200'}
                    `}>
                      {entry.symptomLevel}
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider">Психика</span>
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-1 shadow-sm
                      ${entry.emotionLevel < 4 ? 'bg-red-50 text-red-700 border border-red-200' : entry.emotionLevel < 8 ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'}
                    `}>
                      {entry.emotionLevel}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};