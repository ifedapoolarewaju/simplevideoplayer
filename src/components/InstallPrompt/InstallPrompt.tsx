'use client';

import { useState, useEffect } from 'react';
import './InstallPrompt.css';

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'svp-install-dismissed';

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] =
        useState<BeforeInstallPromptEvent | null>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [showIOSTip, setShowIOSTip] = useState(false);
    const [dismissed, setDismissed] = useState(true);

    useEffect(() => {
        if (window.matchMedia('(display-mode: standalone)').matches) return;

        setDismissed(localStorage.getItem(DISMISS_KEY) === 'true');
        setIsIOS(
            /iPad|iPhone|iPod/.test(navigator.userAgent) &&
                !('MSStream' in window)
        );

        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    if (dismissed) return null;
    if (!deferredPrompt && !isIOS) return null;

    async function handleInstall() {
        if (deferredPrompt) {
            await deferredPrompt.prompt();
            await deferredPrompt.userChoice;
            // prompt() can only be called once per event — clear it always
            setDeferredPrompt(null);
        } else if (isIOS) {
            setShowIOSTip((prev) => !prev);
        }
    }

    function handleDismiss() {
        localStorage.setItem(DISMISS_KEY, 'true');
        setDismissed(true);
    }

    return (
        <div className='install-prompt'>
            {showIOSTip && (
                <div className='install-prompt-tip'>
                    Tap the share button, then &quot;Add to Home Screen&quot;
                </div>
            )}
            <div className='install-prompt-actions'>
                <button
                    className='install-prompt-button'
                    onClick={handleInstall}
                >
                    Install App
                </button>
                <button
                    className='install-prompt-dismiss'
                    onClick={handleDismiss}
                >
                    Don&apos;t ask again
                </button>
            </div>
        </div>
    );
}
