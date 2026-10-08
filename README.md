# AlaStretch - 4-Minute Office Stretch Experience

A personalized, interactive 4-minute office stretching workout featuring three animated characters based on real people.

## Features

- **8 Exercise Rounds** - 5 seated, 3 standing exercises (30 seconds each)
- **Personalized Characters** - Three unique animated characters with distinct appearances
- **Audio System** - Background music, speech synthesis, countdown sounds with automatic ducking
- **Voice Control** - Optional microphone commands (start, pause, resume, restart)
- **Interactive Controls** - Play, pause, restart buttons
- **Progress Tracking** - Visual timer, round counter, and progress bar
- **Video Export** - Render to 1080p 60fps MP4

## Quick Start

### Interactive Web Version

1. Install dependencies:
   ```bash
   cd alastretch
   npm install
   ```

2. Start the local server:
   ```bash
   npm start
   ```

3. Open your browser to: `http://localhost:3000`

4. Click "Start Workout" and enjoy!

### Video Rendering

1. Render frames:
   ```bash
   npm run render
   ```

2. Install FFmpeg (if not already installed)

3. Create MP4 from frames:
   ```bash
   ffmpeg -framerate 60 -i "output/frames/frame_%06d.png" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p "output/alastretch.mp4"
   ```

## Exercise Sequence

1. **Seated Neck Rolls** (0:00-0:30)
2. **Seated Shoulder Shrugs** (0:30-1:00)
3. **Standing Side Bends** (1:00-1:30)
4. **Seated Torso Twists** (1:30-2:00)
5. **Standing Arm Circles** (2:00-2:30)
6. **Seated Wrist Rotations** (2:30-3:00)
7. **Standing Hip Circles** (3:00-3:30)
8. **Seated Ankle Rolls** (3:30-4:00)

## Voice Commands

When voice control is enabled, you can say:
- "Start" / "Play" / "Begin" - Start the workout
- "Pause" / "Stop" - Pause the workout
- "Resume" / "Continue" - Resume from pause
- "Restart" / "Reset" - Restart from beginning

## Characters

- **Ala** (Center) - Brown shoulder-length hair, yellow athletic top
- **Ruby** (Left) - Dark hair pulled back, red athletic top
- **Tine** (Right) - Styled-up hair, purple athletic top

All characters wear modest, office-appropriate athletic wear with full-length leggings.

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari (voice control may have limited support)

## Technical Details

- **Canvas-based rendering** - Smooth 2D character animation
- **Web Audio API** - Dynamic music and sound effects
- **Web Speech API** - Text-to-speech and voice recognition
- **Puppeteer** - Headless browser rendering for video export
- **Vanilla JavaScript** - No framework dependencies for the app itself

## Project Structure

```
alastretch/
├── index.html              # Main HTML file
├── styles.css              # Styling
├── app.js                  # Main application logic
├── character-renderer.js   # Character drawing and animation
├── audio-manager.js        # Audio system
├── voice-controller.js     # Voice command handling
├── exercises.js            # Exercise definitions
├── package.json            # Dependencies
├── scripts/
│   ├── server.js          # Local development server
│   └── render-video.js    # Video rendering script
└── output/                # Generated video files (created on render)
```

## Notes

- The application automatically handles audio context initialization on user interaction
- Voice control requires microphone permissions
- Video rendering requires significant disk space (~14GB for frames at 1080p60)
- All character designs are stylized representations for animation purposes

## Made with ❤️

Created as a personalized fitness experience using AI-assisted development.
