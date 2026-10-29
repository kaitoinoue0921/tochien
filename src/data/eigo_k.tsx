import React from 'react';
import { MajorQuestionData } from './types';
import { BarChartFig, SeasonsFig, ElderlyFig } from './eigo_figs';

const Line = ({ who, children }: { who: string; children: React.ReactNode }) => (
  <p><span className="font-bold">{who}:</span> {children}</p>
);
const Blank = ({ n }: { n: string }) => <span className="inline-block min-w-16 border-b border-slate-500 text-center text-slate-500">{n}</span>;

// 本人が持っていた学校の実力テスト（英語）の大問5。対話文とグラフ・図を読む形式。
const dialogue = (
  <div className="space-y-2 text-sm">
    <p>次の英文は、高校生の美緒（Mio）と、美緒の隣のクラスの生徒でフランスからの留学生のジャン（Jean）の対話の一部である。図1〜3は美緒が作成しているスライドである。</p>
    <Line who="Mio">Hi, Jean. What do you think about convenience stores in Japan?</Line>
    <Line who="Jean">I love them. But <Blank n="（　1　）" /> ask?</Line>
    <Line who="Mio">Because I’m making these slides about convenience stores in Japan.</Line>
    <Line who="Jean">Sounds interesting. What is <u>(1) this graph</u> about?</Line>
    <Line who="Mio">It’s about the popular convenience store products among my classmates. I asked them, “What is your favorite convenience store product?” <i>Onigiri</i> was the most popular. <i>Karaage</i> was not as popular as <i>onigiri</i>, but it was as popular as ice cream. Sweets were not as popular as those three, but more popular than instant noodles.</Line>
    <Line who="Jean">Your classmates like convenience store food. I love convenience store sweets. I can’t stop buying them.</Line>
    <Line who="Mio">In my class, five students love convenience store sweets. My friend Saori is one of them. Look at the second slide. She can find new sweets at convenience stores <Blank n="(2)" />, so she often goes there.</Line>
    <Line who="Jean">I see. Convenience stores are popular among young people, right?</Line>
    <Line who="Mio">Yes. They are also popular among elderly people. Look at the third slide. A convenience store staff member delivers <i>bento</i> to an elderly man’s house. The man says, “I can’t cook every day. So I’m happy <Blank n="(3)" /> this <i>bento</i>.”</Line>
    <Line who="Jean">That’s great.</Line>
    <Line who="Mio">Let’s look at the elderly woman’s case. There is a supermarket and a convenience store near her house. The convenience store <Blank n="(4)" /> than the supermarket, so she likes to go to the convenience store. If she goes to the supermarket, she has to walk around a lot to buy things.</Line>
    <Line who="Jean">I see. Now I understand that convenience stores are also popular among elderly people.</Line>
    <Line who="Mio">Good. I’m going to make some slides about the problems with convenience stores.</Line>
    <Line who="Jean">What are they?</Line>
    <Line who="Mio">First, some convenience stores can’t find enough staff members, especially at night. Second, a lot of food is thrown away every day.</Line>
    <Line who="Jean">I see. In France, almost all the shops are closed at night.</Line>
    <Line who="Mio">I didn’t know <u>(5) that</u>.</Line>
    <Line who="Jean">I don’t think all convenience stores in Japan should be open 24 hours.</Line>
    <Line who="Mio">Right. What do people in your country do about food problems?</Line>
    <Line who="Jean">They do many things. For example, supermarkets in my country must pay money when they throw away food.</Line>
    <Line who="Mio">People in your country are trying hard (　　　　). We should think a lot about the food problem.</Line>
    <p className="text-xs text-slate-500">［注］graph＝グラフ　product＝商品　among〜＝〜の間で　instant noodles＝即席めん　stop〜＝〜をやめる　elderly＝年配の　staff member＝店員　deliver〜＝〜を配達する　case＝場合　supermarket＝スーパーマーケット　enough＝十分な　especially＝特に　throw away〜＝〜を捨てる　open＝開いている　pay〜＝〜を支払う</p>
    <BarChartFig title="コンビニエンスストアでいちばん好きな商品調べ（図1）" bars={[{ label: '①', value: 5 }, { label: 'からあげ', value: 7 }, { label: '②', value: 12 }, { label: '③', value: 3 }, { label: '④', value: 7 }]} />
    <SeasonsFig />
    <ElderlyFig />
  </div>
);

const q = (text: string) => <div>{dialogue}<p className="font-bold mt-3">{text}</p></div>;
const ex = (x: React.ReactNode) => x;

export const eigoK: Record<string, MajorQuestionData> = {
  k1: {
    id: "k1",
    title: "英語 実力テスト 大問5：コンビニの対話文とグラフ",
    subs: [
      {
        id: "1", title: "問1 対話が成り立つ空所（3語）", knowledge: ["疑問詞", "対話の流れ"],
        originalText: q("問1　二人の対話が成り立つよう、本文中の空所（1）に入る適切な英語を3語で書きなさい。（I love them. But ＿＿＿ ask?）"),
        steps: [
          { id: 1, title: '① 次の発言を見る', content: <p>空所のあとの Mio の返事は「Because I’m making these slides about convenience stores in Japan.」です。</p>,
            quiz: { type: 'choice', question: 'Because ～ と答えているので、Jean は何を聞いた？', options: ['理由（なぜそんなことを聞くのか）', '場所（どこで作っているのか）', '時間（いつ作るのか）', '方法（どうやって作るのか）', '人（だれと作るのか）'], correctAnswer: '理由（なぜそんなことを聞くのか）', explanation: ex(<p>Because は「なぜなら」。理由をたずねられたときの答え方です。</p>) } },
          { id: 2, title: '② 英語にする', content: <p>「なぜ（あなたは）そんなことを聞くの？」を、3語で英語にします。疑問詞のあとは「do ＋ 主語 ＋ 動詞」の語順です。</p>,
            quiz: { type: 'choice', question: '空所（1）に入るのは？ （But ＿＿＿ ask?）', options: ['why do you', 'why are you', 'why you do', 'what do you', 'why did me'], correctAnswer: 'why do you', explanation: ex(<p>Why do you ask? 「なぜそんなことを聞くの？」。疑問文の語順は〈疑問詞 ＋ do ＋ 主語 ＋ 動詞〉。why you do は語順が違い、what では理由の答え（Because ～）につながりません。</p>) } },
        ],
      },
      {
        id: "2", title: "問2 図1の②・④に入るもの", knowledge: ["as ～ as", "比較", "グラフの読み取り"],
        originalText: q("問2　下線部(1)について、図1の②、④に入るものとして、それぞれ最も適切なものはどれか。（ア 即席めん　イ おにぎり　ウ お菓子　エ アイスクリーム）"),
        steps: [
          { id: 1, title: '① いちばん人気は？', content: <p>「Onigiri was the most popular.」 図1でいちばん高い棒は12人の棒です。</p>,
            quiz: { type: 'choice', question: 'おにぎりが入るのは図1のどれ？', options: ['②（12人）', '①（5人）', '④（7人）', '③（3人）', 'からあげ（7人）'], correctAnswer: '②（12人）', explanation: ex(<p>most popular ＝ いちばん人気。いちばん高い棒（12人）が②です。</p>) } },
          { id: 2, title: '② as popular as は「同じ」', content: <p>「Karaage was not as popular as onigiri, but it was as popular as ice cream.」 からあげは7人です。</p>,
            quiz: { type: 'choice', question: '「as popular as ice cream」から、アイスクリームの人数は？', options: ['からあげと同じ7人', 'からあげより多い12人', 'からあげより少ない3人', 'からあげより少ない5人', 'からあげの半分'], correctAnswer: 'からあげと同じ7人', explanation: ex(<p>as ～ as ＝ 同じくらい。アイスクリームはからあげと同じ7人で、7人の棒は④だけです。</p>) } },
          { id: 3, title: '③ 答え', content: <p>残りの5人と3人は、お菓子と即席めんです。「Sweets were not as popular as those three, but more popular than instant noodles.」（クラスで5人がお菓子好き）</p>,
            quiz: { type: 'choice', question: '②と④に入るものは？', options: ['②イ おにぎり　④エ アイスクリーム', '②イ おにぎり　④ウ お菓子', '②エ アイスクリーム　④イ おにぎり', '②ウ お菓子　④ア 即席めん', '②イ おにぎり　④ア 即席めん'], correctAnswer: '②イ おにぎり　④エ アイスクリーム', explanation: ex(<p>②＝おにぎり（12人）、④＝アイスクリーム（7人）。残りの①5人＝お菓子（「5 students love sweets」）、③3人＝即席めんです。</p>) } },
        ],
      },
      {
        id: "3", title: "問3(2) 図2から空所に入る英語", knowledge: ["every ～", "図を英語にする"],
        originalText: q("問3　図2を参考に、二人の対話が成り立つよう、下線部(2)に2語以上の適切な英語を書きなさい。（She can find new sweets at convenience stores ＿＿＿, so she often goes there.）"),
        steps: [
          { id: 1, title: '① 図2から分かること', content: <p>図2には春・夏・秋・冬があり、それぞれに「新発売」の表示があります。</p>,
            quiz: { type: 'choice', question: '図2が表しているのは？', options: ['どの季節にも新しいお菓子が出ること', '春だけ新しいお菓子が出ること', '冬にお菓子が売れること', 'さおりがお菓子を作ること', '夏に店が休みになること'], correctAnswer: 'どの季節にも新しいお菓子が出ること', explanation: ex(<p>4つの季節すべてに「新発売」があります。</p>) } },
          { id: 2, title: '② 英語にする', content: <p>「どの季節にも」＝ every ＋ 単数名詞。名詞は複数形にしません。</p>,
            quiz: { type: 'choice', question: '空所（2）に入る適切な英語は？', options: ['in every season', 'in every seasons', 'at every season', 'in all season', 'every of seasons'], correctAnswer: 'in every season', explanation: ex(<p>「in every season（どの季節にも）」。every のあとは単数形（season）。「季節の中で」なので前置詞は in。※ every season だけでも正解になります。</p>) } },
        ],
      },
      {
        id: "4", title: "問3(3) 図3から空所に入る英語", knowledge: ["to不定詞（感情の原因）", "図を英語にする"],
        originalText: q("問3　図3を参考に、下線部(3)に2語以上の適切な英語を書きなさい。（So I’m happy ＿＿＿ this bento.）"),
        steps: [
          { id: 1, title: '① 気持ちの理由', content: <p>図3の吹き出し：「毎日料理することができないので、このお弁当を食べられてうれしいです。」</p>,
            quiz: { type: 'choice', question: '「うれしい」のは何をできるから？', options: ['お弁当を食べられるから', 'お弁当を作れるから', 'お弁当を売れるから', '料理を習えるから', 'お弁当を配れるから'], correctAnswer: 'お弁当を食べられるから', explanation: ex(<p>「食べられてうれしい」＝ 食べる動作が、うれしい気持ちの理由です。</p>) } },
          { id: 2, title: '② 英語にする', content: <p>「～して（うれしい）」のように感情の理由を言うときは、〈be happy ＋ to ＋ 動詞の原形〉を使います（不定詞の副詞的用法）。</p>,
            quiz: { type: 'choice', question: '空所（3）に入る英語は？ （I’m happy ＿＿＿ this bento.）', options: ['to eat', 'eating', 'eat', 'to eating', 'for eat'], correctAnswer: 'to eat', explanation: ex(<p>I’m happy to eat this bento.「このお弁当を食べられてうれしい」。to のあとは動詞の原形（eat）。eat だけ・for eat は文法的に不可、to eating も不可です。</p>) } },
        ],
      },
      {
        id: "5", title: "問3(4) 比較の空所", knowledge: ["比較級", "対話の流れ"],
        originalText: q("問3　図3を参考に、下線部(4)に2語以上の適切な英語を書きなさい。（The convenience store ＿＿＿ than the supermarket, so she likes to go to the convenience store.）"),
        steps: [
          { id: 1, title: '① 続きの文のヒント', content: <p>「If she goes to the supermarket, she has to walk around a lot to buy things.」</p>,
            quiz: { type: 'choice', question: 'スーパーについて分かることは？', options: ['広くて、買い物で歩き回らなければならない', '近くて、すぐ買える', '夜は閉まっている', '安くて、品物が多い', '店員が少ない'], correctAnswer: '広くて、買い物で歩き回らなければならない', explanation: ex(<p>walk around a lot ＝ たくさん歩き回る。スーパーは広いので歩く距離が長くなります。</p>) } },
          { id: 2, title: '② コンビニとの比較', content: <p>スーパーと比べたコンビニの良いところを、〈形容詞の比較級 ＋ than〉で表します。「スーパーより（　　）ので、コンビニへ行くのが好き」。</p>,
            quiz: { type: 'choice', question: '空所（4）に入る英語は？ （The convenience store ＿＿＿ than the supermarket）', options: ['is smaller', 'is bigger', 'is more small', 'is small', 'are smaller'], correctAnswer: 'is smaller', explanation: ex(<p>The convenience store is smaller than the supermarket. 小さいので歩き回らずに買えます。短い語の比較級は〈-er〉で、more small とは言いません。主語が単数なので are でなく is。</p>) } },
        ],
      },
      {
        id: "6", title: "問4 下線部(5)が指す内容", knowledge: ["指示語 that"],
        originalText: q("問4　下線部(5)が指す内容は何か。20字程度の日本語で具体的に書きなさい。（I didn’t know that.）"),
        steps: [
          { id: 1, title: '① that は直前の内容', content: <p>that は、すぐ前の相手の発言の内容を指すことが多いです。Mio の発言の直前の Jean の発言は「I see. In France, almost all the shops are closed at night.」</p>,
            quiz: { type: 'choice', question: 'Mio が知らなかったことは？', options: ['フランスではほとんどの店が夜に閉まっていること', '日本のコンビニが夜も開いていること', 'ジャンがコンビニを好きなこと', 'スーパーが食品を捨てていること', 'フランスにはコンビニがないこと'], correctAnswer: 'フランスではほとんどの店が夜に閉まっていること', explanation: ex(<p>解答例：「フランスではだいたい夜には店が閉まっている。」（20字程度）。直前の In France, almost all the shops are closed at night. をそのまま日本語にします。</p>) } },
        ],
      },
      {
        id: "7", title: "問5 最後の空所に入る英語", knowledge: ["話の流れ", "to不定詞"],
        originalText: q("問5　本文中の（　　　）に入る英語として、最も適切なものはどれか。（People in your country are trying hard (　　　). We should think a lot about the food problem.）"),
        steps: [
          { id: 1, title: '① 直前の話題', content: <p>Jean は「supermarkets in my country must pay money when they throw away food」と言いました。つまり、食べ物を捨てるとお金を払うルールです。</p>,
            quiz: { type: 'choice', question: 'このルールの目的は？', options: ['食べ物を捨てるのをやめさせる', '食べ物をたくさん売る', '夜に店を開ける', '高齢者を助ける', '新しいお菓子を作る'], correctAnswer: '食べ物を捨てるのをやめさせる', explanation: ex(<p>捨てるとお金がかかる → 捨てないようにする、という取り組みです。</p>) } },
          { id: 2, title: '② 答え', content: <p>後ろの文は「We should think a lot about the food problem.（食の問題についてよく考えるべきだ）」。</p>,
            quiz: { type: 'choice', question: '空所に入る英語は？', options: ['to stop throwing away food', 'to sell a lot of food', 'to help elderly people more', 'to create more delicious sweets', 'to open stores for 24 hours'], correctAnswer: 'to stop throwing away food', explanation: ex(<p>try hard to ～ ＝ 一生けんめい～しようとする。stop ～ing ＝ ～をやめる。「食べ物を捨てるのをやめようとがんばっている」で、直前の話題（食品ロス）とつながります。</p>) } },
        ],
      },
    ],
  },
};
