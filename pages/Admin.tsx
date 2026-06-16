import React from 'react';
import { useStore } from '../services/store';
import { 
  Shield, Settings, Users, Activity
} from 'lucide-react';

export const Admin: React.FC = () => {
  const { user: currentUser, usersList, orders } = useStore();

  if (!currentUser) return null;

  const totalUsersCount = usersList.length;
  const activeParticipantsCount = usersList.filter(u => u.role === 'participant' || u.role === 'student').length;
  const paidOrders = orders.filter(o => o.status === 'PAID');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="space-y-8 animate-fade-in text-white pb-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
            <Shield className="w-7 h-7 text-purple-400" />
            Управление Платформой
          </h2>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
            Общая сводка системы
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-2"><Users className="text-blue-400 w-5 h-5"/> База пользователей</h3>
          <p className="text-3xl font-black">{totalUsersCount}</p>
          <p className="text-sm text-gray-400 mt-1">Всего регистраций в системе</p>
        </div>
        
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-2"><Activity className="text-emerald-400 w-5 h-5"/> Активные участники</h3>
          <p className="text-3xl font-black text-emerald-400">{activeParticipantsCount}</p>
          <p className="text-sm text-gray-400 mt-1">Оплатившие продукты</p>
        </div>

        {currentUser.role === 'super_admin' && (
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-2"><Shield className="text-teal-400 w-5 h-5"/> Финансовый оборот</h3>
            <p className="text-3xl font-black text-teal-400">{totalRevenue.toLocaleString()} ₽</p>
            <p className="text-sm text-gray-400 mt-1">Суммарный доход платформы</p>
          </div>
        )}
      </div>

      <div className="bg-purple-900/20 border border-purple-500/20 p-8 rounded-2xl text-center">
        <Settings className="w-12 h-12 text-purple-400 mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-bold mb-2">Настройки Платформы</h3>
        <p className="text-gray-400">Глобальные настройки системы отключены в режиме предварительного просмотра.</p>
        <p className="text-sm text-purple-300 mt-4">Используйте блок CRM для работы с базой и финансами.</p>
      </div>
    </div>
  );
};
