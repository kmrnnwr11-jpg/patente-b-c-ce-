import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Bell, 
  Palette, 
  Globe, 
  Moon,
  Sun,
  Volume2,
  Zap
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

export const SettingsPage: FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  
  const [settings, setSettings] = useState({
    theme: localStorage.getItem('theme') || 'dark',
    language: localStorage.getItem('language') || 'it',
    notifications: localStorage.getItem('notifications') !== 'false',
    sound: localStorage.getItem('sound') !== 'false',
    autoSave: localStorage.getItem('autoSave') !== 'false',
    animations: localStorage.getItem('animations') !== 'false'
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    localStorage.setItem(key, value.toString());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Impostazioni
          </h1>
          <p className="text-white/70">
            Personalizza la tua esperienza
          </p>
        </div>

        {/* Account Section */}
        <GlassCard className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Account</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div>
                <div className="font-medium text-white mb-1">Email</div>
                <div className="text-sm text-white/70">
                  {currentUser?.email || 'Non autenticato'}
                </div>
              </div>
              <Button
                onClick={() => navigate('/profile')}
                variant="outline"
                className="text-white border-white/30"
              >
                Modifica Profilo
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* Appearance Section */}
        <GlassCard className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Aspetto</h2>
          </div>

          <div className="space-y-4">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                {settings.theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-white/70" />
                ) : (
                  <Sun className="w-5 h-5 text-white/70" />
                )}
                <div>
                  <div className="font-medium text-white">Tema</div>
                  <div className="text-sm text-white/60">
                    {settings.theme === 'dark' ? 'Scuro' : 'Chiaro'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => updateSetting('theme', settings.theme === 'dark' ? 'light' : 'dark')}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  settings.theme === 'dark' ? 'bg-blue-500' : 'bg-gray-400'
                }`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Animations Toggle */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-white/70" />
                <div>
                  <div className="font-medium text-white">Animazioni</div>
                  <div className="text-sm text-white/60">
                    Effetti visivi e transizioni
                  </div>
                </div>
              </div>
              <button
                onClick={() => updateSetting('animations', !settings.animations)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  settings.animations ? 'bg-blue-500' : 'bg-gray-400'
                }`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.animations ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Preferences Section */}
        <GlassCard className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Preferenze</h2>
          </div>

          <div className="space-y-4">
            {/* Notifications */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div>
                <div className="font-medium text-white">Notifiche</div>
                <div className="text-sm text-white/60">
                  Ricevi notifiche per achievement e promemoria
                </div>
              </div>
              <button
                onClick={() => updateSetting('notifications', !settings.notifications)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  settings.notifications ? 'bg-blue-500' : 'bg-gray-400'
                }`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.notifications ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Sound */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-white/70" />
                <div>
                  <div className="font-medium text-white">Suoni</div>
                  <div className="text-sm text-white/60">
                    Effetti sonori e feedback audio
                  </div>
                </div>
              </div>
              <button
                onClick={() => updateSetting('sound', !settings.sound)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  settings.sound ? 'bg-blue-500' : 'bg-gray-400'
                }`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.sound ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Auto Save */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div>
                <div className="font-medium text-white">Salvataggio Automatico</div>
                <div className="text-sm text-white/60">
                  Salva automaticamente i progressi dei quiz
                </div>
              </div>
              <button
                onClick={() => updateSetting('autoSave', !settings.autoSave)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  settings.autoSave ? 'bg-blue-500' : 'bg-gray-400'
                }`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.autoSave ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Language */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-white/70" />
                <div>
                  <div className="font-medium text-white">Lingua</div>
                  <div className="text-sm text-white/60">Italiano</div>
                </div>
              </div>
              <select
                value={settings.language}
                onChange={(e) => updateSetting('language', e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="it">Italiano</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* App Info */}
        <div className="text-center text-white/50 text-sm">
          <p>Patente B 2025 - Versione 1.0.0</p>
          <p className="mt-1">Made with ❤️ in Italy</p>
        </div>
      </div>
    </div>
  );
};
