# Deployment Guide for AlaStretch

## GitHub Pages Deployment

### Option 1: Direct Deployment (Recommended)

1. **Initialize Git Repository** (if not already done):
   ```bash
   cd "C:\Users\JP Umahag\Desktop\Portfolio\Website pages\alastretch"
   git init
   git add .
   git commit -m "Initial commit: AlaStretch 4-minute workout"
   ```

2. **Create GitHub Repository**:
   - Go to https://github.com/new
   - Create a new repository (e.g., `alastretch`)
   - Don't initialize with README (we already have one)

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/alastretch.git
   git branch -M main
   git push -u origin main
   ```

4. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Deploy from branch
   - Branch: main, folder: / (root)
   - Click Save

5. **Access Your Site**:
   - After a few minutes, visit: `https://YOUR_USERNAME.github.io/alastretch/`

### Option 2: Deploy to Existing Portfolio

If you want to add this to your existing portfolio website:

1. **Copy the alastretch folder** to your portfolio's public directory
2. **Link from your main page**:
   ```html
   <a href="alastretch/index.html">4-Minute Stretch Workout</a>
   ```

### Important Notes for GitHub Pages

✅ **What Works**:
- All interactive features
- Character animations
- Audio (background music, speech, sound effects)
- Voice control (with user permission)
- Play/pause/restart controls
- Progress tracking

⚠️ **What Doesn't Work on GitHub Pages**:
- Video rendering (requires Node.js/Puppeteer - run locally only)
- The `scripts/` folder is not needed for the web version

## Local Development

### Running Locally

```bash
# Start development server
npm start

# Open in browser
# http://localhost:3000
```

### Testing

1. Open http://localhost:3000 in Chrome or Edge
2. Click "Start Workout"
3. Test voice commands (click "Voice Control" first)
4. Verify all 8 exercises cycle correctly
5. Check audio works (music, speech, countdown)

## Video Rendering (Local Only)

### Prerequisites

1. **Install FFmpeg**:
   - Download from https://ffmpeg.org/download.html
   - Add to PATH

2. **Verify Installation**:
   ```bash
   ffmpeg -version
   ```

### Render Video

```bash
# Step 1: Generate frames (takes ~15-20 minutes)
npm run render

# Step 2: Compile to MP4
ffmpeg -framerate 60 -i "output/frames/frame_%06d.png" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p "output/alastretch.mp4"
```

**Output**: `output/alastretch.mp4` (1920×1080, 60fps, ~4 minutes)

### Storage Requirements

- Frames: ~14GB (14,400 PNG files)
- Final MP4: ~200-300MB

**Tip**: Delete frames after creating MP4 to free space:
```bash
Remove-Item -Recurse -Force "output/frames"
```

## Privacy & Security

### Reference Photos

The reference photos used to create the characters are stored locally at:
`C:\Users\JP Umahag\Desktop\Personal\photos for alastretch\`

**These photos are NOT included in the repository.**

The characters are stylized 2D representations drawn programmatically - no actual photographs are embedded in the code.

### What Gets Deployed

Only these files go to GitHub Pages:
- HTML/CSS/JavaScript source code
- Character drawing algorithms
- No personal photos
- No private data

## Browser Compatibility

### Fully Supported
- ✅ Chrome 90+ (all features)
- ✅ Edge 90+ (all features)
- ✅ Firefox 88+ (all features)

### Limited Support
- ⚠️ Safari 14+ (voice control may be limited)
- ⚠️ Mobile browsers (works but voice control varies)

## Troubleshooting

### Audio Not Playing

**Issue**: No sound after clicking Start Workout  
**Solution**: Modern browsers require user interaction before playing audio. The app handles this automatically, but if issues persist:
1. Refresh the page
2. Click "Start Workout" again
3. Check browser audio permissions

### Voice Control Not Working

**Issue**: Voice button shows "Not Supported"  
**Solution**: 
- Use Chrome or Edge (best support)
- Check microphone permissions in browser settings
- HTTPS or localhost required for mic access

### Animations Stuttering

**Issue**: Characters move jerkily  
**Solution**:
1. Close other browser tabs
2. Check CPU usage
3. Try a different browser
4. Reduce system load

### Module Not Found Error

**Issue**: Browser shows "Failed to load module"  
**Solution**: Must use HTTP server, not file:// protocol
```bash
npm start
# Then visit http://localhost:3000
```

## Performance Optimization

### For Production

If deploying to a high-traffic site, consider:

1. **Minify JavaScript**:
   ```bash
   npm install -D terser
   npx terser app.js -o app.min.js -c -m
   ```

2. **Add Service Worker** for offline support

3. **Compress Assets** (gzip)

4. **Use CDN** for faster global access

## Credits

- **Created for**: Ala (Judy Ann) and colleagues Ruby & Tine
- **Character Design**: Based on provided reference photos
- **Development**: AI-assisted with human direction
- **Framework**: Vanilla JavaScript (no dependencies for web app)
- **Audio**: Web Audio API & Web Speech API
- **Animation**: HTML5 Canvas 2D

## License

Personal project - created as a gift. Feel free to adapt for your own use.

---

**Questions?** Check the main README.md for technical details.
