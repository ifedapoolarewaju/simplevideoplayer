
export function getAmplifier(video) {
  const AvailableContext = window.AudioContext || window.webkitAudioContext;
  const context = new AvailableContext();
  const result = {
    context,
    source: context.createMediaElementSource(video),
    gain: context.createGain(),
    amplify: (multiplier) => {
      result.gain.gain.value = multiplier;
    }
  };
  result.source.connect(result.gain);
  result.gain.connect(context.destination);
  return result;
}
