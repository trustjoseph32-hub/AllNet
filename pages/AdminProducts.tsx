import React, { useState, useRef } from 'react';
import { useStore } from '../services/store';
import { Package, Plus, Settings, Edit3, Trash2, CheckCircle, Tag, ShoppingCart, Info, ImagePlus, X } from 'lucide-react';
import { Product, ProductType } from '../types';

export const AdminProducts: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [type, setType] = useState<ProductType>('course_standard');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [features, setFeatures] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Пожалуйста, выберите изображение');
        return;
      }
      
      const fileUrl = URL.createObjectURL(file);
      setImageUrl(fileUrl);
    }
  };

  const resetForm = () => {
    setType('course_standard');
    setTitle('');
    setDescription('');
    setPrice(0);
    setFeatures('');
    setImageUrl('');
    setEditingProduct(null);
  };

  const startEdit = (p: Product) => {
    setEditingProduct(p);
    setType(p.type);
    setTitle(p.title);
    setDescription(p.description);
    setPrice(p.price);
    setFeatures(p.features.join('\n'));
    setImageUrl(p.imageUrl || '');
    setActiveTab('create');
  };

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот продукт?')) {
      deleteProduct(id);
    }
  };

  const handleSave = () => {
    if (!title) return alert('Введите название продукта');

    const productData: Product = {
      id: editingProduct ? editingProduct.id : `prod_${Date.now()}`,
      type,
      title,
      description,
      price,
      features: features.split('\n').filter(f => f.trim()),
      imageUrl: imageUrl || undefined,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }

    resetForm();
    setActiveTab('list');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2 text-white">
            <Package className="w-7 h-7 text-purple-400" />
            Управление Продуктами
          </h2>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
            Добавление и редактирование
          </p>
        </div>
      </div>

      <div className="flex border-b border-white/10 mb-6 space-x-2">
        <button
          onClick={() => { setActiveTab('create'); if(!editingProduct) resetForm(); }}
          className={`py-3 px-6 font-semibold text-sm transition-colors duration-200 flex items-center gap-2 ${
            activeTab === 'create'
              ? 'border-b-2 border-purple-500 text-white'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <Plus className="w-4 h-4" />
          {editingProduct ? 'Редактировать продукт' : 'Создать продукт'}
        </button>
        <button
          onClick={() => { setActiveTab('list'); resetForm(); }}
          className={`py-3 px-6 font-semibold text-sm transition-colors duration-200 flex items-center gap-2 ${
            activeTab === 'list'
              ? 'border-b-2 border-purple-500 text-white'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          Продукты
        </button>
      </div>

      {activeTab === 'create' && (
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <h3 className="text-xl font-bold text-white mb-6">
            {editingProduct ? 'Редактирование продукта' : 'Новый продукт'}
          </h3>
          <div className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Тип продукта</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ProductType)}
                className="w-full bg-[#120a2c]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="course_standard">Стандартный курс</option>
                <option value="interactive_test">Интерактивный тест (Диагностика)</option>
                <option value="therapy_block">Терапевтический блок</option>
                <option value="single_session">Одиночная сессия</option>
                <option value="audio_pack">Аудио пак</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Название</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Пакет участия 'Стандарт'"
                className="w-full bg-[#120a2c]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Краткое описание (в карточке)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Доступ к базовым модулям и материалам..."
                className="w-full bg-[#120a2c]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 h-24 resize-y"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Цена (₽)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="25000"
                className="w-full bg-[#120a2c]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Обложка продукта</label>
              <div 
                className="w-full border-2 border-dashed border-white/20 rounded-xl overflow-hidden hover:border-purple-500/50 transition-colors relative bg-[#120a2c]/60 flex flex-col justify-center items-center group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                style={{ minHeight: '160px' }}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                
                {imageUrl ? (
                  <div className="relative w-full h-full min-h-[160px]">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white font-bold flex items-center gap-2">
                        <Edit3 className="w-5 h-5" /> Изменить
                      </span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageUrl('');
                      }}
                      className="absolute top-2 right-2 bg-black/70 hover:bg-red-500/80 p-2 rounded-full text-white transition-colors z-10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3 text-purple-400 group-hover:scale-110 transition-transform">
                      <ImagePlus className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-gray-300 mb-1">Нажмите для загрузки или перетащите файл</p>
                    <p className="text-xs text-gray-500">Рекомендуемый размер: 1200x800 px (Рейтио 3:2)</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Особенности (по одной на строку)</label>
              <textarea
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                placeholder="Доступ к курсу на 3 месяца\nПроверка ДЗ\nОбщий чат"
                className="w-full bg-[#120a2c]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 h-32 resize-y"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <button 
                onClick={resetForm}
                className="px-6 py-3 font-bold text-sm bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition"
              >
                Сбросить
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-3 font-bold text-sm bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                {editingProduct ? 'Сохранить изменения' : 'Добавить продукт'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white/5 border border-white/10 rounded-2xl flex flex-col overflow-hidden relative group">
              {product.imageUrl && (
                <div className="h-32 w-full overflow-hidden border-b border-white/10">
                  <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-6 flex-1 text-white">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 bg-purple-900/40 px-3 py-1 rounded-full border border-purple-500/20">
                    {product.type}
                  </span>
                  <div className="flex bg-[#120a2c]/80 rounded-lg p-1 border border-white/5">
                    <button 
                      onClick={() => startEdit(product)}
                      className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-1.5 hover:bg-red-500/20 rounded text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{product.title}</h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{product.description}</p>
                <div className="text-2xl font-black text-white">{product.price.toLocaleString()} ₽</div>
              </div>
              <div className="bg-black/20 p-4 border-t border-white/5 text-xs text-gray-400 flex items-center gap-2">
                <Info className="w-4 h-4" />
                ID: {product.id}
              </div>
            </div>
          ))}
          
          {products.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 bg-white/5 rounded-2xl border border-white/10 border-dashed">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-bold">Нет доступных продуктов</p>
              <button 
                onClick={() => setActiveTab('create')}
                className="mt-4 text-purple-400 hover:underline text-sm font-bold"
              >
                Создать первый продукт
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
