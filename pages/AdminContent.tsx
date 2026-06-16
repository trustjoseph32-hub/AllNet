import React, { useState } from 'react';
import { Upload, FileText, Database, Settings, Plus, Edit2, Trash2, ChevronDown, ChevronUp, Image as ImageIcon, Video, User, Copy } from 'lucide-react';

type Tab = 'lessons' | 'kb' | 'files';

const WEEKS = [
  'Вводный урок',
  'Первая неделя',
  'Вторая неделя',
  'Третья неделя',
  'Четвертая неделя',
  'Пятая неделя',
  'Шестая неделя',
  'Седьмая неделя',
  'Восьмая неделя',
];

const ROLES = [
  { id: 'ВА', label: 'ВА' },
  { id: 'ВАс', label: 'ВАс' },
  { id: 'ВАд', label: 'ВАд' },
  { id: 'Ма', label: 'Ма' },
  { id: 'МАс', label: 'МАс' },
  { id: 'Мад', label: 'Мад' },
];

interface LessonDraft {
  id: string;
  weekIndex: number;
  title: string;
  videoUrl: string;
  coverUrl: string;
  kbFileUrl: string;
  description: string;
  assignment: string;
  roles: string[];
}

interface StoredFile {
  id: string;
  name: string;
  type: 'video' | 'image' | 'document';
  url: string;
  size: string;
  uploadedAt: string;
}

const MOCK_FILES: StoredFile[] = [
  { id: '1', name: 'lesson_1_intro.mp4', type: 'video', url: '#', size: '245 MB', uploadedAt: '12.05.2026' },
  { id: '2', name: 'cover_main.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80', size: '1.2 MB', uploadedAt: '12.05.2026' },
  { id: '3', name: 'presentation_w2.pdf', type: 'document', url: '#', size: '4.5 MB', uploadedAt: '14.05.2026' },
  { id: '4', name: 'meditation_video.mp4', type: 'video', url: '#', size: '312 MB', uploadedAt: '15.05.2026' },
];

export const AdminContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('lessons');
  const [expandedWeek, setExpandedWeek] = useState<number | null>(0);
  const [lessons, setLessons] = useState<LessonDraft[]>([]);
  const [editingLesson, setEditingLesson] = useState<LessonDraft | null>(null);

  const handleCreateLesson = (weekIndex: number) => {
    setEditingLesson({
      id: Date.now().toString(),
      weekIndex,
      title: '',
      videoUrl: '',
      coverUrl: '',
      kbFileUrl: '',
      description: '',
      assignment: '',
      roles: ['ВА', 'ВАс', 'ВАд', 'Ма', 'МАс', 'Мад']
    });
  };

  const handleEditLesson = (lesson: LessonDraft) => {
    setEditingLesson({ ...lesson });
  };

  const handleDeleteLesson = (id: string) => {
    if (confirm('Удалить урок?')) {
      setLessons(lessons.filter(l => l.id !== id));
    }
  };

  const handleSaveLesson = () => {
    if (!editingLesson || !editingLesson.title) {
      alert('Введите название урока');
      return;
    }
    const existingIndex = lessons.findIndex(l => l.id === editingLesson.id);
    if (existingIndex >= 0) {
      const newLessons = [...lessons];
      newLessons[existingIndex] = editingLesson;
      setLessons(newLessons);
    } else {
      setLessons([...lessons, editingLesson]);
    }
    setEditingLesson(null);
  };

  const toggleRole = (roleId: string) => {
    if (!editingLesson) return;
    const currentRoles = editingLesson.roles;
    if (currentRoles.includes(roleId)) {
      setEditingLesson({ ...editingLesson, roles: currentRoles.filter(r => r !== roleId) });
    } else {
      setEditingLesson({ ...editingLesson, roles: [...currentRoles, roleId] });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">Управление контентом</h1>
        <p className="text-gray-400 text-sm mt-2 max-w-2xl">
          Создание и редактирование обучающих материалов, базы знаний и файлов.
        </p>
      </div>

      <div className="flex border-b border-white/10 mb-6 space-x-2">
        <button
          onClick={() => setActiveTab('lessons')}
          className={`py-3 px-6 font-semibold text-sm transition-colors duration-200 flex items-center gap-2 ${
            activeTab === 'lessons'
              ? 'border-b-2 border-teal-500 text-white'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <Settings className="w-4 h-4" />
          Уроки
        </button>
        <button
          onClick={() => setActiveTab('kb')}
          className={`py-3 px-6 font-semibold text-sm transition-colors duration-200 flex items-center gap-2 ${
            activeTab === 'kb'
              ? 'border-b-2 border-teal-500 text-white'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <Database className="w-4 h-4" />
          База знаний
        </button>
        <button
          onClick={() => setActiveTab('files')}
          className={`py-3 px-6 font-semibold text-sm transition-colors duration-200 flex items-center gap-2 ${
            activeTab === 'files'
              ? 'border-b-2 border-teal-500 text-white'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <Upload className="w-4 h-4" />
          Файловое хранилище
        </button>
      </div>

      <div className="glass-card p-6 min-h-[400px]">
        {activeTab === 'lessons' && (
          <div className="animate-fade-in">
            {editingLesson ? (
              <div className="bg-[#120a2c]/50 p-6 rounded-2xl border border-white/5 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    {lessons.find(l => l.id === editingLesson.id) ? 'Редактирование урока' : 'Создание урока'} 
                    <span className="text-gray-400 ml-2">({WEEKS[editingLesson.weekIndex]})</span>
                  </h3>
                  <button onClick={() => setEditingLesson(null)} className="text-gray-400 hover:text-white px-3 py-1">Отмена</button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Название урока</label>
                    <input
                      type="text"
                      className="w-full bg-[#0a0518]/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-teal-500"
                      value={editingLesson.title}
                      onChange={e => setEditingLesson({ ...editingLesson, title: e.target.value })}
                      placeholder="Введите название урока"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider flex items-center gap-2">
                        <Video className="w-3 h-3" /> Видео (URL / Файл)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="flex-1 bg-[#0a0518]/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-teal-500"
                          value={editingLesson.videoUrl}
                          onChange={e => setEditingLesson({ ...editingLesson, videoUrl: e.target.value })}
                          placeholder="Ссылка на видео (Vimeo, YouTube, MP4)"
                        />
                        <button 
                          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-teal-400 hover:bg-teal-500/10 transition-colors flex items-center gap-2 shrink-0"
                          title="Выбрать из хранилища"
                        >
                          <Upload className="w-4 h-4" />
                          <span className="text-sm font-medium hidden sm:inline">Выбрать</span>
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider flex items-center gap-2">
                        <ImageIcon className="w-3 h-3" /> Обложка (URL / Файл)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="flex-1 bg-[#0a0518]/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-teal-500"
                          value={editingLesson.coverUrl}
                          onChange={e => setEditingLesson({ ...editingLesson, coverUrl: e.target.value })}
                          placeholder="Ссылка на изображение обложки"
                        />
                        <button 
                          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-teal-400 hover:bg-teal-500/10 transition-colors flex items-center gap-2 shrink-0"
                          title="Выбрать из хранилища"
                        >
                          <Upload className="w-4 h-4" />
                          <span className="text-sm font-medium hidden sm:inline">Выбрать</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider flex items-center gap-2">
                         <Database className="w-3 h-3" /> Файл из базы знаний (URL)
                     </label>
                     <div className="flex gap-2">
                       <input
                         type="text"
                         className="flex-1 bg-[#0a0518]/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-teal-500"
                         value={editingLesson.kbFileUrl || ''}
                         onChange={e => setEditingLesson({ ...editingLesson, kbFileUrl: e.target.value })}
                         placeholder="Ссылка на материал (PDF, документ и т.д.)"
                       />
                       <button 
                         className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-teal-400 hover:bg-teal-500/10 transition-colors flex items-center gap-2 shrink-0"
                         title="Выбрать из базы знаний"
                       >
                         <Database className="w-4 h-4" />
                         <span className="text-sm font-medium hidden sm:inline">Выбрать</span>
                       </button>
                     </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Доступ</label>
                    <div className="flex flex-wrap gap-2">
                      {ROLES.map(role => (
                        <button
                          key={role.id}
                          onClick={() => toggleRole(role.id)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                            editingLesson.roles.includes(role.id)
                              ? 'bg-teal-500/20 text-teal-400 border-teal-500/50'
                              : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {role.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Описание урока (Markdown)</label>
                    <textarea
                      className="w-full bg-[#0a0518]/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-teal-500 h-32 resize-y"
                      value={editingLesson.description}
                      onChange={e => setEditingLesson({ ...editingLesson, description: e.target.value })}
                      placeholder="Введите текстовое описание под видео..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Задание к уроку</label>
                    <textarea
                      className="w-full bg-[#0a0518]/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-teal-500 h-24 resize-y"
                      value={editingLesson.assignment}
                      onChange={e => setEditingLesson({ ...editingLesson, assignment: e.target.value })}
                      placeholder="Введите задание, которое нужно выполнить после урока..."
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button onClick={handleSaveLesson} className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition-colors">
                    Сохранить урок
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {WEEKS.map((week, idx) => {
                  const isExpanded = expandedWeek === idx;
                  const weekLessons = lessons.filter(l => l.weekIndex === idx);
                  return (
                    <div key={idx} className="bg-[#120a2c]/30 rounded-xl border border-white/5 overflow-hidden transition-all">
                      <div 
                        className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                        onClick={() => setExpandedWeek(isExpanded ? null : idx)}
                      >
                        <h3 className="text-lg font-bold text-white flex items-center gap-3">
                          <span className="text-teal-400">{String(idx).padStart(2, '0')}</span> 
                          {week}
                        </h3>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-gray-500 font-medium bg-white/5 px-2 py-1 rounded">
                            Уроков: {weekLessons.length}
                          </span>
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="p-5 border-t border-white/5 bg-[#0a0518]/30">
                          {weekLessons.length > 0 ? (
                            <div className="space-y-3 mb-4">
                              {weekLessons.map(lesson => (
                                <div key={lesson.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                  <div>
                                    <h4 className="text-white font-medium">{lesson.title}</h4>
                                    <div className="text-xs text-gray-400 mt-1 flex gap-2">
                                      {lesson.videoUrl && <span className="flex items-center gap-1"><Video className="w-3 h-3" /> Видео</span>}
                                      {lesson.kbFileUrl && <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> Материал</span>}
                                      {lesson.assignment && <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> Задание</span>}
                                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> {lesson.roles.length} ролей</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button onClick={() => handleEditLesson(lesson)} className="p-2 text-gray-400 hover:text-teal-400 bg-white/5 rounded-lg transition-colors">
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDeleteLesson(lesson.id)} className="p-2 text-gray-400 hover:text-red-400 bg-white/5 rounded-lg transition-colors">
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 mb-4 text-center py-4 bg-white/5 rounded-xl border-dashed border border-white/10">В этой неделе пока нет уроков</p>
                          )}
                          <button 
                            onClick={() => handleCreateLesson(idx)}
                            className="w-full py-3 border border-dashed border-teal-500/50 text-teal-400 rounded-xl hover:bg-teal-500/10 transition-colors flex items-center justify-center gap-2 font-medium"
                          >
                            <Plus className="w-4 h-4" /> Добавить урок
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'kb' && (
          <div className="animate-fade-in text-white">
            <h2 className="text-xl font-bold mb-4">База знаний</h2>
            <p className="text-sm text-gray-400 mb-6">Тексты и файлы по тематике уроков курса.</p>
            
            <div className="border-2 border-dashed border-teal-500/30 bg-teal-500/5 p-12 text-center rounded-2xl">
              <Database className="w-12 h-12 text-teal-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Управление базой знаний</h3>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                Здесь будет интерфейс для добавления статей, методичек и других обучающих материалов.
              </p>
              <button className="mt-6 px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition-colors">
                Добавить материал
              </button>
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="animate-fade-in text-white space-y-8">
            <div>
              <h2 className="text-xl font-bold mb-1">Файловое хранилище</h2>
              <p className="text-sm text-gray-400">Управление медиафайлами, видеоуроками и обложками.</p>
            </div>
            
            <div className="border-2 border-dashed border-blue-500/30 bg-blue-500/5 p-8 text-center rounded-2xl flex flex-col items-center justify-center transition-colors hover:bg-blue-500/10 hover:border-blue-500/50 cursor-pointer">
              <Upload className="w-10 h-10 text-blue-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">Загрузить новые файлы</h3>
              <p className="text-sm text-gray-400 max-w-md mx-auto mb-4">
                Перетащите файлы сюда или нажмите кнопку ниже. Поддерживаются видео (MP4) и изображения (JPG, PNG).
              </p>
              <button className="px-5 py-2.5 bg-white/5 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 shadow-sm rounded-xl font-medium transition-all flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Выбрать файлы
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                <h3 className="text-lg font-bold">Загруженные файлы</h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-xs font-medium bg-white/10 text-white rounded-lg">Все</button>
                  <button className="px-3 py-1.5 text-xs font-medium bg-white/5 border border-white/5 rounded-lg hover:bg-white/10 text-gray-400">Видео</button>
                  <button className="px-3 py-1.5 text-xs font-medium bg-white/5 border border-white/5 rounded-lg hover:bg-white/10 text-gray-400">Изображения</button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {MOCK_FILES.map(file => (
                  <div key={file.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden group hover:border-blue-500/50 transition-colors relative">
                    <div className="aspect-square bg-[#0a0518] flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                      {file.type === 'image' ? (
                        <img src={file.url} alt={file.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      ) : (
                        <div className="text-gray-500 bg-white/5 p-4 rounded-full">
                          {file.type === 'video' ? <Video className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
                        </div>
                      )}
                      
                      {/* Hover Actions */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                        <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors" title="Копировать ссылку">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg bg-white/10 hover:bg-red-500/20 text-red-300 transition-colors" title="Удалить">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-3 border-t border-white/5 bg-[#120a2c]/50">
                      <p className="text-xs font-medium text-white truncate" title={file.name}>{file.name}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <p className="text-[10px] text-gray-500">{file.size}</p>
                        <p className="text-[10px] text-gray-500">{file.uploadedAt}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

