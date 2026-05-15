import React, { useEffect, useState } from 'react';
import { UserService, HistoryItem } from '@/services/UserService';
import { useAuth } from '@/hooks/useAuth';
import { Clock, FileText, Globe, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const HistorySection: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await UserService.getHistory(user.uid);
      setHistory(data);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!user || !itemId) return;
    try {
      await UserService.deleteHistoryItem(user.uid, itemId);
      setHistory(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
  };

  const handleClearAll = async () => {
    if (!user || history.length === 0) return;
    
    if (!isConfirmingClear) {
      setIsConfirmingClear(true);
      setTimeout(() => setIsConfirmingClear(false), 3000);
      return;
    }
    
    setLoading(true);
    setIsConfirmingClear(false);
    try {
      await UserService.clearAllHistory(user.uid);
      setHistory([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <section className="bg-app-bg py-16 px-8 md:px-16 lg:px-24 border-t border-app-border">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-app-text text-3xl font-heading font-bold flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-app-purple/10 flex items-center justify-center text-app-purple">
              <Clock className="w-6 h-6" />
            </div>
            Your Analysis History
          </h2>
          <div className="flex gap-3">
            {history.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearAll}
                className={`${isConfirmingClear ? 'bg-red-500 text-white hover:bg-red-600' : 'text-red-400 hover:text-red-500 hover:bg-red-500/10'} rounded-xl transition-all duration-300`}
              >
                {isConfirmingClear ? 'Confirmar Exclusão?' : 'Limpar Tudo'}
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadHistory}
              className="border-app-border text-app-text-muted hover:text-app-purple hover:border-app-purple rounded-xl"
            >
              Refresh
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-app-purple w-12 h-12" />
          </div>
        ) : history.length > 0 ? (
          <div className="grid gap-4">
            {history.map((item) => (
              <div 
                key={item.id} 
                className="bg-app-card border border-app-border p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-app-purple/30 hover:bg-app-card/80 transition-all group"
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-app-bg flex items-center justify-center text-app-purple group-hover:scale-110 transition-transform">
                    {item.source === 'file' ? (
                      <FileText className="w-6 h-6" />
                    ) : (
                      <Globe className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-app-text font-bold text-lg leading-tight truncate">
                      {item.fileName}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-app-text-muted text-xs">
                        {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-app-border" />
                      <span className="text-app-purple-light text-xs font-medium uppercase tracking-wider">
                        {item.fileType}
                      </span>
                    </div>
                    <p className="text-app-text-muted text-sm mt-3 line-clamp-2 bg-app-bg/50 p-3 rounded-xl border border-app-border/50">
                      {item.summary}
                    </p>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  onClick={() => item.id && handleDelete(item.id)}
                  className="self-end md:self-center text-app-text-muted hover:text-red-400 hover:bg-red-400/10 rounded-xl"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-app-card border border-dashed border-app-border p-16 rounded-3xl text-center">
            <p className="text-app-text-muted font-sans italic">
              No recent analyses found. Start by uploading a file or entering a URL.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
