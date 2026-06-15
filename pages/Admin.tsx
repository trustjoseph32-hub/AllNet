import React, { useState } from 'react';
import { useStore } from '../services/store';
import { 
  Users, Lock, Unlock, Search, Filter, Shield, ShieldAlert, TrendingUp, 
  DollarSign, Calendar, ShoppingBag, Edit3, CheckCircle, Award, 
  CreditCard, ChevronRight, ChevronLeft, ArrowRight, BookOpen, AlertCircle
} from 'lucide-react';
import { CRMStage, UserRole, ParticipantSubRole } from '../types';

export const Admin: React.FC = () => {
  const { 
    user: currentUser, 
    usersList, 
    products, 
    orders, 
    updateUserRoleAndSubRole, 
    toggleUserProduct, 
    toggleUserStatus, 
    moveUserToStage 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'users' | 'crm' | 'finance'>('users');
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [subRoleFilter, setSubRoleFilter] = useState<string>('all');
  
  // Interactive editing states
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<UserRole>('user');
  const [editSubRole, setEditSubRole] = useState<ParticipantSubRole>('none');
  
  const [productUserId, setProductUserId] = useState<string | null>(null);

  if (!currentUser) return null;

  const isSuperAdmin = currentUser.role === 'super_admin';

  // Format participant subroles to descriptive Russian labels
  const getSubRoleLabel = (sub: ParticipantSubRole | undefined) => {
    switch (sub) {
      case 'ВА': return 'ВА (Взрослый, аллергия)';
      case 'ВАс': return 'ВАс (Взрослый, астма)';
      case 'ВАд': return 'ВАд (Взрослый, дерматит)';
      case 'Ма': return 'Ма (Мама ребенка, аллергия)';
      case 'МАс': return 'МАс (Мама ребенка, астма)';
      case 'Мад': return 'Мад (Мама ребенка, дерматит)';
      default: return 'Нет подроли';
    }
  };

  const getSubRoleShortLabel = (sub: ParticipantSubRole | undefined) => {
    if (!sub || sub === 'none') return '';
    return sub;
  };

  // Human role translator
  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return 'Супер Админ';
      case 'admin': return 'Администратор';
      case 'support': return 'Куратор';
      case 'participant': return 'Участник';
      case 'user': return 'Пользователь';
      case 'student': return 'Участник';
      default: return 'Пользователь';
    }
  };

  const stages: { id: CRMStage; label: string; color: string; bg: string; border: string }[] = [
    { id: 'lead', label: 'Входящие Лиды', color: 'text-gray-700', bg: 'bg-[#1c1830]', border: 'border-white/10' },
    { id: 'diagnostics', label: 'Диагностика', color: 'text-blue-400', bg: 'bg-blue-950/10 border-blue-500/20', border: 'border-blue-500/10' },
    { id: 'pre_sale', label: 'Пре-сейл', color: 'text-yellow-400', bg: 'bg-yellow-950/10 border-yellow-500/20', border: 'border-yellow-500/10' },
    { id: 'student', label: 'Студенты / Оплаты', color: 'text-emerald-400', bg: 'bg-emerald-950/10 border-emerald-500/20', border: 'border-emerald-500/10' }
  ];

  // Filtering users
  const filteredUsers = usersList.filter(u => {
    const query = userSearch.toLowerCase();
    const matchesSearch = u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query);
    const matchesRole = roleFilter === 'all' || u.role === roleFilter || (roleFilter === 'participant' && u.role === 'student');
    const matchesSubRole = subRoleFilter === 'all' || u.subRole === subRoleFilter;
    return matchesSearch && matchesRole && matchesSubRole;
  });

  // Calculate Metrics
  const totalUsersCount = usersList.length;
  const activeParticipantsCount = usersList.filter(u => u.role === 'participant' || u.role === 'student').length;
  
  // Total Revenue (only paid orders)
  const paidOrders = orders.filter(o => o.status === 'PAID');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.amount, 0);
  const averageTicket = paidOrders.length > 0 ? Math.round(totalRevenue / paidOrders.length) : 0;

  // Handler to open user role editor modal
  const openRoleEditor = (u: any) => {
    setEditingUserId(u.id);
    setEditRole(u.role);
    setEditSubRole(u.subRole || 'none');
  };

  const saveEditedRole = () => {
    if (editingUserId) {
      updateUserRoleAndSubRole(editingUserId, editRole, editSubRole);
      setEditingUserId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-white">
      {/* Platform Dashboard Headers */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
            <Shield className="w-7 h-7 text-purple-400" />
            Управление Платформой
          </h2>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
            Текущая сессия: <span className="text-purple-400 font-bold">{getRoleLabel(currentUser.role)}</span>
          </p>
        </div>
        
        {/* Tab Selection */}
        <div className="bg-[#120a2c]/60 p-1.5 rounded-xl border border-white/5 flex gap-1 w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('users')} 
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'users' ? 'bg-purple-600 shadow-lg text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Users className="w-4 h-4" /> Пользователи
          </button>
          
          <button 
            onClick={() => setActiveTab('crm')} 
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'crm' ? 'bg-purple-600 shadow-lg text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Filter className="w-4 h-4" /> CRM Воронка
          </button>

          <button 
            onClick={() => setActiveTab('finance')} 
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'finance' ? 'bg-purple-600 shadow-lg text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'} ${!isSuperAdmin ? 'opacity-80' : ''}`}
          >
            <CreditCard className="w-4 h-4" />
            Финансы {!isSuperAdmin && '🔒'}
          </button>
        </div>
      </div>

      {/* --- STATS SUMMARY BAR --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">Всего пользователей</span>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-3xl font-black">{totalUsersCount}</span>
            <span className="text-xs text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded-full">БАЗА</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">Активные Участники</span>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-3xl font-black text-emerald-400">{activeParticipantsCount}</span>
            <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">КУПИЛИ</span>
          </div>
        </div>

        {isSuperAdmin ? (
          <>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">Общая выручка</span>
              <div className="flex items-center gap-2 mt-2 text-yellow-400">
                <span className="text-2xl font-black">{totalRevenue.toLocaleString()} ₽</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col justify-between">
              <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">Средний чек</span>
              <div className="flex items-center gap-2 mt-2 text-purple-400">
                <span className="text-2xl font-black">{averageTicket.toLocaleString()} ₽</span>
              </div>
            </div>
          </>
        ) : (
          <div className="col-span-2 bg-purple-950/10 border border-purple-500/20 p-5 rounded-2xl flex flex-col justify-center">
            <div className="flex items-center gap-3 text-purple-400">
              <ShieldAlert className="w-8 h-8 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 block">Финансовые показатели</span>
                <span className="text-xs text-purple-300 font-bold">ОГРАНИЧЕНО (Доступно только Супер Администратору)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- TAB 1: USERS LIST --- */}
      {activeTab === 'users' && (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
          {/* Filters Bar */}
          <div className="p-6 border-b border-white/10 bg-white/[0.02] flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
            <div>
              <h3 className="font-black uppercase text-sm tracking-widest">Управление Списком учеников</h3>
              <p className="text-xs text-gray-400 mt-0.5">Показано {filteredUsers.length} из {totalUsersCount} учетных записей</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search input */}
              <div className="relative min-w-[200px] flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-purple-400/70" />
                <input 
                  type="text" 
                  placeholder="Имя или email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full bg-[#120a2c]/60 pl-9 pr-4 py-2 border border-white/10 rounded-xl text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              {/* Role filter */}
              <div className="relative">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-[#120a2c]/60 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer text-gray-200"
                >
                  <option value="all">Все роли</option>
                  <option value="super_admin">Супер Админ</option>
                  <option value="admin">Администратор</option>
                  <option value="support">Куратор</option>
                  <option value="participant">Участники</option>
                  <option value="user">Пользователи</option>
                </select>
              </div>

              {/* Subrole filter */}
              <div className="relative">
                <select
                  value={subRoleFilter}
                  onChange={(e) => setSubRoleFilter(e.target.value)}
                  className="bg-[#120a2c]/60 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer text-gray-200"
                >
                  <option value="all">Все подроли</option>
                  <option value="ВА">ВА (Аллергия)</option>
                  <option value="ВАс">ВАс (Астма)</option>
                  <option value="ВАд">ВАд (Дерматит)</option>
                  <option value="Ма">Ма (Мама аллергика)</option>
                  <option value="МАс">МАс (Мама астматика)</option>
                  <option value="Мад">Мад (Мама дерматита)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] border-b border-white/10 text-gray-400 uppercase tracking-widest font-black text-[10px]">
                <tr>
                  <th className="px-6 py-4">Ученик / Профиль</th>
                  <th className="px-6 py-4 text-center">Роль</th>
                  <th className="px-6 py-4 text-center">Подроль</th>
                  <th className="px-6 py-4">Продукты и доступы</th>
                  <th className="px-6 py-4 text-center">Состояние</th>
                  <th className="px-6 py-4 text-right">Настройки</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {filteredUsers.map(u => {
                  const uProducts = u.purchasedProductIds || [];
                  const isCurrentEditing = editingUserId === u.id;
                  const isViewingProducts = productUserId === u.id;

                  return (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Name & Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={u.avatarUrl} className="w-9 h-9 rounded-xl border border-white/10 bg-white/5" alt="Avatar" />
                          <div>
                            <div className="font-bold text-white text-sm">{u.name}</div>
                            <div className="text-gray-400 text-xs mt-0.5">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Role representation with beautiful tags */}
                      <td className="px-6 py-4 text-center">
                        {isCurrentEditing ? (
                          <select
                            value={editRole}
                            onChange={(e) => {
                              const targetRole = e.target.value as UserRole;
                              setEditRole(targetRole);
                              if (targetRole !== 'participant') {
                                setEditSubRole('none');
                              } else {
                                setEditSubRole('ВА');
                              }
                            }}
                            className="bg-[#120a2c] text-white border border-purple-500/30 rounded px-2 py-1 focus:outline-none"
                          >
                            <option value="super_admin">Супер Админ</option>
                            <option value="admin">Администратор</option>
                            <option value="support">Куратор</option>
                            <option value="participant">Участник</option>
                            <option value="user">Пользователь</option>
                          </select>
                        ) : (
                          <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-black tracking-wider leading-none select-none
                            ${u.role === 'super_admin' ? 'bg-purple-900/30 text-purple-400 border border-purple-500/20' : ''}
                            ${u.role === 'admin' ? 'bg-indigo-900/30 text-indigo-400 border border-indigo-500/20' : ''}
                            ${u.role === 'support' ? 'bg-blue-900/30 text-blue-400 border border-blue-500/20' : ''}
                            ${(u.role === 'participant' || u.role === 'student') ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20' : ''}
                            ${u.role === 'user' ? 'bg-gray-800 text-gray-400 border border-gray-700' : ''}
                          `}>
                            {getRoleLabel(u.role)}
                          </span>
                        )}
                      </td>

                      {/* Participant Subrole selection block */}
                      <td className="px-6 py-4 text-center font-bold">
                        {isCurrentEditing ? (
                          editRole === 'participant' ? (
                            <select
                              value={editSubRole}
                              onChange={(e) => setEditSubRole(e.target.value as ParticipantSubRole)}
                              className="bg-[#120a2c] text-white border border-purple-500/30 rounded px-2 py-1 focus:outline-none"
                            >
                              <option value="none">Выберите подроль...</option>
                              <option value="ВА">ВА (Взрослый аллергик)</option>
                              <option value="ВАс">ВАс (Взрослый астматик)</option>
                              <option value="ВАд">ВАд (Взрослый дерматит)</option>
                              <option value="Ма">Ма (Мама аллергика)</option>
                              <option value="МАс">МАс (Мама астматика)</option>
                              <option value="Мад">Мад (Мама дерматита)</option>
                            </select>
                          ) : (
                            <span className="text-gray-500 text-xs">Нет подроли</span>
                          )
                        ) : (
                          getSubRoleShortLabel(u.subRole) ? (
                            <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded border border-purple-500/20">
                              {getSubRoleShortLabel(u.subRole)}
                            </span>
                          ) : <span className="text-gray-500">-</span>
                        )}
                      </td>

                      {/* Purchased Platform Products */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 w-full max-w-[280px]">
                          <div className="flex flex-wrap gap-1.5">
                            {uProducts.map(pId => {
                              const p = products.find(prod => prod.id === pId);
                              return (
                                <span key={pId} className="px-2 py-0.5 bg-yellow-500/5 text-yellow-500/90 rounded text-[10px] border border-yellow-500/10 font-bold shrink-0">
                                  {p ? p.title.split(':')[0] : pId}
                                </span>
                              );
                            })}
                            {uProducts.length === 0 && <span className="text-gray-500 text-xs italic">Нет купленных продуктов</span>}
                          </div>
                          
                          {/* Toggle access drawer trigger */}
                          <button 
                            onClick={() => setProductUserId(isViewingProducts ? null : u.id)}
                            className="text-left text-[10px] font-black uppercase text-purple-400 hover:text-purple-300 mt-1.5 tracking-wider transition-colors inline-block"
                          >
                            {isViewingProducts ? '▲ Закрыть управление доступами' : '▼ Выдать или забрать доступы'}
                          </button>

                          {/* Toggle products select widgets */}
                          {isViewingProducts && (
                            <div className="mt-2 bg-[#0d0720]/80 p-2.5 rounded-xl border border-purple-500/20 space-y-2 animate-fade-in text-xs max-w-[240px]">
                              <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Доступы к продуктам:</p>
                              {products.map(prod => {
                                const hasIt = uProducts.includes(prod.id);
                                return (
                                  <label key={prod.id} className="flex items-center gap-2 text-xs text-gray-200 cursor-pointer select-none hover:text-white">
                                    <input 
                                      type="checkbox" 
                                      checked={hasIt}
                                      onChange={() => toggleUserProduct(u.id, prod.id)}
                                      className="accent-purple-600 rounded"
                                    />
                                    <span>{prod.title}</span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status Checkbox */}
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' : 'bg-red-500/10 text-red-400 border border-red-500/10'}`}>
                          {u.status === 'active' ? 'Активен' : 'Блок'}
                        </span>
                      </td>

                      {/* Settings / Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {isCurrentEditing ? (
                            <>
                              <button 
                                onClick={saveEditedRole}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 rounded text-[10px] font-bold text-white uppercase"
                              >
                                Ок
                              </button>
                              <button 
                                onClick={() => setEditingUserId(null)}
                                className="px-2.5 py-1 bg-gray-700 hover:bg-gray-600 rounded text-[10px] font-bold text-gray-300 uppercase"
                              >
                                Отмена
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={() => openRoleEditor(u)}
                                className="p-2 bg-white/5 hover:bg-purple-600/25 text-purple-400 rounded-lg border border-white/5 transition-all"
                                title="Редактировать роль"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button 
                                onClick={() => toggleUserStatus(u.id)} 
                                className={`p-2 rounded-lg border border-white/5 transition-all ${u.status === 'active' ? 'bg-white/5 hover:bg-red-600/20 text-red-400' : 'bg-white/5 hover:bg-emerald-600/20 text-emerald-400'}`}
                                title={u.status === 'active' ? 'Заблокировать' : 'Разблокировать'}
                              >
                                {u.status === 'active' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 2: CRM BOARD --- */}
      {activeTab === 'crm' && (
        <div className="space-y-6">
          <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
            <h3 className="font-black uppercase text-sm tracking-widest">Продуктовая CRM Воронка</h3>
            <p className="text-xs text-gray-400 mt-1">
              Учет лидов по этапам продаж с визуализацией ролевых и финансовых признаков. Вы можете переводить пользователей между этапами прямо на доске.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
            {stages.map(stage => {
              const stageUsers = usersList.filter(u => u.crmStage === stage.id);
              
              return (
                <div key={stage.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col min-h-[550px] relative">
                  {/* Column Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                    <h4 className="font-black text-[11px] uppercase tracking-wider text-purple-400">
                      {stage.label}
                    </h4>
                    <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-full font-black text-[10px]">
                      {stageUsers.length}
                    </span>
                  </div>

                  {/* Cards inside Column */}
                  <div className="flex-1 space-y-3 overflow-y-auto max-h-[500px] no-scrollbar pb-10">
                    {stageUsers.map(u => {
                      const uProds = u.purchasedProductIds || [];
                      
                      // Calculate individual investments shown to super admins
                      const individualSpend = uProds.reduce((sum, pId) => {
                        const p = products.find(prod => prod.id === pId);
                        return sum + (p ? p.price : 0);
                      }, 0);

                      return (
                        <div key={u.id} className="bg-[#120a2c]/65 p-4 rounded-xl border border-purple-500/10 space-y-3 hover:border-purple-500/30 transition-all shadow-xl group">
                          {/* Inner info */}
                          <div className="flex items-start gap-2.5">
                            <img src={u.avatarUrl} className="w-8 h-8 rounded-lg border border-white/10 bg-white/5" alt="" />
                            <div className="min-w-0">
                              <h5 className="font-bold text-xs hover:text-purple-400 transition-colors truncate">{u.name}</h5>
                              <span className="text-[9px] text-gray-400 truncate block mt-0.5">{u.email}</span>
                            </div>
                          </div>

                          {/* Role tag inside card */}
                          <div className="flex flex-wrap gap-1 items-center">
                            <span className="px-1.5 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded text-[9px] font-bold">
                              {getRoleLabel(u.role)}
                            </span>
                            {u.subRole && u.subRole !== 'none' && (
                              <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[9px] font-bold">
                                {u.subRole}
                              </span>
                            )}
                          </div>

                          {/* Purchased Products counting */}
                          <div className="space-y-1">
                            <div className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Купленные продукты:</div>
                            <div className="flex flex-wrap gap-1">
                              {uProds.map(pId => {
                                const p = products.find(prod => prod.id === pId);
                                return (
                                  <span key={pId} className="px-1.5 py-0.5 bg-yellow-500/10 text-yellow-400 rounded text-[9px] border border-yellow-500/15 font-bold">
                                    {p ? p.title.split(':')[0] : pId}
                                  </span>
                                );
                              })}
                              {uProds.length === 0 && (
                                <span className="text-[9px] text-gray-500 italic">Нет продуктов</span>
                              )}
                            </div>
                          </div>

                          {/* Show or hide investments depending on role privilege */}
                          <div className="flex items-center justify-between pt-2 border-t border-white/5">
                            <div>
                              {isSuperAdmin ? (
                                <div className="text-[10px] text-gray-300">
                                  Оплачено: <span className="font-bold text-yellow-400">{individualSpend.toLocaleString()} ₽</span>
                                </div>
                              ) : (
                                <div className="text-[10px] text-gray-500 italic">
                                  Финансы: 🔒 скрыто
                                </div>
                              )}
                            </div>

                            {/* Easy Transition controllers */}
                            <div className="flex gap-1">
                              {stage.id !== 'lead' && (
                                <button 
                                  onClick={() => {
                                    const prevStages: CRMStage[] = ['lead', 'diagnostics', 'pre_sale', 'student'];
                                    const currIdx = prevStages.indexOf(stage.id);
                                    moveUserToStage(u.id, prevStages[currIdx - 1]);
                                  }}
                                  className="p-1 hover:bg-white/10 rounded transition-colors"
                                  title="Переместить назад"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5 text-gray-400" />
                                </button>
                              )}
                              {stage.id !== 'student' && (
                                <button 
                                  onClick={() => {
                                    const nextStages: CRMStage[] = ['lead', 'diagnostics', 'pre_sale', 'student'];
                                    const currIdx = nextStages.indexOf(stage.id);
                                    moveUserToStage(u.id, nextStages[currIdx + 1]);
                                  }}
                                  className="p-1 hover:bg-white/10 rounded transition-colors"
                                  title="Переместить вперед"
                                >
                                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {stageUsers.length === 0 && (
                      <div className="flex flex-col items-center justify-center p-8 border border-dashed border-white/5 rounded-xl text-center text-gray-500">
                        <AlertCircle className="w-5 h-5 mb-2" />
                        <span className="text-[11px] uppercase font-bold">Пусто</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- TAB 3: FINANCE & PAYMENT DATA --- */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          {!isSuperAdmin ? (
            /* Restricted view for normal Admin */
            <div className="bg-white/5 border border-white/10 p-12 rounded-2xl text-center space-y-4 max-w-2xl mx-auto backdrop-blur-md">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-white mt-4">Ограничение Прав Доступа</h3>
              <p className="text-xs text-gray-400 leading-relaxed uppercase tracking-wider max-w-sm mx-auto">
                Роль <span className="text-indigo-400 font-black">Администратор</span> не имеет доступа к финансовым, расчетным и платежным данным платформы.
              </p>
              <div className="bg-[#120a2c] p-4 rounded-xl border border-white/5 inline-block text-gray-300 text-xs text-left max-w-md">
                <p className="font-bold mb-1 block">🔒 Что закрыто для вас:</p>
                <ul className="list-disc pl-4 space-y-1 font-medium text-gray-400">
                  <li>Суммы платежей и чеков за заказы</li>
                  <li>Общая касса и средний чек</li>
                  <li>Финансовые отчеты и списки транзакций</li>
                </ul>
              </div>
              <p className="text-[10px] text-purple-400 uppercase font-black tracking-widest pt-2">
                Для просмотра переключите вашу роль на <span className="font-bold">⚡ Супер Админ</span> в левом меню!
              </p>
            </div>
          ) : (
            /* Full views for Super Admin */
            <div className="space-y-6">
              {/* Detailed financials widgets */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col gap-4">
                  <span className="text-[11px] uppercase font-black tracking-widest text-purple-400">Финансовая воронка</span>
                  <div className="space-y-3 font-bold text-xs">
                    <div className="flex justify-between items-center text-gray-200">
                      <span>Курс "Свобода Тела" (Стандарт)</span>
                      <span className="text-yellow-400">25 000 ₽</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: '80%' }}></div>
                    </div>

                    <div className="flex justify-between items-center text-gray-200 pt-2">
                      <span>Био-Диагностика "Мета-Сканирование"</span>
                      <span className="text-yellow-400">1 500 ₽</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Sales report */}
                <div className="lg:col-span-2 bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
                  <h4 className="font-black text-xs uppercase tracking-widest text-emerald-400">Последние подтвержденные платежи</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="text-[10px] uppercase font-bold text-gray-400 border-b border-white/10 pb-2">
                        <tr>
                          <th className="py-2">Заказ №</th>
                          <th className="py-2">Ученик</th>
                          <th className="py-2">Продукт</th>
                          <th className="py-2">Метод</th>
                          <th className="py-2 text-right">Сумма</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {paidOrders.map(o => {
                          const client = usersList.find(u => u.id === o.userId);
                          const prod = products.find(p => p.id === o.productId);
                          return (
                            <tr key={o.id} className="hover:bg-white/[0.01]">
                              <td className="py-3 text-purple-400 font-mono font-bold uppercase">{o.id}</td>
                              <td className="py-3 font-bold">{client ? client.name : 'Гость'}</td>
                              <td className="py-3 text-gray-300">{prod ? prod.title : 'Платформа'}</td>
                              <td className="py-3"><span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[9px] font-bold border border-emerald-500/15">Prodamus</span></td>
                              <td className="py-3 text-right font-black text-yellow-400">+{o.amount.toLocaleString()} ₽</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
