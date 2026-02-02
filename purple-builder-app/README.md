# 🟣 PurpleBuilder

**PurpleBuilder** is an AI-powered pitch deck and content simulation platform that helps founders get real-time feedback from AI personas (venture capitalists, target customers) on their pitch materials, websites, and other assets.

![PurpleBuilder](https://img.shields.io/badge/React-19.2.0-blue) ![Vite](https://img.shields.io/badge/Vite-7.2.4-purple) ![License](https://img.shields.io/badge/License-MIT-green)

---

## 🎯 What Does PurpleBuilder Do?

PurpleBuilder is a comprehensive platform that allows founders and entrepreneurs to:

- **Upload & Manage Assets**: Upload pitch decks (PDF/PPTX), websites, Figma designs, surveys, documents, images, and more
- **Get AI-Powered Feedback**: Simulate real-time feedback from AI personas representing VCs and target customers
- **Voice & Text Interactions**: Have live voice calls or text chats with AI personas to discuss your pitch
- **Multi-Asset Management**: Organize and preview multiple content types in one unified dashboard
- **Real-Time Simulation**: See how different personas react to your content with contextual feedback

---

## ✨ Key Features

### 📦 Content Management
- **Multiple Asset Types**: Support for pitch decks, websites, Figma designs, surveys, documents, images, marketing assets, ad copy, emails, and branding materials
- **Asset Preview**: Real-time preview of all uploaded content
- **Asset Organization**: Manage multiple assets in a clean sidebar interface
- **Edit & Update**: Edit asset names and URLs directly from the interface

### 🤖 AI Personas
- **Pre-configured Personas**: 
  - **Sarah Chen** (Sequoia Capital) - Enterprise SaaS & B2B focus
  - **Marcus Rivera** (Andreessen Horowitz) - Consumer tech & marketplaces
  - **Priya Patel** (NEA) - Target customer perspective
  - **James Whitfield** (Tiger Global) - Late-stage growth focus
- **Custom Personas**: Add and manage your own AI personas
- **Persona Context**: Each persona has specific expertise areas and discussion topics

### 💬 Communication Modes
- **Text Chat**: Real-time text-based conversations with AI personas
- **Voice Calls**: Live voice conversations using Web Speech API
- **Discussion Topics**: Pre-defined topic bubbles for quick conversation starters
- **Context-Aware**: Personas remember your pitch content and provide relevant feedback

### 🎭 Simulation Engine
- **Multi-Persona Simulation**: Run simulations with multiple personas simultaneously
- **Real-Time Feedback**: Get instant feedback as personas review your content
- **Feedback Bubbles**: Visual feedback display with persona avatars
- **Selective Simulation**: Choose which personas to include in each simulation

### 🎨 User Interface
- **Responsive Design**: Fully responsive for mobile, tablet, and desktop
- **Modern UI**: Clean, purple-themed interface with smooth animations
- **Three-Panel Layout**: Sidebar (assets), Main content (preview), Investor panel (chat/simulation)
- **Bottom Overlay**: Easy-to-use overlay for adding and editing assets

---

## 📱 Pages & Views

### 1. **Builder Dashboard** (Main Page)
The primary workspace where you manage and preview your content.

**Left Sidebar:**
- Asset list with icons and names
- Plus button to add new assets
- Dropdown menu with 10+ asset types

**Main Content Area:**
- Empty state with quick-add buttons when no assets exist
- Preview pane showing selected asset (website iframe, PDF viewer, image viewer, etc.)
- Simulation overlay at the bottom for all content types

**Right Panel (Investor Panel):**
- Persona selector dropdown
- Discussion topic bubbles
- Text chat interface
- Voice call button

### 2. **AI Personas Page**
Manage and configure AI personas.

**Features:**
- View all personas with avatars and details
- Add new custom personas
- Edit persona information (name, firm, type, context, topics)
- Delete personas

### 3. **Live Call View** (Expanded)
Full-screen voice call interface when a call is active.

**Features:**
- Large persona avatar and information
- Voice message history
- Microphone controls
- Call status indicators (idle, listening, speaking, thinking)
- Real-time transcript display

---

## 🎨 Design System & Colors

### Primary Color Palette
- **Primary Purple**: `#7963D0` - Main brand color, buttons, active states
- **Light Purple**: `#F5F3FF` - Backgrounds, hover states
- **Purple Border**: `#D4C5F0` - Borders, dividers
- **Dark Purple**: `#5A4A9F` - Darker accents

### Neutral Colors
- **Background**: `#FCFCFC` - Main background
- **Grey Background**: `#F5F5F5` - Sidebars, secondary backgrounds
- **Border**: `#E5E5E5` - Default borders
- **Text Primary**: `#181818` - Main text
- **Text Secondary**: `#6B6B6B` - Secondary text
- **Text Tertiary**: `#9CA3AF` - Muted text

### Semantic Colors
- **Success/Active**: Purple shades
- **Hover States**: Light purple backgrounds
- **Shadows**: `rgba(121,99,208,0.12)` to `rgba(121,99,208,0.35)`

### Typography
- **Font Family**: `'DM Sans', 'Segoe UI', system-ui, sans-serif`
- **Font Sizes**: Responsive (11px - 24px)
- **Font Weights**: 500 (regular), 600 (semi-bold), 700 (bold)

---

## 🧩 Components

### Core Components
- **Header**: Sticky header with logo, tab switcher, and user avatar
- **Asset Sidebar**: Collapsible sidebar with asset list and add button
- **Preview Container**: Main content preview area with iframe/PDF/image viewers
- **Simulation Overlay**: Bottom overlay for persona selection and feedback
- **Persona Selector**: Dropdown with persona cards
- **Chat Interface**: Message bubbles with persona avatars
- **Voice Call Interface**: Full-screen call view with controls
- **Bottom Overlay**: Modal for adding/editing assets
- **Topic Bubbles**: Interactive discussion topic buttons

### Interactive Elements
- **Buttons**: Multiple variants (primary, secondary, icon-only)
- **Input Fields**: Text inputs, file uploads, textareas
- **Dropdowns**: Custom dropdown menus
- **Modals**: Overlay modals for actions
- **Loading States**: Spinners and skeleton loaders
- **Empty States**: Helpful empty state messages with CTAs

---

## 🛠️ Tech Stack

### Frontend Framework
- **React 19.2.0** - Modern React with hooks
- **Vite 7.2.4** - Fast build tool and dev server
- **ESLint** - Code linting and quality

### APIs & Services
- **Anthropic Claude API** - AI persona conversations and feedback
- **Web Speech API** - Voice recognition and synthesis
- **Browser APIs** - File API, URL API, Speech Recognition

### Development Tools
- **Cursor** - AI-powered code editor used for development
- **ChatGPT** - AI assistance for code generation and problem-solving
- **Git** - Version control
- **GitHub** - Repository hosting

### Build & Deploy
- **Vite Build** - Production builds
- **ESBuild** - Fast JavaScript bundling
- **Static Assets** - Optimized asset handling

### Future Database Integration
- **Planned**: Database integration for persistent storage of:
  - User accounts and preferences
  - Saved personas and configurations
  - Asset history and versions
  - Conversation history
  - Analytics and usage data

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern browser with Web Speech API support
- Anthropic API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/supreet-builder/purplebuilder.git
   cd purplebuilder/purple-builder-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_ANTHROPIC_API_KEY=your_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

---

## 📖 How It Works

### 1. **Adding Assets**
- Click the **+** button in the left sidebar
- Select asset type (Website, Pitch Deck, Figma, etc.)
- For URLs: Enter the URL in the bottom overlay
- For Files: Upload PDF, PPTX, images, or documents
- Asset appears in sidebar and is automatically selected for preview

### 2. **Previewing Content**
- Click any asset in the sidebar to preview it
- Websites load in an iframe
- PDFs display in a PDF viewer
- Images show in an image viewer
- Other content types show appropriate previews

### 3. **Starting a Simulation**
- Select one or more personas from the simulation overlay
- Click "Start Simulation"
- Personas analyze your content and provide real-time feedback
- Switch between personas to see different perspectives
- Feedback appears in bubbles and chat interface

### 4. **Chatting with Personas**
- Select a persona from the dropdown
- Click discussion topic bubbles for quick starts
- Type messages or use voice call feature
- Personas respond with context-aware feedback based on your uploaded content

### 5. **Voice Calls**
- Click "Talk to [Persona Name]" button
- Grant microphone permissions
- Speak naturally - the AI listens and responds
- See real-time transcript and voice message history

---

## 🎯 Supported Content Types

1. **Website** - Enter any website URL
2. **Pitch Deck** - Upload PDF or PPTX files
3. **Figma** - Add Figma design links
4. **Survey** - Add survey/form URLs
5. **Document** - Upload PDF, DOC, DOCX files
6. **Image** - Upload image files (JPG, PNG, etc.)
7. **Marketing Assets** - Text-based marketing content
8. **Ad Copy** - Advertisement copy text
9. **Email** - Email content
10. **Branding** - Branding materials and guidelines

---

## 🔧 Configuration

### Adding API Keys
The app uses Anthropic's Claude API for AI conversations. Add your API key in the code where API calls are made (currently in the `sendMsg` and voice call functions).

### Customizing Personas
Edit the `defaultPersonas` array in `App.jsx` to add or modify personas. Each persona needs:
- `id`, `name`, `firm`, `type`
- `avatar` (image URL)
- `voiceSettings` (rate, pitch, voiceIndex)
- `context` (background description)
- `topics` (array of discussion topics)

### Styling
All styles are inline in the component. To customize:
- Modify color values in the component
- Adjust spacing and sizing values
- Update font families and sizes

---

## 📁 Project Structure

```
purple-builder-app/
├── src/
│   ├── App.jsx          # Main application component (2,036 lines)
│   ├── App.css          # Global styles
│   ├── main.jsx         # React entry point
│   ├── index.css        # Base styles
│   └── assets/          # Images and icons
│       ├── purplebuilder_logo.png
│       └── ...
├── public/              # Static assets
├── dist/                # Production build output
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── README.md           # This file
```

---

## 🎨 UI/UX Highlights

- **Smooth Animations**: All interactions have smooth transitions
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Intuitive Navigation**: Clear visual hierarchy and easy-to-use controls
- **Visual Feedback**: Loading states, hover effects, and status indicators
- **Accessibility**: Keyboard navigation and screen reader friendly

---

## 🔮 Future Enhancements

- [ ] Database integration for persistent storage
- [ ] User authentication and accounts
- [ ] Team collaboration features
- [ ] Advanced analytics and insights
- [ ] Export simulation reports
- [ ] Integration with more design tools
- [ ] Custom AI model fine-tuning
- [ ] Multi-language support

---

## 🤝 Contributing

This is a private project, but suggestions and feedback are welcome!

---

## 📝 License

MIT License - feel free to use this code for your projects.

---

## 👨‍💻 Development Credits

- **Built with**: React, Vite, Cursor AI, ChatGPT
- **AI Integration**: Anthropic Claude API
- **Design**: Custom purple-themed UI
- **Icons**: Custom SVG icons

---

## 📞 Support

For issues or questions, please open an issue in the GitHub repository.

---

**Made with 💜 by the PurpleBuilder team**
