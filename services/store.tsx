
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, Lesson, DiaryEntry, ChatMessage, Badge, ViewState, 
  DiagnosticsState, CRMStage, Product, Order, UserAccess, OrderStatus,
  UserRole, ParticipantSubRole
} from '../types';
import { PRODUCTS, ANAMNESIS_QUESTIONS, MOCK_USERS_LIST, LESSONS, MOCK_DIARY_ENTRIES, BADGES } from '../constants';

interface StoreContextType {
  user: User | null;
  usersList: User[];
  view: ViewState;
  activeLessonId: number | null;
  lessons: Lesson[];
  diaryEntries: DiaryEntry[];
  chatMessages: ChatMessage[];
  badges: Badge[];
  isAuthenticated: boolean;
  diagnostics: DiagnosticsState;
  isLoading: boolean;
  
  products: Product[];
  activeProductId: string | null;
  orders: Order[];
  userAccess: UserAccess[];
  
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setView: (view: ViewState) => void;
  setActiveLesson: (id: number) => void;
  markBlockComplete: (lessonId: number, blockId: string) => void;
  addDiaryEntry: (entry: Omit<DiaryEntry, 'id'>) => void;
  sendChatMessage: (text: string) => void;
  triggerEmergency: () => void;
  
  viewProductDetail: (productId: string) => void;
  purchaseProduct: (productId: string) => Promise<void>;
  isLessonLocked: (lesson: Lesson) => { locked: boolean; reason: 'purchase' | 'drip' | 'none'; unlockDate?: string };
  
  updateLesson: (id: number, data: Partial<Lesson>) => void;
  toggleUserStatus: (userId: string) => void;
  viewUserDiagnostics: (userId: string) => void;
  moveUserToStage: (userId: string, stage: CRMStage) => void;
  activateUserAccess: (userId: string) => void;

  startDiagnostics: (type: string) => void;
  saveAnamnesisAnswer: (text: string, type: 'text' | 'audio') => void;
  nextAnamnesisStep: () => void;
  prevAnamnesisStep: () => void;
  submitTestAnswer: (questionIndex: number, score: number) => void;
  finishDiagnostics: () => void;

  updateUserRoleAndSubRole: (userId: string, role: UserRole, subRole: ParticipantSubRole) => void;
  toggleUserProduct: (userId: string, productId: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const API_BASE = '/api'; 

export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [usersList, setUsersList] = useState<User[]>(MOCK_USERS_LIST);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [lessons, setLessons] = useState<Lesson[]>(LESSONS);
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(MOCK_DIARY_ENTRIES);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [badges, setBadges] = useState<Badge[]>(BADGES);
  const [products] = useState<Product[]>(PRODUCTS);
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const INITIAL_MOCK_ORDERS: Order[] = [
    { id: 'ord-01', userId: 'user-va', productId: 'prod_meta_scan', amount: 1500, status: 'PAID', createdAt: '2023-11-20T10:00:00Z' },
    { id: 'ord-02', userId: 'user-vas', productId: 'prod_course_full', amount: 25000, status: 'PAID', createdAt: '2023-10-15T14:30:00Z' },
    { id: 'ord-03', userId: 'user-vad', productId: 'prod_course_full', amount: 25000, status: 'PAID', createdAt: '2023-11-05T09:15:00Z' },
    { id: 'ord-04', userId: 'user-vad', productId: 'prod_meta_scan', amount: 1500, status: 'PAID', createdAt: '2023-11-05T09:20:00Z' },
    { id: 'ord-05', userId: 'user-ma', productId: 'prod_meta_scan', amount: 1500, status: 'PAID', createdAt: '2023-11-18T16:45:00Z' },
    { id: 'ord-06', userId: 'user-mas', productId: 'prod_course_full', amount: 25000, status: 'PAID', createdAt: '2023-09-01T11:00:00Z' },
    { id: 'ord-07', userId: 'user-mas', productId: 'prod_meta_scan', amount: 1500, status: 'PAID', createdAt: '2023-09-01T11:05:00Z' },
    { id: 'ord-08', userId: 'user-mad', productId: 'prod_course_full', amount: 25000, status: 'PAID', createdAt: '2023-11-10T12:00:00Z' },
  ];

  const INITIAL_USER_ACCESS: UserAccess[] = [
    { id: 'acc-01', userId: 'user-va', productId: 'prod_meta_scan', productType: 'interactive_test', startDate: '2023-11-20T10:00:00Z', status: 'active' },
    { id: 'acc-02', userId: 'user-vas', productId: 'prod_course_full', productType: 'course_standard', startDate: '2023-10-15T14:30:00Z', status: 'active' },
    { id: 'acc-03', userId: 'user-vad', productId: 'prod_course_full', productType: 'course_standard', startDate: '2023-11-05T09:15:00Z', status: 'active' },
    { id: 'acc-04', userId: 'user-vad', productId: 'prod_meta_scan', productType: 'interactive_test', startDate: '2023-11-05T09:20:00Z', status: 'active' },
    { id: 'acc-05', userId: 'user-ma', productId: 'prod_meta_scan', productType: 'interactive_test', startDate: '2023-11-18T16:45:00Z', status: 'active' },
    { id: 'acc-06', userId: 'user-mas', productId: 'prod_course_full', productType: 'course_standard', startDate: '2023-09-01T11:00:00Z', status: 'active' },
    { id: 'acc-07', userId: 'user-mas', productId: 'prod_meta_scan', productType: 'interactive_test', startDate: '2023-09-01T11:05:00Z', status: 'active' },
    { id: 'acc-08', userId: 'user-mad', productId: 'prod_course_full', productType: 'course_standard', startDate: '2023-11-10T12:00:00Z', status: 'active' },
  ];

  const [orders, setOrders] = useState<Order[]>(INITIAL_MOCK_ORDERS);
  const [userAccess, setUserAccess] = useState<UserAccess[]>(INITIAL_USER_ACCESS);

  const [diagnostics, setDiagnostics] = useState<DiagnosticsState>({
    stage: 'SELECTION',
    testType: null,
    currentAnamnesisIndex: 0,
    anamnesisAnswers: {},
    currentQuestionIndex: 0,
    answers: {},
    isComplete: false
  });

  useEffect(() => {
    const initApp = async () => {
      const storedUser = localStorage.getItem('at_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };
    initApp();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Эмуляция задержки сети
    await new Promise(resolve => setTimeout(resolve, 800));

    // Поиск в мок-данных для демо-режима
    const foundUser = usersList.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser) {
      if (password === '123456') {
        setUser(foundUser);
        setIsAuthenticated(true);
        localStorage.setItem('at_user', JSON.stringify(foundUser));
        setIsLoading(false);
        return;
      } else {
        setIsLoading(false);
        throw new Error('Некорректный пароль для этого аккаунта (введите 123456)');
      }
    }

    // Если мок не найден, пытаемся дернуть реальный API (для продакшн среды)
    try {
      const data = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      }).then(res => res.json());

      if (data.token) {
        localStorage.setItem('at_token', data.token);
        localStorage.setItem('at_user', JSON.stringify(data.user));
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        throw new Error(data.error || 'Пользователь не найден');
      }
    } catch (e) {
      throw new Error('Неверный логин или пароль');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newUser: User = {
      id: `u-${Date.now()}`,
      name,
      email,
      role: 'student',
      xp: 0,
      level: 1,
      streak: 0,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      status: 'active',
      joinedAt: new Date().toISOString(),
      diagnosticsStatus: 'none',
      crmStage: 'lead',
      source: 'direct',
      paymentStatus: 'unpaid'
    };

    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('at_user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('at_token');
    localStorage.removeItem('at_user');
    setUser(null);
    setIsAuthenticated(false);
    setView(ViewState.DASHBOARD);
  };

  const setActiveLesson = (id: number) => {
    const lesson = lessons.find(l => l.id === id);
    if (!lesson) return;
    const lockStatus = isLessonLocked(lesson);
    if (lockStatus.locked) {
        if (lockStatus.reason === 'purchase') setView(ViewState.SERVICES);
        return;
    }
    setActiveLessonId(id);
    setView(ViewState.LESSON_DETAIL);
  };

  const markBlockComplete = (lessonId: number, blockId: string) => {
    setLessons(prev => prev.map(l => {
      if (l.id === lessonId && !l.completedBlockIds.includes(blockId)) {
        return { ...l, completedBlockIds: [...l.completedBlockIds, blockId] };
      }
      return l;
    }));
  };

  const addDiaryEntry = (entry: Omit<DiaryEntry, 'id'>) => {
    const newEntry = { ...entry, id: Date.now().toString() };
    setDiaryEntries(prev => [...prev, newEntry]);
  };

  const sendChatMessage = (text: string) => {
    const newMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text, timestamp: Date.now() };
    setChatMessages(prev => [...prev, newMsg]);
    
    // Эмуляция ответа ИИ
    setTimeout(() => {
      const aiMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        sender: 'ai', 
        text: `Я проанализировал ваше сообщение: "${text}". Как ваш куратор, я рекомендую обратить внимание на уровень стресса и выполнить дыхательную практику из Урока 1.`, 
        timestamp: Date.now() 
      };
      setChatMessages(prev => [...prev, aiMsg]);
    }, 1500);
  };

  const triggerEmergency = () => {
    alert("SOS сигнал отправлен. Инструкция в чате.");
    setView(ViewState.AI_CHAT);
  };

  const viewProductDetail = (productId: string) => {
      setActiveProductId(productId);
      setView(ViewState.PRODUCT_DETAIL);
  };

  const purchaseProduct = async (productId: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const product = products.find(p => p.id === productId);
    if (product) {
      const newAccess: UserAccess = {
        id: `acc-${Date.now()}`,
        userId: user?.id || 'guest',
        productId: product.id,
        productType: product.type,
        startDate: new Date().toISOString(),
        status: 'active'
      };
      setUserAccess(prev => [...prev, newAccess]);
      alert(`Доступ к "${product.title}" успешно активирован!`);
    }
    setIsLoading(false);
  };

  const isLessonLocked = (lesson: Lesson) => {
      if (lesson.blockId === 0) return { locked: false, reason: 'none' };
      if (!user) return { locked: true, reason: 'purchase' };
      // В админ-режиме, супер-админ режиме или у куратора все открыто
      if (user.role === 'admin' || user.role === 'super_admin' || user.role === 'support') return { locked: false, reason: 'none' };
      
      const hasPurchasedId = user.purchasedProductIds?.includes(lesson.requiredProductId || '');
      const hasAccess = hasPurchasedId || userAccess.some(a => a.userId === user.id && (a.productId === lesson.requiredProductId || a.productType === 'therapy_block'));
      if (!hasAccess) return { locked: true, reason: 'purchase' };

      // Drip scheduler (Weekly roll-out of therapeutic content)
      if (lesson.weekNumber && lesson.weekNumber > 1) {
        const joinedDate = new Date(user.joinedAt || Date.now());
        const unlockMs = joinedDate.getTime() + (lesson.weekNumber - 1) * 7 * 24 * 60 * 60 * 1000;
        if (Date.now() < unlockMs) {
          const unlockDate = new Date(unlockMs).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
          return { locked: true, reason: 'drip', unlockDate };
        }
      }

      return { locked: false, reason: 'none' };
  };

  const updateLesson = (id: number, data: Partial<Lesson>) => {
    setLessons(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
  };

  const toggleUserStatus = (userId: string) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, status: u.status === 'active' ? 'banned' : 'active' } : u));
    if (userId === user?.id) {
      setUser(prev => prev ? { ...prev, status: prev.status === 'active' ? 'banned' : 'active' } : null);
    }
  };

  const moveUserToStage = (userId: string, stage: CRMStage) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, crmStage: stage } : u));
    if (userId === user?.id) {
      setUser(prev => prev ? { ...prev, crmStage: stage } : null);
    }
  };

  const activateUserAccess = (userId: string) => {
    // Manual activation from admin pane
  };

  const updateUserRoleAndSubRole = (userId: string, role: UserRole, subRole: ParticipantSubRole) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = { ...u, role, subRole };
        if (role === 'participant' && u.crmStage !== 'student') {
          updated.crmStage = 'student';
          updated.paymentStatus = 'paid';
        } else if (role === 'user') {
          updated.crmStage = u.crmStage === 'student' ? 'pre_sale' : u.crmStage;
          updated.paymentStatus = 'unpaid';
        }
        if (userId === user?.id) {
          setUser(updated);
          localStorage.setItem('at_user', JSON.stringify(updated));
        }
        return updated;
      }
      return u;
    }));
  };

  const toggleUserProduct = (userId: string, productId: string) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        const currentProducts = u.purchasedProductIds || [];
        const updatedProducts = currentProducts.includes(productId)
          ? currentProducts.filter(id => id !== productId)
          : [...currentProducts, productId];
        
        let updatedRole = u.role;
        let updatedStage = u.crmStage;
        let pStatus = u.paymentStatus;
        if (updatedProducts.length > 0 && u.role === 'user') {
          updatedRole = 'participant';
          updatedStage = 'student';
          pStatus = 'paid';
        } else if (updatedProducts.length === 0 && u.role === 'participant') {
          updatedRole = 'user';
          updatedStage = 'pre_sale';
          pStatus = 'unpaid';
        }

        const updated = { 
          ...u, 
          purchasedProductIds: updatedProducts, 
          role: updatedRole, 
          crmStage: updatedStage,
          paymentStatus: pStatus
        };

        if (userId === user?.id) {
          setUser(updated);
          localStorage.setItem('at_user', JSON.stringify(updated));
        }

        // Синхронизация заказов и доступов
        if (updatedProducts.includes(productId)) {
          const oPrice = PRODUCTS.find(p => p.id === productId)?.price || 0;
          const newOrder: Order = {
            id: `ord-${Date.now()}`,
            userId,
            productId,
            amount: oPrice,
            status: 'PAID',
            createdAt: new Date().toISOString()
          };
          const newAccess: UserAccess = {
            id: `acc-${Date.now()}`,
            userId,
            productId,
            productType: PRODUCTS.find(p => p.id === productId)?.type || 'course_standard',
            startDate: new Date().toISOString(),
            status: 'active'
          };
          setOrders(prevOrders => [...prevOrders, newOrder]);
          setUserAccess(prevAccess => [...prevAccess, newAccess]);
        } else {
          setOrders(prevOrders => prevOrders.filter(o => !(o.userId === userId && o.productId === productId)));
          setUserAccess(prevAccess => prevAccess.filter(a => !(a.userId === userId && a.productId === productId)));
        }

        return updated;
      }
      return u;
    }));
  };

  const viewUserDiagnostics = (userId: string) => {
    const targetUser = usersList.find(u => u.id === userId) || user;
    if (targetUser && targetUser.diagnosticsStatus === 'completed') {
      setDiagnostics(prev => ({
        ...prev,
        stage: 'RESULTS',
        isComplete: true,
        viewingUserId: userId
      }));
    } else {
      setDiagnostics(prev => ({
        ...prev,
        stage: 'SELECTION',
        isComplete: false,
        viewingUserId: userId
      }));
    }
    setView(ViewState.DIAGNOSTICS);
  };

  const startDiagnostics = (type: string) => setDiagnostics({ ...diagnostics, stage: 'ANAMNESIS', testType: type });
  const saveAnamnesisAnswer = (text: string, type: 'text' | 'audio') => {
      setDiagnostics(prev => ({
          ...prev,
          anamnesisAnswers: { ...prev.anamnesisAnswers, [prev.currentAnamnesisIndex]: { text, type } }
      }));
  };
  const nextAnamnesisStep = () => {
      setDiagnostics(prev => {
          const nextIdx = prev.currentAnamnesisIndex + 1;
          if (nextIdx >= ANAMNESIS_QUESTIONS.length) return { ...prev, stage: 'TEST' };
          return { ...prev, currentAnamnesisIndex: nextIdx };
      });
  };
  const prevAnamnesisStep = () => setDiagnostics(prev => ({ ...prev, currentAnamnesisIndex: Math.max(0, prev.currentAnamnesisIndex - 1) }));
  const submitTestAnswer = (questionIndex: number, score: number) => {
      setDiagnostics(prev => ({ ...prev, answers: { ...prev.answers, [questionIndex]: score }, currentQuestionIndex: questionIndex + 1 }));
  };
  const finishDiagnostics = () => {
      setIsLoading(true);
      setTimeout(() => {
        setDiagnostics(prev => ({ ...prev, stage: 'RESULTS', isComplete: true }));
        setIsLoading(false);
      }, 2000);
  };

  return (
    <StoreContext.Provider value={{
        user, usersList, view, activeLessonId, lessons, diaryEntries, chatMessages, badges, isAuthenticated, diagnostics, isLoading,
        products, activeProductId, orders, userAccess,
        login, register, logout, setView, setActiveLesson, markBlockComplete, addDiaryEntry, sendChatMessage, triggerEmergency,
        purchaseProduct, viewProductDetail, isLessonLocked,
        updateLesson, toggleUserStatus, viewUserDiagnostics, moveUserToStage, activateUserAccess,
        startDiagnostics, saveAnamnesisAnswer, nextAnamnesisStep, prevAnamnesisStep, submitTestAnswer, finishDiagnostics,
        updateUserRoleAndSubRole, toggleUserProduct
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) throw new Error("useStore must be used within AppProvider");
    return context;
};
