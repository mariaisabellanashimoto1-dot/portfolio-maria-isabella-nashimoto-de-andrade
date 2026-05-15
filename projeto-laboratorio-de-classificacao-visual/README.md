# 🤖 PeopleVision: Classificador de Perfil Profissional por Imagem

![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![Teachable Machine](https://img.shields.io/badge/Teachable_Machine-4285F4?style=for-the-badge&logo=google&logoColor=white)
![MobileNetV2](https://img.shields.io/badge/MobileNetV2-Transfer_Learning-34A853?style=for-the-badge&logo=google&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Status](https://img.shields.io/badge/Status-Produção-success?style=for-the-badge)
![Classes](https://img.shields.io/badge/Classes-2-blueviolet?style=for-the-badge)

---

## 📝 Descrição do Projeto

O **PeopleVision** é um modelo de visão computacional treinado para classificar automaticamente perfis profissionais em duas categorias — **Operacional** e **Liderança** — a partir de imagens, utilizando a plataforma Google Teachable Machine com backbone **MobileNetV2** via Transfer Learning.

O modelo é exportado no formato **TensorFlow.js** e pode ser integrado diretamente em aplicações web, sistemas de RH, dashboards de People Analytics ou ferramentas de triagem visual, sem necessidade de infraestrutura de servidor para inferência — toda a predição ocorre no navegador, em tempo real.

---

## 🧠 Arquitetura do Modelo

O modelo adota uma estratégia de **Transfer Learning em dois estágios**:

### Estágio 1 — Extrator de Features (Backbone Congelado)
- **Base:** MobileNetV2 pré-treinado (ImageNet)
- **Blocos Inverted Residual:** 16 blocos com conexões residuais (Add layers)
- **Operações:** Conv2D, DepthwiseConv2D, BatchNormalization, ReLU
- **Saída do backbone:** GlobalAveragePooling2D → vetor de 1.280 features
- **Input Shape:** `224 × 224 × 3` (RGB)

### Estágio 2 — Cabeça de Classificação (Treinável)
- **Dense 1:** 1.280 → 100 neurônios (ReLU)
- **Dense 2:** 100 → 2 neurônios (Softmax) — uma saída por classe

```
Input [224×224×3]
        │
  MobileNetV2 Backbone
  (16 Inverted Residual Blocks)
        │
  GlobalAveragePooling2D
        │
  Dense(100) + ReLU
        │
  Dense(2)  + Softmax
        │
  Output: [Operacional | Liderança]
```

### Especificações Técnicas

| Parâmetro             | Valor                     |
|-----------------------|---------------------------|
| Formato               | TensorFlow.js (TFJS)      |
| Versão TFJS           | 1.7.4                     |
| Versão Teachable Machine | 2.4.14               |
| Tamanho da Imagem     | 224 × 224 px              |
| Número de Classes     | 2                         |
| Total de Tensores de Peso | 263                   |
| Backbone              | MobileNetV2               |
| Estratégia            | Transfer Learning         |
| Dtype dos Pesos       | float32                   |

---

## 🏷️ Classes de Classificação

| ID | Label        | Descrição                                                                 |
|----|--------------|---------------------------------------------------------------------------|
| 0  | `Operacional`| Perfis de execução, técnicos e especialistas de linha de frente          |
| 1  | `Liderança`  | Perfis de gestão, coordenação e direção estratégica                      |

---

## 📁 Estrutura dos Arquivos

```
├── model.json        # Topologia do modelo + manifesto de pesos (TensorFlow.js)
├── weights.bin       # Pesos binários float32 (263 tensores)
└── metadata.json     # Metadados do modelo: classes, versões, timestamp
```

### Detalhamento dos Arquivos

**`model.json`** — Contém a topologia completa da rede neural no formato Sequential aninhado (`sequential_1` → MobileNetV2 + GAP; `sequential_3` → Dense head), além do manifesto que mapeia os tensores de pesos ao arquivo `weights.bin`.

**`weights.bin`** — Arquivo binário com todos os 263 tensores de peso treinados, armazenados em formato float32 e referenciados pelo manifesto em `model.json`.

**`metadata.json`** — Arquivo de configuração gerado automaticamente pelo Teachable Machine contendo os nomes das classes (`labels`), a versão do pacote, o tamanho de entrada da imagem e o timestamp de criação do modelo.

---

## 🚀 Como Integrar

### 1. Instalar a biblioteca

```bash
npm install @teachablemachine/image
```

### 2. Carregar e utilizar o modelo

```javascript
import * as tmImage from '@teachablemachine/image';

const MODEL_URL   = './model.json';
const METADATA_URL = './metadata.json';

// Carregar o modelo
const model = await tmImage.load(MODEL_URL, METADATA_URL);

// Realizar predição em um elemento <img> ou <canvas>
const predictions = await model.predict(imageElement);

// Exibir resultados
predictions.forEach(({ className, probability }) => {
  console.log(`${className}: ${(probability * 100).toFixed(1)}%`);
});
```

### 3. Integração via CDN (sem bundler)

```html
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.7.4/dist/tf.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@teachablemachine/image@0.8.4-alpha2/dist/teachablemachine-image.min.js"></script>
```

---

## 📊 Especificações de Inferência

- **Latência esperada:** < 100ms em GPU / < 300ms em CPU (navegador moderno)
- **Ambiente de execução:** Browser (WebGL backend) ou Node.js (TFJS Node)
- **Pré-processamento obrigatório:** Redimensionar a imagem de entrada para `224×224` px antes da inferência
- **Saída:** Array de objetos `{ className, probability }` com probabilidades em `[0, 1]` somando `1.0`

---

## 🔧 Requisitos

- **Node.js** ≥ 14 (para uso via npm)
- **Navegador moderno** com suporte a WebGL (Chrome, Firefox, Edge, Safari 14+)
- `@teachablemachine/image` v0.8.4-alpha2 ou superior
- `@tensorflow/tfjs` v1.7.4 ou superior

---

## 📅 Informações de Versão

| Campo              | Valor                            |
|--------------------|----------------------------------|
| Criado em          | 2026-05-15T20:03:22.253Z         |
| Nome do modelo     | `tm-my-image-model`              |
| Pacote TM          | `@teachablemachine/image`        |
| Versão do pacote   | `0.8.4-alpha2`                   |
| Versão TM          | `2.4.14`                         |
| Versão TFJS        | `1.7.4`                          |

---

## 📌 Casos de Uso Sugeridos

- **People Analytics:** Triagem automatizada de perfis em processos seletivos
- **RH Digital:** Integração com sistemas de ATS para categorização visual de candidatos
- **Dashboards Executivos:** Análise visual de composição de equipes por nível hierárquico
- **Aplicações Mobile:** Inferência on-device via TensorFlow Lite (com conversão do modelo)

---

*Modelo gerado com Google Teachable Machine — [teachablemachine.withgoogle.com](https://teachablemachine.withgoogle.com)*

---
[Voltar ao início](https://github.com/mariaisabellanashimoto1-dot/portfolio-maria-isabella-nashimoto-de-andrade)
