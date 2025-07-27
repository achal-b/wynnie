<table width="100%">
  <tr>
    <td align="left" width="120">
      <img src="public/icon0.svg" alt="Wynnie Logo" width="100" />
    </td>
    <td align="right">
      <h1>Wynnie 🛒🤖</h1>
      <h3 style="margin-top: -10px;">Your smart autonomous AI shopping companion that revolutionizes online shopping through natural language conversations</h3>
    </td>
  </tr>
</table>

![Wynnie Dashboard](https://i.postimg.cc/7L3hvy4P/image.png)

## 🎯 What is Wynnie?

**Wynnie** is your smart **autonomous AI shopping companion** that revolutionizes how people shop online through simple *natural language*. It's like having a personal shopping genie 🧞 that actually *understands what you want* and handles everything automatically - from finding products to getting the best deals!

### 🌟 The Vision

The whole idea behind Wynnie is to *eliminate all the tedious shopping work* while making everything accessible to literally anyone - whether you speak English, Hindi, Spanish, or any of 50+ supported languages. Most importantly, it caters to elderly people who have money to spend and need to shop, but are often shut out by friction designed for digital natives.

## 🚀 Why Wynnie?

### The Problem

Online shopping is still a pain for way *too many* people! **Language barriers, confusing interfaces, and overwhelming choices** make it really hard for people to find what they actually need and get good deals.

![Retail Challenge](https://i.postimg.cc/y6tPjwVp/image.png)
*Source: [RetailWire - Are retailers making it too tough for seniors to shop online?](https://retailwire.com/discussion/are-retailers-making-it-too-tough-for-seniors-to-shop-online)*

### Traditional vs. Wynnie Approach

| **Traditional E-commerce Pain Points** | **Wynnie's AI Solution** |
|---------------------------------------|--------------------------|
| 🟠 Users manually search for products | 🟢 AI-driven intent detection + voice/text input |
| 🟠 Overwhelming product listings | 🟢 Personalized, context-aware recommendations |
| 🟠 No clarity on best deals or coupons | 🟢 Auto-applied coupons via Synphase Scraper |
| 🟠 Complex checkout flows | 🟢 Streamlined voice-first ordering system |
| 🟠 Static dashboards and limited insights | 🟢 Dynamic dashboard with conversational UX |
| 🟠 No real-time decision feedback | 🟢 LLM-as-Judge provides on-the-fly optimization |
| 🟠 Limited customer engagement | 🟢 Conversational agents tailored to user needs |
| 🟠 Siloed services & fragmented UX | 🟢 Unified AI Orchestrator with agent collaboration |

## 🎠 Features

- **🎤 Autonomous AI shopping buddy** that delivers true performance!
- **🌍 AssemblyAI's Voice recognition** that works with 50+ languages automatically!
- **⚡ Scales like crazy** with our multi-agent orchestrated architecture
- **🔍 Real-time product hunting** using Perplexity AI ([Sonar](https://sonar.perplexity.ai)) & [SERP API](https://serpapi.com)
- **💰 Smart deal finder** that optimizes your cart automatically!
- **🚚 Intelligent delivery planning** with eco-friendly routing
- **📱 Works offline** as a Progressive Web App (PWA)!
- **🗣️ Speaks your language** - literally any of 50+ languages
- **👥 Speaker identification** & automatically isolates background noise
- **🎨 Clean, modern interface** built with Next.js & Tailwind
- **🔐 Google OAuth SSO** via Google Firebase
- **📊 Live price tracking** and bundle suggestions!
- **🧠 True AI recommendations** finetuned to user's experience!
- **⚡ Supabase backend** for blazing fast performance!
- **💳 Seamless payments** via UPI-Litex (highly secure & E2E encrypted)
- **🔄 CI/CD ready** via GitHub actions
- **♿ Works for everyone** - accessibility first!
- **🔒 Privacy-focused** and GDPR compliant!

## 🏗️ System Architecture

![System Architecture](https://i.postimg.cc/sDT0cBZs/image.png)

### 4-Flow AI Architecture

```
Flow 1: Voice Recognition & Translation (AssemblyAI)
Flow 2: Intelligent Product Discovery (Perplexity AI + SERP)
Flow 3: Smart Delivery Optimization (Custom AI Agents)
Flow 4: Cart & Payment Optimization (OpenAI + UPI-Litex)
```

![Agentic Workflow](https://i.postimg.cc/DZKh1CSS/image.png)

## 💻 How It Works

1. **Sign Up**: Users sign up using Google OAuth via Firebase
2. **Voice Input**: Speak naturally or type - AssemblyAI transcribes with real-time accuracy
3. **Intent Detection**: OpenAI processes the transcription to understand what you want
4. **Product Discovery**: AI agents search through SERP APIs and Perplexity Sonar
5. **Deal Optimization**: Auto-apply coupons and find the best prices
6. **Smart Checkout**: Seamless payments through UPI LiteX
7. **Order Tracking**: Everything stored securely in Supabase

## 📸 Screenshots

![Screenshots Panel](https://i.postimg.cc/zBmdB6Vc/image.png)

## 🎯 Performance Metrics

- **🎤 Speech Recognition**: 94%+ accuracy with AssemblyAI
- **🌍 Language Support**: Auto-detecting 50+ languages
- **⚡ Response Time**: <2s average AI response
- **📱 PWA Score**: 95+ Lighthouse performance
- **🛒 Conversion Rate**: 40% improvement in user testing

## 🛠️ Tech Stack

- **Frontend**: Next.js 14/15, TypeScript, Tailwind CSS
- **Voice Recognition**: [AssemblyAI](https://www.assemblyai.com/) Universal Speech Model
- **AI Services**: OpenAI GPT-4o mini, Perplexity AI, Meta-Llama
- **Product APIs**: [SerpAPI](https://serpapi.com), Walmart Product API
- **Database**: [Supabase](https://supabase.com/) with PostgreSQL
- **Authentication**: [Firebase](https://firebase.google.com/) Google OAuth
- **Payments**: UPI LiteX integration
- **Deployment**: Vercel with PWA capabilities

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later)
- [pnpm](https://pnpm.io/installation)
- API keys for AI services

### Setup

1. **Fork and Clone**

   ```bash
   git clone https://github.com/achal-b/wynnie.git
   cd wynnie
   ```

2. **Environment Setup**

   ```bash
   # Unix/Linux/Mac
   cp .env.example .env.local
   
   # Windows Command Prompt
   copy .env.example .env.local
   ```

3. **Configure Environment Variables**

   ```bash
   # AI Services
   ASSEMBLY_AI_API_KEY=your_assembly_ai_key
   OPENAI_API_KEY=your_openai_key
   PERPLEXITY_API_KEY=your_perplexity_key
   
   # Database
   DATABASE_URL=your_supabase_url
   
   # External APIs
   SERPAPI_KEY=your_serpapi_key
   WALMART_API_KEY=your_walmart_key
   
   # Firebase
   FIREBASE_CONFIG=your_firebase_config
   
   # Development
   NODE_ENV="development"
   ```

4. **Install and Run**

   ```bash
   pnpm install
   pnpm db:migrate
   pnpm db:seed
   pnpm dev
   ```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 🎯 Why AssemblyAI?

Voice recognition is make-or-break for accessible shopping. **AssemblyAI's Universal Speech Model** gives us the accuracy and language support we need without the headaches.

> AssemblyAI automatically detects what language someone's speaking from a list of 50+, figures out who's talking when, and gives us word-level timing. This lets us build shopping experiences that actually work for real people having real conversations.

```javascript
// AssemblyAI Voice Processor for Wynnie 🦄
async transcribeAudio({
  file,
  speech_model = 'universal',
  language_code,
  punctuate = true,
  format_text = true,
  speaker_labels = false,
  speakers_expected,
}: AssemblyAITranscriptionRequest): Promise<AssemblyAITranscriptionResponse> {
  try {
    const audioUrl = await this.uploadAudio(file);
    const transcriptionJob = await this.startTranscription(audioUrl, {
      speech_model, language_code, punctuate,
      format_text, speaker_labels, speakers_expected,
    });
    const completedTranscription = await this.pollForCompletion(transcriptionJob.id);
    return completedTranscription;
  } catch (error) {
    console.error('Error transcribing audio with AssemblyAI:', error);
    throw error;
  }
}
```

## 🔒 Privacy & Security

Wynnie deals with shopping data and payment info, which is sensitive. We've gone overboard on security to make sure everything stays locked down and **100% GDPR compliant**.

- All communication happens over encrypted channels
- Supabase's built-in security features
- Voice data processed securely through AssemblyAI's endpoints
- Planning full end-to-end encryption for everything

## 🎨 Design Process

We followed the **Double Diamond** design process by the [British Design Council](https://www.designcouncil.org.uk/our-work/news-opinion/double-diamond-universally-accepted-depiction-design-process/):

![Design Process](https://i.postimg.cc/W36QPTXn/image.png)

1. **Discover**: Understanding why current shopping experiences fail so many people
2. **Define**: Figuring out what an autonomous shopping agent actually needs to do
3. **Develop**: Building the multi-agent system that handles real conversations
4. **Deliver**: Launching with PWA support and continuous learning from real users

## 🚀 What's Next?

**Upcoming Features:**

- **🔮 Predictive Shopping**: AI that suggests things before you even ask
- **📷 Visual Product Search**: Point your camera at something and find it online
- **👥 Group Shopping**: Shop with friends and family through shared conversations
- **🌱 Sustainability Scoring**: See the environmental impact of your purchases
- **📱 Cross-Platform**: Native mobile apps and smart speaker integration

## 🤝 Contributing

We welcome contributions! Focus areas include:

- Voice recognition improvements
- AI optimization
- Multilingual support
- Accessibility enhancements

**Quick start for contributors:**

1. Fork the repo and clone locally
2. Follow the setup instructions above
3. Create a feature branch and submit a PR

## 📁 Project Structure

```
wynnie/
├── src/
│   ├── components/          # UI and shopping interface components
│   ├── hooks/              # Custom React hooks for voice and AI
│   ├── lib/                # AI services and API integration logic
│   ├── stores/             # State management (cart, user preferences)
│   └── types/              # TypeScript types for shopping data
├── public/                 # Static assets
└── docs/                   # Documentation
```

## 🏆 Team

- **Business Automation Voice Agent** category submission
- **Real-Time Voice Performance** track consideration
- Built by [@neilblaze](https://github.com/neilblaze) & [@achalbajpai](https://github.com/achal-b)

## 📺 Demo

{% youtube <https://www.youtube.com/watch?v=V3EziqzxxLQ> %}

## 📄 License

[Apache 2.0 License](https://github.com/achal-b/wynnie/blob/main/LICENSE)

---

***Making e-commerce inclusive, one conversation at a time.*** ✨

**🔗 Repository**: [https://github.com/achal-b/wynnie](https://github.com/achal-b/wynnie) [Open source on GitHub]
