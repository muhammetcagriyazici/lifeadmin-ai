import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, Search, MoreVertical, Shield, CheckCircle2,
  UserCircle, X, Mail, Trash2, Ban, Check, User as UserIcon,
} from 'lucide-react';
import { useApp, AppUser, UserRole, UserStatus } from '@/store';
import { useState, useRef, useEffect } from 'react';

const roleConfig: Record<UserRole, { label: string; labelEn: string; color: string; bg: string; icon: any }> = {
  admin: { label: 'Yönetici', labelEn: 'Admin', color: 'text-indigo-600', bg: 'bg-indigo-50', icon: Shield },
  user: { label: 'Kullanıcı', labelEn: 'User', color: 'text-ink-600', bg: 'bg-ink-100', icon: UserCircle },
};

const statusConfig: Record<UserStatus, { label: string; labelEn: string; color: string; bg: string; dot: string }> = {
  active: { label: 'Aktif', labelEn: 'Active', color: 'text-emerald-600', bg: 'bg-emerald-50', dot: 'bg-emerald-400' },
  inactive: { label: 'Pasif', labelEn: 'Inactive', color: 'text-ink-500', bg: 'bg-ink-100', dot: 'bg-ink-300' },
  suspended: { label: 'Askıya Alınmış', labelEn: 'Suspended', color: 'text-red-500', bg: 'bg-red-50', dot: 'bg-red-400' },
};

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function AdminPanel() {
  const { t, lang, users, addUser, updateUserStatus, deleteUser } = useApp();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const stats = [
    { label: t.admin.totalUsers, value: users.length, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: t.admin.activeUsers, value: users.filter((u) => u.status === 'active').length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: t.admin.adminUsers, value: users.filter((u) => u.role === 'admin').length, icon: Shield, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: t.admin.newUsers, value: users.filter((u) => Date.now() - u.createdAt < 86400000 * 7).length, icon: UserPlus, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="h-full overflow-y-auto p-6 relative">
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-ink-800 mb-1">{t.admin.title}</h2>
          <p className="text-sm text-ink-400">{t.admin.subtitle}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-indigo text-white text-sm font-semibold shadow-lg shadow-indigo-500/20"
        >
          <UserPlus size={18} />
          {t.admin.create}
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-white rounded-2xl border border-ink-100 p-4"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <p className="text-2xl font-bold text-ink-800">{stat.value}</p>
            <p className="text-xs text-ink-400 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* User table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white rounded-2xl border border-ink-100 overflow-hidden"
      >
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-ink-50">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.admin.search}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-ink-100 bg-ink-50/50 outline-none focus:border-indigo-300 focus:bg-white text-ink-700 transition-all"
            />
          </div>
          <div className="flex gap-1.5">
            {(['all', 'admin', 'user'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  roleFilter === r
                    ? 'gradient-indigo text-white shadow-sm'
                    : 'bg-ink-50 text-ink-500 hover:bg-ink-100'
                }`}
              >
                {r === 'all' ? t.admin.all : r === 'admin' ? t.admin.roleAdmin : t.admin.roleUser}
              </button>
            ))}
          </div>
        </div>

        {/* Table - desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-50 bg-ink-50/30">
                <th className="text-left text-xs font-semibold text-ink-400 uppercase tracking-wider px-4 py-3">{t.admin.name}</th>
                <th className="text-left text-xs font-semibold text-ink-400 uppercase tracking-wider px-4 py-3">{t.admin.email}</th>
                <th className="text-left text-xs font-semibold text-ink-400 uppercase tracking-wider px-4 py-3">{t.admin.role}</th>
                <th className="text-left text-xs font-semibold text-ink-400 uppercase tracking-wider px-4 py-3">{t.admin.status}</th>
                <th className="text-right text-xs font-semibold text-ink-400 uppercase tracking-wider px-4 py-3">{t.admin.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <UserRow
                  key={user.id}
                  user={user}
                  t={t}
                  lang={lang}
                  index={i}
                  openMenuId={openMenuId}
                  setOpenMenuId={setOpenMenuId}
                  menuRef={menuRef}
                  onUpdateStatus={updateUserStatus}
                  onDelete={deleteUser}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards - mobile */}
        <div className="md:hidden divide-y divide-ink-50">
          {filtered.map((user, i) => (
            <MobileUserCard
              key={user.id}
              user={user}
              t={t}
              lang={lang}
              index={i}
              openMenuId={openMenuId}
              setOpenMenuId={setOpenMenuId}
              menuRef={menuRef}
              onUpdateStatus={updateUserStatus}
              onDelete={deleteUser}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm text-ink-400">{t.tracker.empty}</p>
          </div>
        )}
      </motion.div>

      <CreateUserModal open={showModal} onClose={() => setShowModal(false)} onCreate={addUser} />
    </div>
  );
}

function UserRow({
  user, t, lang, index, openMenuId, setOpenMenuId, menuRef, onUpdateStatus, onDelete,
}: {
  user: AppUser;
  t: any;
  lang: string;
  index: number;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
  menuRef: React.RefObject<HTMLDivElement>;
  onUpdateStatus: (id: string, status: UserStatus) => void;
  onDelete: (id: string) => void;
}) {
  const role = roleConfig[user.role];
  const status = statusConfig[user.status];
  const RoleIcon = role.icon;
  const menuOpen = openMenuId === user.id;

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.03 }}
      className="border-b border-ink-50 last:border-0 hover:bg-ink-50/30 transition-colors"
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-indigo flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {getInitials(user.name)}
          </div>
          <span className="text-sm font-medium text-ink-700">{user.name}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-ink-500">{user.email}</span>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg ${role.bg} ${role.color}`}>
          <RoleIcon size={13} />
          {lang === 'en' ? role.labelEn : role.label}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg ${status.bg} ${status.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {lang === 'en' ? status.labelEn : status.label}
        </span>
      </td>
      <td className="px-4 py-3 text-right relative">
        <button
          onClick={() => setOpenMenuId(menuOpen ? null : user.id)}
          className="p-1.5 rounded-lg hover:bg-ink-100 transition-colors text-ink-400 inline-flex"
        >
          <MoreVertical size={16} />
        </button>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.96 }}
              transition={{ duration: 0.12 }}
              className="absolute right-4 top-full mt-1 w-44 bg-white rounded-xl shadow-xl shadow-ink-900/10 border border-ink-100 py-1.5 z-20 text-left"
            >
              {user.status !== 'active' && (
                <button
                  onClick={() => { onUpdateStatus(user.id, 'active'); setOpenMenuId(null); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-600 hover:bg-ink-50 transition-colors"
                >
                  <Check size={15} className="text-emerald-500" />
                  {lang === 'tr' ? 'Aktif Yap' : 'Activate'}
                </button>
              )}
              {user.status !== 'suspended' && (
                <button
                  onClick={() => { onUpdateStatus(user.id, 'suspended'); setOpenMenuId(null); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-600 hover:bg-ink-50 transition-colors"
                >
                  <Ban size={15} className="text-amber-500" />
                  {lang === 'tr' ? 'Askıya Al' : 'Suspend'}
                </button>
              )}
              <button
                onClick={() => { onDelete(user.id); setOpenMenuId(null); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={15} />
                {t.admin.delete}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </td>
    </motion.tr>
  );
}

function MobileUserCard({
  user, t, lang, index, openMenuId, setOpenMenuId, menuRef, onUpdateStatus, onDelete,
}: {
  user: AppUser;
  t: any;
  lang: string;
  index: number;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
  menuRef: React.RefObject<HTMLDivElement>;
  onUpdateStatus: (id: string, status: UserStatus) => void;
  onDelete: (id: string) => void;
}) {
  const role = roleConfig[user.role];
  const status = statusConfig[user.status];
  const menuOpen = openMenuId === user.id;
  const RoleIcon = role.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.03 }}
      className="p-4 relative"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-indigo flex items-center justify-center text-white text-xs font-bold">
            {getInitials(user.name)}
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-700">{user.name}</p>
            <p className="text-xs text-ink-400">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => setOpenMenuId(menuOpen ? null : user.id)}
          className="p-1.5 rounded-lg hover:bg-ink-100 transition-colors text-ink-400"
        >
          <MoreVertical size={16} />
        </button>
      </div>
      <div className="flex items-center gap-2 ml-13">
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${role.bg} ${role.color}`}>
          <RoleIcon size={12} />
          {lang === 'en' ? role.labelEn : role.label}
        </span>
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-lg ${status.bg} ${status.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {lang === 'en' ? status.labelEn : status.label}
        </span>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden"
          >
            <div className="bg-ink-50 rounded-xl p-1.5 space-y-0.5">
              {user.status !== 'active' && (
                <button
                  onClick={() => { onUpdateStatus(user.id, 'active'); setOpenMenuId(null); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-600 hover:bg-white rounded-lg transition-colors"
                >
                  <Check size={15} className="text-emerald-500" />
                  {lang === 'tr' ? 'Aktif Yap' : 'Activate'}
                </button>
              )}
              {user.status !== 'suspended' && (
                <button
                  onClick={() => { onUpdateStatus(user.id, 'suspended'); setOpenMenuId(null); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-600 hover:bg-white rounded-lg transition-colors"
                >
                  <Ban size={15} className="text-amber-500" />
                  {lang === 'tr' ? 'Askıya Al' : 'Suspend'}
                </button>
              )}
              <button
                onClick={() => { onDelete(user.id); setOpenMenuId(null); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-white rounded-lg transition-colors"
              >
                <Trash2 size={15} />
                {t.admin.delete}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CreateUserModal({
  open, onClose, onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, email: string, role: UserRole) => void;
}) {
  const { t, lang } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const reset = () => {
    setName('');
    setEmail('');
    setRole('user');
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; email?: string } = {};
    if (!name.trim()) newErrors.name = lang === 'tr' ? 'Ad soyad gerekli' : 'Name is required';
    if (!email.trim()) newErrors.email = lang === 'tr' ? 'E-posta gerekli' : 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = lang === 'tr' ? 'Geçerli bir e-posta girin' : 'Enter a valid email';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onCreate(name.trim(), email.trim(), role);
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="relative w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl shadow-ink-900/20 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 pb-4 relative">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl gradient-indigo flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <UserPlus size={22} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-ink-800">{t.admin.createUser}</h3>
                    <p className="text-xs text-ink-400">{t.admin.createUserSub}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-ink-100 transition-colors text-ink-400"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-ink-500 mb-1.5 block">{t.admin.name}</label>
                <div className="relative">
                  <UserIcon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.auth.namePlaceholder}
                    className={`w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border bg-white outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-ink-700 ${
                      errors.name ? 'border-red-300 focus:border-red-400' : 'border-ink-100 focus:border-indigo-300'
                    }`}
                  />
                </div>
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="text-xs font-medium text-ink-500 mb-1.5 block">{t.admin.email}</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.auth.emailPlaceholder}
                    className={`w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border bg-white outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-ink-700 ${
                      errors.email ? 'border-red-300 focus:border-red-400' : 'border-ink-100 focus:border-indigo-300'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="text-xs font-medium text-ink-500 mb-1.5 block">{t.admin.role}</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['user', 'admin'] as const).map((r) => {
                    const config = roleConfig[r];
                    const Icon = config.icon;
                    const isSelected = role === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border-2 ${
                          isSelected
                            ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                            : 'border-ink-100 bg-white text-ink-500 hover:border-ink-200'
                        }`}
                      >
                        <Icon size={16} />
                        {lang === 'en' ? config.labelEn : config.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-ink-100 text-ink-600 text-sm font-medium hover:bg-ink-200 transition-colors"
                >
                  {t.common.cancel}
                </button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-2.5 rounded-xl gradient-indigo text-white text-sm font-semibold shadow-lg shadow-indigo-500/20"
                >
                  {t.admin.createBtn}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
