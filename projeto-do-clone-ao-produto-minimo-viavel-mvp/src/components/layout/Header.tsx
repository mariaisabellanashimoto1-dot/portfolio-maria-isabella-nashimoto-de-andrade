import React from 'react';
import { signInWithGoogle, logout } from '../../lib/firebase';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useRemoteConfig } from '../../hooks/useRemoteConfig';
import { Button } from '../ui/button';
import { LogIn, LogOut, User as UserIcon, Sun, Moon } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { welcome_message, primary_color } = useRemoteConfig();

  return (
    <header className="bg-app-bg py-12 px-8 md:px-16 lg:px-24 border-b border-app-border">
      <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <h1 
            className="font-heading text-[48px] md:text-[56px] leading-tight font-bold tracking-tight"
            style={{ color: primary_color }}
          >
            Pixels<span className="text-app-text">Ocultos</span>
          </h1>
          <p className="font-sans text-app-text-muted text-lg mt-2 max-w-2xl">
            {welcome_message}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-app-text-muted hover:text-app-purple hover:bg-app-purple/10 rounded-xl"
            title={theme === 'light' ? 'Ativar Modo Escuro' : 'Ativar Modo Claro'}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </Button>

          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-3 bg-app-card p-2 pr-4 rounded-2xl border border-app-border shadow-xl">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'User'} 
                      className="w-10 h-10 rounded-xl border border-app-purple/30"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-app-purple/20 flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-app-purple" />
                    </div>
                  )}
                  <div className="hidden sm:block">
                    <p className="text-app-text text-sm font-semibold leading-none">{user.displayName}</p>
                    <p className="text-app-text-muted text-[11px] leading-none mt-1">{user.email}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={logout}
                    className="text-app-text-muted hover:text-app-purple hover:bg-app-purple/10 rounded-xl ml-2"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={signInWithGoogle}
                  className="bg-app-purple text-white hover:bg-app-purple-dark font-bold px-6 py-6 rounded-2xl flex items-center gap-3 shadow-lg shadow-app-purple/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <LogIn className="w-5 h-5" />
                  Login with Google
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};
