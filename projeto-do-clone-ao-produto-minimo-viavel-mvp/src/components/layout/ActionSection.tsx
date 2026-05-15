import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MetadataService, MetadataResult } from '@/services/MetadataService';
import { UserService } from '@/services/UserService';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ActionSectionProps {
  onResult: (result: MetadataResult) => void;
}

export const ActionSection: React.FC<ActionSectionProps> = ({ onResult }) => {
  const { user } = useAuth();
  const [fileName, setFileName] = useState<string>('Nenhum arquivo escolhido');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const saveToHistory = async (result: MetadataResult, source: 'file' | 'url') => {
    if (user) {
      try {
        const summary = Object.entries(result.groups)
          .map(([group, tags]) => `${group}: ${Object.keys(tags).length} tags`)
          .join(', ');
        
        await UserService.addToHistory(user.uid, {
          fileName: result.source,
          fileType: result.format,
          source,
          summary: summary.substring(0, 1000)
        });
      } catch (err) {
        console.error('Failed to save history:', err);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      setSelectedFile(file);
      setError(null);
    } else {
      setFileName('Nenhum arquivo escolhido');
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await MetadataService.extractFromFile(selectedFile);
      onResult(result);
      await saveToHistory(result, 'file');
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUrlInspect = async () => {
    if (!url) return;
    
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await MetadataService.extractFromUrl(url);
      onResult(result);
      await saveToHistory(result, 'url');
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section className="bg-app-bg py-16 px-8 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto w-full flex flex-col gap-12">
        
        {error && (
          <div className="w-full bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl font-sans text-sm flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Analyze a File */}
          <div className="bg-app-card border border-app-border p-8 rounded-3xl shadow-2xl flex flex-col gap-6 group hover:border-app-purple/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-app-purple/10 flex items-center justify-center text-app-purple group-hover:bg-app-purple group-hover:text-white transition-all">
                <Loader2 className={`w-6 h-6 ${isAnalyzing ? 'animate-spin' : ''}`} />
              </div>
              <h2 className="text-app-text text-2xl font-heading font-bold">
                Analyze a File
              </h2>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="relative">
                <label 
                  htmlFor="file-upload" 
                  className="flex items-center justify-between bg-app-bg border border-app-border rounded-2xl px-4 py-4 cursor-pointer hover:bg-app-border/50 transition-all"
                >
                  <span className="text-app-text-muted text-sm truncate pr-4">
                    {fileName}
                  </span>
                  <span className="bg-app-purple text-white px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shadow-lg shadow-app-purple/20">
                    Browse
                  </span>
                </label>
                <input 
                  type="file" 
                  id="file-upload" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </div>
              
              <Button 
                onClick={handleUpload}
                disabled={!selectedFile || isAnalyzing}
                className="bg-app-purple text-white hover:bg-app-purple-dark h-14 rounded-2xl text-lg font-bold shadow-lg shadow-app-purple/20 disabled:opacity-30 transition-all"
              >
                {isAnalyzing ? <Loader2 className="animate-spin h-6 w-6" /> : 'Start Analysis'}
              </Button>
              
              <p className="text-app-text-muted text-xs text-center">
                Supports JPEG, PNG, MP4, MP3, and more.
              </p>
            </div>
          </div>

          {/* Analyze a URL */}
          <div className="bg-app-card border border-app-border p-8 rounded-3xl shadow-2xl flex flex-col gap-6 group hover:border-app-purple/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-app-purple/10 flex items-center justify-center text-app-purple group-hover:bg-app-purple group-hover:text-white transition-all">
                <Loader2 className={`w-6 h-6 ${isAnalyzing ? 'animate-spin' : ''}`} />
              </div>
              <h2 className="text-app-text text-2xl font-heading font-bold">
                Analyze a URL
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              <input 
                type="url" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/image.jpg" 
                className="bg-app-bg border border-app-border text-app-text rounded-2xl px-4 py-4 font-sans text-sm focus:outline-none focus:border-app-purple transition-all"
              />
              
              <Button 
                onClick={handleUrlInspect}
                disabled={!url || isAnalyzing}
                className="bg-app-purple text-white hover:bg-app-purple-dark h-14 rounded-2xl text-lg font-bold shadow-lg shadow-app-purple/20 disabled:opacity-30 transition-all"
              >
                {isAnalyzing ? <Loader2 className="animate-spin h-6 w-6" /> : 'Inspect URL'}
              </Button>

              <p className="text-app-text-muted text-xs text-center">
                Enter a direct link to a media asset.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
