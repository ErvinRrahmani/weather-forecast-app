# Weather Forecast App

A simple weather app built with React and TypeScript. Search for any city and get current weather information!

## What it does
- 🌤️ Shows current weather for any city
- 📊 Displays temperature, weather description, and wind speed
- 📝 Keeps a history of your searches
- ↩️ Click on history items to search again
- 🗑️ Remove items from history (with undo option)
- 📱 Works on desktop and mobile

## Quick Start

### 1. Install and Run
```bash
npm install    # Install dependencies
npm run dev    # Start the app
```
Open http://localhost:5173 in your browser.

### 2. Get a Free API Key
1. Go to [OpenWeatherMap](https://openweathermap.org/api) and sign up (it's free!)
2. Copy your API key
3. Create a file called `.env.local` in the project folder
4. Add this line to the file:
   ```
   VITE_OPENWEATHER_API_KEY=your-api-key-here
   ```
5. Replace `your-api-key-here` with your actual API key

### 3. That's it!
Search for any city and enjoy the weather! 🌈

## Other Commands
```bash
npm run build  # Build for production
npm test       # Run tests
```

## How it's built

This app follows good coding practices:

**Clean Code Structure:**
- Each part does one job
- Easy to test and extend
- Well-organized folders

**Project Folders:**
```
src/
├── components/    # UI pieces (search form, weather display, etc.)
├── hooks/         # Reusable logic
├── services/      # API calls
├── utils/         # Helper functions
└── types/         # TypeScript definitions
```

**Quality Features:**
- ✅ TypeScript for better code
- ✅ 47 automated tests
- ✅ Error handling
- ✅ Loading states
- ✅ Responsive design
- ✅ Accessibility support

## Need Help?

**Common Issues:**
- **"API key error"**: Make sure your `.env.local` file has the correct API key
- **"City not found"**: Try a different spelling or include the country (e.g., "Paris, France")
- **App won't start**: Run `npm install` first

**Want to add features?**
The code is organized to make adding new features easy. Each component is independent and well-tested.

---

Made with ❤️ using React, TypeScript, and Tailwind CSS
