import { useEffect, useRef } from 'react';

// A short filtered air sweep, generated locally without audio downloads.
export function useCardSound() {
  const context = useRef<AudioContext | null>(null);
  useEffect(() => () => {
    const audio = context.current;
    context.current = null;
    if (audio && audio.state !== 'closed') void audio.close().catch(() => {});
  }, []);
  return async () => {
    try {
      if (!window.AudioContext) return;
      const audio = context.current ?? (context.current = new AudioContext());
      await audio.resume();
      if (audio.state !== 'running') return;
      const duration = 0.32;
      const buffer = audio.createBuffer(1, Math.ceil(audio.sampleRate * duration), audio.sampleRate);
      const samples = buffer.getChannelData(0);
      for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
      const source = audio.createBufferSource();
      source.buffer = buffer;
      const filter = audio.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = 0.7;
      const gain = audio.createGain();
      const now = audio.currentTime;
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(350, now + duration);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration - 0.02);
      gain.gain.linearRampToValueAtTime(0, now + duration);
      source.connect(filter).connect(gain).connect(audio.destination);
      source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); };
      source.start(now);
      source.stop(now + duration);
    } catch {
      // Audio restrictions must never interrupt drawing a card.
    }
  };
}
