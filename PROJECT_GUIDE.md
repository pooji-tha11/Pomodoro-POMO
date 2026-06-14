# The POMO App - Beginner's Project Guide

Welcome to the **POMO** project! This guide is written specifically for you to understand how this app was built from the ground up. Whether you are revisiting this code months from now or just trying to wrap your head around React concepts, this guide will explain everything using plain English and examples directly from your codebase.

---

## 1. Project Overview

### What is this app?
POMO is a minimal, beautifully designed, and cozy Pomodoro focus timer with an integrated task checklist. 

### What problem does it solve?
It helps users avoid distractions by breaking work into intervals (usually 25 minutes of focus, followed by 5 minutes of break). By keeping a checklist right next to the timer, it ensures users know exactly what they are focusing on.

### The User Flow
1. A user opens the app and is greeted by a clean workspace.
2. They type out a few tasks in the Todo List.
3. They click **Start** on the timer and begin focusing.
4. When the timer hits `00:00`, a soft bell rings. The app records that session, adds it to the "Today's Momentum" dots, logs the time in the History, and automatically switches to Break Time.
5. The user takes a break, resets the timer, and goes again.
6. The next day, the app clears completed tasks automatically to provide a fresh start!

---

## 2. Tech Stack Used

Here are the specific tools we used to build this:

* **React**: The core JavaScript library used to build the user interface. It lets us create reusable components (like buttons or timers) and handles updating the screen automatically when data changes.
* **Vite**: A blazingly fast build tool. Think of it as the engine that starts our local development server (`npm run dev`) and bundles all our React code together so the browser can read it.
* **JavaScript (ES6+)**: The programming language that powers all the logic, math, and behavior in the app.
* **Vanilla CSS**: We used plain CSS (no Tailwind or libraries) using CSS Variables to create a highly custom, premium design with a beautiful Dark/Light mode.
* **localStorage**: A feature built into web browsers that lets websites save small amounts of data. We used this so the app remembers your tasks even if you close the tab.
* **lucide-react**: A library for beautiful, simple icons (like the trash can, settings gear, and maximize buttons).

---

## 3. Folder Structure Breakdown

If you open the project folder, here is what you'll see and why it exists:

```text
POMO/
├── index.html           # The main entry point. The browser loads this first.
├── public/              
│   └── favicon.svg      # The little logo icon that appears in the browser tab.
├── package.json         # Lists all your project dependencies (like React and Vite).
└── src/                 # "Source" folder. 99% of your coding happens here!
    ├── main.jsx         # The starting point for React. It renders <App /> into index.html.
    ├── App.jsx          # The "brain" of your app. Holds all the state and ties everything together.
    ├── index.css        # Global styles (background colors, fonts, CSS variables for theming).
    ├── App.css          # Specific styling for layout and individual components.
    └── components/      # A folder holding isolated, reusable pieces of your UI.
        ├── Header.jsx         # The top bar with the logo, date, and dark mode toggle.
        ├── Timer.jsx          # The big countdown clock and Start/Pause buttons.
        ├── TodoList.jsx       # The right panel where you add/delete/check off tasks.
        ├── DailySummary.jsx   # The stats at the bottom (Sessions, Focus Time, Tasks Done).
        └── SettingsModal.jsx  # The popup to change timer durations and sounds.
```

---

## 4. How React Works In This Project

React is all about making the UI react to changes in data.

* **Components**: Think of components like custom HTML tags. Instead of writing massive HTML files, we created `<Timer />` and `<TodoList />` and assembled them inside `<App />`. 
* **State (`useState`)**: State is React's memory. It's a way for a component to remember information. 
  * *Example*: `const [isRunning, setIsRunning] = useState(false);` remembers if the timer is ticking or paused. When you call `setIsRunning(true)`, React automatically re-renders the UI to show the "Pause" button instead of "Start".
* **Props**: Props (short for properties) are how we pass data from a parent component down to a child component.
  * *Example*: `<TodoList tasks={tasks} />`. The `App.jsx` owns the `tasks` state, but it passes it down to `TodoList` as a prop so the list can display them.
* **Event Handlers**: Functions that run when a user interacts with the app.
  * *Example*: `onClick={toggleTimer}` runs a function when the user clicks the Start button.
* **`useEffect`**: A React hook that lets you run side-effects (things outside of the standard React rendering cycle). 
  * *Example*: We use `useEffect` to listen to keyboard presses (`Space` to pause) and to make the timer count down `setInterval` every 1 second.

---

## 5. Feature-by-Feature Code Explanation

### The Pomodoro Timer (`Timer.jsx` & `App.jsx`)
In `App.jsx`, we keep track of `timeLeft` (in seconds). Inside `Timer.jsx`, a `useEffect` runs every 1000 milliseconds (1 second) and subtracts 1 from `timeLeft`. When `timeLeft` hits zero, it triggers `onSessionComplete`.

### Focus & Break Switching
When `timeLeft === 0`, `Timer.jsx` looks at the `mode` state. If it was `'focus'`, it sets the mode to `'break'` and sets the time to the `breakDuration`. This creates the automatic flipping behavior.

### Task System (`TodoList.jsx`)
Tasks are an array of objects: `[{ id: 1, text: 'DSA', completed: false }]`. 
When you add a task, we use the `...` (spread operator) to copy the old tasks and add the new one: `setTasks([...tasks, newTask])`.

### Daily Task Persistence
In `App.jsx`, when the app first loads (`useEffect` with an empty array `[]`), it checks `lastOpenedDate` against `today`. If they don't match, it filters the `tasks` array, dropping anything that is `completed: true`. It then resets the daily stats.

### Theme Toggle (`index.css` & `Header.jsx`)
We store a `theme` state as `'light'` or `'dark'`. An effect dynamically updates the `<html>` tag: `document.documentElement.setAttribute('data-theme', theme);`. In `index.css`, we use `[data-theme='dark']` to swap out all our CSS variables to darker colors.

### Fullscreen Mode (`Timer.jsx`)
The Maximize button calls `document.documentElement.requestFullscreen()`, which is a native browser feature. We listen to fullscreen changes to swap the icon to `Minimize`.

---

## 6. State Management Map

All the important state lives in `App.jsx` so it can be shared with child components.

* `theme`: Stores 'light' or 'dark'. Changes when you click the moon/sun icon.
* `isSoundEnabled`: Stores true/false. Changed in the Settings modal.
* `focusDuration` & `breakDuration`: Stores numbers (e.g., 25 and 5). Changed in Settings.
* `mode`: Stores 'focus' or 'break'. Changes automatically when a timer hits zero.
* `timeLeft`: Stores seconds remaining. Changed every second by the timer interval, or when switching modes.
* `isRunning`: Stores true/false. Changed by clicking Start/Pause or pressing Spacebar.
* `tasks`: Stores an array of task objects. Changed by the TodoList component.
* `sessionsCompleted` & `totalFocusTime`: Stores numbers. Incremented every time a focus session hits zero.
* `recentSessions`: Stores an array of logged completed sessions for the UI history list.

---

## 7. LocalStorage Breakdown

If we only used `useState`, all your tasks would vanish when you hit refresh. To fix this, we created a custom hook called `useLocalStorageState` in `App.jsx`.

**How it works:**
Instead of starting from a blank slate, the hook first peeks inside the browser's `localStorage`. 
* If it finds saved tasks, it uses them as the initial state.
* If it doesn't, it uses the default (like 25 minutes).

Then, it uses a `useEffect` to "watch" that state. Every single time you complete a task or change a setting, the `useEffect` fires and quietly saves the updated state as a string using `JSON.stringify(state)` back into `localStorage`. 

---

## 8. Code Walkthrough (The Lifecycle)

Here is exactly what React does as you use the app:

1. **App Loads**: React mounts `<App />`. It reads `localStorage` and restores your theme, timer, and tasks. It notices it's a new day, so it wipes yesterday's completed tasks.
2. **Timer Starts**: You click Start. `isRunning` becomes `true`. React passes `isRunning` down to `<Timer />`. The `useEffect` inside `<Timer />` starts a 1-second interval.
3. **Timer Ticks**: Every second, `setTimeLeft` is called. React re-renders `<Timer />` to show the new number.
4. **Session Ends**: `timeLeft` hits 0. The interval is cleared. `App.jsx`'s `onSessionComplete` function is triggered. It plays the audio bell, adds `1` to `sessionsCompleted`, and saves the session to history. React updates the "Momentum" dots and the "Recent Sessions" list.
5. **Task Completes**: You click a checkbox. The `toggleTask` function in `TodoList` flips `completed` to `true`. The custom hook intercepts this and saves the new task list to `localStorage` instantly.

---

## 9. Important React Concepts I Learned

* **Reusable Components**: We wrote the `<Timer />` component once, but it is flexible. We pass it `mode='focus'` or `mode='break'`, and it automatically adjusts its title without needing two separate timer files.
* **Lifting State Up**: We put the `tasks` state inside `App.jsx` instead of `TodoList.jsx` so that `App.jsx` could potentially use task data for the `DailySummary` component.
* **Conditional Rendering**: We used syntax like `{recentSessions.length > 0 && ( ... )}` to only show the "RECENT SESSIONS" card if you actually have sessions. If the array is empty, React renders nothing.
* **Event Handling**: We captured browser events safely, like stopping a form from refreshing the page using `e.preventDefault()` when adding a task.

---

## 10. Beginner Notes (Things that look scary but aren't)

* **`[...tasks, newTask]`**: This is called the Spread Operator. It just means "take everything currently inside the `tasks` array, dump it out here, and stick `newTask` at the very end." It's React's safe way to add to an array without destroying the old one.
* **`() => setIsRunning(prev => !prev)`**: When updating state based on the previous state, React likes you to use a function. `prev` is just a variable representing the old state (e.g., `false`). `!prev` flips it to the opposite (`true`).
* **`new (window.AudioContext || window.webkitAudioContext)()`**: This terrifying line in `App.jsx` is just the browser's built-in way of making sounds without needing an MP3 file. We told it to generate two sine waves (like a pure tuning fork) to make a pleasant bell noise.

---

## 11. Suggested Future Improvements

While this code is excellent and clean, here are ways it could be improved as you learn more:

* **Context API**: Right now, we pass a lot of props from `App.jsx` down into `Timer` and `SettingsModal`. If the app gets bigger, it's better practice to use React Context so child components can grab data without passing it down multiple levels.
* **Splitting Files**: The `App.jsx` file is getting a bit long because it holds the audio code, the local storage hook, and all the state. A great refactor would be moving `useLocalStorageState` into a separate file in a `hooks/` folder.
* **Complex Data Types**: Currently, dates are tracked by strings (`toDateString()`). In massive apps, it's safer to use timestamp numbers or libraries like `date-fns` to do date math.

*Happy Coding! Use this guide whenever you feel lost in the code. You built this, and it works beautifully.*
