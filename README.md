## Simple Video Player

> Why download a video player when you can simply play your videos on the browser

This is a simple video player that runs on the Browser. Visit the website https://simplevideoplayer.com

Basically, do you have a video on your computer you'd like to play? Just visit https://simplevideoplayer.com and there you have a video player. Your videos will not be uploaded anywhwere, it's all being played locally.

It also supports subtitles (SRT and WebVTT), so add them to your videos as you watch.

### Features

- You can add subtitle files (SRT or WebVTT) to your video.
- Easy to use keyboard controls
- VLC style volume amplification
- **Progressive Web App (PWA)** — install it to your home screen and use it offline

### PWA & Offline Support

Simple Video Player is a Progressive Web App. This means you can:

- **Install it** on your phone or desktop from the browser (look for "Add to Home Screen" or the install icon in your browser's address bar)
- **Use it offline** — once loaded, the app works without an internet connection
- **Get instant updates** — the service worker keeps the app up-to-date automatically

Since all video playback happens locally on your device, offline support is a natural fit.

### Why did I build this?

So sometimes I have videos which might have been downloaded from untrusted sources and I'm worried about the safety of playing them with any app on my machine. If the video is indeed corrupted with some virus, depending on the kind of firewall rules you have enabled, any app that plays the video may be exploited to grant it persmissions to execute some unwanted actions.

Because browsers like Chrome, and Brave have [sandboxing](https://computer.howstuffworks.com/google-chrome-browser7.htm), I'm often fairly more confident about playing these video files via my browser. Even though they are also [not 100% secure](https://security.stackexchange.com/a/122105), I am more assured when using them. Also browsers are updated more often than a lot of video players, so if there were a security issue revolving around video players on the browser, you are likelier to have your browser updated with a security fix than your offline video player.

Also I was just really surprised nothing like this already exists on the internet. :/

PS: My take on this is not based on any in-depth research, but rather a somewhat superficial knowledge on how Computers, Viruses, and Browsers work.

### Contributions

Oh yes please! Clearly there's a lot of room for improvement. Keyboard shortcuts, and lots of other general video player functionalities. I'd be happy to review your PR. :)
