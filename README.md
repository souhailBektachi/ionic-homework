# عييت (I'm Tired) - Anti-Productivity App

An Ionic mobile application that playfully discourages users from working excessively. Unlike traditional productivity apps that reward work, this app expresses disappointment when users report working and celebrates when they're resting.

## Features

### Main Dashboard (عييت)
- Disappointment meter shows how disappointed the app is with your work habits
- Work check-in system asking "Are you working right now?"
- The app displays "عيا عيا" with disappointed responses when you work
- Celebration messages when you're resting
- Quick daily work hour input

### Work Tracker (العمل)
- Calendar-based work hour tracking
- Detailed work history with color-coded work hours
- Ability to delete work records
- Weekly work statistics including average daily hours
- Tracks excessive work days

### Statistics & Settings (الإحصائيات)
- Cumulative disappointment tracking
- Weekly work statistics and analysis 
- "Shame board" showing days with excessive work
- Customizable judgment severity settings
- Reminder frequency controls

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Ionic CLI
- Angular CLI

### Installation

1. Clone the repository
```
git clone [repository-url]
```

2. Install dependencies
```
npm install
```

3. Run the application
```
ionic serve
```

## Building for Mobile

### Android
```
ionic capacitor add android
ionic capacitor copy android
ionic capacitor open android
```

### iOS
```
ionic capacitor add ios
ionic capacitor copy ios
ionic capacitor open ios
```

## Technical Implementation

The app uses:
- Ionic framework for cross-platform UI components
- Angular for application architecture
- Local storage for maintaining work history and settings
- Reactive UI patterns for real-time feedback

## Design Philosophy

"عييت" (I'm Tired) is designed with a tongue-in-cheek approach to productivity, celebrating rest rather than work. The app uses gentle humor and mock disappointment to encourage users to maintain a healthy work-life balance and take more breaks.

The Arabic title "عييت" (pronounced "ayeet") conveys the feeling of being tired or fed up with work, which reinforces the app's core message.