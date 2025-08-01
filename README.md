# Project 01 #AIAugustAppADay: AI-Powered To-Do List

![Last Commit](https://img.shields.io/github/last-commit/davedonnellydev/ai-august-2025-01)  

**📆 Date**: 01/Aug/2025  
**🎯 Project Objective**: Build a to-do list app that uses AI to suggest tasks based on user goals or previous entries.   
**🚀 Features**: User to suggest a task goal, OpenAI splits it into tasks; User can mark tasks as done, delete, edit, add more; Persist tasks (localStorage is fine for MVP)  
**🛠️ Tech used**: Next.js, TypeScript, OpenAI API  
**▶️ Live Demo**: *[https://your-demo-url.com](https://your-demo-url.com)*  
*(Link will be added after deployment)*  

## 🗒️ Summary

An interesting first day. I got a MVP up and running with barebones features of: User being able to enter a goal and get AI to break it down into up to 5 separate tasks. Users can mark tasks as done, and users can either regenerate new list of tasks or they can add more tasks based on updated goal. Goal and tasks save to localStorage. There's also a reset button which clears all goal/task data on local storage. I didn't get a chance to implement basic features like editing the tasks, deleting individual tasks or goals, or reordering / sorting tasks or goals but I'm pretty happy with where I landed for my first attempt.
I was using OpenAI's Responses API, which I've used before, but was implementing a feature I hadn't come across yet called [Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs?api-mode=responses), which was exactly the kind of thing I needed.

**Blockers**  
- Lack of planning: I hadn't spent enough time planning the flow of the app at the start of the day, nor had I really thought through the structures of the data I needed to use in order to get the app working in the flow I thought up.
- Lack of knowledge on how the UI elements worked: This was my first time using Mantine UI and I hadn't given myself enough time to read through all the guidance materials to know what was possible and how things should be structured. Given the time limits, the 'day of' wasn't really the time to be delving into all that.
- Time/Overcomplication of app features: I wanted a lot out of this first one, there were so many more features I wanted to implement but I could really only get through so much before I had to call it a day. I fear time will always be an enemy here.

**Lessons learned**  

- Spend more time planning! I was a little too excited to get started with the building/playing with the OpenAI API. About halfway through the day I noticed I was stabbing around in the dark a bit, trying to figure out how this app was going to function. I realised I failed to invest enough time in planning at the start of the day. I took some time out to gather my thoughts, detail the data structures a bit more and plan out the app's UX in a little bit more detail than I had at the start of the day.
- Lean on AI. Yes, this challenge is about what AI tools are out there and how I can incorporate them into apps, but the other focus is to see how far I can get in my day to day engineering with the help of AI. Using Cursor.ai to build today's project, I'm eager to discover what it's strengths and weaknesses are! Today I fell into the trap of trying to wrangle the details too much (when I just don't have time!) rather than give the AI a chance to build my app for me.

**Final thoughts**  
I'm pretty happy with how it turned out, despite lack of a few vital functions. I have a much better idea of how to tackle these workdays going forward. Looking forward to Monday's challenge!  


This project has been built as part of my AI August App-A-Day Challenge. You can read more information on the full project here: [https://github.com/davedonnellydev/ai-august-2025-challenge](https://github.com/davedonnellydev/ai-august-2025-challenge).  

## 🧪 Testing

![CI](https://github.com/davedonnellydev/ai-august-2025-01/actions/workflows/npm_test.yml/badge.svg)  
*Note: Test suite runs automatically with each push/merge.*  

## Quick Start

1. **Clone and install:**
   ```bash
   git clone https://github.com/davedonnellydev/nextjs-typescript-mantine-starter.git
   cd nextjs-typescript-mantine-starter
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

3. **Start development:**
   ```bash
   npm run dev
   ```

4. **Run tests:**
   ```bash
   npm test
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# OpenAI API (for AI features)
OPENAI_API_KEY=your_openai_api_key_here

# Optional: External API URLs
USER_API_URL=https://jsonplaceholder.typicode.com/users
PRODUCT_API_URL=https://dummyjson.com/products

# Optional: Proxy Settings
ENABLE_CACHE=true
CACHE_DURATION=300000
```

### Key Configuration Files

- **`next.config.mjs`** - Next.js configuration with bundle analyzer
- **`tsconfig.json`** - TypeScript configuration with path aliases (`@/*`)
- **`theme.ts`** - Mantine theme customization
- **`eslint.config.mjs`** - ESLint rules with Mantine and TypeScript support
- **`jest.config.cjs`** - Jest testing configuration
- **`.nvmrc`** - Node.js version (v24.3.0)

### Path Aliases

The project uses TypeScript path aliases for cleaner imports:

```typescript
import { Component } from '@/components/Component';  // instead of '../../../components/Component'
```


## 📦 Available Scripts
### Build and dev scripts

- `npm run dev` – start dev server
- `npm run build` – bundle application for production
- `npm run analyze` – analyzes application bundle with [@next/bundle-analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

### Testing scripts

- `npm run typecheck` – checks TypeScript types
- `npm run lint` – runs ESLint
- `npm run prettier:check` – checks files with Prettier
- `npm run jest` – runs jest tests
- `npm run jest:watch` – starts jest watch
- `npm test` – runs `jest`, `prettier:check`, `lint` and `typecheck` scripts

### Other scripts

- `npm run storybook` – starts storybook dev server
- `npm run storybook:build` – build production storybook bundle to `storybook-static`
- `npm run prettier:write` – formats all files with Prettier


## 📜 License
![GitHub License](https://img.shields.io/github/license/davedonnellydev/ai-august-2025-01)  
This project is licensed under the MIT License.  
