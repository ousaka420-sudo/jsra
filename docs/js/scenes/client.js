// 自動生成ファイルです。直接編集しないでください。
// 元：シナリオ.xlsx（「シナリオを反映.command」で作り直されます）

// ---- 「依頼人1」シート ----
export const afterEp1 = [
  {"mode": "chat", "skin": "client", "title": "依頼人", "sub": "暗号化された接続", "icon": "client", "device": "依頼人とのチャット", "record": "", "filter": "on"},
  {"say": "依頼人", "av": "client", "text": "見ましたか"},
  {"say": "依頼人", "av": "client", "text": "黄緑のテープ"},
  {
    "choice": {
      "opts": [
        {
          "label": "コウキって子に会った",
          "then": [
            {
              "me": true,
              "text": "コウキって子に会った。ソラって人を助けてた"
            }
          ]
        },
        {
          "label": "あの子が斑木光輝？",
          "then": [
            {
              "me": true,
              "text": "あの子が、斑木光輝？"
            }
          ]
        }
      ]
    }
  },
  {"say": "依頼人", "av": "client", "text": "……はい"},
  {"say": "依頼人", "av": "client", "text": "昔から、そういうことをする人でした"},
  {"say": "依頼人", "av": "client", "text": "迷った子がいると、勝手に道に印をつけて"},
  {"say": "依頼人", "av": "client", "text": "自分は、いちばん最後に帰ってくる"},
  {"wait": 900},
  {"say": "依頼人", "av": "client", "text": "次の端末は、まだつながりません。もう少し待ってください"},
  {"end": true, "read": "client-1"},
];

// ---- 「依頼人2」シート ----
export const afterLog = [
  {"mode": "chat", "skin": "client", "title": "依頼人", "sub": "暗号化された接続", "icon": "client", "device": "依頼人とのチャット", "record": "", "filter": "on"},
  {"say": "依頼人", "av": "client", "text": "第一部隊の記録を、開きましたね"},
  {"say": "依頼人", "av": "client", "text": "フィルタを外したものは、見たことになります\nしばらく、知らない番号で呼ばれても返事をしないでください"},
  {"me": true, "text": "学ランの子を、怖がって逃げてた"},
  {"say": "依頼人", "av": "client", "text": "……はい"},
  {"say": "依頼人", "av": "client", "text": "あの人は、いつも少しだけ、間に合わない人を背負って歩いてるんです"},
  {"end": true, "read": "client-2"},
];

// ---- 「依頼人3」シート ----
export const afterEp2 = [
  {"mode": "chat", "skin": "client", "title": "依頼人", "sub": "暗号化された接続", "icon": "client", "device": "依頼人とのチャット", "record": "", "filter": "on"},
  {"say": "依頼人", "av": "client", "text": "駐車場の記録、見ましたか"},
  {"say": "依頼人", "av": "client", "text": "協会は、あの人を「誘導灯」と呼んでいるんですね"},
  {"say": "依頼人", "av": "client", "text": "……ぴったりだと思います"},
  {"wait": 1200},
  {"text": "依頼人がメッセージの送信を取り消しました"},
  {
    "choice": {
      "opts": [
        {
          "label": "今、何て送ろうとした？",
          "then": [
            {
              "me": true,
              "text": "今、何て送ろうとした？"
            },
            {
              "say": "依頼人",
              "av": "client",
              "text": "打ち間違いです"
            }
          ]
        },
        {
          "label": "「三日くらい」って言ってた",
          "then": [
            {
              "me": true,
              "text": "ここに来て「三日くらい」って言ってた"
            },
            {
              "say": "依頼人",
              "av": "client",
              "text": "……そうですか"
            },
            {
              "say": "依頼人",
              "av": "client",
              "text": "あの人の中では、まだ三日なんですね"
            }
          ]
        }
      ]
    }
  },
  {"say": "依頼人", "av": "client", "text": "次の端末も、もうすぐつながります"},
  {"end": true, "read": "client-3"},
];

// ---- 「依頼人4」シート ----
export const afterLog2 = [
  {"mode": "chat", "skin": "client", "title": "依頼人", "sub": "暗号化された接続", "icon": "client", "device": "依頼人とのチャット", "record": "", "filter": "on"},
  {"say": "依頼人", "av": "client", "text": "ハヤトという人の記録を、聞きましたね"},
  {"say": "依頼人", "av": "client", "text": "接触禁止の規定が変わったのは、その次の日です"},
  {"say": "依頼人", "av": "client", "text": "誰かがいなくならないと、ルールは変わらない"},
  {"say": "依頼人", "av": "client", "text": "協会も。……村も"},
  {"me": true, "text": "村？"},
  {"say": "依頼人", "av": "client", "text": "今のは、忘れてください"},
  {"end": true, "read": "client-4"},
];

// ---- 「依頼人5」シート ----
export const afterEp3 = [
  {"mode": "chat", "skin": "client", "title": "依頼人", "sub": "暗号化された接続", "icon": "client", "device": "依頼人とのチャット", "record": "", "filter": "on"},
  {"say": "依頼人", "av": "client", "text": "映画館の記録、見ましたか"},
  {"say": "依頼人", "av": "client", "text": "あの人、カメラに気づいてましたね"},
  {"say": "依頼人", "av": "client", "text": "「見てるなら、手伝って」"},
  {"say": "依頼人", "av": "client", "text": "……あの人に頼まれると、断れないんです。昔から"},
  {
    "choice": {
      "opts": [
        {
          "label": "あなたは誰なの？",
          "then": [
            {
              "me": true,
              "text": "あなたは誰なの？"
            },
            {
              "say": "依頼人",
              "av": "client",
              "text": "あの人を見つけたら、教えます"
            }
          ]
        },
        {
          "label": "本部の部屋が映ってた",
          "then": [
            {
              "me": true,
              "text": "スクリーンの中に、本部の部屋が映ってた"
            },
            {
              "say": "依頼人",
              "av": "client",
              "text": "ええ。継目は、モールの中だけじゃない"
            },
            {
              "say": "依頼人",
              "av": "client",
              "text": "次は、協会の中です"
            }
          ]
        }
      ]
    }
  },
  {"say": "依頼人", "av": "client", "text": "次の端末に入れるまで、もう少し待ってください"},
  {"end": true, "read": "client-5"},
];

// ---- 「依頼人6」シート ----
export const afterLog3 = [
  {"mode": "chat", "skin": "client", "title": "依頼人", "sub": "暗号化された接続", "icon": "client", "device": "依頼人とのチャット", "record": "", "filter": "on"},
  {"say": "依頼人", "av": "client", "text": "最後まで見た人たちの記録ですね"},
  {"say": "依頼人", "av": "client", "text": "座っている自分と、出ていく自分。どちらが本物か、あの場所では決められない"},
  {"say": "依頼人", "av": "client", "text": "……あの人は六年間、一度も「出ていくほう」を選ばなかった"},
  {"me": true, "text": "六年？"},
  {"say": "依頼人", "av": "client", "text": "ぼくが数えた分だけ、です"},
  {"end": true, "read": "client-6"},
];

// ---- 「依頼人7」シート ----
export const afterEp4 = [
  {"mode": "chat", "skin": "client", "title": "依頼人", "sub": "暗号化された接続", "icon": "client", "device": "依頼人とのチャット", "record": "", "filter": "on"},
  {"say": "依頼人", "av": "client", "text": "ボールプールの記録、見ましたか"},
  {"say": "依頼人", "av": "client", "text": "あの名札、子どもの字でしたね"},
  {"say": "依頼人", "av": "client", "text": "……ぼくも昔は、あんな字でした"},
  {
    "choice": {
      "opts": [
        {
          "label": "光輝、つらそうだった",
          "then": [
            {
              "me": true,
              "text": "光輝、つらそうだった"
            },
            {
              "say": "依頼人",
              "av": "client",
              "text": "知ってます"
            },
            {
              "say": "依頼人",
              "av": "client",
              "text": "あの人は、自分のために泣いたことがないので"
            }
          ]
        },
        {
          "label": "「弟の声」って言ってた",
          "then": [
            {
              "me": true,
              "text": "「弟の声だ」って言ってた"
            },
            {
              "say": "依頼人",
              "av": "client",
              "text": "……あの場所は、あの人がいちばん欲しい声を出すんです"
            }
          ]
        }
      ]
    }
  },
  {"say": "依頼人", "av": "client", "text": "次は迷子センターです。協会の放送卓に、入れるようにしておきます"},
  {"end": true, "read": "client-7"},
];

// ---- 「依頼人8」シート ----
export const afterLog4 = [
  {"mode": "chat", "skin": "client", "title": "依頼人", "sub": "暗号化された接続", "icon": "client", "device": "依頼人とのチャット", "record": "", "filter": "on"},
  {"say": "依頼人", "av": "client", "text": "「指名」の記録を、見ましたね"},
  {"say": "依頼人", "av": "client", "text": "あれは、あの場所が人を選ぶ仕組みです。協会もツギメイトも、知っていて止めていない"},
  {"say": "依頼人", "av": "client", "text": "……ぼくのところにも、昔、指名が来ました"},
  {"me": true, "text": "昔？"},
  {"say": "依頼人", "av": "client", "text": "アプリができる、ずっと前の話です"},
  {"end": true, "read": "client-8"},
];

// ---- 「依頼人9」シート ----
export const afterEp5 = [
  {"mode": "chat", "skin": "client", "title": "依頼人", "sub": "暗号化された接続", "icon": "client", "device": "依頼人とのチャット", "record": "", "filter": "on"},
  {"say": "依頼人", "av": "client", "text": "……放送、聞こえました"},
  {"me": true, "text": "聞こえたの？"},
  {"say": "依頼人", "av": "client", "text": "はい。ぼくのいる場所まで"},
  {"say": "依頼人", "av": "client", "text": "迷子だったのは、あの人のほうだったんですね"},
  {"say": "依頼人", "av": "client", "text": "迎えに行かなきゃいけないのは、ずっと、こっちだった"},
  {
    "choice": {
      "opts": [
        {
          "label": "「まだらぎ ゆうき」って、あなた？",
          "then": [
            {
              "me": true,
              "text": "迷子カードの保護者の「まだらぎ ゆうき」って、あなた？"
            },
            {
              "say": "依頼人",
              "av": "client",
              "text": "……最後の端末を開けたら、答えます"
            }
          ]
        },
        {
          "label": "光輝は、弟が来るのを待ってる",
          "then": [
            {
              "me": true,
              "text": "光輝は、弟が来るのを六年待ってる"
            },
            {
              "say": "依頼人",
              "av": "client",
              "text": "知ってます"
            },
            {
              "say": "依頼人",
              "av": "client",
              "text": "だから、行きます"
            }
          ]
        }
      ]
    }
  },
  {"say": "依頼人", "av": "client", "text": "最後の端末は、エリアマネージャーのPCです。そこに、全部の答えがあります"},
  {"end": true, "read": "client-9"},
];

// ---- 「依頼人10」シート ----
export const afterLog5 = [
  {"mode": "chat", "skin": "client", "title": "依頼人", "sub": "暗号化された接続", "icon": "client", "device": "依頼人とのチャット", "record": "", "filter": "on"},
  {"say": "依頼人", "av": "client", "text": "迷子カードの最後の一枚、見ましたか"},
  {"say": "依頼人", "av": "client", "text": "保護者の欄が空いている迷子は、あそこの一部になる"},
  {"say": "依頼人", "av": "client", "text": "……だから、あなたの欄は、ぼくが書いておきます"},
  {"me": true, "text": "何て書くの？"},
  {"say": "依頼人", "av": "client", "text": "「依頼人」。迎えに行きますよ、ちゃんと"},
  {"end": true, "read": "client-10"},
];

// ---- 「依頼人11」シート ----
export const afterEp6 = [
  {"mode": "chat", "skin": "client", "title": "依頼人", "sub": "暗号化された接続", "icon": "client", "device": "依頼人とのチャット", "record": "", "filter": "on"},
  {"say": "依頼人", "av": "client", "text": "……あの人に、名前を言われてしまいましたね"},
  {"say": "依頼人", "av": "client", "text": "はい。ぼくが、斑木優希です"},
  {"say": "依頼人", "av": "client", "text": "六年前、あの村で、真寄様に送られるはずだった子どもです"},
  {"say": "依頼人", "av": "client", "text": "兄は、ぼくの代わりに、あそこへ行きました"},
  {
    "choice": {
      "opts": [
        {
          "label": "どうして自分で探さなかったの？",
          "then": [
            {
              "me": true,
              "text": "どうして、最初から自分で探さなかったの？"
            },
            {
              "say": "依頼人",
              "av": "client",
              "text": "ぼくが近づくと、あの場所はぼくを欲しがるので"
            },
            {
              "say": "依頼人",
              "av": "client",
              "text": "兄を見つけてからでないと、行けなかった"
            }
          ]
        },
        {
          "label": "光輝を連れて帰れる？",
          "then": [
            {
              "me": true,
              "text": "光輝を、連れて帰れる？"
            },
            {
              "say": "依頼人",
              "av": "client",
              "text": "連れて帰ります。……そのあとのことは、着いてから考えます"
            }
          ]
        }
      ]
    }
  },
  {"say": "依頼人", "av": "client", "text": "綴町店の搬入口から入ります。最後は、ぼくのスマホをつないでおきます"},
  {"end": true, "read": "client-11"},
];

// ---- 「依頼人12」シート ----
export const afterLog6 = [
  {"mode": "chat", "skin": "client", "title": "依頼人", "sub": "暗号化された接続", "icon": "client", "device": "依頼人とのチャット", "record": "", "filter": "on"},
  {"say": "依頼人", "av": "client", "text": "村の記録を、読みましたね"},
  {"say": "依頼人", "av": "client", "text": "最後のページの字。あれは、子どもの字です"},
  {"say": "依頼人", "av": "client", "text": "真寄様も、もとは、ぼくみたいに送られた子どもだったんだと思います"},
  {"say": "依頼人", "av": "client", "text": "誰にも迎えに来てもらえなかった子が、迎えに来てくれた人を、手放せなくなった"},
  {"end": true, "read": "client-12"},
];
