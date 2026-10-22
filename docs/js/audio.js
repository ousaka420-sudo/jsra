// 仮の効果音。素材が入るまでは WebAudio で鳴らす
import { store } from './store.js';

let ctx = null;

function ac() {
  if (!ctx) {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    ctx = new C();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, start, dur, type = 'square', gain = 0.05) {
  const c = ac();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, c.currentTime + start);
  g.gain.linearRampToValueAtTime(gain, c.currentTime + start + 0.01);
  g.gain.linearRampToValueAtTime(0, c.currentTime + start + dur);
  o.connect(g).connect(c.destination);
  o.start(c.currentTime + start);
  o.stop(c.currentTime + start + dur + 0.05);
}

function noise(dur, gain = 0.03) {
  const c = ac();
  if (!c) return;
  const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const s = c.createBufferSource();
  const g = c.createGain();
  g.gain.value = gain;
  s.buffer = buf;
  s.connect(g).connect(c.destination);
  s.start();
}

const sounds = {
  // フードコートの呼び出しベル
  bell() { for (let i = 0; i < 6; i++) tone(i % 2 ? 1320 : 1760, i * 0.12, 0.09, 'square', 0.035); },
  bellFar() { for (let i = 0; i < 4; i++) tone(i % 2 ? 1320 : 1760, i * 0.16, 0.08, 'square', 0.012); },
  radio() { noise(0.25, 0.04); tone(1200, 0.22, 0.06, 'sine', 0.03); },
  tape() { noise(0.18, 0.05); },
  notify() { tone(880, 0, 0.08, 'sine', 0.06); tone(1320, 0.09, 0.12, 'sine', 0.06); },
  glitch() { noise(0.5, 0.06); tone(90, 0, 0.5, 'sawtooth', 0.04); },
  chime() { [659, 784, 988, 1318].forEach((f, i) => tone(f, i * 0.14, 0.3, 'sine', 0.05)); },
};

export function sfx(name) {
  if (store.get('muted')) return;
  try { sounds[name] && sounds[name](); } catch (e) { /* 音は鳴らなくても進行に影響しない */ }
}
