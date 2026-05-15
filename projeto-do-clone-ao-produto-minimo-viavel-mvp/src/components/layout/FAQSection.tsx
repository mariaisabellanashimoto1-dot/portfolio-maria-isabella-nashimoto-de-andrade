import React from 'react';

const faqData = [
  {
    question: "O que é este site?",
    answer: "Pixels Ocultos é uma ferramenta que mostra os metadados (normalmente ocultos) incorporados em um arquivo que você envia. A ferramenta foca em exibir metadados de imagens Exif (como arquivos .jpeg), mas pode extrair metadados de quase todos os formatos de mídia comuns, incluindo imagens, vídeos, arquivos de áudio, documentos do Microsoft Word, PDFs da Adobe e muito mais."
  },
  {
    question: "O que é Exif?",
    answer: "O Exchangeable image file format é um padrão que define os formatos de imagem, áudio e tags de metadados usados por câmeras, telefones e outros dispositivos de gravação digital."
  },
  {
    question: "Que tipo de metadados são comumente incluídos?",
    answer: (
      <>
        Dependendo do tipo de arquivo e da ferramenta de autoria (o aplicativo ou o dispositivo de captura), diferentes tipos de metadados são registrados. Exemplos incluem:
        <ul className="list-disc ml-8 mt-2 space-y-1">
          <li>Data e hora da captura e da última edição</li>
          <li>Coordenadas de localização GPS</li>
          <li>Uma pequena miniatura da imagem original</li>
          <li>Nome do autor e detalhes de direitos autorais</li>
          <li>Direção da bússola</li>
          <li>Informações do dispositivo, incluindo fabricante e modelo</li>
          <li>Informações de captura, incluindo tipo de lente, abertura, velocidade do obturador</li>
          <li>O nome do arquivo original</li>
        </ul>
      </>
    )
  },
  {
    question: "Posso ver um exemplo?",
    answer: (
      <>
        Aqui estão alguns arquivos de exemplo para mostrar a gama de dados registrados por várias câmeras diferentes:
        <ol className="list-decimal ml-8 mt-2 space-y-1">
          <li>Canon 40D</li>
          <li>iPhone 6</li>
          <li>Nexus 5X</li>
          <li>OnePlus 5</li>
          <li>Pixel 6a</li>
        </ol>
      </>
    )
  },
  {
    question: "Quais tipos de arquivo são suportados?",
    answer: "Muitos! O Pixels Ocultos suporta uma vasta lista de formatos de mídia."
  },
  {
    question: "Como meus arquivos são tratados?",
    answer: "Os arquivos que você envia são processados automaticamente pelo analisador. O arquivo original é excluído imediatamente após o processamento. Os arquivos gerados (miniatura, metadados, etc.) são armazenados com segurança por até três dias e depois eliminados."
  },
  {
    question: "Qual é a ferramenta subjacente?",
    answer: "Nos bastidores, o Pixels Ocultos utiliza o fantástico programa de linha de comando ExifTool de Phil Harvey."
  }
];

export const FAQSection: React.FC = () => {
  return (
    <section className="bg-app-bg py-24 px-8 md:px-16 lg:px-24">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center mb-20">
          <h2 className="text-app-purple text-sm font-bold uppercase tracking-[0.3em] mb-4">Common Questions</h2>
          <h3 className="text-app-text text-4xl md:text-5xl font-heading font-bold tracking-tight">
            Perguntas <span className="text-app-purple">Frequentes</span>
          </h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          {faqData.map((item, index) => (
            <div key={index} className="bg-app-card border border-app-border p-8 rounded-3xl hover:border-app-purple/20 transition-all group">
              <h3 className="text-app-text text-xl font-heading font-bold mb-4 group-hover:text-app-purple transition-colors">
                {item.question}
              </h3>
              <div className="text-app-text-muted font-sans text-sm leading-relaxed">
                {item.answer}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-32 pt-12 border-t border-app-border flex flex-col md:flex-row justify-center items-center gap-6 text-app-text-muted font-sans text-xs uppercase tracking-widest">
        </div>
      </div>
    </section>
  );
};
