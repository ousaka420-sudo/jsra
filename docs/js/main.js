import { store } from './store.js';
import { sfx } from './audio.js';
import { Player } from './engine.js';
import prologue from './scenes/prologue.js';
import ep11 from './scenes/ep1-1.js';
import log11 from './scenes/log1-1.js';
import ep12 from './scenes/ep1-2.js';
import log12 from './scenes/log1-2.js';
import ep13 from './scenes/ep1-3.js';
import log13 from './scenes/log1-3.js';
import ep14 from './scenes/ep1-4.js';
import log14 from './scenes/log1-4.js';
import ep15 from './scenes/ep1-5.js';
import log15 from './scenes/log1-5.js';
import ep16 from './scenes/ep1-6.js';
import log16 from './scenes/log1-6.js';
import ep17 from './scenes/ep1-7.js';
import { afterEp1, afterLog, afterEp2, afterLog2, afterEp3, afterLog3, afterEp4, afterLog4, afterEp5, afterLog5, afterEp6, afterLog6 } from './scenes/client.js';

const SCENES = {
  prologue,
  '1-1': ep11,
  'log-1-1': log11,
  '1-2': ep12,
  'log-1-2': log12,
  '1-3': ep13,
  'log-1-3': log13,
  '1-4': ep14,
  'log-1-4': log14,
  '1-5': ep15,
  'log-1-5': log15,
  '1-6': ep16,
  'log-1-6': log16,
  '1-7': ep17,
  'client-1': afterEp1,
  'client-2': afterLog,
  'client-3': afterEp2,
  'client-4': afterLog2,
  'client-5': afterEp3,
  'client-6': afterLog3,
  'client-7': afterEp4,
  'client-8': afterLog4,
  'client-9': afterEp5,
  'client-10': afterLog5,
  'client-11': afterEp6,
  'client-12': afterLog6,
};

// ハブに並ぶ端末。needs のエピソードをクリアすると接続できる
const DEVICES = [
  { id: '1-1', name: 'ソラのスマホ', meta: 'ツギメイト／10/03 第二部隊／フードコート', icon: '<img src="assets/ui/tsugi_1.webp" alt="">', iconClass: 'tsugi' },
  { id: '1-2', needs: '1-1', name: '鷺沼班長のタブレット', meta: 'JSRA FIELD／10/06 第二部隊／立体駐車場', icon: '📟', locked: '接続待ち' },
  { id: '1-3', needs: '1-2', name: '協会 本部端末', meta: '監視カメラ／10/09 本部／シネマ', icon: '🖥', locked: '暗号化中' },
  { id: '1-4', needs: '1-3', name: 'タカミのスマホ', meta: 'ツギメイト／10/12 指名案件／キッズスペース', icon: '📱', locked: '接続待ち' },
  { id: '1-5', needs: '1-4', name: '迷子センターの館内放送卓', meta: '遠隔接続／10/15 本部／迷子センター', icon: '📢', locked: '接続待ち' },
  { id: '1-6', needs: '1-5', name: 'エリアマネージャーのPC', meta: 'ツギメイト株式会社／10/18／バックヤード', icon: '💼', locked: '権限不足' },
  { id: '1-7', needs: '1-6', name: '依頼人のスマホ', meta: '10/18／吹き抜け（第1章 最終話）', icon: '<img src="assets/ui/button.svg" alt="">', locked: '依頼人の許可待ち' },
];
// 閲覧禁止ログ。エピソードのクリアで解放される
const LOGS = [
  { id: 'log-1-1', name: '第一部隊 隊員のスマホ', meta: '最終同期 10/01 23:59／視覚フィルタなし' },
  { id: 'log-1-2', name: '単独派遣の無線記録', meta: '最終受信 10/04 22:55／視覚フィルタなし' },
  { id: 'log-1-3', name: '上映記録：スクリーン7', meta: '10/07 23:30／視覚フィルタなし' },
  { id: 'log-1-4', name: 'ツギメイト サポート履歴', meta: '10/08 指名案件／視覚フィルタなし' },
  { id: 'log-1-5', name: '迷子センター 受付記録', meta: '2020/10/04〜／視覚フィルタなし' },
  { id: 'log-1-6', name: '斑森村 神事記録', meta: '針ヶ谷のPCの保存ファイル／視覚フィルタなし' },
];
// 依頼人のチャット。after を満たした順に新着として出る
const CLIENT_CHATS = [
  { id: 'client-1', after: () => store.has('cleared', '1-1'), text: '見ましたか' },
  { id: 'client-2', after: () => store.has('readLogs', 'log-1-1'), text: '第一部隊の記録を、開きましたね' },
  { id: 'client-3', after: () => store.has('cleared', '1-2'), text: '駐車場の記録、見ましたか' },
  { id: 'client-4', after: () => store.has('readLogs', 'log-1-2'), text: 'ハヤトという人の記録を、聞きましたね' },
  { id: 'client-5', after: () => store.has('cleared', '1-3'), text: '映画館の記録、見ましたか' },
  { id: 'client-6', after: () => store.has('readLogs', 'log-1-3'), text: '最後まで見た人たちの記録ですね' },
  { id: 'client-7', after: () => store.has('cleared', '1-4'), text: 'ボールプールの記録、見ましたか' },
  { id: 'client-8', after: () => store.has('readLogs', 'log-1-4'), text: '「指名」の記録を、見ましたね' },
  { id: 'client-9', after: () => store.has('cleared', '1-5'), text: '……放送、聞こえました' },
  { id: 'client-10', after: () => store.has('readLogs', 'log-1-5'), text: '迷子カードの最後の一枚、見ましたか' },
  { id: 'client-11', after: () => store.has('cleared', '1-6'), text: '……あの人に、名前を言われてしまいましたね' },
  { id: 'client-12', after: () => store.has('readLogs', 'log-1-6'), text: '村の記録を、読みましたね' },
];

const $ = (s) => document.querySelector(s);
const views = ['hp', 'login', 'hub', 'message', 'play'];

function show(name) {
  views.forEach((v) => { $(`#view-${v}`).hidden = v !== name; });
  document.body.style.background = name === 'hp' || name === 'login' ? '' : '#050608';
  window.scrollTo(0, 0);
}

// ---- トースト・モーダル ----
let toastTimer;
function toast(text) {
  const t = $('#toast');
  t.textContent = text;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 3800);
}

const MODALS = {
  privacy: `<h2>プライバシーポリシー</h2>
    <p>本サイトはフィクション作品です。登場する団体・施設・求人・アプリはすべて架空のものです。</p>
    <p><b>現在の情報の取り扱い</b><br>ゲームの進行状況と、Cookie設定の選択結果を、お使いのブラウザ内（localStorage）にのみ保存しています。外部のサーバーには送信していません。</p>
    <p><b>外部サービス</b><br>文字の表示に Google Fonts を利用しています。フォントの読み込みの際、お使いの端末から Google のサーバーへ IPアドレスなどが送信されます。</p>
    <p><b>ホスティング</b><br>本サイトは GitHub Pages で公開しています。ページを表示する際、GitHub のサーバーにアクセスログ（IPアドレスなど）が記録されることがあります。</p>
    <p><b>生成AIの利用</b><br>背景・キャラクターなどの画像の多くは、生成AI（Google Gemini ほか）で作成しています。</p>
    <p><b>今後の予定</b><br>広告配信サービスやアクセス解析を導入する場合は、このページで送信先と送信される情報を公表し、あらためて同意をお願いします。</p>`,
};

function openModal(html) {
  $('#modal-body').innerHTML = html;
  $('#modal').hidden = false;
}
$('#modal-close').addEventListener('click', () => { $('#modal').hidden = true; });
$('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') $('#modal').hidden = true; });

document.addEventListener('click', (e) => {
  const o = e.target.closest('[data-open]');
  if (!o) return;
  if (o.dataset.open === 'consent') { $('#consent').hidden = false; return; }
  openModal(MODALS[o.dataset.open]);
});

// ---- 同意バナー ----
function initConsent() {
  $('#consent').hidden = store.get('consent') !== null;
  $('#consent').addEventListener('click', (e) => {
    const b = e.target.closest('[data-consent]');
    if (!b) return;
    store.set('consent', b.dataset.consent);
    $('#consent').hidden = true;
    renderAds();
  });
}

// ---- 広告枠 ----
// いまは作中広告だけを出す。本物の広告に切り替えるときは、consent === 'accepted' の場合だけ
// 広告タグを読み込むようにここを差し替える（閲覧禁止ログの画面には広告を置かない）
const FAKE_ADS = [
  `<a class="ad ad-tsugi" href="#/login"><span class="ad-label">作中広告</span><img src="assets/ui/tsugi_2.webp" alt=""><span><strong>ツギメイト</strong>スキマ時間で、だれかの継目をふさごう。</span></a>`,
  `<div class="ad ad-mall"><span class="ad-label">作中広告</span><span><strong>フォレストサイドパーク 花守</strong>家族みんなで、一日じゅう。<br>GRAND OPEN 2015.4.29</span></div>`,
  `<div class="ad ad-dark"><span class="ad-label">作中広告</span><span><strong>迷子のお知らせ</strong>お連れさまのお名前をお呼び出しします。<br>総合案内所までお越しください。</span></div>`,
];
function renderAds() {
  document.querySelectorAll('.ad-slot').forEach((slot, i) => {
    slot.innerHTML = FAKE_ADS[(i + Math.floor(Date.now() / 60000)) % FAKE_ADS.length];
  });
}

// ---- 公開HP：文字化けをタップすると元の言葉が見える ----
let revealed = 0;
document.querySelectorAll('.moji').forEach((m) => {
  m.addEventListener('click', () => {
    if (m.classList.contains('revealed')) return;
    m.textContent = m.dataset.word;
    m.classList.add('revealed');
    revealed += 1;
    if (revealed === 3) toast('依頼人：……見つけてくれましたね。STAFF ONLY から入ってください');
  });
});

// ---- ログイン ----
$('#login-btn').addEventListener('click', () => {
  const msg = $('#login-msg');
  msg.textContent = '認証サーバーに接続しています……';
  setTimeout(() => {
    msg.textContent = '認証できません。外部からの接続を検出しました';
    $('#view-login').classList.add('glitching');
    sfx('glitch');
    setTimeout(() => {
      $('#view-login').classList.remove('glitching');
      msg.textContent = '';
      location.hash = store.get('seenPrologue') ? '#/hub' : '#/message/prologue';
    }, 1600);
  }, 900);
});

// ---- ハッキングで侵入した協会の職員用記録管理アプリ ----
let activeClient = { id: 'prologue', text: '斑木光輝を探してください。まずは、ソラという子のスマホから', fresh: false };
let dismissedNoticeId = null;

function renderHub() {
  const fresh = CLIENT_CHATS.find((c) => c.after() && !store.has('readLogs', c.id));
  const lastRead = [...CLIENT_CHATS].reverse().find((c) => store.has('readLogs', c.id));
  activeClient = fresh ? { id: fresh.id, text: fresh.text, fresh: true }
    : store.has('cleared', '1-7') ? { id: lastRead ? lastRead.id : 'prologue', text: '第1章 完。……兄と、ごはんを食べています', fresh: false }
    : lastRead ? { id: lastRead.id, text: '次の端末がつながるのを待っています', fresh: false }
    : { id: 'prologue', text: '斑木光輝を探してください。まずは、ソラという子のスマホから', fresh: false };

  const devices = DEVICES.map((d) => {
    const open = !d.notYet && (!d.needs || store.has('cleared', d.needs));
    const done = store.has('cleared', d.id);
    return `<button type="button" class="dev" ${open ? `data-go="${d.id}"` : 'disabled'}>
      <span class="dev-icon ${d.iconClass || ''}">${d.icon}</span>
      <span class="dev-main"><span class="dev-name">${d.name}</span><span class="dev-meta">${d.meta}</span></span>
      <span class="dev-badge ${open && !done ? 'new' : ''}">${!open ? d.locked : done ? '再生済み' : 'NEW'}</span>
    </button>`;
  }).join('');

  const logs = LOGS.filter((l) => store.has('unlockedLogs', l.id)).map((l) => `
    <button type="button" class="dev danger" data-go="${l.id}">
      <span class="dev-icon">⚠</span>
      <span class="dev-main"><span class="dev-name">${l.name}</span><span class="dev-meta">${l.meta}</span></span>
      <span class="dev-badge">${store.has('readLogs', l.id) ? '閲覧済み' : '閲覧注意'}</span>
    </button>`).join('');

  $('#hub-body').innerHTML = `
    <p class="hub-sec">接続できる端末</p>
    ${devices}

    ${logs ? `<p class="hub-sec">未確認の記録</p>${logs}` : ''}

    <div class="ad-slot" data-ad="hub"></div>
    <p class="fiction" style="margin-top:24px">本サイトはフィクションです。実在の人物・団体・施設・求人とは関係ありません。</p>`;
  renderAds();
  renderClientNotice();
}

function renderClientNotice() {
  const notice = $('#client-notice');
  const showNotice = activeClient.fresh && dismissedNoticeId !== activeClient.id;
  $('#message-unread').hidden = !activeClient.fresh;
  notice.hidden = !showNotice;
  notice.classList.toggle('show', showNotice);
  $('#client-notice-text').textContent = activeClient.text;
}

function openClientMessage() {
  location.hash = `#/message/${activeClient.id}`;
}

$('#hub-message-btn').addEventListener('click', openClientMessage);
$('#client-notice-main').addEventListener('click', openClientMessage);
$('#client-notice-close').addEventListener('click', () => {
  dismissedNoticeId = activeClient.id;
  renderClientNotice();
});

$('#hub-body').addEventListener('click', (e) => {
  const b = e.target.closest('[data-go]');
  if (b && !b.disabled) location.hash = `#/play/${b.dataset.go}`;
});

$('#hub-menu-btn').addEventListener('click', () => {
  const muted = store.get('muted');
  openModal(`<h2>設定</h2>
    <p><button type="button" class="modal-close" id="m-mute">音：${muted ? 'OFF' : 'ON'}</button></p>
    <p><button type="button" class="modal-close" data-open="consent">Cookie設定</button></p>
    <p><button type="button" class="modal-close" id="m-reset">進行データを消去</button></p>
    <p><a href="#/">JSRA のトップに戻る</a></p>`);
  $('#m-mute').addEventListener('click', () => { store.set('muted', !muted); $('#modal').hidden = true; });
  $('#m-reset').addEventListener('click', () => {
    if (confirm('進行データを消去しますか？')) { store.reset(); $('#modal').hidden = true; location.hash = '#/'; }
  });
});

// ---- 再生 ----
let current = null;
async function play(id, root = $('#player-root'), returnTo = '#/hub') {
  const script = SCENES[id];
  if (!script) { location.hash = '#/hub'; return; }
  if (current) current.abort();
  const player = new Player(root, { toast });
  current = player;
  const r = await player.run(script);
  if (current !== player) return; // 別の再生に切り替わった
  current = null;
  if (r) {
    if (r.mark) store.set(r.mark, true);
    if (r.clear) store.mark('cleared', r.clear);
    if (r.unlock) store.mark('unlockedLogs', r.unlock);
    if (r.read) store.mark('readLogs', r.read);
  }
  if (id === 'prologue') store.set('seenPrologue', true);
  location.hash = returnTo;
}

// ---- ルーター ----
function route() {
  const h = location.hash || '#/';
  if (current) { const p = current; current = null; p.abort(); }
  if (h.startsWith('#/play/')) { show('play'); play(decodeURIComponent(h.slice(7))); return; }
  if (h.startsWith('#/message/')) { show('message'); play(decodeURIComponent(h.slice(10)), $('#message-root')); return; }
  if (h === '#/login') { show('login'); return; }
  if (h === '#/hub') { show('hub'); renderHub(); return; }
  if (h.startsWith('#/')) { show('hp'); return; }
  // #works などページ内リンク
  show('hp');
  document.querySelector(h)?.scrollIntoView({ behavior: 'smooth' });
}

window.addEventListener('hashchange', route);
initConsent();
renderAds();
route();
