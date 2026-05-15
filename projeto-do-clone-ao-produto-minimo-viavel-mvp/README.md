# 🔍 Pixels Ocultos: Advanced Metadata & Media Forensics Dashboard

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-8E75FF?style=for-the-badge&logo=google-gemini&logoColor=white)

## 📝 Descrição do Projeto
O **Pixels Ocultos** é uma ferramenta forense digital poderosa projetada para extrair, analisar e visualizar camadas invisíveis de informações em arquivos de mídia. Especializado no processamento de metadados profundos, o sistema permite que investigadores, fotógrafos e entusiastas de segurança identifiquem a procedência, os parâmetros técnicos e até mesmo manipulações em imagens e arquivos de áudio.

Utilizando motores de extração de alto desempenho como o **ExifReader** e análise de cor via **ColorThief**, a plataforma decompõe arquivos para revelar dados de geolocalização (GPS), especificações de hardware da câmera, perfis de cores e tags XMP/IPTC que normalmente permanecem ocultas ao usuário comum.

---
![Interface Principal](./imagem/imagem1.png)
*Figura 1: Interface principal do Pixels Ocultos com análise de imagem e painel de metadados.*

## 🚀 Tecnologias Utilizadas
* **Frontend:** React 19 + TypeScript + Vite
* **Inteligência Artificial:** Google Gemini AI (Detecção assistida de anomalias e análise visual)
* **Estilização:** Tailwind CSS 4 (Custom Theme & Shadow Effects)
* **Backend & Auth:** Firebase (Google Authentication & Firestore para Histórico)
* **Extração de Dados:** ExifReader (Imagens) + Music-Metadata (Áudio)
* **Análise Visual:** ColorThief (Histogramas de cor) + D3.js (Visualização de dados)
* **Exportação:** jsPDF + AutoTable (Relatórios técnicos automatizados)

## 📊 Resultados e Funcionalidades
O projeto foi estruturado para fornecer uma auditoria completa de arquivos digitais:
* **Extração Profunda (Full EXIF):** Leitura exaustiva de metadados, incluindo coordenadas GPS com integração direta para visualização de localidade.
* **Detecção Assistida por IA:** Integração com Gemini AI para análise de conteúdo, identificação de objetos e sugestões de autenticidade baseadas em contexto visual.

![Análise Técnica](./imagem/imagem2.jpeg)
*Figura 2: Detalhamento técnico de metadados e histograma de cores dominantes.*

* **Histogramas de Cor Dinâmicos:** Visualização da paleta dominante e distribuição cromática para análise de composição e possíveis edições.
* **Histórico de Análise Persistente:** Sincronização em tempo real via Firestore, permitindo que usuários autenticados acessem auditorias passadas de qualquer dispositivo.
* **Relatórios PDF Profissionais:** Geração instantânea de documentação técnica contendo todos os metadados extraídos para fins de arquivamento ou investigação.

![IA Forense](./imagem/imagem3.png)
*Figura 3: Auditoria assistida por IA identificando anomalias e descrevendo o contexto da cena.*

## 🔧 Como Executar
1. Clone o repositório.
2. Certifique-se de ter as variáveis de ambiente configuradas no arquivo `.env` (ex: `GEMINI_API_KEY`).
3. O Firebase será inicializado automaticamente através do arquivo `firebase-applet-config.json`.
4. Instale as dependências:
   ```bash
   npm install
   ```
5. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

---
[Voltar ao início](https://github.com/mariaisabellanashimoto1-dot/portfolio-maria-isabella-nashimoto-de-andrade)
