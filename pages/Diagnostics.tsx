
import React, { useState } from 'react';
import { useStore } from '../services/store';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { CheckCircle, FileText, ArrowRight, ArrowLeft, Mic, MicOff } from 'lucide-react';
import { ANAMNESIS_QUESTIONS_BY_SUBROLE, TEST_QUESTIONS } from '../constants';

export const Diagnostics: React.FC = () => {
  const { 
    user,
    usersList,
    diagnostics, 
    saveAnamnesisAnswer, 
    nextAnamnesisStep, 
    prevAnamnesisStep, 
    submitTestAnswer, 
    finishDiagnostics 
  } = useStore();

  const [isRecording, setIsRecording] = useState(false);

  // STAGE 2: Anamnesis Wizard
  if (diagnostics.stage === 'ANAMNESIS') {
    const viewingUser = diagnostics.viewingUserId ? usersList.find(u => u.id === diagnostics.viewingUserId) || user : user;
    const subRole = viewingUser?.subRole || 'none';
    const anamnesisQuestions = ANAMNESIS_QUESTIONS_BY_SUBROLE[subRole] || ANAMNESIS_QUESTIONS_BY_SUBROLE['none'];
    
    const currentQ = anamnesisQuestions[diagnostics.currentAnamnesisIndex];
    const currentAns = diagnostics.anamnesisAnswers[diagnostics.currentAnamnesisIndex]?.text || '';
    
    return (
      <div className="max-w-2xl mx-auto py-6 animate-fade-in">
        {/* Progress Header */}
        <div className="mb-8">
           <div className="flex justify-between items-center mb-2">
             <h2 className="text-lg font-bold text-gray-900">Сбор Анамнеза</h2>
             <span className="text-sm text-gray-500 font-medium">Вопрос {diagnostics.currentAnamnesisIndex + 1} из {anamnesisQuestions.length}</span>
           </div>
           <ProgressBar current={diagnostics.currentAnamnesisIndex + 1} max={anamnesisQuestions.length} colorClass="bg-blue-500" />
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col min-h-[400px]">
          {/* Header Instruction */}
          <div className="bg-blue-50 border-b border-blue-100 px-6 py-3 flex items-center gap-2 text-blue-700 text-sm font-medium">
            <span>⏱️</span> Выполняется: 2-3 минуты
          </div>

          <div className="p-8 flex-1">
             <h3 className="text-xl font-medium text-gray-800 mb-6 leading-relaxed">
               {currentQ}
             </h3>
             
             <div className="relative">
               <textarea
                 className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[150px] resize-none text-base"
                 placeholder="Напишите ваш ответ здесь..."
                 value={currentAns}
                 onChange={(e) => saveAnamnesisAnswer(e.target.value, 'text')}
               />
               
               {/* Mock Audio Button */}
               <button 
                 onClick={() => {
                    setIsRecording(!isRecording);
                    if (!isRecording) {
                      // Mock text input from "voice"
                      setTimeout(() => {
                        saveAnamnesisAnswer(currentAns + (currentAns ? ' ' : '') + " [Аудиозапись 0:35]", 'audio');
                        setIsRecording(false);
                      }, 1500);
                    }
                 }}
                 className={`absolute bottom-3 right-3 p-2 rounded-full transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                 title="Записать аудио"
               >
                 {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
               </button>
             </div>
             
             {isRecording && <p className="text-xs text-red-500 mt-2 font-medium">Идет запись... (говорите)</p>}
          </div>

          {/* Navigation Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
             <Button 
               variant="secondary" 
               onClick={prevAnamnesisStep} 
               disabled={diagnostics.currentAnamnesisIndex === 0}
               className="flex items-center gap-2"
             >
               <ArrowLeft className="w-4 h-4" /> Назад
             </Button>

             <div className="flex gap-2">
                <Button 
                  onClick={nextAnamnesisStep}
                  disabled={!currentAns.trim()} 
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  {diagnostics.currentAnamnesisIndex === anamnesisQuestions.length - 1 ? 'Перейти к Тесту' : 'Далее'} 
                  {diagnostics.currentAnamnesisIndex !== anamnesisQuestions.length - 1 && <ArrowRight className="w-4 h-4" />}
                </Button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // STAGE 3: Test (120 questions)
  if (diagnostics.stage === 'TEST') {
    const questionText = TEST_QUESTIONS[diagnostics.currentQuestionIndex];
    const totalQuestions = TEST_QUESTIONS.length;

    if (diagnostics.currentQuestionIndex >= totalQuestions) {
       return (
         <div className="text-center py-20 animate-fade-in">
           <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
           <h2 className="text-3xl font-bold text-gray-900 mb-2">Поздравляем!</h2>
           <p className="text-gray-500 mb-8 text-lg">Вы прошли оба этапа диагностики. <br/>Данные обрабатываются...</p>
           <Button size="lg" onClick={finishDiagnostics}>Показать мой профиль</Button>
         </div>
       )
    }

    return (
      <div className="max-w-2xl mx-auto py-10 animate-fade-in">
        <div className="mb-8">
           <div className="flex justify-between text-sm text-gray-500 mb-2 font-medium">
             <span>Этап 2: Тест • Вопрос {diagnostics.currentQuestionIndex + 1} из {totalQuestions}</span>
             <span>{Math.round(((diagnostics.currentQuestionIndex) / totalQuestions) * 100)}%</span>
           </div>
           <ProgressBar current={diagnostics.currentQuestionIndex} max={totalQuestions} colorClass="bg-green-500" />
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center min-h-[400px] flex flex-col justify-center">
           <h3 className="text-2xl font-medium text-gray-800 mb-10 leading-relaxed">{questionText}</h3>
           
           <div className="grid grid-cols-1 gap-3">
             {[1, 2, 3, 4, 5].map(val => (
               <button
                 key={val}
                 onClick={() => submitTestAnswer(diagnostics.currentQuestionIndex, val)}
                 className="p-4 rounded-xl border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all text-left flex items-center gap-4 group"
               >
                 <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-lg group-hover:bg-green-500 group-hover:text-white transition-colors shrink-0">
                   {val}
                 </div>
                 <span className="text-gray-700 font-medium text-lg">
                   {val === 1 ? 'Совсем не согласен' :
                    val === 2 ? 'Скорее не согласен' :
                    val === 3 ? 'Нейтрально' :
                    val === 4 ? 'Скорее согласен' : 'Полностью согласен'}
                 </span>
               </button>
             ))}
           </div>
        </div>
      </div>
    );
  }

  // STAGE 4: Results
  if (diagnostics.stage === 'RESULTS') {
    return (
      <div className="max-w-4xl mx-auto py-8 animate-fade-in">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-green-100 mb-8 text-center">
           <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
             <FileText className="w-10 h-10 text-green-600" />
           </div>
           <h1 className="text-3xl font-bold text-gray-900 mb-2">Ваш диагностический профиль готов</h1>
           <p className="text-gray-500 mb-6 max-w-lg mx-auto">Мы проанализировали анамнез и 120 ответов теста. Выявлены ключевые психосоматические взаимосвязи.</p>
           
           <div className="flex justify-center gap-4">
             <Button onClick={() => alert('Запрос на скачивание PDF отправлен в n8n')}>
               Скачать PDF отчет
             </Button>
             <Button variant="outline" onClick={() => alert('Отправлено на email')}>
               Отправить на Email
             </Button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mock Result Blocks */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
             <h3 className="font-bold text-gray-900 mb-4">Ключевые зоны напряжения</h3>
             <div className="space-y-4">
               <div>
                 <div className="flex justify-between mb-1">
                   <span className="text-sm font-medium text-gray-700">Тревожность</span>
                   <span className="text-sm font-bold text-red-500">Высокий (4.2)</span>
                 </div>
                 <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-red-500 h-2 rounded-full" style={{width: '84%'}}></div></div>
               </div>
               <div>
                 <div className="flex justify-between mb-1">
                   <span className="text-sm font-medium text-gray-700">Подавленный гнев</span>
                   <span className="text-sm font-bold text-indigo-500">Средний (3.5)</span>
                 </div>
                 <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-indigo-500 h-2 rounded-full" style={{width: '70%'}}></div></div>
               </div>
             </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
             <h3 className="font-bold text-gray-900 mb-4">Рекомендации ИИ-Терапевта</h3>
             <ul className="space-y-3 text-sm text-gray-600">
               <li className="flex gap-2 items-start">
                 <ArrowRight className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                 <span>Использовать технику "STOP-фраза" для работы с границами.</span>
               </li>
               <li className="flex gap-2 items-start">
                 <ArrowRight className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                 <span>Внедрить ежедневную практику дыхания 4-7-8 для снижения тревоги.</span>
               </li>
               <li className="flex gap-2 items-start">
                 <ArrowRight className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                 <span>Проработать блок "Вторичные выгоды" в Уроке 8.</span>
               </li>
             </ul>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
