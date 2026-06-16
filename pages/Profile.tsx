import React, { useState, useRef } from 'react';
import { useStore } from '../services/store';
import { ViewState, Product } from '../types';
import AvatarEditor from 'react-avatar-editor';
import { 
  Award, User as UserIcon, Calendar, Flame, Camera, X,
  Lock, Shield, Star, ExternalLink, Zap,
  MapPin, Phone, Globe, Clock, Bell, ShieldCheck, Key, Smartphone, CreditCard, Receipt
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { 
    user, 
    products, 
    userAccess, 
    setView,
    updateUserAvatar
  } = useStore();

  const [notifications, setNotifications] = useState({ push: true, email: true });
  const [twoFactor, setTwoFactor] = useState(false);

  const [editingAvatarImage, setEditingAvatarImage] = useState<string | null>(null);
  const [avatarScale, setAvatarScale] = useState<number>(1);
  const editorRef = useRef<AvatarEditor | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          setEditingAvatarImage(event.target.result);
          setAvatarScale(1);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      updateUserAvatar(dataUrl);
      setEditingAvatarImage(null);
    }
  };

  if (!user) return null;

  // 2. Calculations for Purchased Products
  const purchasedIds = user.purchasedProductIds || [];
  const ownedProducts = products.filter(p => 
    purchasedIds.includes(p.id) || 
    userAccess.some(access => access.userId === user.id && access.productId === p.id)
  );

  // 3. User Role translator
  const getRoleLabelRu = (role: string) => {
    switch (role) {
      case 'super_admin': return '⚡ Супер Администратор';
      case 'admin': return '💼 Администратор Платформы';
      case 'support': return '🎓 Куратор / Наставник';
      case 'participant': return `🟢 Действующий Участник (${user.subRole || 'ВА'})`;
      case 'student': return `🟢 Действующий Участник (${user.subRole || 'ВА'})`;
      case 'user': return '⚪ Зарегистрированный Пользователь';
      default: return 'Пользователь';
    }
  };

  const joinedDateStr = user.joinedAt 
    ? new Date(user.joinedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'недавно';

  return (
    <div className="space-y-8 animate-fade-in text-white pb-20">
      
      {/* 1. БАЗОВАЯ ИНФОРМАЦИЯ (Идентификация) */}
      <div className="glass-card p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="flex items-center gap-2 mb-6">
          <UserIcon className="w-5 h-5 text-teal-400" />
          <h2 className="text-xl font-black uppercase tracking-tight text-white">Базовая информация</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="relative group shrink-0 self-center md:self-start">
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-600 via-teal-500 to-cyan-500 rounded-2xl blur-[4px] opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-1 bg-[#120a2c] rounded-2xl w-[136px] h-[136px]">
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="w-full h-full rounded-xl object-cover border border-white/10" 
              />
              <label className="absolute inset-1 flex flex-col items-center justify-center bg-[#070311]/60 opacity-0 group-hover:opacity-100 backdrop-blur-sm transition-opacity rounded-xl cursor-pointer">
                <Camera className="w-6 h-6 text-white mb-1" />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Изменить</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            </div>
            <span className="absolute -bottom-1.5 -right-1.5 bg-green-500 border-4 border-[#070311] rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-black" title="В сети">
              ●
            </span>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Личные данные и Роль */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-400 mb-1">Личные данные</h3>
                <p className="text-2xl font-black text-white">{user.name}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider
                    ${user.role === 'super_admin' || user.role === 'admin' ? 'bg-teal-950/40 text-teal-400 border border-teal-500/30' : ''}
                    ${user.role === 'support' ? 'bg-blue-900/40 text-blue-400 border border-blue-500/30' : ''}
                    ${(user.role === 'participant' || user.role === 'student') ? 'bg-teal-950/40 text-teal-400 border border-teal-500/30' : ''}
                    ${user.role === 'user' ? 'bg-gray-800/40 text-gray-400 border border-gray-700' : ''}`}
                  >
                    {getRoleLabelRu(user.role)}
                  </span>
                  {user.subRole && user.subRole !== 'none' && (
                    <span className="px-2 py-1 bg-[#120a2c] text-teal-400 border border-teal-500/20 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      {user.subRole}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-400 mb-2">Контактная информация</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <div className="w-6 flex justify-center"><UserIcon className="w-4 h-4 text-gray-500" /></div>
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 flex justify-center"><Phone className="w-4 h-4 text-gray-500" /></div>
                    <span>+7 (***) ***-**-** <span className="text-[10px] text-gray-500 uppercase font-bold ml-1 border border-white/10 px-1 py-0.5 rounded">Скрыт</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Локализация и Активность */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-400 mb-2">Локализация</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <div className="w-6 flex justify-center"><MapPin className="w-4 h-4 text-gray-500" /></div>
                    <span>Россия, Москва</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 flex justify-center"><Clock className="w-4 h-4 text-gray-500" /></div>
                    <span>Часовой пояс: UTC+3 (МСК)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 flex justify-center"><Globe className="w-4 h-4 text-gray-500" /></div>
                    <span>Язык интерфейса: Русский</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-400 mb-2">Активность</h3>
                <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-300">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-teal-400" />
                    В клубе с {joinedDateStr}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-indigo-500" />
                    Серия: {user.streak} дн.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ФИНАНСОВАЯ ИНФОРМАЦИЯ И ПОКУПКИ */}
      <div className="glass-card p-6 md:p-8 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-6">
          <CreditCard className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-black uppercase tracking-tight text-white">Финансовая информация</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Подписки и Приобретенные продукты */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2">
              <Award className="w-4 h-4" /> Текущие подписки и продукты
            </h3>
            <div className="space-y-3 max-h-[250px] overflow-y-auto no-scrollbar pr-1">
              {ownedProducts.map((p: Product) => (
                <div key={p.id} className="bg-teal-500/5 border border-teal-500/10 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-sm text-teal-400 leading-tight pr-4">{p.title}</h4>
                    <span className="text-[10px] font-black text-white bg-teal-500/20 px-2.5 py-1 rounded border border-teal-500/30 shrink-0">
                      АКТИВЕН
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-gray-400 font-medium">
                    <span>Тип: <span className="uppercase text-gray-300">{p.type}</span></span>
                    <span>До: <span className="text-gray-300">Бессрочно</span></span>
                  </div>
                </div>
              ))}

              {ownedProducts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 border border-dashed border-white/10 rounded-xl text-center space-y-3">
                  <Lock className="w-6 h-6 text-gray-500" />
                  <div>
                    <p className="font-bold text-xs text-gray-400">Нет активных продуктов</p>
                    <p className="text-[10px] text-gray-500 mt-1">Оформите подписку или купите программу</p>
                  </div>
                  <button 
                    onClick={() => setView(ViewState.SERVICES)}
                    className="mt-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
                  >
                    Перейти в магазин
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* История транзакций */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2">
              <Receipt className="w-4 h-4" /> История транзакций
            </h3>
            <div className="space-y-3 max-h-[250px] overflow-y-auto no-scrollbar pr-1">
              {[
                { id: 'T-10042', date: '12 Апр 2026', amount: '12 500 ₽', status: 'Успешно', desc: 'Курс "ИммуноБаланс"' },
                { id: 'T-10021', date: '01 Мар 2026', amount: '2 900 ₽', status: 'Успешно', desc: 'Терапевтический блок' }
              ].map((tx, idx) => (
                <div key={idx} className="bg-[#120a2c]/50 border border-white/5 rounded-xl p-4 flex justify-between items-center transition-all hover:bg-white/5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-300">{tx.desc}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">{tx.status}</span>
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono">Чек: {tx.id} • {tx.date}</div>
                  </div>
                  <div className="text-sm font-black text-white">{tx.amount}</div>
                </div>
              ))}
              <button className="w-full py-3 border border-dashed border-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:border-white/20 transition-all focus:outline-none">
                Смотреть все транзакции
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. НАСТРОЙКИ ПЛАТФОРМЫ */}
      <div className="glass-card p-6 md:p-8 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-gray-300" />
          <h2 className="text-xl font-black uppercase tracking-tight text-white">Настройки платформы</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Уведомления */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 border-b border-white/10 pb-2 flex items-center gap-2">
              <Bell className="w-4 h-4" /> Уведомления
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-300">Push-уведомления</h4>
                  <p className="text-[10px] text-gray-500">Напоминания о дедлайнах и новых уроках в браузере</p>
                </div>
                <button 
                  onClick={() => setNotifications({ ...notifications, push: !notifications.push })}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${notifications.push ? 'bg-teal-500' : 'bg-gray-700'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform absolute ${notifications.push ? 'translate-x-7' : 'translate-x-1'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-300">Email-рассылки</h4>
                  <p className="text-[10px] text-gray-500">Ответы куратора, новости экосистемы, чеки покупок</p>
                </div>
                <button 
                  onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${notifications.email ? 'bg-teal-500' : 'bg-gray-700'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform absolute ${notifications.email ? 'translate-x-7' : 'translate-x-1'}`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Безопасность */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 border-b border-white/10 pb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Безопасность
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-300 flex items-center gap-1.5"><Key className="w-3.5 h-3.5 text-gray-400"/> Смена пароля</h4>
                  <p className="text-[10px] text-gray-500">Последнее обновление: 2 месяца назад</p>
                </div>
                <button className="px-3 py-1.5 border border-white/10 hover:border-white/20 rounded-lg text-xs font-bold text-gray-300 hover:text-white transition-colors">
                  Обновить
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-300 flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5 text-gray-400"/> Двухфакторная аутентификация (2FA)</h4>
                  <p className="text-[10px] text-gray-500">Дополнительная защита при входе через SMS/Telegram</p>
                </div>
                <button 
                  onClick={() => setTwoFactor(!twoFactor)}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${twoFactor ? 'bg-teal-500' : 'bg-gray-700'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform absolute ${twoFactor ? 'translate-x-7' : 'translate-x-1'}`}></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL FOR AVATAR EDITING */}
      {editingAvatarImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070311]/80 backdrop-blur-sm">
          <div className="bg-[#120a2c] border border-teal-500/30 rounded-2xl p-6 w-full max-w-sm flex flex-col items-center relative shadow-2xl">
            <button 
              onClick={() => setEditingAvatarImage(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-black text-white mb-6 uppercase tracking-wider">Настройка фото</h3>
            
            <div className="rounded-xl overflow-hidden mb-6 border border-white/10 bg-[#070311]">
              <AvatarEditor
                ref={editorRef}
                image={editingAvatarImage}
                width={200}
                height={200}
                border={30}
                color={[7, 3, 17, 0.6]} // #070311 with 60% opacity
                scale={avatarScale}
                rotate={0}
                borderRadius={100} // make the crop area circular
              />
            </div>
            
            <div className="w-full space-y-2 mb-6">
              <div className="flex justify-between text-xs text-gray-400 font-bold uppercase tracking-wider">
                <span>Масштаб</span>
                <span>{Math.round(avatarScale * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="3" 
                step="0.05" 
                value={avatarScale}
                onChange={(e) => setAvatarScale(parseFloat(e.target.value))}
                className="w-full translate-y-[-2px] accent-teal-500"
              />
            </div>

            <div className="flex w-full gap-3">
              <button 
                onClick={() => setEditingAvatarImage(null)}
                className="flex-1 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-colors"
              >
                Отмена
              </button>
              <button 
                onClick={handleSaveAvatar}
                className="flex-1 py-3 bg-teal-600 border border-teal-500/20 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-teal-500 transition-colors shadow-[0_0_15px_rgba(20,184,166,0.3)]"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
