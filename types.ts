
export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  LESSONS = 'LESSONS',
  LESSON_DETAIL = 'LESSON_DETAIL',
  DIARY = 'DIARY',
  AI_CHAT = 'AI_CHAT',
  PROFILE = 'PROFILE',
  DIAGNOSTICS = 'DIAGNOSTICS',
  ADMIN = 'ADMIN',
  SERVICES = 'SERVICES',
  PRODUCT_DETAIL = 'PRODUCT_DETAIL',
  NUTRITION = 'NUTRITION',
  PROGRESS = 'PROGRESS'
}

export type UserRole = 'super_admin' | 'admin' | 'support' | 'participant' | 'user' | 'student';

export type ParticipantSubRole = 'ВА' | 'ВАс' | 'ВАд' | 'Ма' | 'МАс' | 'Мад' | 'none';

export type CRMStage = 'lead' | 'diagnostics' | 'pre_sale' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  subRole?: ParticipantSubRole;
  purchasedProductIds?: string[];
  xp: number;
  level: number;
  streak: number;
  avatarUrl: string;
  status: 'active' | 'banned';
  joinedAt: string;
  diagnosticsStatus: 'none' | 'in_progress' | 'completed';
  crmStage: CRMStage;
  source: string; // e.g., 'bot_lead', 'direct', 'ad'
  paymentStatus: 'paid' | 'unpaid';
}

export type BlockType = 'text' | 'video' | 'audio';

export interface LessonBlock {
  id: string;
  type: BlockType;
  title: string;
  content: string; // Markdown description or text content
  mediaUrl?: string; // URL for video or audio
  coverUrl?: string; // Cover image for media
  hasAssignment: boolean; // If true, shows an input field
  assignmentDescription?: string; // Text describing the assignment (shown above input)
  userAnswer?: string; // Stored user answer
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
}

export interface Lesson {
  id: number;
  blockId: number;
  title: string;
  description: string;
  durationMinutes: number;
  isLocked: boolean;
  isCompleted: boolean;
  blocks: LessonBlock[];
  completedBlockIds: string[]; // Track which blocks are done
  quiz?: {
    questions: QuizQuestion[];
  };
  aiAnalysisStatus?: 'none' | 'pending' | 'completed';
  
  // Entitlement & Drip Fields
  requiredProductId?: string; // Which product unlocks this lesson
  weekNumber?: number; // For drip content (1, 2, 3...)
}

export interface DiaryEntry {
  id: string;
  date: string;
  symptomLevel: number; // 1-10
  emotionLevel: number; // 1-10
  triggers: string;
  emotions: string; // Text description
  notes: string;
  diet?: string; // Сегодняшний рацион питания
  hasAttacks?: boolean; // Были ли сегодня приступы
  attackSeverity?: number; // Интенсивность приступа 1-10
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

// Diagnostics Types
export type DiagnosticsStage = 'SELECTION' | 'ANAMNESIS' | 'TEST' | 'RESULTS';

export interface AnamnesisAnswer {
  text: string;
  type: 'text' | 'audio'; 
}

export interface DiagnosticsState {
  stage: DiagnosticsStage;
  testType: string | null; 
  
  // Anamnesis State
  currentAnamnesisIndex: number;
  anamnesisAnswers: Record<number, AnamnesisAnswer>; 
  
  // Test State
  currentQuestionIndex: number;
  answers: Record<number, number>; // questionId -> score (1-5)
  
  isComplete: boolean;
  viewingUserId?: string; 
}

// --- COMMERCE & CRM TYPES ---

export type ProductType = 
  | 'interactive_test' 
  | 'course_standard' 
  | 'therapy_block' 
  | 'single_session' 
  | 'audio_pack';

export interface ProductFAQ {
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  type: ProductType;
  title: string;
  description: string; // Short description for card
  price: number;
  features: string[]; // Short bullet points for card
  imageUrl?: string;
  
  // Marketing / Landing Page Data
  fullDescription?: string; // Long markdown text
  benefits?: string[]; // Detailed benefits list
  targetAudience?: string[]; // "For whom?"
  faq?: ProductFAQ[];
}

export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELED';

export interface Order {
  id: string;
  userId: string;
  productId: string;
  amount: number;
  status: OrderStatus;
  createdAt: string; // ISO Date
  externalId?: string; // Prodamus ID
}

export interface UserAccess {
  id: string;
  userId: string;
  productId: string;
  productType: ProductType;
  startDate: string; // ISO Date (Crucial for Drip)
  status: 'active' | 'expired';
}
