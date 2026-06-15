
import React, { useState } from 'react';
import { useStore } from '../services/store';
import { ViewState } from '../types';
import { Button } from '../components/Button';
import { ArrowLeft, Check, Lock, Loader2, Star, ShieldCheck, HelpCircle } from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { products, activeProductId, purchaseProduct, setView, userAccess } = useStore();
  const [isBuying, setIsBuying] = useState(false);

  const product = products.find(p => p.id === activeProductId);
  
  if (!product) return <div>Продукт не найден</div>;

  const purchased = userAccess.some(a => a.productId === product.id);

  const handleBuy = async () => {
    setIsBuying(true);
    try {
      await purchaseProduct(product.id);
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <div className="animate-fade-in pb-20">
      {/* Back Button */}
      <button 
        onClick={() => setView(ViewState.SERVICES)}
        className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Назад к витрине
      </button>

      {/* Hero Section */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative h-64 md:h-auto">
             <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 md:hidden">
               <h1 className="text-2xl font-bold text-white">{product.title}</h1>
             </div>
          </div>
          <div className="p-8 md:p-10 flex flex-col justify-center">
            <h1 className="hidden md:block text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">{product.fullDescription || product.description}</p>
            
            <div className="flex items-end gap-3 mb-8">
               <div className="text-4xl font-bold text-green-700">
                  {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(product.price)}
               </div>
               <div className="text-sm text-gray-400 pb-1 line-through">
                  {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(product.price * 1.5)}
               </div>
            </div>

            <Button 
                size="lg"
                className="w-full md:w-auto text-lg py-4 shadow-xl shadow-green-500/20"
                variant={purchased ? 'secondary' : 'primary'}
                disabled={purchased || isBuying}
                onClick={!purchased ? handleBuy : undefined}
            >
                {isBuying ? (
                    <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Оформляем...</>
                ) : purchased ? (
                    'Доступ уже открыт'
                ) : (
                    'Получить доступ'
                )}
            </Button>
            
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <Lock className="w-3 h-3" /> Безопасная оплата через Prodamus
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
           
           {/* Benefits */}
           <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                 <Star className="w-5 h-5 text-yellow-500" /> Что вы получите
              </h2>
              <div className="grid grid-cols-1 gap-4">
                 {(product.benefits || product.features).map((item, i) => (
                    <div key={i} className="flex gap-4 items-start p-4 rounded-xl bg-gray-50">
                       <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-4 h-4" />
                       </div>
                       <span className="text-gray-700 font-medium">{item}</span>
                    </div>
                 ))}
              </div>
           </div>

           {/* FAQ */}
           {product.faq && (
             <div className="bg-white rounded-2xl p-8 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                   <HelpCircle className="w-5 h-5 text-blue-500" /> Частые вопросы
                </h2>
                <div className="space-y-4">
                   {product.faq.map((item, i) => (
                      <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                         <h3 className="font-semibold text-gray-900 mb-2">{item.question}</h3>
                         <p className="text-gray-500 text-sm leading-relaxed">{item.answer}</p>
                      </div>
                   ))}
                </div>
             </div>
           )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
           {/* Target Audience */}
           <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="font-bold text-blue-900 mb-4">Для кого это?</h3>
              <ul className="space-y-3">
                 {(product.targetAudience || ["Для всех, кто хочет выздороветь"]).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-blue-800">
                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                       {item}
                    </li>
                 ))}
              </ul>
           </div>

           {/* Guarantee */}
           <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
              <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Гарантия качества</h3>
              <p className="text-xs text-gray-500">
                Мы уверены в эффективности нашей методики. Если вы не почувствуете улучшений, мы вернем деньги в течение 7 дней.
              </p>
           </div>
        </div>

      </div>
    </div>
  );
};
