Here's the markdown artifact without the code blocks formatting:

# AI Chat Assistant

A modern, feature-rich chat application powered by GPT-4 Turbo and built with Next.js 14.

Preview:
[AI Chat Assistant](https://chatbot-shadcn-next-langchain.vercel.app/)

![alt text](<Screenshot 2024-12-02 at 00.25.01.png>)

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Authentication**: NextAuth.js
- **AI Integration**: LangChain
- **Animations**: Framer Motion
- **Markdown**: React Markdown
- **Code Highlighting**: React Syntax Highlighter

## Features

### 🤖 Intelligent Conversations

- Powered by GPT-4 Turbo for high-quality responses
- Stream-based message delivery for real-time interactions
- Smart message cleaning to maintain natural conversation flow
- Markdown support with syntax highlighting for code blocks

### 💡 Smart Suggestions

- Dynamic follow-up questions generated after each response
- Context-aware suggestions to keep conversations flowing
- One-click suggestion insertion into the chat input

### 🎨 Modern UI/UX

- Clean, responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- Dark mode support
- Code syntax highlighting
- Typing indicators and message streaming
- IBM Plex Sans font for improved readability

### 🔒 Authentication & User Management

- Google OAuth integration
- Free tier for guests (3 messages)
- Unlimited messages for authenticated users
- Seamless auth state management

### ⚡ Technical Highlights

- Built with Next.js 14 and TypeScript
- Server-side streaming with Edge Runtime
- LangChain for AI interactions
- Real-time message count tracking
- Responsive layout with Tailwind CSS
- Component-based architecture

## Getting Started

1. Clone the repository:

git clone https://github.com/yourusername/ai-chat-assistant.git

2. Install dependencies:

npm install

3. Create a `.env.local` file with your environment variables:

OPENAI_API_KEY=your_openai_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

4. Run the development server:

npm run dev

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

src/
├── app/ # Next.js app router
├── components/ # React components
│ ├── Chat/ # Chat-related components
│ ├── layout/ # Layout components
│ └── ui/ # Reusable UI components
├── lib/ # Utility functions
└── types/ # TypeScript types

## License

MIT License - feel free to use this project for your own purposes.

## Acknowledgments

- [Vercel](https://vercel.com) for the amazing Next.js framework
- [OpenAI](https://openai.com) for the GPT-4 API
- [LangChain](https://js.langchain.com) for the AI utilities
