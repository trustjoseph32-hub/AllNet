
import React from 'react';
import { AppProvider, useStore } from './services/store';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { LessonView } from './pages/LessonView';
import { Diary } from './pages/Diary';
import { AICurator } from './pages/AICurator';
import { Profile } from './pages/Profile';
import { Diagnostics } from './pages/Diagnostics';
import { Admin } from './pages/Admin';
import { Services } from './pages/Services';
import { ProductDetail } from './pages/ProductDetail';
import { Auth } from './pages/Auth';
import { Nutritionist } from './pages/Nutritionist';
import { Progress } from './pages/Progress';
import { ViewState } from './types';
import { Loader2 } from 'lucide-react';

const GlobalLoader: React.FC = () => {
  const { isLoading } = useStore();
  if (!isLoading) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center border border-gray-100">
        <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
        <p className="text-sm font-bold text-gray-700">Обработка данных...</p>
      </div>
    </div>
  );
};

const Content: React.FC = () => {
  const { view, user } = useStore();

  if (view === ViewState.ADMIN && user?.role !== 'admin' && user?.role !== 'super_admin') {
    return <div className="p-8 text-center text-red-600">Доступ запрещен</div>;
  }

  switch (view) {
    case ViewState.DASHBOARD: return <Dashboard />;
    case ViewState.LESSONS:
    case ViewState.LESSON_DETAIL: return <LessonView />;
    case ViewState.DIARY: return <Diary />;
    case ViewState.AI_CHAT: return <AICurator />;
    case ViewState.PROFILE: return <Profile />;
    case ViewState.DIAGNOSTICS: return <Diagnostics />;
    case ViewState.SERVICES: return <Services />;
    case ViewState.PRODUCT_DETAIL: return <ProductDetail />;
    case ViewState.NUTRITION: return <Nutritionist />;
    case ViewState.PROGRESS: return <Progress />;
    case ViewState.ADMIN: return <Admin />;
    default: return <Dashboard />;
  }
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useStore();

  if (!isAuthenticated) {
    return (
      <>
        <GlobalLoader />
        <Auth />
      </>
    );
  }

  return (
    <Layout>
      <GlobalLoader />
      <Content />
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
