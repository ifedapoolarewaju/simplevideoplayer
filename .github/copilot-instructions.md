# Simple Video Player

Simple Video Player is a Next.js 14.2.30 React application written in TypeScript that allows users to play local video files directly in their browser without uploading them anywhere. The application supports subtitle files (SRT and WebVTT), keyboard controls, and VLC-style volume amplification up to 400%.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Prerequisites and Setup
- Ensure Node.js v20.19.5+ and npm v10.8.2+ are installed
- Clone the repository and navigate to the project directory

### Bootstrap and Development
1. Install dependencies:
   ```bash
   npm install
   ```
   - Takes approximately 17 seconds
   - Installs 320 packages
   - May show 3 vulnerabilities (1 low, 2 moderate) - these are acceptable for development

2. Start development server:
   ```bash
   npm run dev
   ```
   - Takes approximately 1.4 seconds to start
   - Runs on http://localhost:3000

3. Run linting:
   ```bash
   npm run lint
   ```
   - Takes under 30 seconds
   - Shows expected warnings about missing dependencies and image optimization
   - All warnings are acceptable and do not prevent functionality

### Production Build
```bash
npm run build
```
- Creates optimized production build
- Takes approximately 2-3 minutes to complete 
- Shows warnings about image optimization and ESLint rules (these are expected)
- May show metadata warnings about metadataBase - these are acceptable
- Outputs build statistics and static page information

## Validation

### Manual Testing Requirements
**ALWAYS** manually validate changes by running through these complete user scenarios:

1. **File Selection Test**:
   - Navigate to http://localhost:3000
   - Click "Select a video file" button
   - Verify file dialog opens (note: in headless environments, test the click event)
   - Test drag-and-drop functionality if possible

2. **Application Load Test**:
   - Verify main page loads with pink "Select a video file" button
   - Verify GitHub fork link appears in top-right corner
   - Verify features section displays correctly
   - Check browser console for any unexpected errors

3. **Component Integration Test**:
   - Verify all React components render without errors
   - Test that VideoContextProvider properly wraps the application
   - Validate that routing works between main page and video player

### Development Validation Commands
```bash
# Always run these before committing changes:
npm run lint          # Validates code style and catches basic issues
npm run dev           # Verify application starts successfully
npm run build         # Test production build (optional but recommended)
```

## Codebase Navigation

### Key Directories and Files
```
/src/app/
├── layout.tsx          # Main app layout with metadata and providers
├── page.tsx           # Home page with file selection interface
├── globals.css        # Global styles
└── screen/page.tsx    # Video player screen

/src/components/
├── VideoPlayer/       # Main video playback component
├── VideoSelector/     # File selection and drag-drop interface  
├── VideoControls/     # Custom video control interface
├── CustomVideoControls/ # Keyboard controls and shortcuts
├── VideoContextProvider/ # React context for video state management
├── SubtitleSelector/  # Subtitle file handling (SRT/WebVTT)
└── Fork/             # GitHub repository link component

/src/assets/          # Icons and images (logo.png, play icons, volume controls)
```

### Critical Components to Understand
- **VideoContextProvider.tsx**: Central state management for video data
- **VideoPlayer.tsx**: Core video playback logic and subtitle integration  
- **VideoSelector.tsx**: File selection, drag-drop, and navigation to player
- **CustomVideoControls.tsx**: Keyboard shortcuts and volume amplification

### Common Modification Patterns
- Video functionality changes: Start with `VideoPlayer.tsx` and `VideoControls.tsx`
- UI/UX changes: Modify `page.tsx` and component-specific CSS files
- State management: Update `VideoContextProvider.tsx`
- File handling: Work with `VideoSelector.tsx` and `SubtitleSelector.tsx`

## Common Tasks

### Adding New Features
1. Always start the development server: `npm run dev`
2. Make changes to relevant components in `/src/components/`
3. Test changes at http://localhost:3000
4. Run `npm run lint` to check for issues
5. Manually validate using the scenarios above

### Debugging Issues
1. Check browser console for React errors
2. Verify file imports use the correct `@/` alias paths
3. Ensure all components are properly exported/imported
4. Use both development and production builds for comprehensive testing

### Styling Changes
- Global styles: `/src/app/globals.css`
- Component styles: Individual `.css` files next to components
- Uses standard CSS (no CSS-in-JS or styled-components)

## Timing Expectations and Commands

| Command | Expected Time | Notes |
|---------|---------------|-------|
| `npm install` | ~17 seconds | Downloads 320+ packages |
| `npm run dev` | ~1.4 seconds | Starts development server |
| `npm run lint` | <30 seconds | Shows expected warnings |
| `npm run build` | ~2-3 minutes | Creates optimized production build |

**NEVER CANCEL** long-running commands. Always wait for completion or documented failure.

## Troubleshooting

### Common Issues
1. **Linting warnings about dependencies**: Expected warnings, do not modify unless changing component logic.
2. **Image optimization warnings**: Expected Next.js warnings, acceptable for current setup.
3. **Metadata warnings**: Expected metadataBase warnings during build, acceptable for current setup.

### Build Environment Notes  
- Production builds work in all environments
- Development mode recommended for faster iteration
- Both development and production modes are fully functional

## Project Context

This is a browser-based video player designed for security-conscious users who want to play local video files without installing desktop applications. The browser sandbox provides an additional layer of security when playing videos from untrusted sources.

**Key Features**:
- Local file playback (no uploads)
- Subtitle support (SRT/WebVTT)  
- Keyboard controls
- Volume amplification up to 400%
- No external dependencies for core functionality