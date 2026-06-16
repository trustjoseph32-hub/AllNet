
import React, { useState } from 'react';
import { useStore } from '../services/store';
import { Soup, Sparkles, ChefHat, Info, CheckCircle2, AlertCircle, ShoppingCart, RefreshCw, Flame } from 'lucide-react';
import { Button } from '../components/Button';
import { GoogleGenAI } from "@google/genai";

export const Nutritionist: React.FC = () => {
  const { user, diaryEntries } = useStore();
  const [selectedFocus, setSelectedFocus] = useState<'detox' | 'skin' | 'energy' | 'digest'>('skin');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any | null>(null);

  const generateMenuWithAI = async () => {
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Формируем контекст из последних записей дневника
      const recentSymptoms = diaryEntries.slice(-3).map(e => e.triggers).join(', ');
      
      const prompt = `
        Действуй как ИИ-Нутрициолог курса AllergyNet. 
        Цель: Создать антивоспалительное меню на 1 день.
        Фокус: ${selectedFocus === 'skin' ? 'Здоровье кожи и низкий гистамин' : selectedFocus}.
        Контекст пользователя: Аллергия, недавние триггеры: ${recentSymptoms || 'не указаны'}.
        
        Верни JSON с полями:
        - breakfast (title, components[], why)
        - lunch (title, components[], why)
        - dinner (title, components[], why)
        - shoppingList (string[])
        - expertTip (короткий совет дня)
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { 
          responseMimeType: "application/json"
        }
      });

      const data = JSON.parse(response.text || '{}');
      setGeneratedPlan(data);
    } catch (error) {
      console.error("AI Generation failed", error);
      // Fallback на статику при ошибке
      setGeneratedPlan({
        breakfast: { title: "Зеленая гречка с авокадо", components: ["Пророщенная гречка", "Авокадо"], why: "Низкий гликемический индекс" },
        lunch: { title: "Суп из запеченной тыквы", components: ["Тыква", "Имбирь"], why: "Бета-каротин для восстановления кожи" },
        dinner: { title: "Белая рыба на пару", components: ["Треска", "Брокколи"], why: "Легкий белок, не перегружающий печень" },
        shoppingList: ["Тыква", "Гречка зеленая", "Треска", "Авокадо", "Брокколи"],
        expertTip: "Пейте теплую воду с лимоном за 20 минут до еды."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3 h-3" /> ImmunoChef AI v2.0
          </div>
          <h1 className="text-3xl font-bold mb-3">Биологическая поддержка</h1>
          <p className="text-emerald-50 opacity-90 max-w-xl">
            Пока мы работаем с психикой, ИИ-Нутрициолог помогает вашему телу снизить уровень гистамина и системного воспаления.
          </p>
        </div>
        <ChefHat className="absolute -bottom-6 -right-6 w-48 h-48 text-white/10 -rotate-12" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Settings */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Flame className="w-4 h-4 text-indigo-500" /> Фокус рациона
            </h3>
            <div className="space-y-2">
              {[
                { id: 'skin', label: 'Чистая кожа', desc: 'Протокол при дерматитах' },
                { id: 'detox', label: 'Глубокий Детокс', desc: 'Поддержка печени и почек' },
                { id: 'energy', label: 'Энергия+', desc: 'Без скачков инсулина' },
                { id: 'digest', label: 'Заживление', desc: 'Слизистая кишечника (LGS)' }
              ].map((focus) => (
                <button
                  key={focus.id}
                  onClick={() => setSelectedFocus(focus.id as any)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedFocus === focus.id 
                    ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/10' 
                    : 'border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <div className={`font-bold text-sm ${selectedFocus === focus.id ? 'text-emerald-700' : 'text-gray-700'}`}>
                    {focus.label}
                  </div>
                  <div className="text-xs text-gray-500">{focus.desc}</div>
                </button>
              ))}
            </div>
            <Button 
              className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 py-4 shadow-lg shadow-emerald-200"
              onClick={generateMenuWithAI}
              isLoading={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Сформировать рацион
            </Button>
          </div>

          <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
             <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0" />
                <p className="text-xs text-indigo-700 leading-relaxed">
                  ИИ учитывает ваши триггеры из дневника: <strong>{diaryEntries.slice(-1)[0]?.triggers || 'не обнаружены'}</strong>.
                </p>
             </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-8">
          {!generatedPlan && !isLoading ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl h-full flex flex-col items-center justify-center p-12 text-center">
               <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Soup className="w-10 h-10 text-gray-300" />
               </div>
               <p className="text-gray-500 font-medium">Ваше антивоспалительное меню<br/>появится здесь после генерации</p>
            </div>
          ) : isLoading ? (
            <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm flex flex-col items-center justify-center h-full min-h-[400px]">
               <div className="relative mb-6">
                  <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-emerald-400" />
               </div>
               <p className="text-emerald-800 font-bold text-lg">Gemini подбирает нутриенты...</p>
               <p className="text-gray-400 text-sm mt-2">Анализируем совместимость продуктов с вашим типом аллергии</p>
            </div>
          ) : (
            <div className="space-y-6">
               {/* Daily Meals */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <MealCard type="Завтрак" data={generatedPlan.breakfast} icon="🍳" color="bg-indigo-50" text="text-indigo-700" />
                  <MealCard type="Обед" data={generatedPlan.lunch} icon="🥗" color="bg-emerald-50" text="text-emerald-700" />
                  <MealCard type="Ужин" data={generatedPlan.dinner} icon="🍲" color="bg-blue-50" text="text-blue-700" />
               </div>

               {/* Shopping & Tips */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-emerald-500" /> Список покупок
                    </h3>
                    <div className="flex flex-wrap gap-2">
                       {generatedPlan.shoppingList?.map((item: string, i: number) => (
                         <span key={i} className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-600 border border-gray-200">
                           {item}
                         </span>
                       ))}
                    </div>
                  </div>

                  <div className="bg-emerald-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                      <h3 className="font-bold mb-2 flex items-center gap-2">
                        <Info className="w-4 h-4 text-emerald-300" /> Совет куратора
                      </h3>
                      <p className="text-sm text-emerald-100 italic">
                        "{generatedPlan.expertTip}"
                      </p>
                    </div>
                    <Sparkles className="absolute top-2 right-2 w-12 h-12 text-white/10" />
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MealCard = ({ type, data, icon, color, text }: any) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-emerald-200 transition-all group overflow-hidden">
    <div className={`h-1 ${color}`}></div>
    <div className="p-5">
      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform inline-block">{icon}</div>
      <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${text}`}>{type}</div>
      <h4 className="font-bold text-gray-900 mb-2 leading-tight">{data.title}</h4>
      <p className="text-[10px] text-gray-400 mb-3 line-clamp-2">{data.why}</p>
      <div className="space-y-1">
        {data.components?.map((c: string, i: number) => (
          <div key={i} className="text-[11px] text-gray-500 flex items-center gap-2">
             <CheckCircle2 className="w-3 h-3 text-emerald-500" />
             {c}
          </div>
        ))}
      </div>
    </div>
  </div>
);
