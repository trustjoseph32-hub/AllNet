
import React from 'react';
import { useStore } from '../services/store';
import { Button } from '../components/Button';
import { Check, Lock, Zap, Clock, Calendar, Headphones, ArrowRight } from 'lucide-react';
import { ProductType } from '../types';

export const Services: React.FC = () => {
  const { products, userAccess, viewProductDetail } = useStore();

  const hasAccess = (productId: string) => userAccess.some(a => a.productId === productId);

  const getProductIcon = (type: ProductType) => {
      switch (type) {
          case 'interactive_test': return <Zap className="w-6 h-6 text-indigo-500" />;
          case 'course_standard': return <Lock className="w-6 h-6 text-green-500" />;
          case 'therapy_block': return <Clock className="w-6 h-6 text-blue-500" />;
          case 'single_session': return <Calendar className="w-6 h-6 text-purple-500" />;
          case 'audio_pack': return <Headphones className="w-6 h-6 text-cyan-500" />;
          default: return <Lock className="w-6 h-6" />;
      }
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Витрина услуг</h1>
        <p className="text-gray-500">Выберите подходящий формат работы над вашей психосоматикой. От самостоятельного изучения до личной терапии.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => {
          const purchased = hasAccess(product.id);

          return (
            <div key={product.id} className={`bg-white rounded-2xl border transition-all duration-300 flex flex-col ${purchased ? 'border-green-200 shadow-sm' : 'border-gray-100 hover:shadow-lg hover:-translate-y-1'}`}>
               <div className="relative h-40 bg-gray-100 rounded-t-2xl overflow-hidden cursor-pointer" onClick={() => viewProductDetail(product.id)}>
                 {product.imageUrl && (
                     <img src={product.imageUrl} className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" alt="" />
                 )}
                 <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-xl p-2 shadow-sm">
                    {getProductIcon(product.type)}
                 </div>
                 {purchased && (
                     <div className="absolute inset-0 bg-green-500/20 backdrop-blur-[2px] flex items-center justify-center">
                         <div className="bg-white px-4 py-2 rounded-full text-green-700 font-bold shadow-lg flex items-center gap-2">
                             <Check className="w-5 h-5" /> Куплено
                         </div>
                     </div>
                 )}
               </div>

               <div className="p-6 flex-1 flex flex-col">
                 <h3 className="font-bold text-lg text-gray-900 mb-2 cursor-pointer hover:text-green-600 transition-colors" onClick={() => viewProductDetail(product.id)}>
                    {product.title}
                 </h3>
                 <p className="text-sm text-gray-500 mb-6 flex-1">{product.description}</p>
                 
                 <div className="space-y-3 mb-6">
                    {product.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                            <span>{feature}</span>
                        </div>
                    ))}
                 </div>

                 <div className="mt-auto">
                    <div className="flex items-end gap-2 mb-4">
                        <span className="text-2xl font-bold text-gray-900">
                            {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(product.price)}
                        </span>
                    </div>
                    
                    <Button 
                        className="w-full" 
                        variant={purchased ? 'secondary' : 'outline'}
                        disabled={purchased}
                        onClick={() => !purchased && viewProductDetail(product.id)}
                    >
                        {purchased ? (
                            'Доступ открыт'
                        ) : (
                            <>Подробнее <ArrowRight className="w-4 h-4 ml-2" /></>
                        )}
                    </Button>
                 </div>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
