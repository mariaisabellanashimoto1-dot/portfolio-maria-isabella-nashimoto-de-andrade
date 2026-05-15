import { GoogleGenAI, Type } from "@google/genai";

export interface AIDetectionResult {
  isAI: boolean;
  confidence: number;
  reasoning: string;
}

export class AIDetectionService {
  private static ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  static async detectAI(mediaUrl: string): Promise<AIDetectionResult> {
    try {
      let base64Data = '';
      let mimeType = '';

      if (mediaUrl.startsWith('data:')) {
        const [header, data] = mediaUrl.split(',');
        base64Data = data;
        mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
      } else {
        const response = await fetch(mediaUrl);
        const blob = await response.blob();
        mimeType = blob.type;
        
        base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }

      const isImage = mimeType.startsWith('image/');
      const isVideo = mimeType.startsWith('video/');
      const isAudio = mimeType.startsWith('audio/');

      let mediaTypeLabel = 'arquivo';
      if (isImage) mediaTypeLabel = 'imagem';
      if (isVideo) mediaTypeLabel = 'vídeo';
      if (isAudio) mediaTypeLabel = 'áudio';

      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data,
              },
            },
            {
              text: `Analise este ${mediaTypeLabel} e determine se ele foi gerado por Inteligência Artificial (IA) ou se é um conteúdo real/humano. 
              Procure por artefatos típicos de IA, metadados suspeitos implícitos na estrutura ou padrões não naturais.
              Forneça uma análise técnica detalhada em português.`,
            },
          ],
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isAI: {
                type: Type.BOOLEAN,
                description: `True se o ${mediaTypeLabel} for gerado por IA, false caso contrário.`
              },
              confidence: {
                type: Type.NUMBER,
                description: "Nível de confiança da análise entre 0 e 1."
              },
              reasoning: {
                type: Type.STRING,
                description: "Explicação técnica detalhada em português."
              }
            },
            required: ["isAI", "confidence", "reasoning"]
          }
        }
      });

      const text = response.text || '';
      // Clean potential markdown blocks
      const cleanJson = text.replace(/```json\n?|```/g, '').trim();
      const result = JSON.parse(cleanJson);
      
      return {
        isAI: !!result.isAI,
        confidence: Number(result.confidence) || 0,
        reasoning: String(result.reasoning || 'Sem explicação disponível.'),
      };
    } catch (error) {
      console.error('Error detecting AI:', error);
      throw new Error('Falha ao analisar a imagem com IA. O modelo retornou um formato inválido.');
    }
  }
}
