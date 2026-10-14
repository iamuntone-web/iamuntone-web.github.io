import { useRef, useState } from 'react';
import { useCardSound } from './useCardSound';
import strategies from './data/strategies.json';

export function StrategyDeck() {
  const [text, setText] = useState<string | null>(null);
  const [phase, setPhase] = useState<'idle' | 'leaving' | 'entering'>('idle');
  const pending = useRef('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const playSound = useCardSound();
  const draw = () => {
    if (phase !== 'idle') return;
    if (soundEnabled) void playSound();
    const choices = strategies.filter(item => item !== text);
    pending.current = choices[Math.floor(Math.random() * choices.length)];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setText(pending.current);
      return;
    }
    setPhase('leaving');
  };
  return <section className="strategies" aria-labelledby="strategies-title">
    <h2 id="strategies-title">ОБХОДНЫЕ СТРАТЕГИИ</h2>
    <p className="strategies-intro">Застрял? Вытащи карточку, вдруг она подкинет свежую мысль. Эти необычные подсказки придумали Брайан Ино и Питер Шмидт в 1975 году, чтобы выходить из творческого тупика.</p>
    <div className={`strategy-deck ${phase}`}>
      <div className="strategy-back strategy-left" aria-hidden="true"/>
      <div className="strategy-back strategy-right" aria-hidden="true"/>
      <button type="button" className="strategy-card" aria-label={text ? 'Вытянуть следующую подсказку' : 'Вытянуть подсказку'} aria-disabled={phase !== 'idle'} onClick={draw} onAnimationEnd={event => {
        if (event.target !== event.currentTarget) return;
        if (phase === 'leaving') { setText(pending.current); setPhase('entering'); }
        else if (phase === 'entering') setPhase('idle');
      }}>
        <span className="strategy-content"><img src="/assets/strategy-spark.png" alt=""/><span>{text || <>Нажми на карточку<br/>для подсказки</>}</span></span>
      </button>
    </div>
    <button className="strategy-sound" type="button" aria-pressed={soundEnabled} aria-label="Звук карточек" onClick={() => setSoundEnabled(value => !value)}>{soundEnabled ? 'Звук: вкл' : 'Звук: выкл'}</button>
    <span className="sr-only" role="status" aria-live="polite">{phase === 'idle' ? text : ''}</span>
  </section>;
}
