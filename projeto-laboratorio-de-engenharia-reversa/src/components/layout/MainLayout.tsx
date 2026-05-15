import React, { useState } from 'react';
import { Header } from './Header';
import { ActionSection } from './ActionSection';
import { FAQSection } from './FAQSection';
import { ResultsView } from './ResultsView';
import { MetadataResult } from '@/services/MetadataService';

export const MainLayout: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<MetadataResult | null>(null);

  if (analysisResult) {
    return <ResultsView result={analysisResult} onBack={() => setAnalysisResult(null)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-solar-base03">
      <Header />
      <ActionSection onResult={setAnalysisResult} />
      <FAQSection />
    </div>
  );
};
