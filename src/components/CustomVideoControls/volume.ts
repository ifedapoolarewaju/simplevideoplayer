'use client';
export type Amplifier = {
    context: AudioContext;
    source: MediaElementAudioSourceNode;
    gain: GainNode;
    amplify: (multiplier: number) => void;
};

export function getAmplifier(video: HTMLMediaElement): Amplifier {
    const AvailableContext = window.AudioContext || window.webkitAudioContext;
    const context = new AvailableContext();
    const result = {
        context,
        source: context.createMediaElementSource(video),
        gain: context.createGain(),
        amplify: (multiplier: number) => {
            result.gain.gain.value = multiplier;
        },
    };
    result.source.connect(result.gain);
    result.gain.connect(context.destination);
    return result;
}
