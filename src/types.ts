export type SkillCategory =
  | 'PROGRAMMING'
  | 'WEB_DEVELOPMENT'
  | 'GRAPHIC_DESIGN'
  | 'MATHEMATICS'
  | 'COMMUNICATION'
  | 'LANGUAGES'
  | 'PHOTOGRAPHY'
  | 'MUSIC'
  | 'MARKETING'
  | 'OTHER';

export const CATEGORY_LABELS: Record<SkillCategory, string> = {
  PROGRAMMING: 'Programming',
  WEB_DEVELOPMENT: 'Web Development',
  GRAPHIC_DESIGN: 'Graphic Design',
  MATHEMATICS: 'Mathematics',
  COMMUNICATION: 'Communication',
  LANGUAGES: 'Languages',
  PHOTOGRAPHY: 'Photography',
  MUSIC: 'Music',
  MARKETING: 'Marketing',
  OTHER: 'Other',
};

export interface User {
  id: number;
  fullName: string;
  email: string;
  bio: string | null;
  university: string | null;
  location: string | null;
  avatarId: string;
  theme: string;
  language: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Wallet {
  balance: number;
  totalEarned: number;
  totalSpent: number;
}

export interface Transaction {
  id: number;
  type: 'EARN' | 'SPEND';
  amount: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
}

export interface SkillOffer {
  id: number;
  skillId: number;
  name: string;
  category: SkillCategory;
  skillType: 'TEACH' | 'LEARN';
  level: string;
  details: string | null;
  ownerId: number;
  ownerName: string;
  ownerAvatarId: string;
}

export interface CatalogSkill {
  id: number;
  name: string;
  category: SkillCategory;
  description: string | null;
}

export interface Match {
  userId: number;
  fullName: string;
  university: string | null;
  avatarId: string;
  bio: string | null;
  matchPercent: number;
  canTeachYou: string[];
  wantsFromYou: string[];
  explanation: string;
}

export interface Participant {
  id: number;
  fullName: string;
  avatarId: string;
}

export interface ExchangeRequest {
  id: number;
  learner: Participant;
  teacher: Participant;
  skillName: string;
  hours: number;
  message: string | null;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
  role: 'LEARNER' | 'TEACHER';
  createdAt: string;
  sessionId: number | null;
  scheduledAt: string | null;
  sessionStatus: 'SCHEDULED' | 'COMPLETED' | null;
  rateable: boolean;
}

export interface Session {
  id: number;
  requestId: number;
  skillName: string;
  partnerName: string;
  partnerAvatarId: string;
  role: 'LEARNER' | 'TEACHER';
  scheduledAt: string;
  hours: number;
  status: 'SCHEDULED' | 'COMPLETED';
  rateable: boolean;
}

export interface Notification {
  id: number;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Rating {
  id: number;
  raterName: string;
  stars: number;
  comment: string | null;
  skillName: string;
  createdAt: string;
}

export interface Badge {
  key: string;
  title: string;
  description: string;
  earned: boolean;
}

export interface Dashboard {
  user: User;
  wallet: Wallet;
  teaching: SkillOffer[];
  learning: SkillOffer[];
  recommendedMatches: Match[];
  pendingRequests: ExchangeRequest[];
  upcomingSessions: Session[];
  recentActivity: Notification[];
  badges: Badge[];
  averageRating: number;
  ratingCount: number;
  unreadNotifications: number;
}

export interface PublicStats {
  students: number;
  skillOffers: number;
  sessionsCompleted: number;
  hoursExchanged: number;
}
