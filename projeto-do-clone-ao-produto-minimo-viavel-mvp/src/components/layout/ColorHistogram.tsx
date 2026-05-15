import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Loader2, Copy, Check, BarChart3 } from 'lucide-react';
import * as ColorThiefNamespace from 'colorthief';
const ColorThief = (ColorThiefNamespace as any).default || ColorThiefNamespace;

// Define types for ColorThief
interface ColorThiefInstance {
  getPalette(img: HTMLImageElement, colorCount?: number, quality?: number): [number, number, number][];
  getColor(img: HTMLImageElement, quality?: number): [number, number, number];
}

interface ColorHistogramProps {
  imageUrl: string;
}

interface DominantColor {
  hex: string;
  rgb: string;
}

export const ColorHistogram: React.FC<ColorHistogramProps> = ({ imageUrl }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [histogramData, setHistogramData] = useState<{ label: string, data: number[], color: string }[] | null>(null);
  const [dominantColors, setDominantColors] = useState<DominantColor[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const rgbToHex = (r: number, g: number, b: number) => {
    const toHex = (x: any) => {
      const val = parseInt(x);
      return (isNaN(val) ? 0 : val).toString(16).padStart(2, '0');
    };
    return "#" + [r, g, b].map(toHex).join('').toUpperCase();
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  useEffect(() => {
    const generateHistogram = async () => {
      setLoading(true);
      setError(null);
      setDominantColors([]);

      try {
        const img = new Image();
        if (!imageUrl.startsWith('data:') && !imageUrl.startsWith('blob:')) {
          img.crossOrigin = "anonymous";
        }
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () => reject(new Error('Falha ao carregar imagem para o histograma.'));
          img.src = imageUrl;
        });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) throw new Error('Não foi possível obter o contexto do canvas.');

        const maxDim = 300;
        let w = img.width;
        let h = img.height;
        if (w > h) {
          if (w > maxDim) {
            h *= maxDim / w;
            w = maxDim;
          }
        } else {
          if (h > maxDim) {
            w *= maxDim / h;
            h = maxDim;
          }
        }

        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);

        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;

        const rHist = new Array(256).fill(0);
        const gHist = new Array(256).fill(0);
        const bHist = new Array(256).fill(0);
        const lHist = new Array(256).fill(0);

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const l = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

          rHist[r]++;
          gHist[g]++;
          bHist[b]++;
          lHist[l]++;
        }

        setHistogramData([
          { label: 'Red', data: rHist, color: '#ef4444' },
          { label: 'Green', data: gHist, color: '#22c55e' },
          { label: 'Blue', data: bHist, color: '#3b82f6' },
          { label: 'Luminosity', data: lHist, color: '#a855f7' }
        ]);

        // --- Color Extraction Logic ---
        let finalPalette: any[] = [];

        // 1. Try ColorThief
        try {
          let colorThief;
          if (typeof ColorThief === 'function') {
            colorThief = new (ColorThief as any)();
          } else if ((ColorThief as any).default && typeof (ColorThief as any).default === 'function') {
            colorThief = new (ColorThief as any).default();
          } else {
            colorThief = new (window as any).ColorThief();
          }
          
          const ctPalette = colorThief.getPalette(img, 6);
          if (Array.isArray(ctPalette) && ctPalette.length > 0) {
            finalPalette = ctPalette;
          }
        } catch (e) {
          console.warn('ColorThief failed, using fallback');
        }

        // 2. Manual Fallback (Frequency Analysis)
        if (finalPalette.length === 0) {
          const colorCounts: Record<string, number> = {};
          // Sample pixels
          for (let i = 0; i < data.length; i += 16) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            if (data[i + 3] < 10) continue; // Skip transparent
            
            const qr = Math.round(r / 12) * 12;
            const qg = Math.round(g / 12) * 12;
            const qb = Math.round(b / 12) * 12;
            const key = `${qr},${qg},${qb}`;
            colorCounts[key] = (colorCounts[key] || 0) + 1;
          }

          finalPalette = Object.entries(colorCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([key]) => key.split(',').map(Number));
        }

        // 3. Last Resort Fallback (Geometric Sampling)
        if (finalPalette.length === 0) {
          const samples = [0.2, 0.4, 0.5, 0.6, 0.8];
          finalPalette = samples.map(s => {
            const idx = Math.floor(data.length * s / 4) * 4;
            return [data[idx] || 0, data[idx+1] || 0, data[idx+2] || 0];
          });
        }

        // Format and set colors
        const formattedColors = finalPalette
          .filter(rgb => Array.isArray(rgb) && rgb.length >= 3)
          .map((rgb: any) => ({
            rgb: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
            hex: rgbToHex(rgb[0], rgb[1], rgb[2])
          }));

        // If for some reason we still have nothing, add a neutral gray
        if (formattedColors.length === 0) {
          formattedColors.push({ rgb: 'rgb(128, 128, 128)', hex: '#808080' });
        }

        setDominantColors(formattedColors);
        setLoading(false);
      } catch (err: any) {
        console.error('Histogram/Palette Error:', err);
        setError(err.message || 'Erro desconhecido ao processar cores.');
        setLoading(false);
      }
    };

    generateHistogram();
  }, [imageUrl]);

  useEffect(() => {
    if (!loading && histogramData && svgRef.current) {
      // Small delay to ensure container is measured correctly
      const timer = setTimeout(() => renderChart(histogramData), 50);
      
      const handleResize = () => renderChart(histogramData);
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(timer);
      };
    }
  }, [loading, histogramData]);

  const renderChart = (datasets: { label: string, data: number[], color: string }[]) => {
    if (!svgRef.current) return;

    const margin = { top: 10, right: 10, bottom: 20, left: 35 };
    const rect = svgRef.current.getBoundingClientRect();
    const width = rect.width || 400;
    const height = 180 - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain([0, 255])
      .range([0, width - margin.left - margin.right]);

    const maxVal = d3.max(datasets.flatMap(d => d.data)) || 1;
    const y = d3.scaleLinear()
      .domain([0, maxVal])
      .range([height, 0]);

    // Add X axis with technical style
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickSize(3))
      .attr("class", "text-[8px] font-mono text-app-text-muted opacity-40");

    // Add Y axis with technical style
    svg.append("g")
      .call(d3.axisLeft(y).ticks(3).tickFormat(d3.format(".0s")).tickSize(3))
      .attr("class", "text-[8px] font-mono text-app-text-muted opacity-40");

    const area = d3.area<number>()
      .x((_, i) => x(i))
      .y0(height)
      .y1(d => y(d))
      .curve(d3.curveBasis);

    datasets.forEach(dataset => {
      svg.append("path")
        .datum(dataset.data)
        .attr("fill", dataset.color)
        .attr("fill-opacity", 0.12)
        .attr("stroke", dataset.color)
        .attr("stroke-width", 1.2)
        .attr("d", area);
    });
  };

  return (
    <div className="bg-app-card p-6 rounded-3xl border border-app-border shadow-xl overflow-hidden group relative">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <BarChart3 className="w-12 h-12 text-app-purple" />
      </div>

      <h2 className="text-app-text font-heading font-bold text-lg mb-6 flex items-center gap-3 relative z-10">
        <div className="w-1.5 h-5 bg-app-purple rounded-full" />
        Análise Cromática
      </h2>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <Loader2 className="w-6 h-6 text-app-purple animate-spin" />
          <p className="text-app-text-muted text-[10px] font-mono uppercase tracking-widest">Processando Pixels...</p>
        </div>
      ) : error ? (
        <div className="py-12 text-center bg-red-500/5 rounded-2xl border border-red-500/10">
          <p className="text-red-500 text-xs font-medium">{error}</p>
          <p className="text-app-text-muted text-[10px] mt-2">Tente outra imagem ou verifique a conexão.</p>
        </div>
      ) : (
        <div className="space-y-8 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-app-text-muted text-[10px] uppercase font-bold tracking-widest">Histograma RGB/L</p>
              <div className="flex gap-3">
                {[
                  { label: 'R', color: 'bg-red-500' },
                  { label: 'G', color: 'bg-green-500' },
                  { label: 'B', color: 'bg-blue-500' },
                  { label: 'L', color: 'bg-app-purple' }
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                    <span className="text-[9px] font-mono text-app-text-muted">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full h-[180px] bg-app-bg/30 rounded-2xl border border-app-border/50 p-2">
              <svg ref={svgRef} className="w-full h-full overflow-visible" />
            </div>
          </div>

          {/* Dominant Colors Palette */}
          <div className="pt-6 border-t border-app-border/50">
            <p className="text-app-text-muted text-[10px] uppercase font-bold tracking-widest mb-4">Paleta de Cores Predominantes</p>
            {dominantColors.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {dominantColors.map((color, idx) => (
                  <div key={idx} className="space-y-2 group/color">
                    <div 
                      className="h-12 w-full rounded-xl border border-app-border shadow-sm transition-all group-hover/color:scale-105 group-hover/color:shadow-md cursor-pointer relative flex items-center justify-center overflow-hidden"
                      style={{ backgroundColor: color.hex }}
                      onClick={() => copyToClipboard(color.hex, idx)}
                    >
                      <div className="absolute inset-0 bg-black/0 group-hover/color:bg-black/5 transition-colors" />
                      {copiedIndex === idx && (
                        <div className="bg-black/60 text-white p-1.5 rounded-full animate-in fade-in zoom-in duration-200 relative z-10">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-[10px] font-mono text-app-text font-bold tracking-tight">{color.hex}</span>
                      <span className="text-[8px] font-mono text-app-text-muted opacity-70">{color.rgb}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center bg-app-bg/50 rounded-2xl border border-dashed border-app-border">
                <p className="text-app-text-muted text-[10px] uppercase tracking-widest">Nenhuma cor detectada</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
