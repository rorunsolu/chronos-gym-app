# Chronos Gym App

## Overview

I live in the gym and after thinking about what projects I should try creating after my last one (a Productivity App) I settled on this one. I wanted to create a workout app similar to the same app that I already personally use (it's called Hevy. Been using it since 2023). Functionality wise it is mostly
identical other than the social side of things. When I have time I'll try add that in later on.

## Stack

- React
- TypeScript
- JavaScript
- Vite
- Firebase
- Tailwind CSS / CSS

## Features

- **Authentication**: Secure login and account management using Firebase.
- **Exercise Tracking**: Create, view, and manage exercises with detailed statistics.
- **Routine Management**: Plan and execute workout routines with session tracking.
- **Timers**: Rest timers for workouts.
- **Profile Management**: View and update user profiles.
- **Statistics**: Calculate and display single exercise and session stats.

## Project Structure

The project is organized into the following main directories:

- **src/common**: Includes shared utilities like stats calculation and type definitions.
- **src/components**: Reusable UI components such as logos, exercise cards, and timers.
- **src/contexts**: Context providers for managing global state (e.g., Account, Exercise, Routine, Workout).
- **src/hooks**: Custom React hooks for accessing and manipulating context data.
- **src/pages**: Page components for different sections of the app (e.g., Homepage, Profile, Exercise, Routine, Workout).

## Installation

1. Clone the repository:
   ```powershell
   git clone https://github.com/rorunsolu/chronos-gym-app
   ```
2. Navigate to the root project directory:
3. Install dependencies:
   ```powershell
   npm install
   ```

## Development

To start the development server:

```powershell
npm run dev
```

## Build

To create a production build:

```powershell
npm run build
```

## Deployment

The app is configured for deployment on Vercel. Ensure the `vercel.json` file is properly set up.
