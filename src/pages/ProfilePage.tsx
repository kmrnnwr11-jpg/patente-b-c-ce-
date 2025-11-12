import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, Award, LogOut, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Navbar } from '@/components/layout/Navbar';

export const ProfilePage: FC = () => {
  const navigate = useNavigate();
  const { currentUser, userData, logout, updateUserProfile } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSaveProfile = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await updateUserProfile(displayName);
      setSuccess('Profilo aggiornato con successo!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Update profile error:', err);
      setError('Errore aggiornamento profilo');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Il Tuo Profilo</h1>
            <p className="text-white/70">Gestisci le tue informazioni personali</p>
          </div>

          {/* Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-100 text-sm"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-100 text-sm"
            >
              {success}
            </motion.div>
          )}

          {/* Profile Card */}
          <GlassCard className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-3xl font-bold">
                  {currentUser?.displayName?.charAt(0).toUpperCase() || 'U'}
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {currentUser?.displayName || 'Utente'}
                  </h2>
                  <p className="text-white/70">
                    {userData?.isPremium ? '⭐ Premium' : '🆓 Free'}
                  </p>
                </div>
              </div>

              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-white/20 hover:bg-white/30 text-white"
                >
                  <Edit2 size={18} className="mr-2" />
                  Modifica
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Save size={18} className="mr-2" />
                    Salva
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setDisplayName(currentUser?.displayName || '');
                    }}
                    className="bg-white/20 hover:bg-white/30 text-white"
                  >
                    <X size={18} />
                  </Button>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="space-y-4">
              {/* Display Name */}
              <div>
                <label className="flex items-center gap-2 text-white/70 text-sm mb-2">
                  <User size={16} />
                  Nome Completo
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                ) : (
                  <p className="text-white text-lg">{currentUser?.displayName || 'Non impostato'}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-white/70 text-sm mb-2">
                  <Mail size={16} />
                  Email
                </label>
                <p className="text-white text-lg">{currentUser?.email || 'Non disponibile'}</p>
                {currentUser?.emailVerified ? (
                  <span className="text-green-400 text-xs">✓ Verificata</span>
                ) : (
                  <span className="text-yellow-400 text-xs">⚠ Non verificata</span>
                )}
              </div>

              {/* Phone */}
              {currentUser?.phoneNumber && (
                <div>
                  <label className="flex items-center gap-2 text-white/70 text-sm mb-2">
                    <Phone size={16} />
                    Telefono
                  </label>
                  <p className="text-white text-lg">{currentUser.phoneNumber}</p>
                </div>
              )}

              {/* Registration Date */}
              <div>
                <label className="flex items-center gap-2 text-white/70 text-sm mb-2">
                  <Calendar size={16} />
                  Membro dal
                </label>
                <p className="text-white text-lg">
                  {userData?.createdAt ? formatDate(userData.createdAt) : 'N/A'}
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Stats Card */}
          <GlassCard className="p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Award size={24} />
              Le Tue Statistiche
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  {userData?.totalQuizzes || 0}
                </div>
                <div className="text-white/70 text-sm">Quiz Completati</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  {userData?.streak || 0}
                </div>
                <div className="text-white/70 text-sm">Giorni Consecutivi</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  {userData?.totalAnswers 
                    ? Math.round((userData.correctAnswers / userData.totalAnswers) * 100) 
                    : 0}%
                </div>
                <div className="text-white/70 text-sm">Precisione</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  {userData?.correctAnswers || 0}
                </div>
                <div className="text-white/70 text-sm">Risposte Corrette</div>
              </div>
            </div>
          </GlassCard>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            {!userData?.isPremium && (
              <Button
                onClick={() => navigate('/premium')}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-4 rounded-xl"
              >
                ⭐ Passa a Premium
              </Button>
            )}

            <Button
              onClick={handleLogout}
              className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-white border border-red-500/50 py-4 rounded-xl"
            >
              <LogOut size={20} className="mr-2" />
              Esci
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

