
import React, { useState } from 'react';
import { useStore } from '../services/store';
import { Button } from '../components/Button';
import { Mail, Lock, User, ArrowRight, Sparkles, ShieldCheck, Heart, Zap, Apple, Flower2, Cat } from 'lucide-react';

const BrandingHeader: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`flex flex-col items-center lg:items-start ${className}`}>
    <div className="flex gap-6 mb-4">
      <div className="animate-float-1 w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center shadow-sm border border-red-100/50">
        <Apple className="w-7 h-7 text-red-300" />
      </div>
      <div className="animate-float-2 w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center shadow-sm border border-yellow-100/50">
        <Flower2 className="w-7 h-7 text-yellow-400" />
      </div>
      <div className="animate-float-3 w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center shadow-sm border border-blue-100/50">
        <Cat className="w-7 h-7 text-blue-300" />
      </div>
    </div>
    <div className="text-3xl font-black text-gray-900 tracking-tight mb-2">AllergyNet</div>
  </div>
);

export const Auth: React.FC = () => {
  const { login, register } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!name) throw new Error('Пожалуйста, введите имя');
        await register(name, email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка. Попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-50 overflow-hidden font-sans">
      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-200/40 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-200/30 rounded-full blur-[150px]"></div>
      </div>

      {/* Left Side: Brand Content (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center px-16 bg-white border-r border-gray-100 overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <BrandingHeader className="mb-6" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider mb-8 border border-green-100">
            <Sparkles className="w-3 h-3" /> Новое поколение терапии
          </div>
          
          <h1 className="text-5xl font-black text-gray-900 leading-tight mb-6">
            Ваш путь к <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">жизни без аллергии</span> начинается здесь.
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Курс по работе с психологической причиной аллергии, дерматитов и астмы. Здесь объединились наука и психология.
          </p>

          <div className="space-y-6">
            <FeatureItem 
              icon={<ShieldCheck className="w-5 h-5 text-white" />} 
              bgColor="bg-green-500" 
              title="Безопасная методика" 
              desc="Основано на КПТ и доказательной психотерапии" 
            />
            <FeatureItem 
              icon={<Zap className="w-5 h-5 text-white" />} 
              bgColor="bg-emerald-500" 
              title="Быстрый старт" 
              desc="Первые результаты уже после первой недели занятий" 
            />
            <FeatureItem 
              icon={<Heart className="w-5 h-5 text-white" />} 
              bgColor="bg-teal-500" 
              title="Забота и поддержка" 
              desc="Умный ИИ-куратор и сообщество единомышленников" 
            />
          </div>
        </div>

        {/* Abstract shapes for left side */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full -mr-32 -mt-32 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-50 rounded-full -ml-24 -mb-24 opacity-50"></div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo & Animated Icons (Mobile Only) */}
          <div className="lg:hidden flex flex-col items-center mb-10">
            <BrandingHeader />
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-white/50 relative overflow-hidden">
            {/* Form Toggle */}
            <div className="flex bg-gray-100/50 p-1 rounded-2xl mb-8 relative z-10">
              <button 
                onClick={() => { setIsLogin(true); setError(null); }}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Вход
              </button>
              <button 
                onClick={() => { setIsLogin(false); setError(null); }}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${!isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Регистрация
              </button>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isLogin ? 'Рады видеть вас снова!' : 'Создайте аккаунт'}
              </h2>
              <p className="text-sm text-gray-500">
                {isLogin ? 'Введите свои данные для входа в кабинет' : 'Присоединяйтесь к сообществу здоровых людей'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 text-xs p-4 rounded-2xl border border-red-100 animate-shake">
                  {error}
                </div>
              )}

              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Имя</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Александр"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-gray-900"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Электронная почта</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-gray-900"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Пароль</label>
                  {isLogin && <button type="button" className="text-xs text-green-600 font-bold hover:underline">Забыли?</button>}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-gray-900"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full py-5 text-base font-bold mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-2xl shadow-xl shadow-green-500/20 transform active:scale-[0.98] transition-all"
                isLoading={isLoading}
              >
                {isLogin ? 'Войти в кабинет' : 'Начать преображение'} <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>

            {/* Social Auth Section */}
            <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col items-center">
               <p className="text-xs text-gray-400 mb-4 font-medium">Или войти через</p>
               <div className="flex gap-4">
                  <button className="w-12 h-12 rounded-xl border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all hover:scale-110 active:scale-95" title="Яндекс">
                     <img src="https://www.svgrepo.com/show/475701/yandex-color.svg" className="w-5 h-5" alt="Yandex" />
                  </button>
                  <button className="w-12 h-12 rounded-xl border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all hover:scale-110 active:scale-95" title="ВКонтакте">
                     <img src="https://www.svgrepo.com/show/452131/vk.svg" className="w-5 h-5" alt="VK" />
                  </button>
                  <button className="w-12 h-12 rounded-xl border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all hover:scale-110 active:scale-95" title="Telegram">
                     <img src="https://www.svgrepo.com/show/452115/telegram.svg" className="w-5 h-5" alt="Telegram" />
                  </button>
               </div>
            </div>
          </div>
          
          <p className="mt-8 text-center text-xs text-gray-400 px-8">
            Нажимая кнопку, вы соглашаетесь с нашей <button className="underline hover:text-gray-600">политикой конфиденциальности</button>
          </p>
        </div>
      </div>
    </div>
  );
};

interface FeatureItemProps {
  icon: React.ReactNode;
  bgColor: string;
  title: string;
  desc: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, bgColor, title, desc }) => (
  <div className="flex gap-4 items-start group">
    <div className={`w-12 h-12 ${bgColor} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 shrink-0`}>
      {icon}
    </div>
    <div>
      <h3 className="font-bold text-gray-900 mb-0.5">{title}</h3>
      <p className="text-sm text-gray-500 leading-snug">{desc}</p>
    </div>
  </div>
);
