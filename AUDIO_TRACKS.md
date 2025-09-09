# Audio Track Switching Feature

This document describes the audio track switching functionality added to Simple Video Player.

## Overview

The audio track switching feature allows users to switch between multiple audio tracks in video files that contain them. This is useful for:

- Videos with multiple language dubs
- Videos with director's commentary
- Videos with different audio mixes (stereo, 5.1, etc.)

## Technical Implementation

### Browser Compatibility

The feature relies on the HTML5 `audioTracks` API, which has limited browser support:

- **Supported**: Some versions of Chrome, Firefox, and Safari (with limitations)
- **Not Supported**: Many browsers don't implement this API
- **Graceful Fallback**: The component automatically detects support and only shows when available

### How It Works

1. **Detection**: When a video loads, the `AudioTrackSelector` component checks:
   - If the browser supports the `audioTracks` API
   - If the video file contains multiple audio tracks
   
2. **UI Display**: 
   - If multiple tracks are available: Shows an active audio track button with a dropdown
   - If only one track: Shows a disabled button with explanatory tooltip
   - If API not supported: Shows a disabled button that explains the limitation when clicked

3. **Track Switching**: 
   - Users can click the audio track button to see available tracks
   - Each track shows its label and language (if available)
   - Clicking a track switches the audio and updates the UI

### Component Structure

```
AudioTrackSelector/
├── AudioTrackSelector.tsx    # Main component logic
└── AudioTrackSelector.css    # Styling for the dropdown and button
```

### Integration

The component is integrated into the video controls (`VideoControls.tsx`) and appears between the volume slider and fullscreen button.

## User Experience

### Multiple Audio Tracks Available
- Audio track button appears with a music note icon
- Button is white/active and clickable
- Tooltip shows "Select Audio Track (X available)"
- Dropdown shows list of tracks with labels and languages
- Current track is marked with a checkmark

### Single Audio Track
- Audio track button appears but is grayed out
- Tooltip explains "Only one audio track available"
- Button is not clickable

### API Not Supported
- Audio track button appears grayed out
- Clicking shows a message explaining browser limitations
- Message auto-hides after 3 seconds

## Console Logging

The component provides helpful console messages for debugging:

- `Simple Video Player: Audio tracks detected: X [track details]`
- `Simple Video Player: Multiple audio tracks available for switching`
- `Simple Video Player: AudioTracks API not supported in this browser`
- `Simple Video Player: Switched to audio track: [track-id]`

## Testing

To test the audio track functionality:

1. Find a video file with multiple audio tracks (e.g., MKV files with multiple languages)
2. Load the video in Simple Video Player
3. Check browser console for audio track detection messages
4. Look for the audio track button in the video controls
5. If multiple tracks are detected, test switching between them

## Limitations

- Limited browser support for the `audioTracks` API
- Some video formats may not expose multiple audio tracks to the web browser
- Track labels and languages depend on the video file metadata
- The feature only works with video files that properly declare multiple audio tracks

## Future Enhancements

Potential improvements could include:

- Fallback detection methods for browsers without `audioTracks` API
- Integration with video.js or other media libraries for better track support
- Manual track configuration for advanced users
- Audio track preview before switching