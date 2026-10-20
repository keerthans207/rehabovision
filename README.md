# RehaboVision AI

A computer-vision-assisted sports rehabilitation platform prototype built with React, TypeScript, and Vite.

## Overview

RehaboVision AI is designed to support physiotherapist-led rehabilitation by tracking patient movement during prescribed exercises using computer vision. It provides two connected experiences:

### Physiotherapist Experience
- Patient management and protocol configuration
- Session review with measurement data and quality indicators
- Progress tracking across multiple sessions
- Clinical notes and annotations

### Patient Experience
- Guided exercise sessions with live pose tracking
- Real-time joint angle measurements and repetition counting
- Session history and progress visualization
- Clear feedback on measurement quality

## Key Design Principles

- **Minimal and calm**: Clean, spacious layouts with restrained visual effects
- **Healthcare-focused**: Professional tone, clear labels, accessible contrast
- **Measurement transparency**: All measurements include units, timestamps, and quality indicators
- **Clinical responsibility**: No autonomous diagnosis or treatment recommendations

## Tech Stack

- **React 18** with TypeScript
- **React Router 6** for navigation
- **Recharts** for data visualization
- **Lucide React** for icons
- **Vite** for build tooling

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`.

## Project Structure

```
src/
├── components/
│   ├── layout/       # AppLayout, Sidebar, PageHeader
│   └── ui/           # Reusable UI components (Button, Card, Input, etc.)
├── pages/
│   ├── physio/       # Physiotherapist interface screens
│   └── patient/      # Patient interface screens
├── data/
│   └── mock.ts       # Mock data for prototype
├── types/
│   └── index.ts      # TypeScript type definitions
├── hooks/
│   └── useToast.ts   # Toast notification hook
├── App.tsx           # Route configuration
├── main.tsx          # Entry point
└── index.css         # Design system tokens and global styles
```

## Design System

### Colors
- **Primary**: `#147D78` (teal)
- **Background**: `#F7F9FA`
- **Surface**: `#FFFFFF`
- **Text Primary**: `#172B2A`
- **Text Secondary**: `#647572`
- **Success**: `#27845A`
- **Warning**: `#C58A26`
- **Error**: `#C84C4C`

### Typography
- **Font**: Inter (via Google Fonts)
- **Sizes**: 11px–32px, consistent line heights
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Spacing
- Based on 8px grid
- Component padding: 16–32px
- Gap between elements: 8–24px

### Components
All UI components follow consistent design tokens defined in `index.css` and are built as reusable, accessible React components.

## Important Notes

### This is a Prototype
- Camera feed and pose skeleton are **illustrative only** — real implementation requires actual computer vision integration
- Mock data is used throughout for demonstration
- No backend or database integration
- Authentication is simulated via role selection on the home screen

### Clinical Responsibility
- This platform **does not diagnose injuries** or prescribe treatment autonomously
- All exercise protocols must be configured by qualified physiotherapists
- Measurement data should be reviewed by clinicians before making treatment decisions
- Patients should consult their physiotherapist if they experience unusual or severe discomfort

### Accessibility
- Semantic HTML and ARIA labels throughout
- Keyboard navigation support
- Accessible color contrast ratios
- Clear focus indicators
- Reduced motion preference respected

## Future Implementation

To move from prototype to production, you would need:

1. **Computer Vision Integration**
   - MediaPipe, TensorFlow.js, or similar pose estimation library
   - Real-time video processing and landmark extraction
   - Quality validation and error handling

2. **Backend & Database**
   - User authentication and authorization
   - Patient data storage (HIPAA/GDPR compliant)
   - Session recording and retrieval
   - Physiotherapist-patient assignment logic

3. **Advanced Features**
   - Multi-angle camera support
   - Exercise library with reference videos
   - Automated movement analysis and anomaly detection
   - Export reports for clinical review
   - Mobile app for iOS and Android

4. **Security & Compliance**
   - Healthcare data encryption
   - Role-based access control
   - Audit logging
   - Consent management
   - Regulatory compliance (FDA, CE marking, etc.)

## License

This is a prototype developed for design and demonstration purposes.

---

**RehaboVision AI** — Supporting physiotherapist-led rehabilitation through computer vision.
