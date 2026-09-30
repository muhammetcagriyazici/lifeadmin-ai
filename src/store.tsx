import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Lang, translations, TranslationDict } from '@/i18n';

export type CaseStatus = 'pending' | 'inProgress' | 'resolved';

export type AppView = 'dashboard' | 'cases' | 'settings' | 'admin';

export type UserRole = 'admin' | 'user';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: number;
}

export interface CaseItem {
  id: string;
  title: string;
  titleEn: string;
  status: CaseStatus;
  deadline: string;
  amount?: string;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  contentEn: string;
  rights?: string[];
  rightsEn?: string[];
  recommendation?: string;
  recommendationEn?: string;
  nextSteps?: string[];
  nextStepsEn?: string[];
  timestamp: number;
}

export type DraftTab = 'email' | 'whatsapp' | 'formal';

interface AppState {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: TranslationDict;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  messages: ChatMessage[];
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  cases: CaseItem[];
  addCase: (title: string, titleEn: string) => void;
  updateCaseStatus: (id: string, status: CaseStatus) => void;
  draftTab: DraftTab;
  setDraftTab: (tab: DraftTab) => void;
  hasDraft: boolean;
  setHasDraft: (v: boolean) => void;
  currentUser: AppUser | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
  users: AppUser[];
  addUser: (name: string, email: string, role: UserRole) => void;
  updateUserStatus: (id: string, status: UserStatus) => void;
  deleteUser: (id: string) => void;
}

const AppContext = createContext<AppState | null>(null);

const mockUsers: AppUser[] = [
  { id: 'u1', name: 'Ayşe Kaya', email: 'ayse.kaya@email.com', role: 'admin', status: 'active', createdAt: Date.now() - 86400000 * 120 },
  { id: 'u2', name: 'Mehmet Yılmaz', email: 'mehmet.yilmaz@email.com', role: 'user', status: 'active', createdAt: Date.now() - 86400000 * 90 },
  { id: 'u3', name: 'Zeynep Demir', email: 'zeynep.demir@email.com', role: 'user', status: 'active', createdAt: Date.now() - 86400000 * 45 },
  { id: 'u4', name: 'Can Öztürk', email: 'can.ozturk@email.com', role: 'user', status: 'inactive', createdAt: Date.now() - 86400000 * 30 },
  { id: 'u5', name: 'Elif Şahin', email: 'elif.sahin@email.com', role: 'admin', status: 'active', createdAt: Date.now() - 86400000 * 200 },
  { id: 'u6', name: 'Burak Aydın', email: 'burak.aydin@email.com', role: 'user', status: 'suspended', createdAt: Date.now() - 86400000 * 15 },
  { id: 'u7', name: 'Selin Koç', email: 'selin.koc@email.com', role: 'user', status: 'active', createdAt: Date.now() - 86400000 * 7 },
  { id: 'u8', name: 'Emre Çelik', email: 'emre.celik@email.com', role: 'user', status: 'active', createdAt: Date.now() - 86400000 * 3 },
];

const defaultUser: AppUser = mockUsers[0];

const initialCases: CaseItem[] = [
  {
    id: '1',
    title: 'Spor Salonu İptali',
    titleEn: 'Gym Cancellation',
    status: 'pending',
    deadline: '2026-10-05',
    amount: '₺1.200',
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: '2',
    title: 'Kargo Hasarı İadesi',
    titleEn: 'Damaged Package Refund',
    status: 'inProgress',
    deadline: '2026-10-10',
    amount: '₺850',
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: '3',
    title: 'Banka Aidatı İadesi',
    titleEn: 'Bank Fee Refund',
    status: 'resolved',
    deadline: '2026-09-20',
    amount: '₺480',
    createdAt: Date.now() - 86400000 * 15,
  },
  {
    id: '4',
    title: 'Online İade Reddi',
    titleEn: 'Online Return Refusal',
    status: 'inProgress',
    deadline: '2026-10-15',
    amount: '₺2.300',
    createdAt: Date.now() - 86400000 * 2,
  },
];

const initialMessage: ChatMessage = {
  id: 'init',
  role: 'ai',
  content: '',
  contentEn: '',
  timestamp: Date.now(),
};

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('tr');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<AppView>('dashboard');
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [cases, setCases] = useState<CaseItem[]>(initialCases);
  const [draftTab, setDraftTab] = useState<DraftTab>('email');
  const [hasDraft, setHasDraft] = useState(false);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(defaultUser);
  const [users, setUsers] = useState<AppUser[]>(mockUsers);

  const toggleSidebar = useCallback(() => setSidebarCollapsed((v) => !v), []);

  const addMessage = useCallback((msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    setMessages((prev) => [...prev, { ...msg, id: Math.random().toString(36).slice(2), timestamp: Date.now() }]);
  }, []);

  const addCase = useCallback((title: string, titleEn: string) => {
    const id = Math.random().toString(36).slice(2);
    const deadline = new Date(Date.now() + 86400000 * 14).toISOString().slice(0, 10);
    setCases((prev) => [
      { id, title, titleEn, status: 'pending' as CaseStatus, deadline, createdAt: Date.now() },
      ...prev,
    ]);
  }, []);

  const updateCaseStatus = useCallback((id: string, status: CaseStatus) => {
    setCases((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  }, []);

  const login = useCallback((email: string, name?: string) => {
    const existing = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
    } else {
      const newName = name || email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      setCurrentUser({
        id: Math.random().toString(36).slice(2),
        name: newName,
        email,
        role: 'user',
        status: 'active',
        createdAt: Date.now(),
      });
    }
    setActiveView('dashboard');
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setActiveView('dashboard');
  }, []);

  const addUser = useCallback((name: string, email: string, role: UserRole) => {
    setUsers((prev) => [
      { id: Math.random().toString(36).slice(2), name, email, role, status: 'active', createdAt: Date.now() },
      ...prev,
    ]);
  }, []);

  const updateUserStatus = useCallback((id: string, status: UserStatus) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
  }, []);

  const deleteUser = useCallback((id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const t = translations[lang];

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t,
        sidebarCollapsed,
        toggleSidebar,
        activeView,
        setActiveView,
        messages,
        addMessage,
        cases,
        addCase,
        updateCaseStatus,
        draftTab,
        setDraftTab,
        hasDraft,
        setHasDraft,
        currentUser,
        login,
        logout,
        users,
        addUser,
        updateUserStatus,
        deleteUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export { getInitials };
