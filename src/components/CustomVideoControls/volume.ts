"use client";
export type Amplifier = {
  context: AudioContext;
  source: MediaElementAudioSourceNode;
  gain: GainNode;
  amplify: (multiplier: number) => void;
};

export function getAmplifier(video: HTMLMediaElement): Amplifier {
  // let media = new WeakMap();
  // let source;
  // let context;
  const AvailableContext = window.AudioContext || window.webkitAudioContext;
  const context = new AvailableContext();
  // if (media.has(video)) {
  //   source = media.get(video);
  // } else {
  //   source = new MediaElementAudioSourceNode(context, { mediaElement: video });
  //   media.set(video, source);
  // }
  // if (!source) {
  //   console.log("source", source);
  //   console.log("context", context.);

  //   source = context.createMediaElementSource(video);
  // }
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
