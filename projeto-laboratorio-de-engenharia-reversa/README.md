# 🔍 ExifLens: High-Performance Media Metadata Analyzer

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini_AI-8E75C2?style=for-the-badge&logo=googlegemini&logoColor=white)


## 📝 Descrição do Projeto
O **ExifLens** é uma plataforma de alto desempenho projetada para a extração, análise e visualização de metadados complexos em arquivos de imagem e áudio. Como um sucessor técnico do *exifinfo.org*, o sistema oferece uma interface forense moderna para fotógrafos, engenheiros de áudio e investigadores digitais.

Utilizando algoritmos de parsing eficientes (ExifReader e music-metadata), o dashboard processa instantaneamente tags **EXIF, IPTC, XMP** e metadados de áudio (ID3, Vorbis), enquanto integra a inteligência do **Google Gemini AI** para gerar insights automáticos e descrições contextuais sobre o conteúdo da mídia.


---
![Dashboard Preview](https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/public/og.png)
*Figura 1: Interface principal destacando o upload Drag-and-Drop e a visualização detalhada de tags.*

## 🚀 Tecnologias Utilizadas
* **Frontend:** React 19 + TypeScript + Vite
* **Backend:** Express.js (Runtime Node.js)
* **Inteligência Artificial:** Google Gemini AI (Análise preditiva de metadados)
* **Motores de Extração:** ExifReader (Imagens) & music-metadata-browser (Áudio)
* **Estilização:** Tailwind CSS + shadcn/ui (Design System)
* **Animações:** Motion (Micro-interações e Transições Fluídas)

## 📊 Resultados e Funcionalidades
O projeto foi estruturado para garantir precisão técnica e experiência de usuário premium:
* **Deep Image Inspection:** Extração exaustiva de coordenadas GPS, modelos de lente, configurações de exposição e miniaturas incorporadas.
* **Audio Engine Audit:** Suporte avançado para arquivos FLAC, MP3 e WAV, capturando desde taxas de amostragem até metadados de copyright.
* **AI-Powered Insights:** Classificação inteligente de arquivos e detecção de anomalias em metadados via integração com LLM.
* **Privacidade e Performance:** Processamento híbrido que equilibra parsing client-side para velocidade e server-side para segurança de dados sensíveis.

![Métricas de Análise](https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/public/og.png)
*Figura 2: Detalhamento de metadados técnicos e correlações via IA.*

## 🔧 Como Executar
1. Clone o repositório.
2. Crie um arquivo `.env` com sua `GEMINI_API_KEY`.
3. Instale as dependências: `npm install`.
4. Execute o servidor de desenvolvimento: `npm run dev`.

![Fluxo de Dados](https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/public/og.png)
*Figura 3: Pipeline de processamento de arquivos desde o upload até a renderização dos resultados.*

---
[Voltar ao início](https://github.com/profdiegocarvalho/portfolio-arthur-correia-carvalho)
