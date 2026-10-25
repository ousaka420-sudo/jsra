// シナリオ再生エンジン。シナリオはコマンドの配列（js/scenes/*.js）
import { sfx } from './audio.js';
import { store } from './store.js';

// 立ち絵。表情差分があるキャラは表情番号で切り替わる
const SPRITES = {
  kouki: (n = 1) => `assets/chara/kouki_s${n}.webp`,
  // 優希：1=無表情 2=冷たい目 3=伏し目 4=かすかな笑み
  yuki: (n = 1) => `assets/chara/yuki_s${n}.webp`,
  // 鷺沼班長：1=眠そう 2=厳しい 3=安堵 4=不安 'gun'=銃を抜く（いざという時だけ）
  saginuma: (n = 1) => (n === 'gun' ? 'assets/chara/saginuma_gun.webp' : `assets/chara/saginuma_s${n}.webp`),
  // 本部オペレーター糸井：1=落ち着き 2=素の笑顔
  itoi: (n = 1) => `assets/chara/itoi_s${n}.webp`,
  // エリアマネージャー針ヶ谷：1=優しい笑顔 2=目が笑っていない笑顔
  harigaya: (n = 1) => `assets/chara/harigaya_s${n}.webp`,
  // 第二部隊のアルバイト タカミ：1=無関心
  takami: () => 'assets/chara/takami_s1.webp',
};
// 上の一覧にないキャラは「キャラID_s番号.webp」（番号以外は「キャラID_名前.webp」）を探す
const sprite = (who, n = 1) => (SPRITES[who] ? SPRITES[who](n) : `assets/chara/${who}_${typeof n === 'number' ? `s${n}` : n}.webp`);
// 表情番号：1=いたずらっぽい笑顔 2=安心させる笑顔 3=真剣 4=寂しげ（優希は 1=無表情 2=冷たい目 3=伏し目 4=かすかな笑み）
const face = (who, n) => `assets/chara/${who}_face${n}.webp`;
const BG_LABEL = {
  parking: '仮背景：第3駐車場',
  foodcourt: '仮背景：フードコート',
  'foodcourt-deep': '仮背景：フードコート（奥）',
  exit: '仮背景：非常口',
  black: '',
  static: '',
};
// 本番の背景画像。ここにない背景は CSS の仮背景で表示する
const BG_IMAGES = {
  foodcourt: 'assets/bg/foodcourt.webp',
  'foodcourt-deep': 'assets/bg/foodcourt-deep.webp',
  exit: 'assets/bg/exit.webp',
  garage: 'assets/bg/garage.webp',
  stairs: 'assets/bg/stairs.webp',
  cinema: 'assets/bg/cinema.webp',
  hq: 'assets/bg/hq.webp',
  kids: 'assets/bg/kids.webp',
  arcade: 'assets/bg/arcade.webp',
  lostfound: 'assets/bg/lostfound.webp',
  office: 'assets/bg/office.webp',
  atrium: 'assets/bg/atrium.webp',
  parking: 'assets/bg/parking.webp',
};
// 生成画像が明るすぎる背景は、ゲーム内で少し沈める
const BG_FILTERS = {
  kids: 'brightness(.72) saturate(.75) contrast(1.05)',
  office: 'brightness(.6) saturate(.8)',
};
// マスコット「ツギー」：1=ふつう 2=手を振る 3=バンザイ 4=おじぎ 5=不気味
const TSUGI = (n) => `assets/ui/tsugi_${n}.webp`;
const MASCOT = TSUGI(1);
const MASCOT_UNCANNY = TSUGI(5);
const CLIENT_ICON = 'assets/ui/button.svg';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export class Player {
  constructor(root, { toast, onExit } = {}) {
    this.root = root;
    this.toast = toast || (() => {});
    this.onExit = onExit || (() => {});
    this.backlog = [];
    this.auto = false;
    this.aborted = false;
    this.mode = 'adv';
    this.build();
  }

  build() {
    this.root.innerHTML = `
      <div class="player">
        <div class="stage"><div class="bg bg-black"></div><img class="sprite hide" alt=""></div>
        <div class="radio" hidden><div class="radio-head"></div><div class="radio-list"></div></div>
        <div class="cctv" hidden>
          <div class="cctv-frame"><div class="bg"></div><div class="cctv-figure"></div></div>
          <div class="cctv-scan"></div><div class="cctv-id"></div><div class="cctv-rec">REC</div>
          <div class="cctv-time"></div><div class="cctv-sub"></div>
        </div>
        <div class="chat" hidden>
          <div class="chat-head">
            <button type="button" class="chat-back" data-act="message-back" hidden>← <span>戻る</span></button>
            <img alt="" hidden><div class="chat-heading"><div class="chat-title"></div><div class="chat-sub"></div></div>
          </div>
          <div class="chat-list"></div><div class="chat-hint">タップで続き</div>
        </div>
        <div class="app" hidden></div>
        <div class="msg" hidden><div class="msg-name" hidden></div><img class="msg-face" alt="" hidden><div class="msg-text"></div><div class="msg-next">▼</div></div>
        <div class="hud">
          <div class="hud-info"><div class="hud-device"></div><div class="hud-record"></div></div>
          <span class="hud-filter">視覚フィルタ ON</span>
          <button type="button" class="hud-btn" data-act="auto">AUTO</button>
          <button type="button" class="hud-btn" data-act="menu" aria-label="メニュー">≡</button>
        </div>
        <div class="cam-label"></div>
        <div class="overlay"></div>
      </div>`;
    const $ = (s) => this.root.querySelector(s);
    this.el = {
      player: $('.player'), stage: $('.stage'), bg: $('.stage .bg'), sprite: $('.sprite'),
      radio: $('.radio'), radioHead: $('.radio-head'), radioList: $('.radio-list'),
      cctv: $('.cctv'), cctvBg: $('.cctv-frame .bg'), cctvFig: $('.cctv-figure'), cctvId: $('.cctv-id'), cctvTime: $('.cctv-time'), cctvSub: $('.cctv-sub'),
      chat: $('.chat'), chatBack: $('.chat-back'), chatIcon: $('.chat-head img'), chatTitle: $('.chat-title'), chatSub: $('.chat-sub'), chatList: $('.chat-list'),
      app: $('.app'), msg: $('.msg'), msgName: $('.msg-name'), msgFace: $('.msg-face'), msgText: $('.msg-text'),
      device: $('.hud-device'), record: $('.hud-record'), filter: $('.hud-filter'), overlay: $('.overlay'),
      autoBtn: $('[data-act="auto"]'), camLabel: $('.cam-label'),
    };
    this.el.player.addEventListener('click', (e) => {
      const act = e.target.closest('[data-act]');
      if (act) { this.hudAction(act.dataset.act); return; }
      if (e.target.closest('button, .app, .sheet, .warn, .cm, .choices')) return;
      this.tap();
    });
  }

  hudAction(act) {
    if (act === 'message-back') {
      location.hash = '#/hub';
      return;
    }
    if (act === 'auto') {
      this.auto = !this.auto;
      this.el.autoBtn.classList.toggle('on', this.auto);
      if (this.auto && !this.typing) this.tap();
    }
    if (act === 'menu') this.openMenu();
  }

  openMenu() {
    const sheet = document.createElement('div');
    sheet.className = 'sheet';
    const muted = store.get('muted');
    sheet.innerHTML = `<div class="sheet-card">
      <h3>メニュー</h3>
      <button type="button" class="row" data-m="log">バックログを見る</button>
      <button type="button" class="row" data-m="mute">音：${muted ? 'OFF' : 'ON'}</button>
      <button type="button" class="row" data-m="exit">再生を中断して 記録管理に戻る</button>
      <button type="button" class="row" data-m="close">閉じる</button></div>`;
    sheet.addEventListener('click', (e) => {
      const m = e.target.closest('[data-m]')?.dataset.m;
      if (!m && e.target !== sheet) return;
      if (m === 'log') {
        sheet.querySelector('.sheet-card').innerHTML = '<h3>バックログ</h3>' +
          (this.backlog.map((l) => `<div class="backlog-line">${l.name ? `<b>${esc(l.name)}</b>` : ''}${esc(l.text)}</div>`).join('') || '<p>まだありません</p>') +
          '<button type="button" class="row" data-m="close">閉じる</button>';
        return;
      }
      if (m === 'mute') store.set('muted', !muted);
      if (m === 'exit') { sheet.remove(); this.abort(); return; }
      sheet.remove();
    });
    this.el.player.appendChild(sheet);
  }

  // ---- 入力待ち ----
  tap() {
    if (this.typing) { this.finishTyping(); return; }
    if (this.resolveTap) {
      const r = this.resolveTap;
      this.resolveTap = null;
      clearTimeout(this.autoTimer);
      r();
    }
  }

  waitTap(autoMs = 1800) {
    return new Promise((res) => {
      this.resolveTap = res;
      if (this.auto) {
        this.autoTimer = setTimeout(() => {
          if (this.resolveTap === res) { this.resolveTap = null; res(); }
        }, autoMs);
      }
    });
  }

  wait(ms) {
    return new Promise((res) => {
      this.resolveTap = res; // タップで短縮できる
      setTimeout(() => { if (this.resolveTap === res) this.resolveTap = null; res(); }, ms);
    });
  }

  type(el, text, speed = 28) {
    return new Promise((res) => {
      this.typing = true;
      let i = 0;
      el.textContent = '';
      const done = () => { clearTimeout(this.typeTimer); this.typing = false; el.textContent = text; this.finishTyping = () => {}; res(); };
      this.finishTyping = done;
      const step = () => {
        if (this.aborted) return done();
        i += 1;
        el.textContent = text.slice(0, i);
        if (i >= text.length) return done();
        this.typeTimer = setTimeout(step, speed);
      };
      step();
    });
  }

  abort() {
    if (this.aborted) return;
    this.aborted = true;
    if (this.resolveTap) { const r = this.resolveTap; this.resolveTap = null; r(); }
    if (this.resolveUi) { const r = this.resolveUi; this.resolveUi = null; r(null); }
    this.finishTyping && this.finishTyping();
    this.onExit();
  }

  // ---- 実行 ----
  async run(script) {
    const queue = [...script];
    let result = null;
    while (queue.length && !this.aborted) {
      const cmd = queue.shift();
      const r = await this.exec(cmd);
      if (r && r.insert) queue.unshift(...r.insert);
      if (r && r.end) { result = r.end; break; }
    }
    return this.aborted ? null : result || {};
  }

  async exec(c) {
    if (c.mode) this.setMode(c.mode, c);
    if (c.device !== undefined) this.el.device.textContent = c.device;
    if (c.record !== undefined) this.el.record.textContent = c.record;
    if (c.filter) this.setFilter(c.filter);
    if (c.bg) this.setBg(this.el.bg, c.bg);
    if (c.show) this.showSprite(c.show, c.face, c.at);
    if (c.hide) this.el.sprite.classList.add('hide');
    if (c.sfx) sfx(c.sfx);
    if (c.fx) this.fx(c.fx);
    if (c.figure !== undefined) this.el.cctvFig.classList.toggle('on', !!c.figure);
    // 監視カメラ越しの立ち絵（ADVのまま緑がかった映像にする）。false で解除
    if (c.camLook !== undefined) {
      this.el.player.classList.toggle('cam-look', !!c.camLook);
      this.el.camLabel.textContent = c.camLook || '';
    }
    if (c.notice) this.toast(c.notice);
    if (c.wait) await this.wait(c.wait);
    if (c.text !== undefined || c.photo) await this.say(c);
    if (c.choice) return { insert: await this.choice(c.choice) };
    if (c.item) await this.item(c);
    if (c.app) await this.appScreen(c.app, c);
    if (c.cm) await (c.cm === true ? this.cm() : this.movie(c.cm, true));
    if (c.movie) await this.movie(c.movie, false);
    if (c.warn) {
      const ok = await this.warn(c.warn);
      if (!ok) { this.abort(); return null; }
    }
    if (c.end) return { end: c };
    return null;
  }

  setMode(mode, c) {
    if (mode !== "adv") this.el.player.classList.remove("cam-look");
    this.mode = mode;
    const e = this.el;
    e.stage.hidden = !(mode === 'adv');
    e.msg.hidden = mode !== 'adv';
    e.radio.hidden = mode !== 'radio';
    e.cctv.hidden = mode !== 'cctv';
    e.chat.hidden = mode !== 'chat';
    e.app.hidden = mode !== 'app';
    if (mode === 'adv') { e.msgText.textContent = ''; e.msgName.hidden = true; e.msgFace.hidden = true; }
    if (mode === 'radio') {
      e.radioHead.textContent = c.head || '';
      if (!c.keep) e.radioList.innerHTML = '';
    }
    if (mode === 'cctv') {
      e.cctvId.textContent = c.cam || '';
      e.cctvTime.textContent = c.time || '';
      e.cctvSub.textContent = '';
      e.cctvFig.classList.remove('on');
      this.setBg(e.cctvBg, c.camBg || 'black');
    }
    if (mode === 'chat') {
      const isClient = c.skin === 'client';
      e.player.classList.toggle('client-message', isClient);
      e.chat.className = 'chat' + (c.skin ? ` skin-${c.skin}` : '');
      e.chatBack.hidden = !isClient;
      e.chatTitle.textContent = c.title || '';
      e.chatSub.textContent = c.sub || '';
      e.chatIcon.hidden = !c.icon;
      if (c.icon) e.chatIcon.src = c.icon === 'client' ? CLIENT_ICON : c.icon === 'mascot' ? MASCOT : c.icon;
      if (!c.keep) e.chatList.innerHTML = '';
    }
  }

  setBg(el, name) {
    const img = BG_IMAGES[name] || (name in BG_LABEL ? null : `assets/bg/${name}.webp`);
    el.className = img ? 'bg bg-image' : `bg bg-${name}`;
    el.style.backgroundImage = img ? `url("${img}")` : '';
    el.dataset.label = img ? '' : BG_LABEL[name] || '';
    el.style.filter = BG_FILTERS[name] || '';
  }

  // at: 'left' | 'right'（省略で中央）
  showSprite(who, faceNo, at) {
    const s = this.el.sprite;
    this.spriteWho = who;
    s.src = sprite(who, faceNo);
    s.className = 'sprite' + (who === 'kouki' ? ' kouki-glow' : '') + (at ? ` at-${at}` : '');
  }

  // 台詞の表情に合わせて、表示中の立ち絵を差し替える
  syncSprite(who, faceNo) {
    const s = this.el.sprite;
    if (s.classList.contains('hide') || this.spriteWho !== who || !faceNo) return;
    const src = sprite(who, faceNo);
    if (!s.src.endsWith(src)) s.src = src;
  }

  setFilter(state) {
    const f = this.el.filter;
    f.className = 'hud-filter' + (state === 'on' ? '' : ` ${state}`);
    f.textContent = { on: '視覚フィルタ ON', fail: 'フィルタ処理失敗', off: '視覚フィルタ OFF' }[state];
    this.el.player.classList.toggle('filter-off', state === 'off');
  }

  fx(name) {
    const p = this.el.player;
    const cls = `fx-${name}`;
    p.classList.remove(cls);
    void p.offsetWidth;
    p.classList.add(cls);
    if (name === 'glitch') sfx('glitch');
    setTimeout(() => p.classList.remove(cls), 1300);
  }

  async say(c) {
    const text = c.text || '';
    this.backlog.push({ name: c.say || (c.me ? '（自分）' : ''), text });
    const autoMs = 1400 + text.length * 50;

    if (this.mode === 'adv') {
      const e = this.el;
      e.msgName.hidden = !c.say;
      e.msgName.textContent = c.say || '';
      e.msgName.className = 'msg-name' + (c.who ? ` ${c.who}` : '');
      e.msgFace.hidden = !(c.who && c.face);
      if (c.who && c.face) this.syncSprite(c.who, c.face);
      if (c.who && c.face) e.msgFace.src = face(c.who, c.face);
      e.msgText.classList.toggle('narr', !c.say);
      await this.type(e.msgText, text);
      return this.waitTap(autoMs);
    }

    if (this.mode === 'radio') {
      const line = document.createElement('p');
      line.className = 'radio-line';
      const cls = c.say === '本部' ? 'hq' : c.say === 'SYSTEM' ? 'sys' : 'field';
      line.innerHTML = `<span class="t">${esc(c.time || '')}</span>${c.say ? `<span class="s ${cls}">${esc(c.say)}：</span>` : ''}<span class="b"></span>`;
      this.el.radioList.appendChild(line);
      sfx('radio');
      await this.type(line.querySelector('.b'), text, 22);
      this.el.radio.scrollTop = this.el.radio.scrollHeight;
      return this.waitTap(autoMs);
    }

    if (this.mode === 'cctv') {
      await this.type(this.el.cctvSub, text, 40);
      return this.waitTap(autoMs);
    }

    if (this.mode === 'chat') {
      const list = this.el.chatList;
      if (!c.say && !c.me) {
        list.insertAdjacentHTML('beforeend', `<p class="sys-line">${esc(text)}</p>`);
      } else {
        const row = document.createElement('div');
        row.className = 'bubble-row' + (c.me ? ' me' : '');
        let av = '';
        if (!c.me) {
          av = c.av === 'client' ? `<img class="av" src="${CLIENT_ICON}" alt="">`
            : c.av === 'mascot' ? `<img class="av" src="${MASCOT}" alt="">`
            : c.av && c.av.startsWith('assets/') ? `<img class="av" src="${c.av}" alt="">`
            : `<span class="av-txt">${esc((c.say || '?').slice(0, 1))}</span>`;
        }
        const body = c.photo
          ? `<div class="bubble photo"><div class="glitch-photo"><img src="${sprite(c.photo)}" alt=""><div class="slice"></div></div></div>`
          : `<div class="bubble">${esc(text)}</div>`;
        row.innerHTML = `${av}<div class="bubble-col">${!c.me && c.say ? `<p class="bubble-name">${esc(c.say)}</p>` : ''}${body}${c.time ? `<div class="bubble-time">${esc(c.time)}</div>` : ''}</div>`;
        list.appendChild(row);
        if (!c.me && !c.quick) sfx('notify');
      }
      list.scrollTop = list.scrollHeight;
      if (c.quick) return this.wait(c.quick === true ? 500 : c.quick);
      return this.waitTap(autoMs);
    }
    return null;
  }

  choice({ q, opts }) {
    return new Promise((res) => {
      const box = document.createElement('div');
      box.className = 'choices';
      const prompt = q || (this.el.player.classList.contains('client-message') ? '返信を選ぶ' : '');
      box.innerHTML = (prompt ? `<p>${esc(prompt)}</p>` : '') +
        opts.map((o, i) => `<button type="button" class="choice" data-i="${i}">${esc(o.label)}</button>`).join('');
      box.addEventListener('click', (e) => {
        const b = e.target.closest('[data-i]');
        if (!b) return;
        const o = opts[+b.dataset.i];
        this.backlog.push({ name: '選択', text: o.label });
        box.remove();
        this.resolveUi = null;
        res(o.then || []);
      });
      this.resolveUi = () => { box.remove(); res([]); };
      this.el.overlay.appendChild(box);
    });
  }

  item(c) {
    const box = document.createElement('div');
    box.className = 'item';
    if (c.item === 'pager') box.innerHTML = `<div class="pager"><span>${esc(c.num)}</span></div>`;
    if (c.item === 'tape') box.innerHTML = `<div class="tape">${esc(c.label || '→ こっち')}</div>`;
    if (c.item === 'endcard') {
      // 章の終わり：文字枠とHUDを隠して、黒地にゆっくり浮かび上がらせる
      this.el.player.classList.add('ending');
      box.className = 'item end';
      box.innerHTML = `<div class="end-card">
        <p class="end-ch">${esc(c.chapter || '')}</p>
        <p class="end-title">${esc(c.title || '').replace(/\n/g, '<br>')}</p>
        <p class="end-kan">完</p>
        <div class="tape end-tape">${esc(c.next || '→ 次の異界へ')}</div>
        <p class="end-thanks">${esc(c.thanks || '')}</p>
      </div>`;
    }
    if (c.item === 'tag') box.innerHTML = `<div class="name-tag"><span>なまえ</span>${esc(c.label || '')}</div>`;
    if (c.cap) box.insertAdjacentHTML('beforeend', `<p class="item-cap">${esc(c.cap)}</p>`);
    this.el.overlay.appendChild(box);
    return this.waitTap(2500).then(() => box.remove());
  }

  // ---- ツギメイト画面 ----
  appScreen(kind, c) {
    const a = this.el.app;
    const bar = `<div class="app-bar"><img src="${MASCOT}" alt="">ツギメイト</div>`;
    const d = c.data || {};
    let autoSubmitTimer = null;
    if (kind === 'job') {
      a.innerHTML = `${bar}
        <div class="app-card">
          <span class="app-tag">急募</span><span class="app-tag teal">未経験OK</span><span class="app-tag teal">交通費全額</span>
          <div class="app-title">${esc(d.title)}</div>
          <div class="app-pay">${esc(d.pay)}<small> / 時給</small></div>
          <dl class="app-dl">
            <dt>勤務地</dt><dd>${esc(d.place)}</dd>
            <dt>集合</dt><dd>${esc(d.meet)}</dd>
            <dt>時間</dt><dd>${esc(d.time)}</dd>
            <dt>募集</dt><dd>${esc(d.slots)}</dd>
            <dt>依頼元</dt><dd>${esc(d.client)}</dd>
          </dl>
          <div class="app-note">${(d.notes || []).map(esc).join('<br>')}</div>
        </div>
        <button type="button" class="app-btn">${esc(c.button || '応募する')}</button>`;
    } else if (kind === 'matched') {
      a.innerHTML = `${bar}<div class="app-center"><img src="${TSUGI(3)}" alt=""><h2>マッチング成立！</h2>
        <p>${esc(d.msg || '')}</p></div><button type="button" class="app-btn">${esc(c.button || 'つぎへ')}</button>`;
    } else if (kind === 'done') {
      a.innerHTML = `${bar}<div class="app-center"><img src="${TSUGI(4)}" alt="" class="m"><h2>おつかれさまでした！</h2>
        <p>${esc(d.summary || '')}</p><p class="app-pay">${esc(d.reward || '')}</p>
        <p>依頼元を評価してください</p>
        <div class="stars">${[1, 2, 3, 4, 5].map((n) => `<button type="button" data-star="${n}">★</button>`).join('')}</div>
        <p class="app-small">${esc(d.small || '')}</p></div>
        <button type="button" class="app-btn" disabled>評価を送信</button>`;
      const btn = a.querySelector('.app-btn');
      a.querySelectorAll('[data-star]').forEach((s) => s.addEventListener('click', () => {
        const n = +s.dataset.star;
        a.querySelectorAll('[data-star]').forEach((x) => x.classList.toggle('on', +x.dataset.star <= n));
        btn.disabled = false;
        btn.textContent = '評価を送信中…';
        clearTimeout(autoSubmitTimer);
        // 星を選んだ操作そのものを送信として扱い、ここで再生が止まらないようにする
        autoSubmitTimer = setTimeout(() => btn.click(), 350);
        // 一瞬だけマスコットの笑顔が広すぎる
        const m = a.querySelector('img.m');
        m.src = MASCOT_UNCANNY;
        setTimeout(() => { m.src = TSUGI(4); }, 260);
      }));
    } else if (kind === 'order' || kind === 'report') {
      // 協会の業務端末（職員用）。アルバイトのツギメイトでは見えない項目が並ぶ
      const rows = (d.rows || []).map((r) => `<dt>${esc(r[0])}</dt><dd${r[2] ? ' class="hidden-from-staff"' : ''}>${esc(r[1])}${r[2] ? `<span class="biz-flag">${esc(r[2])}</span>` : ''}</dd>`).join('');
      a.className = 'app biz';
      a.innerHTML = `<div class="biz-bar"><span>JSRA FIELD</span><small>${esc(d.user || '')}</small></div>
        <div class="biz-card">
          <p class="biz-kind">${kind === 'order' ? '作業指示書' : '作業報告'}</p>
          <div class="biz-title">${esc(d.title)}</div>
          <dl class="biz-dl">${rows}</dl>
          ${d.note ? `<div class="biz-note">${esc(d.note).replace(/\n/g, '<br>')}</div>` : ''}
        </div>
        <button type="button" class="app-btn biz-btn">${esc(c.button || '確認')}</button>`;
    }
    if (kind !== 'order' && kind !== 'report') a.className = 'app';
    a.scrollTop = 0;
    return new Promise((res) => {
      let settled = false;
      const finish = (notify) => {
        if (settled) return;
        settled = true;
        clearTimeout(autoSubmitTimer);
        if (notify) sfx('notify');
        this.resolveUi = null;
        res();
      };
      this.resolveUi = () => finish(false);
      a.querySelector('.app-btn').addEventListener('click', () => finish(true), { once: true });
    });
  }

  // ---- 章間CM（作中広告。いずれ本物の動画広告に差し替える） ----
  cm() {
    const scenes = [
      { html: '<h3>スキマ時間、<br>ありますか？</h3>', dur: 2200 },
      { html: `<div><img src="${TSUGI(2)}" alt=""><div class="logo">ツギメイト</div></div>`, dur: 2400 },
      { html: `<div><img src="${TSUGI(3)}" alt=""><h3>その空き時間で、<br>だれかの継目を<br>ふさごう。</h3></div>`, dur: 2600 },
      { html: '<div><p>最短即日 ／ 面接なし ／ 高時給</p><h3>あなたの空白、<br>つなぎます。</h3></div>', dur: 2400 },
      { html: `<div><img class="last" src="${MASCOT}" alt=""><div class="logo">ツギメイト</div><p>アプリは無料。</p></div>`, dur: 2600 },
    ];
    return new Promise((res) => {
      const box = document.createElement('div');
      box.className = 'cm';
      box.innerHTML = '<span class="cm-label">作中CM</span>' +
        scenes.map((s) => `<div class="cm-scene">${s.html}</div>`).join('') +
        '<p class="cm-note">※本CMは作中の架空広告です</p><button type="button" class="cm-skip" disabled>5秒後にスキップ</button>';
      this.el.overlay.appendChild(box);
      const els = box.querySelectorAll('.cm-scene');
      const skip = box.querySelector('.cm-skip');
      let t = 0;
      const timers = [];
      els.forEach((el, i) => {
        timers.push(setTimeout(() => {
          els.forEach((x) => { x.style.transition = 'opacity .4s'; x.style.opacity = 0; });
          el.style.opacity = 1;
          if (i === 1) sfx('chime');
        }, t));
        t += scenes[i].dur;
      });
      // 最後のカットで一度だけ笑顔が広すぎる
      timers.push(setTimeout(() => {
        const m = box.querySelector('img.last');
        if (m) { m.src = MASCOT_UNCANNY; setTimeout(() => { m.src = MASCOT; }, 300); }
      }, t - 900));
      let left = 5;
      const iv = setInterval(() => {
        left -= 1;
        if (left > 0) skip.textContent = `${left}秒後にスキップ`;
        else { skip.textContent = 'スキップ ▶'; skip.disabled = false; clearInterval(iv); }
      }, 1000);
      const finish = () => { timers.forEach(clearTimeout); clearInterval(iv); box.remove(); this.resolveUi = null; res(); };
      timers.push(setTimeout(finish, t + 200));
      skip.addEventListener('click', finish);
      this.resolveUi = finish;
    });
  }

  // ---- 動画（CM・挿入アニメ）。cm: { src, skip } / movie: { src, skip }。skip＝何秒後にスキップできるか（なし＝スキップ不可）
  // 再生できなかったとき、CM は仮CMに切り替え、挿入アニメはそのまま先へ進む
  movie({ src, skip }, isCm) {
    return new Promise((res) => {
      const box = document.createElement('div');
      box.className = 'cm movie';
      box.innerHTML = `<video playsinline preload="auto" src="${esc(src)}"></video>` +
        (isCm ? '<span class="cm-label">作中CM</span><p class="cm-note">※本CMは作中の架空広告です</p>' : '') +
        '<button type="button" class="cm-play" hidden>▶ タップで再生</button><button type="button" class="cm-skip" hidden></button>';
      this.el.overlay.appendChild(box);
      const v = box.querySelector('video');
      const playBtn = box.querySelector('.cm-play');
      const skipBtn = box.querySelector('.cm-skip');
      v.muted = !!store.get('muted');
      let done = false;
      let iv = null;
      const finish = (failed) => {
        if (done) return;
        done = true;
        clearInterval(iv);
        v.pause();
        box.remove();
        this.resolveUi = null;
        if (failed && isCm && !this.aborted) this.cm().then(res);
        else res();
      };
      const countdown = () => {
        if (skip == null || iv) return;
        let left = Math.ceil(skip);
        skipBtn.hidden = false;
        const tick = () => {
          skipBtn.disabled = left > 0;
          skipBtn.textContent = left > 0 ? `${left}秒後にスキップ` : 'スキップ ▶';
          if (left <= 0) clearInterval(iv);
          left -= 1;
        };
        tick();
        iv = setInterval(tick, 1000);
      };
      // スマホでは音つきの自動再生が止められることがあるので、そのときはボタンを出す
      const start = () => v.play().then(countdown).catch(() => { playBtn.hidden = false; });
      playBtn.addEventListener('click', () => { playBtn.hidden = true; start(); });
      skipBtn.addEventListener('click', () => finish(false));
      v.addEventListener('ended', () => finish(false));
      v.addEventListener('error', () => finish(true));
      this.resolveUi = () => finish(false);
      start();
    });
  }

  warn({ title, text, go = '見る', back = 'やめる' }) {
    return new Promise((res) => {
      const box = document.createElement('div');
      box.className = 'warn';
      box.innerHTML = `<div class="warn-box"><h3>${esc(title)}</h3><p>${esc(text).replace(/\n/g, '<br>')}</p>
        <div class="warn-btns"><button type="button" data-w="0">${esc(back)}</button><button type="button" class="go" data-w="1">${esc(go)}</button></div></div>`;
      box.addEventListener('click', (e) => {
        const b = e.target.closest('[data-w]');
        if (!b) return;
        box.remove();
        this.resolveUi = null;
        res(b.dataset.w === '1');
      });
      this.resolveUi = () => { box.remove(); res(false); };
      this.el.overlay.appendChild(box);
    });
  }
}
