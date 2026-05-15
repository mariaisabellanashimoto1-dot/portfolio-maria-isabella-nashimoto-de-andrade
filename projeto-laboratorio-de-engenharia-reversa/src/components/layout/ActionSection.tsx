import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MetadataService, MetadataResult } from '@/services/MetadataService';
import { Loader2 } from 'lucide-react';

interface ActionSectionProps {
  onResult: (result: MetadataResult) => void;
}

export const ActionSection: React.FC<ActionSectionProps> = ({ onResult }) => {
  const [fileName, setFileName] = useState<string>('Nenhum arquivo escolhido');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section className="bg-solar-base02 min-h-[445.75px] py-12 px-8 md:px-16 lg:px-24 flex flex-col items-start justify-center gap-16">
      <div className="max-w-6xl w-full flex flex-col gap-16">
        
        {error && (
          <div className="w-full bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-[2px] font-mono text-sm">
            Error: {error}
          </div>
        )}

        {/* Analyze a File */}
        <div className="w-full">
          <h2 className="text-solar-cyan text-[38.4px] font-mono font-bold border-b border-solar-cyan/30 mb-6 leading-none pb-2">
            Analyze a File:
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div 
                className="flex items-center border border-[#657c7b] bg-[#586e75] rounded-[2px] overflow-hidden"
                style={{ width: '550.891px', height: '28.078px' }}
              >
                <label 
                  htmlFor="file-upload" 
                  className="bg-white text-black px-3 h-full flex items-center cursor-pointer text-[13px] font-mono font-bold whitespace-nowrap"
                >
                  Escolher arquivo
                </label>
                <input 
                  type="file" 
                  id="file-upload" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
                <span className="px-3 text-solar-cyan font-mono text-[13px] truncate">
                  {fileName}
                </span>
              </div>
              <Button 
                onClick={handleUpload}
                disabled={!selectedFile || isAnalyzing}
                className="bg-solar-button text-solar-base03 hover:bg-solar-button/90 h-[27.078px] w-[126.734px] rounded-[5px] text-[100%] font-mono font-bold disabled:opacity-50"
              >
                {isAnalyzing ? <Loader2 className="animate-spin h-4 w-4" /> : 'Upload File'}
              </Button>
            </div>
            <p className="text-solar-cyan font-mono text-sm">
              Or just drag and drop a file here.
            </p>
          </div>
        </div>

        {/* Analyze a URL */}
        <div className="w-full">
          <h2 className="text-solar-cyan text-[38.4px] font-mono font-bold border-b border-solar-cyan/30 mb-6 leading-none pb-2">
            Analyze a URL:
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <span className="text-solar-cyan font-mono text-sm font-bold">URL:</span>
              <input 
                type="url" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="" 
                className="bg-[#586e75] border border-[#657c7b] text-solar-cyan rounded-[2px] px-2 font-mono focus:outline-none"
                style={{ width: '550.891px', height: '22.078px' }}
              />
              <Button 
                onClick={handleUrlInspect}
                disabled={!url || isAnalyzing}
                className="bg-solar-button text-solar-base03 hover:bg-solar-button/90 h-[27.078px] w-[126.734px] rounded-[5px] text-[100%] font-mono font-bold disabled:opacity-50"
              >
                {isAnalyzing ? <Loader2 className="animate-spin h-4 w-4" /> : 'Inspect URL'}
              </Button>
            </div>
            <p className="text-solar-cyan font-mono text-sm">
              Enter the URL of a media asset.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
