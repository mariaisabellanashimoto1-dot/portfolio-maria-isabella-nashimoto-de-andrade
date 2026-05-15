import React, { useState } from 'react';
import { MetadataResult } from '@/services/MetadataService';
import { AIDetectionService, AIDetectionResult } from '@/services/AIDetectionService';
import { ColorHistogram } from './ColorHistogram';
import { useRemoteConfig } from '@/hooks/useRemoteConfig';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, FileText, Brain, Sparkles, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ResultsViewProps {
  result: MetadataResult;
  onBack: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ result, onBack }) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [aiResult, setAiResult] = useState<AIDetectionResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const { show_ai_detector } = useRemoteConfig();

  const handleAIDetection = async () => {
    const urlToAnalyze = result.originalUrl || result.thumbnail;
    if (!urlToAnalyze) return;
    
    setIsDetecting(true);
    setAiError(null);
    try {
      const detection = await AIDetectionService.detectAI(urlToAnalyze);
      setAiResult(detection);
    } catch (err: any) {
      setAiError(err.message || 'Erro ao detectar IA.');
    } finally {
      setIsDetecting(false);
    }
  };
  const generateReport = () => {
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(124, 58, 237); // App Purple
    doc.text('Relatório de Metadados - Pixels Ocultos', 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // Muted Text
    doc.text(`Gerado em: ${timestamp}`, 14, 28);
    doc.text(`Arquivo: ${result.source}`, 14, 33);
    doc.text(`Formato: ${result.format}`, 14, 38);

    let currentY = 45;

    Object.entries(result.groups).forEach(([groupName, tags]) => {
      // Check if we need a new page
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFontSize(14);
      doc.setTextColor(31, 41, 55); // Dark Text
      doc.text(groupName, 14, currentY);
      currentY += 5;

      const tableData = Object.entries(tags).map(([key, value]) => [
        key,
        typeof value === 'object' ? JSON.stringify(value) : String(value)
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [['Tag', 'Valor']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [124, 58, 237], textColor: [255, 255, 255] },
        styles: { fontSize: 8, cellPadding: 2 },
        margin: { left: 14, right: 14 },
        didDrawPage: (data) => {
          currentY = data.cursor ? data.cursor.y + 10 : 20;
        }
      });

      // Update currentY for next group
      // @ts-ignore - autoTable adds lastAutoTable to doc
      currentY = doc.lastAutoTable.finalY + 10;
    });

    doc.save(`relatorio-metadados-${result.source.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  };

  return (
    <div className="bg-app-bg min-h-screen py-12 px-8 md:px-16 lg:px-24 font-sans text-app-text">
      <div className="max-w-6xl w-full mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <Button 
            onClick={onBack}
            variant="outline"
            className="border-app-border text-app-text-muted hover:text-app-purple hover:border-app-purple rounded-2xl px-6 py-6 transition-all"
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Voltar para Análise
          </Button>

          <Button 
            onClick={generateReport}
            className="bg-app-purple text-white hover:bg-app-purple-dark rounded-2xl px-6 py-6 font-bold shadow-lg shadow-app-purple/20 transition-all flex items-center gap-2"
          >
            <Download className="w-5 h-5" /> Gerar Relatório PDF
          </Button>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-app-border pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-app-text tracking-tight">
              Metadata <span className="text-app-purple">Results</span>
            </h1>
            <p className="text-app-text-muted mt-2 font-mono text-sm truncate max-w-xl">
              {result.source}
            </p>
          </div>
          <div className="bg-app-purple/10 text-app-purple px-4 py-2 rounded-xl border border-app-purple/20 font-bold text-sm uppercase tracking-widest">
            {result.format}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Summary & Thumbnail */}
          <div className="lg:col-span-1 space-y-8">
            {result.thumbnail && (
              <div className="border border-app-border p-3 bg-app-card rounded-3xl shadow-2xl overflow-hidden group">
                <img 
                  src={result.thumbnail} 
                  alt="Preview" 
                  className="w-full h-auto max-h-[500px] object-contain rounded-2xl group-hover:scale-[1.02] transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="mt-4 flex items-center justify-center gap-2 text-app-text-muted text-xs font-medium uppercase tracking-tighter">
                  <div className="w-1.5 h-1.5 rounded-full bg-app-purple animate-pulse" />
                  {result.isImage ? 'Image Preview' : 'Embedded Thumbnail'}
                </div>
              </div>
            )}
            
            <div className="bg-app-card p-8 rounded-3xl border border-app-border shadow-xl">
              <h2 className="text-app-text font-heading font-bold text-xl mb-6 flex items-center gap-3">
                <div className="w-2 h-6 bg-app-purple rounded-full" />
                File Overview
              </h2>
              <div className="space-y-6">
                <div className="bg-app-bg/50 p-4 rounded-2xl border border-app-border">
                  <p className="text-app-text-muted text-[10px] uppercase font-bold tracking-widest mb-1">Format</p>
                  <p className="text-app-text font-bold text-lg">{result.format}</p>
                </div>
                <div className="bg-app-bg/50 p-4 rounded-2xl border border-app-border">
                  <p className="text-app-text-muted text-[10px] uppercase font-bold tracking-widest mb-1">Source Name</p>
                  <p className="text-app-text font-medium text-sm break-all">{result.source}</p>
                </div>
              </div>
            </div>

            {/* Color Histogram Card */}
            {result.isImage && result.thumbnail && (
              <ColorHistogram imageUrl={result.thumbnail} />
            )}

            {/* AI Detection Card */}
            {show_ai_detector && (
              <div className="bg-app-card p-8 rounded-3xl border border-app-border shadow-xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Brain className="w-16 h-16 text-app-purple" />
              </div>
              
              <h2 className="text-app-text font-heading font-bold text-xl mb-6 flex items-center gap-3 relative z-10">
                <div className="w-2 h-6 bg-app-purple rounded-full" />
                Detector de IA
              </h2>

              {!aiResult ? (
                <div className="space-y-4 relative z-10">
                  <p className="text-app-text-muted text-sm leading-relaxed">
                    Quer saber se este arquivo foi gerado por inteligência artificial? Nossa análise avançada pode identificar padrões comuns em IAs para imagens, vídeos e áudios.
                  </p>
                  <Button 
                    onClick={handleAIDetection}
                    disabled={isDetecting}
                    className="w-full bg-app-purple text-white hover:bg-app-purple-dark rounded-2xl py-6 font-bold flex items-center justify-center gap-2 shadow-lg shadow-app-purple/20 transition-all"
                  >
                    {isDetecting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analisando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Verificar Origem
                      </>
                    )}
                  </Button>
                  {aiError && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {aiError}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-6 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className={`p-4 rounded-2xl border flex items-center gap-4 ${
                    aiResult.isAI 
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' 
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                  }`}>
                    {aiResult.isAI ? (
                      <AlertCircle className="w-8 h-8 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-8 h-8 shrink-0" />
                    )}
                    <div>
                      <p className="font-bold text-lg leading-tight">
                        {aiResult.isAI ? 'Provável IA' : 'Provável Humana'}
                      </p>
                      <p className="text-xs opacity-80">
                        Confiança: {(aiResult.confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="bg-app-bg/50 p-4 rounded-2xl border border-app-border">
                    <p className="text-app-text-muted text-[10px] uppercase font-bold tracking-widest mb-2">Análise Técnica</p>
                    <p className="text-app-text text-sm leading-relaxed italic">
                      "{aiResult.reasoning}"
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setAiResult(null)}
                    className="text-app-text-muted hover:text-app-purple text-xs"
                  >
                    Analisar novamente
                  </Button>
                </div>
              )}
            </div>
            )}
          </div>

          {/* Right Column: Detailed Tags */}
          <div className="lg:col-span-2 space-y-10">
            {Object.entries(result.groups).map(([groupName, tags]) => (
              <div key={groupName} className="bg-app-card rounded-3xl border border-app-border shadow-xl overflow-hidden">
                <div className="bg-app-purple/5 px-8 py-5 border-b border-app-border flex justify-between items-center">
                  <h2 className="text-app-purple-light text-xl font-heading font-bold">
                    {groupName}
                  </h2>
                  <span className="bg-app-purple/20 text-app-purple text-[10px] px-2 py-1 rounded-lg font-bold">
                    {Object.keys(tags).length} TAGS
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-app-bg/30">
                        <th className="py-4 px-8 font-bold text-app-text-muted uppercase text-[10px] tracking-widest w-1/3">Tag Name</th>
                        <th className="py-4 px-8 font-bold text-app-text-muted uppercase text-[10px] tracking-widest">Metadata Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-app-border">
                      {Object.entries(tags).map(([key, value]) => (
                        <tr key={key} className="hover:bg-app-purple/5 transition-colors group">
                          <td className="py-4 px-8 font-bold text-app-text group-hover:text-app-purple-light transition-colors">{key}</td>
                          <td className="py-4 px-8 text-app-text-muted font-mono text-xs break-all">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
