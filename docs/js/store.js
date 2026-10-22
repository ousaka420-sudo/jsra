// 進行状況と同意状態の保存。localStorage が使えない環境でも落ちないようにする
const KEY = 'jsra-save-v1';

const defaults = {
  consent: null,        // 'accepted' | 'rejected' | null
  seenPrologue: false,
  cleared: {},          // { '1-1': true }
  unlockedLogs: {},     // { 'log-1-1': true }
  readLogs: {},
  muted: false,
};

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...defaults, ...JSON.parse(raw) };
  } catch (e) { /* プライベートブラウズなど */ }
  return { ...defaults };
}

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* 無視 */ }
}

export const store = {
  get: (k) => state[k],
  set(k, v) { state[k] = v; save(); },
  mark(group, id) { state[group] = { ...state[group], [id]: true }; save(); },
  has: (group, id) => !!(state[group] && state[group][id]),
  reset() { state = { ...defaults, consent: state.consent }; save(); },
};
