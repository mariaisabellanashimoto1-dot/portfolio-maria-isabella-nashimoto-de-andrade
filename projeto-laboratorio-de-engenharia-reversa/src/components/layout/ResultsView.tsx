import React from 'react';
import { MetadataResult } from '@/services/MetadataService';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ResultsViewProps {
  result: MetadataResult;
  onBack: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ result, onBack }) => {
  return (
    <div className="bg-solar-base03 min-h-screen py-12 px-8 md:px-16 lg:px-24 font-mono text-solar-cyan">
      <div className="max-w-6xl w-full mx-auto">
        <Button 
          onClick={onBack}
          className="mb-8 bg-solar-button text-solar-base03 hover:bg-solar-button/90 font-bold"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Analysis
        </Button>

        <h1 className="text-[38.4px] font-bold border-b border-solar-cyan/30 mb-8 pb-2">
          Metadata for: <span className="text-solar-yellow">{result.source}</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Summary & Thumbnail */}
          <div className="lg:col-span-1 space-y-8">
            {result.thumbnail && (
              <div className="border border-solar-cyan/20 p-2 bg-solar-base02 rounded-[2px]">
                <img 
                  src={result.thumbnail} 
                  alt="Preview" 
                  className="w-full h-auto max-h-[500px] object-contain"
                  referrerPolicy="no-referrer"
                />
                <p className="text-xs mt-2 text-center opacity-60 italic">
                  {result.isImage ? 'Image Preview' : 'Embedded Thumbnail'}
                </p>
              </div>
            )}
            
            <div className="bg-solar-base02 p-6 rounded-[2px] border border-solar-cyan/10">
              <h2 className="text-solar-yellow font-bold mb-4 border-b border-solar-yellow/20 pb-1">File Info</h2>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="opacity-60">Format</dt>
                  <dd className="font-bold">{result.format}</dd>
                </div>
                <div>
                  <dt className="opacity-60">Source</dt>
                  <dd className="truncate" title={result.source}>{result.source}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Right Column: Detailed Tags */}
          <div className="lg:col-span-2 space-y-12">
            {Object.entries(result.groups).map(([groupName, tags]) => (
              <div key={groupName} className="space-y-4">
                <h2 className="text-solar-yellow text-2xl font-bold border-b border-solar-yellow/30 pb-1">
                  {groupName}
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-solar-cyan/10">
                        <th className="py-2 pr-4 font-bold opacity-60 w-1/3">Tag</th>
                        <th className="py-2 font-bold opacity-60">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(tags).map(([key, value]) => (
                        <tr key={key} className="border-b border-solar-cyan/5 hover:bg-solar-base02/50 transition-colors">
                          <td className="py-2 pr-4 font-bold">{key}</td>
                          <td className="py-2 break-all">
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
