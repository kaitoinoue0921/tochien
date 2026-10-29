import React from 'react';
import { Step } from '@/components/StepLayout';
import { MajorQuestionData } from './types';

// 栃木県公立入試 英語 大問5（対話文＋図表）形式の類題。
// 図の数値と対話中の比較表現（as ~ as / more ~ than / twice as ~ as など）は一致するように作ってある。

/* ───────── 共通パーツ ───────── */
const B = ({ n }: { n: number }) => (
  <span className="inline-block mx-1 px-2 border border-slate-500 rounded text-sm font-bold">{n}</span>
);
const U = ({ children }: { children: React.ReactNode }) => (
  <span className="underline underline-offset-4 decoration-2">{children}</span>
);

type Line = [string, React.ReactNode];
const Dialogue = ({ lines, notes }: { lines: Line[]; notes: string }) => (
  <div className="space-y-1 text-[15px] leading-relaxed">
    {lines.map(([who, text], i) => (
      <p key={i} className="pl-24 -indent-24"><span className="inline-block w-24 indent-0 font-bold">{who}:</span>{text}</p>
    ))}
    <p className="text-sm text-slate-500 pt-1">〔注〕{notes}</p>
  </div>
);

const W = 340;
const Frame = ({ children, h }: { children: React.ReactNode; h: number }) => (
  <div className="my-4 flex flex-col items-center">
    <div className="bg-white rounded-lg p-2">
      <svg viewBox={`0 0 ${W} ${h}`} style={{ width: 330 }} className="h-auto">{children}</svg>
    </div>
  </div>
);

// 棒グラフ
const BarFig = ({ title, bars, max, unit, step }: { title: string; bars: { label: string; value: number }[]; max: number; unit: string; step: number }) => {
  const H = 240, L = 40, R = 10, T = 34, Bt = 40;
  const bw = (W - L - R) / bars.length;
  const Y = (v: number) => H - Bt - (v / max) * (H - T - Bt);
  const ticks: number[] = [];
  for (let v = 0; v <= max; v += step) ticks.push(v);
  return (
    <Frame h={H}>
      <text x={W / 2} y={16} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0f172a">{title}</text>
      <text x={L - 4} y={T - 8} textAnchor="end" fontSize="9" fill="#475569">({unit})</text>
      {ticks.map(v => (
        <g key={v}>
          <line x1={L} y1={Y(v)} x2={W - R} y2={Y(v)} stroke="#e2e8f0" />
          <text x={L - 4} y={Y(v) + 3} textAnchor="end" fontSize="9" fill="#475569">{v.toLocaleString()}</text>
        </g>
      ))}
      {bars.map((b, i) => {
        const x = L + i * bw + bw * 0.2, w = bw * 0.6;
        return (
          <g key={i}>
            <rect x={x} y={Y(b.value)} width={w} height={Y(0) - Y(b.value)} fill="#60a5fa" stroke="#1d4ed8" />
            <text x={x + w / 2} y={Y(b.value) - 4} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0f172a">{b.value.toLocaleString()}</text>
            <text x={x + w / 2} y={H - Bt + 14} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0f172a">{b.label}</text>
          </g>
        );
      })}
      <line x1={L} y1={Y(0)} x2={W - R} y2={Y(0)} stroke="#334155" />
    </Frame>
  );
};

// 円グラフ（value は％、合計100）
const PieFig = ({ title, slices }: { title: string; slices: { label: string; value: number }[] }) => {
  const H = 250, cx = W / 2, cy = 135, r = 88;
  const colors = ['#93c5fd', '#fcd34d', '#86efac', '#fca5a5', '#e2e8f0'];
  let acc = 0;
  const pt = (a: number, rr: number) => [cx + rr * Math.sin(a), cy - rr * Math.cos(a)];
  return (
    <Frame h={H}>
      <text x={W / 2} y={18} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0f172a">{title}</text>
      {slices.map((s, i) => {
        const a0 = (acc / 100) * 2 * Math.PI; acc += s.value;
        const a1 = (acc / 100) * 2 * Math.PI, am = (a0 + a1) / 2;
        const [x0, y0] = pt(a0, r), [x1, y1] = pt(a1, r);
        const small = s.value < 10;
        const [tx, ty] = pt(am, small ? r + 22 : r * 0.62);
        return (
          <g key={i}>
            <path d={`M${cx},${cy} L${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1.toFixed(1)},${y1.toFixed(1)} Z`} fill={colors[i % colors.length]} stroke="#fff" strokeWidth="2" />
            <text x={tx} y={ty - 2} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0f172a">{s.label}</text>
            <text x={tx} y={ty + 11} textAnchor="middle" fontSize="10" fill="#0f172a">{s.value}%</text>
          </g>
        );
      })}
    </Frame>
  );
};

// 表
const TableFig = ({ title, head, rows }: { title: string; head: string[]; rows: string[][] }) => (
  <div className="my-4 flex flex-col items-center">
    <div className="bg-white rounded-lg p-3 text-slate-900">
      <p className="text-center text-[13px] font-bold mb-2">{title}</p>
      <table className="border-collapse text-[13px]">
        <thead><tr>{head.map((h, i) => <th key={i} className="border border-slate-500 px-3 py-1 bg-slate-100">{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className="border border-slate-500 px-3 py-1 text-center">{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  </div>
);

const st = (id: number, title: string, content: React.ReactNode, question: string, options: string[], correctAnswer: string, explanation: React.ReactNode): Step => ({
  id, title, content, quiz: { type: 'choice', question, options, correctAnswer, explanation },
});
const Q = ({ children }: { children: React.ReactNode }) => <p className="mt-3">{children}</p>;
const orig = (intro: React.ReactNode, q: React.ReactNode) => <div>{intro}<Q>{q}</Q></div>;

/* ───────── r1：図書館の利用調べ ───────── */
const R1Fig = () => (
  <BarFig title="先月、市立図書館で借りられたもの" unit="点" max={1400} step={200}
    bars={[{ label: 'Books', value: 1200 }, { label: '(A)', value: 600 }, { label: '(B)', value: 400 }, { label: '(C)', value: 200 }]} />
);
const r1Intro = (
  <div className="space-y-2">
    <p>次の英文は、中学生のユイ（Yui）とALTのグリーン先生（Mr. Green）の対話の一部である。また、図はユイが英語の発表のために作ったグラフである。</p>
    <Dialogue notes="*staff＝職員　*data＝データ　*elderly＝高齢の　*letter＝文字" lines={[
      ['Mr. Green', 'Hi, Yui. What are you looking at?'],
      ['Yui', 'This is a graph about our city library. I made it for my English presentation.'],
      ['Mr. Green', 'Interesting. Do you often use the library?'],
      ['Yui', 'Yes. I love reading.'],
      ['Mr. Green', <>How <B n={1} /> go there?</>],
      ['Yui', 'I go there every Saturday. Last month, I asked the library *staff about the things people borrowed, and they gave me this *data.'],
      ['Mr. Green', 'Books are the most popular, right?'],
      ['Yui', "That's right. People borrowed 1,200 books last month. Comics are more popular than magazines, and DVDs are not as popular as magazines."],
      ['Mr. Green', <>Look at the graph. People borrowed <B n={3} /> books as comics.</>],
      ['Yui', 'Yes. I was surprised that so many people still borrow books.'],
      ['Mr. Green', 'Does the library have any services for *elderly people?'],
      ['Yui', "Yes. It has many books with large *letters. Also, the staff take books to elderly people who can't come to the library."],
      ['Mr. Green', <>Wow, <U>that</U>&apos;s a great idea. My grandmother lives alone in America, and she can&apos;t walk well. She would be happy if someone brought books to her house.</>],
      ['Yui', 'Some elderly people also come to the library to join reading events and talk with other people there.'],
      ['Mr. Green', 'So the library is not only a place for reading books.'],
      ['Yui', <>Right. In my presentation, I want to say that libraries can <B n={5} />.</>],
      ['Mr. Green', "That's a wonderful message, Yui."],
    ]} />
    <R1Fig />
  </div>
);

/* ───────── r2：通学手段と環境問題 ───────── */
const R2Fig = () => (
  <BarFig title="わたしたちの学校の生徒の通学手段" unit="人" max={140} step={20}
    bars={[{ label: 'Bike', value: 120 }, { label: '(A)', value: 90 }, { label: '(B)', value: 45 }, { label: 'Train', value: 30 }, { label: '(C)', value: 30 }]} />
);
const r2Intro = (
  <div className="space-y-2">
    <p>次の英文は、中学生のソウタ（Sota）と留学生のエマ（Emma）の対話の一部である。また、図はソウタが全校生徒に調査して作ったグラフである。</p>
    <Dialogue notes="*produce＝〜を出す　*CO2＝二酸化炭素　*environment＝環境　*take turns 〜ing＝交代で〜する" lines={[
      ['Emma', 'Sota, what is this graph?'],
      ['Sota', 'It shows how students in our school come to school. I asked all the students.'],
      ['Emma', <>How <B n={1} /> to school, Sota?</>],
      ['Sota', 'I come by bike every day. It takes about fifteen minutes.'],
      ['Emma', 'Coming by bike is the most popular, right?'],
      ['Sota', <>Yes. <B n={3} /> students come to school by bike than on foot.</>],
      ['Emma', 'I see. And walking is more popular than taking the bus.'],
      ['Sota', "That's right. Also, coming by car is as popular as coming by train."],
      ['Emma', 'Why do some students come by car?'],
      ['Sota', "Their houses are far from school, and there aren't many buses. But cars *produce a lot of *CO2. I'm worried about the *environment."],
      ['Emma', 'In my town in Germany, people do something about that. Three or four families *take turns driving their children to school. One car carries four or five children.'],
      ['Sota', <><U>That</U> sounds nice. It can reduce the number of cars on the road.</>],
      ['Emma', 'Also, many people in my town ride bikes. The town has special roads only for bikes, so it is safe to ride.'],
      ['Sota', "That's great. In Japan, some roads are too narrow for bikes."],
      ['Emma', 'If more students come by bike or on foot, we can help the environment.'],
      ['Sota', 'I agree. Choosing how to get to school is something we can do every day.'],
      ['Emma', 'What will you say in your presentation?'],
      ['Sota', <>I&apos;ll tell my classmates that <B n={5} />.</>],
      ['Emma', 'Great. Then many students will start to think about the environment.'],
    ]} />
    <R2Fig />
  </div>
);

/* ───────── r3：スマホの使用時間と睡眠 ───────── */
const R3Fig = () => (
  <>
    <BarFig title="図1　スマートフォンで何をしているか" unit="人" max={60} step={10}
      bars={[{ label: 'Videos', value: 48 }, { label: '(A)', value: 36 }, { label: '(B)', value: 24 }, { label: '(C)', value: 12 }]} />
    <TableFig title="表2　1日のスマートフォンの使用時間と平均睡眠時間" head={['使用時間', '平均睡眠時間']}
      rows={[['1時間未満', '8時間'], ['1〜2時間', '7時間30分'], ['2〜3時間', '7時間'], ['3時間より長い', '6時間']]} />
  </>
);
const r3Intro = (
  <div className="space-y-2">
    <p>次の英文は、中学生のハルカ（Haruka）とALTのスミス先生（Mr. Smith）の対話の一部である。また、図1と表2はハルカがクラスで調査した結果である。</p>
    <Dialogue notes="*survey＝調査　*screen＝画面　*rule＝決まり" lines={[
      ['Mr. Smith', 'Haruka, you look sleepy today.'],
      ['Haruka', 'I went to bed at one last night. I was watching videos on my smartphone.'],
      ['Mr. Smith', <>Oh, no. How many hours <B n={1} /> every night?</>],
      ['Haruka', 'I usually sleep only about six hours.'],
      ['Mr. Smith', "That's not enough for junior high school students."],
      ['Haruka', 'I know. Actually, I did a *survey about smartphones in my class. Look at Graph 1. It shows what students do on their smartphones.'],
      ['Mr. Smith', 'Watching videos is the most popular.'],
      ['Haruka', 'Yes. Playing games is more popular than sending messages, but it is not as popular as watching videos. Only twelve students use their smartphones for studying, and twice as many students use them for sending messages.'],
      ['Mr. Smith', 'What does Table 2 show?'],
      ['Haruka', <>It shows how long students use smartphones and how long they sleep. Students who use smartphones for more than three hours sleep <B n={3} /> than students who use them for less than one hour.</>],
      ['Mr. Smith', "That's a big difference. The light from the *screen makes it hard to fall asleep."],
      ['Haruka', 'What did you do when you were a student?'],
      ['Mr. Smith', 'When I was a high school student, my family made a *rule. We put all our phones in the living room at nine every night.'],
      ['Haruka', <><U>That</U> sounds difficult, but I think it&apos;s a good rule.</>],
      ['Mr. Smith', 'At first it was hard, but soon I started to sleep better.'],
      ['Haruka', <>I don&apos;t want to feel sleepy in class anymore. So I will <B n={5} />.</>],
      ['Mr. Smith', "Good idea. Let's check how you feel next week."],
    ]} />
    <R3Fig />
  </div>
);

/* ───────── r4：外国人観光客と地方の観光 ───────── */
const R4Fig = () => (
  <PieFig title="外国人観光客がわたしたちの町に来た理由"
    slices={[{ label: 'Hot springs', value: 35 }, { label: '(A)', value: 25 }, { label: '(B)', value: 20 }, { label: '(C)', value: 15 }, { label: 'Others', value: 5 }]} />
);
const r4Intro = (
  <div className="space-y-2">
    <p>次の英文は、中学生のダイキ（Daiki）とALTのリー先生（Ms. Lee）の対話の一部である。また、図は町が外国人観光客に行った調査の結果である。</p>
    <Dialogue notes="*poster＝ポスター　*everyday life＝日常生活　*experience＝〜を体験する" lines={[
      ['Ms. Lee', 'Daiki, what are you making?'],
      ['Daiki', 'A *poster about tourism in our town. I want to make it in English.'],
      ['Ms. Lee', <>Great. How many <B n={1} /> to our town every year?</>],
      ['Daiki', 'About 4,000 foreign visitors come here every year. Our town asked them why they came here. Look at this graph.'],
      ['Ms. Lee', <>Hot springs are the <B n={3} /> reason.</>],
      ['Daiki', 'Yes. Food is the second most popular reason, and nature is more popular than the festival.'],
      ['Ms. Lee', 'Many foreign tourists visit big cities like Tokyo and Kyoto, but small towns also have their own good points.'],
      ['Daiki', 'Have you ever been to a small town in Japan?'],
      ['Ms. Lee', <>Yes. Last summer, I stayed at a farmer&apos;s house in a small village. I picked vegetables with the family and cooked dinner together. I&apos;ll never forget <U>it</U>.</>],
      ['Daiki', 'That sounds like a nice experience.'],
      ['Ms. Lee', "In big cities, you can see famous places, but you can't often see people's *everyday life."],
      ['Daiki', 'For us, farm work is not special at all.'],
      ['Ms. Lee', "But for visitors, it is special. They want to *experience things they can't do in their own countries."],
      ['Daiki', 'I see. Then everyday things in our town can be special for visitors.'],
      ['Ms. Lee', "That's right."],
      ['Daiki', <>So I think our town should <B n={5} />.</>],
      ['Ms. Lee', 'I agree. Then visitors will enjoy our town more.'],
    ]} />
    <R4Fig />
  </div>
);

/* ───────── r5：部活動の人気とボランティア ───────── */
const R5Fig = () => (
  <TableFig title="わたしたちの学校の部活動の部員数" head={['部活動', '部員数（人）']}
    rows={[['Soccer team', '30'], ['(A)', '30'], ['(B)', '24'], ['Baseball team', '18'], ['(C)', '12'], ['Volunteer club', '8']]} />
);
const r5Intro = (
  <div className="space-y-2">
    <p>次の英文は、中学生のマイ（Mai）と留学生のトム（Tom）の対話の一部である。また、表はマイが調べた部活動の部員数である。</p>
    <Dialogue notes="*nursing home＝老人ホーム　*food bank＝フードバンク（食べ物を必要な人に配る活動）" lines={[
      ['Tom', 'Mai, what is this table?'],
      ['Mai', "It shows the number of members in each club at our school. I'm a member of the volunteer club, so I wanted to know about our clubs."],
      ['Tom', <>What <B n={1} /> in the volunteer club?</>],
      ['Mai', 'We clean the park near our school every month. We also visit a *nursing home and sing songs with the people there.'],
      ['Tom', "That sounds nice. The soccer team has thirty members. It's very popular."],
      ['Mai', 'Yes. The tennis team has as many members as the soccer team. And the brass band has twice as many members as the art club.'],
      ['Tom', 'How about the volunteer club?'],
      ['Mai', <>Look. The volunteer club has <B n={3} /> members of all the clubs. Only eight.</>],
      ['Tom', "That's too bad. In my school in Australia, every student had to do volunteer work for twenty hours a year."],
      ['Mai', <>Twenty hours? Did you like <U>it</U>?</>],
      ['Tom', 'At first, I didn\'t. But when I helped at a *food bank, an old man said "Thank you" to me with a big smile. After that, I started to enjoy volunteer work.'],
      ['Mai', 'I understand. When people at the nursing home smile, I feel happy, too.'],
      ['Tom', 'Many students may think volunteer work is hard or boring.'],
      ['Mai', "I think so, too. That's why our club has so few members."],
      ['Tom', "Why don't you tell other students about your experiences?"],
      ['Mai', <>Good idea. I want more students to know that <B n={5} />.</>],
      ['Tom', "I'm sure some of them will join your club."],
    ]} />
    <R5Fig />
  </div>
);

/* ───────── r6：給食の食品ロスと海外の取り組み ───────── */
const R6Fig = () => (
  <BarFig title="先週、わたしたちのクラスが残した給食の量" unit="kg" max={20} step={5}
    bars={[{ label: 'Rice', value: 9 }, { label: '(A)', value: 18 }, { label: '(B)', value: 12 }, { label: 'Meat', value: 6 }, { label: '(C)', value: 6 }]} />
);
const r6Intro = (
  <div className="space-y-2">
    <p>次の英文は、中学生のケン（Ken）とALTのマルタン先生（Ms. Martin）の対話の一部である。また、図はケンのクラスが1週間の給食の食べ残しをはかった結果である。</p>
    <Dialogue notes="*food loss＝食品ロス　*measure＝〜をはかる　*portion＝1人分の量　*serve＝（料理を）盛りつける" lines={[
      ['Ms. Martin', 'Ken, what are you studying?'],
      ['Ken', "I'm studying *food loss in school lunch. Our class *measured the food we left last week."],
      ['Ms. Martin', <><B n={1} /> did your class leave last week?</>],
      ['Ken', <>We left 51 kilograms in one week. Look at this graph. We left the most vegetables, and we left as much soup as meat. The amount of vegetables we left was <B n={3} /> that of rice.</>],
      ['Ms. Martin', "That's a lot. Why do students leave vegetables?"],
      ['Ken', "Some students don't like them, and the *portions are too big for some students."],
      ['Ms. Martin', 'In France, some schools let students choose a small or large portion.'],
      ['Ken', "That's interesting."],
      ['Ms. Martin', 'I also read about schools in Finland. There, students *serve lunch by themselves, so they take only the amount they can eat.'],
      ['Ken', <>In our school, the same amount of food is put on every plate. If students serve themselves, they won&apos;t leave much food. I think we can do <U>that</U> in our school, too.</>],
      ['Ms. Martin', 'Good. But you should also think about the people behind your lunch.'],
      ['Ken', 'What do you mean?'],
      ['Ms. Martin', 'Farmers grew the vegetables, and cooks made the lunch for you. If you remember that, you may want to eat more.'],
      ['Ken', "You're right. I didn't think about the people who made our lunch."],
      ['Ms. Martin', 'What will you do next?'],
      ['Ken', <>I&apos;ll ask my teacher if students can <B n={5} />.</>],
      ['Ms. Martin', "That's a good first step."],
    ]} />
    <R6Fig />
  </div>
);

/* ───────── データ ───────── */
export const eigoR: Record<string, MajorQuestionData> = {
  r1: {
    id: 'r1',
    title: '英語 大問5 類題1：図書館の利用調べと高齢者向けサービス',
    subs: [
      {
        id: '1', title: '(1) 空所に入る3語（疑問文）', knowledge: ['疑問詞 how often', '現在形の疑問文'],
        originalText: orig(r1Intro, <>(1)　本文中の <B n={1} /> に入る適切な英語3語を選びなさい。</>),
        steps: [
          st(1, '① 答えの文を見る', <p>疑問文の空所は、すぐ後の「答え」から逆算します。ユイは <i>I go there every Saturday.</i> と答えています。</p>,
            'ユイの答えが伝えている内容は？', ['図書館に行く回数（頻度）', '図書館への行き方', '図書館にいる時間の長さ', '図書館に一緒に行く人'], '図書館に行く回数（頻度）',
            <p><i>every Saturday</i>（毎週土曜日）は回数・頻度を表します。頻度をたずねる疑問詞は How often です。</p>),
          st(2, '② 時制と主語', <p>答えは <i>I go</i> と現在形です。相手（you）にふだんのことをたずねる一般動詞の疑問文になります。</p>,
            'How often のあとに続く形は？', ['do you go', 'did you go', 'are you go'], 'do you go',
            <p>答えが現在形 <i>I go there every Saturday.</i> なので過去形 did は合いません。一般動詞 go の疑問文なので be動詞 are も使えません。空所のあとに go があるので、空所は often do you です。</p>),
          st(3, '③ 答え', <p>How <B n={1} /> go there? の空所に入る3語を選びます。</p>,
            '(1) に入る英語3語は？', ['often you do', 'often do you', 'often did you', 'often are you', 'many do you'], 'often do you',
            <p>How often do you go there?（どのくらいの頻度でそこへ行きますか）。答え <i>I go there every Saturday.</i> と合います。often you do は語順の誤り、did は時制の誤り、are は一般動詞の疑問文に合わず、How many は数えられる名詞が必要です。</p>),
        ],
      },
      {
        id: '2', title: '(2) グラフの (A)〜(C)', knowledge: ['比較 more ~ than', 'not as ~ as'],
        originalText: orig(r1Intro, <>(2)　図の (A)、(B)、(C) に入るものの組み合わせとして正しいものを選びなさい。</>),
        steps: [
          st(1, '① グラフの大きさ', <p>まずグラフで (A)(B)(C) の数を読みます。</p>,
            '(A)(B)(C) を多い順に並べると？', ['(A) → (B) → (C)', '(C) → (B) → (A)', '(B) → (A) → (C)'], '(A) → (B) → (C)',
            <p>(A) 600、(B) 400、(C) 200 なので、多い順に (A) → (B) → (C) です。</p>),
          st(2, '② 比較表現を読む', <p>ユイの発言 <i>Comics are more popular than magazines, and DVDs are not as popular as magazines.</i> を使います。not as ~ as は「〜ほど…ない」です。</p>,
            'マンガ・雑誌・DVDを人気の順に並べると？', ['マンガ → 雑誌 → DVD', '雑誌 → マンガ → DVD', 'DVD → 雑誌 → マンガ', 'マンガ → DVD → 雑誌'], 'マンガ → 雑誌 → DVD',
            <p>マンガは雑誌より人気（more popular than）、DVDは雑誌ほど人気がない（not as popular as）ので、マンガ → 雑誌 → DVD です。</p>),
          st(3, '③ 答え', <p>①の順と②の順を対応させます。</p>,
            '(A)(B)(C) の組み合わせは？', ['(A) Magazines (B) Comics (C) DVDs', '(A) Comics (B) DVDs (C) Magazines', '(A) Comics (B) Magazines (C) DVDs', '(A) DVDs (B) Magazines (C) Comics', '(A) Magazines (B) DVDs (C) Comics'], '(A) Comics (B) Magazines (C) DVDs',
            <p>多い順 (A)→(B)→(C) が、人気順 マンガ→雑誌→DVD にあたります。not as popular as を「同じくらい人気」と読むと雑誌とDVDを取り違えます。</p>),
        ],
      },
      {
        id: '3', title: '(3) 図を見て空所に入る英語', knowledge: ['倍数表現 twice as ~ as', 'many と much'],
        originalText: orig(r1Intro, <>(3)　図を参考に、本文中の <B n={3} /> に入る適切な英語を選びなさい。</>),
        steps: [
          st(1, '① 図の数を読む', <p>文は People borrowed <B n={3} /> books as comics. です。本とマンガの数を比べます。</p>,
            '本とマンガ（(A)）の数は？', ['本 1,200、マンガ 600', '本 1,200、マンガ 400', '本 600、マンガ 1,200'], '本 1,200、マンガ 600',
            <p>(2)より (A) がマンガで 600。本は 1,200 です。</p>),
          st(2, '② 何倍か、many か much か', <p>1,200 は 600 の何倍かを考えます。「〜の2倍の…」は twice as ＋ 形容詞 ＋ as。books は数えられる名詞です。</p>,
            'どの語を使う？', ['twice と many', 'twice と much', 'half と many'], 'twice と many',
            <p>1,200 ÷ 600 ＝ 2 で2倍。books は数えられる名詞の複数形なので many を使います。much は数えられない名詞に使います。</p>),
          st(3, '③ 答え', <p>as ... as の前に倍数を置く語順に注意します。</p>,
            '(3) に入る英語は？', ['twice as much', 'twice many', 'as twice many', 'twice as many', 'more twice'], 'twice as many',
            <p>People borrowed twice as many books as comics.（人々はマンガの2倍の本を借りた）。twice は as の前に置きます。much は数えられない名詞用、twice many は as が欠けています。</p>),
        ],
      },
      {
        id: '4', title: '(4) 下線部 that の内容', knowledge: ['指示語 that'],
        originalText: orig(r1Intro, <>(4)　下線部の that が指す内容として最も適切なものを選びなさい。</>),
        steps: [
          st(1, '① 直前の文を見る', <p>that は多くの場合、直前に相手が言ったことを指します。直前のユイの発言を確認します。</p>,
            '直前でユイが紹介した高齢者向けサービスは？', ['文字の大きい本と、職員が本を届けること', '読書会と、DVDの貸し出し', '本の販売と、送迎バス'], '文字の大きい本と、職員が本を届けること',
            <p><i>It has many books with large letters. Also, the staff take books to elderly people who can&apos;t come to the library.</i> の2つです。</p>),
          st(2, '② あとの文で絞る', <p>グリーン先生は続けて <i>She would be happy if someone brought books to her house.</i> と言っています。</p>,
            'このあとの文とつながるのはどちら？', ['職員が本を届けること', '文字の大きい本があること'], '職員が本を届けること',
            <p>「誰かが家に本を届けてくれたら祖母は喜ぶだろう」とあるので、that は本を届けるサービスを指します。直前の Also で始まる文の内容でもあります。</p>),
          st(3, '③ 答え', null,
            'that が指す内容は？', ['図書館に文字の大きい本がたくさんあること', '図書館の職員が、図書館に来られない高齢者に本を届けること', '高齢者が図書館で読書会に参加すること', 'グリーン先生の祖母がアメリカで一人で暮らしていること', '図書館の職員が高齢者に本の読み方を教えること'], '図書館の職員が、図書館に来られない高齢者に本を届けること',
            <p>根拠は <i>the staff take books to elderly people who can&apos;t come to the library</i> と、直後の <i>if someone brought books to her house</i>。文字の大きい本も話題に出ていますが、家に届ける話とはつながりません。</p>),
        ],
      },
      {
        id: '5', title: '(5) 最後の空所', knowledge: ['対話の要旨'],
        originalText: orig(r1Intro, <>(5)　本文中の <B n={5} /> に入る英語として最も適切なものを選びなさい。</>),
        steps: [
          st(1, '① 直前の発言', <p>直前にグリーン先生が <i>So the library is not only a place for reading books.</i> とまとめています。</p>,
            'この文の意味は？', ['図書館は本を読むためだけの場所ではない', '図書館は本を読む場所ではない', '図書館で本を読む人は少ない'], '図書館は本を読むためだけの場所ではない',
            <p>not only は「〜だけではない」。本を読む以外の役割もある、という意味です。</p>),
          st(2, '② 本文で紹介された役割', <p>ユイは高齢者向けのサービスや、高齢者が読書会に参加してほかの人と話すことを紹介しました。</p>,
            'ユイが伝えたい図書館の役割に近いのは？', ['いろいろな年代の人がつながる場所', '若い人だけが使う場所', 'DVDを借りるための場所'], 'いろいろな年代の人がつながる場所',
            <p><i>Some elderly people also come to the library to join reading events and talk with other people there.</i> から、人と人がつながる場所でもあるとわかります。</p>),
          st(3, '③ 答え', null,
            '(5) に入る英語は？', ['lend more DVDs than books', 'be used only by students', 'help people of all ages connect with each other', 'stop their services for elderly people', 'sell books to people who cannot come'], 'help people of all ages connect with each other',
            <p>libraries can help people of all ages connect with each other（図書館はあらゆる年代の人がつながる手助けができる）。グラフでは本が最も多いのでDVDの文は誤り。学生だけ、サービスをやめる、本を売る、はどれも本文にありません。</p>),
        ],
      },
    ],
  },

  r2: {
    id: 'r2',
    title: '英語 大問5 類題2：通学手段のグラフと環境問題',
    subs: [
      {
        id: '1', title: '(1) 空所に入る3語（疑問文）', knowledge: ['疑問詞 how', '現在形の疑問文'],
        originalText: orig(r2Intro, <>(1)　本文中の <B n={1} /> に入る適切な英語3語を選びなさい。</>),
        steps: [
          st(1, '① 答えの文を見る', <p>ソウタは <i>I come by bike every day.</i> と答えています。</p>,
            'エマがたずねたのは？', ['学校への来方（手段）', '学校までの距離', '学校に着く時刻'], '学校への来方（手段）',
            <p>by bike（自転車で）は手段です。手段は How でたずねます。所要時間は次の文で補足しているだけです。</p>),
          st(2, '② 時制と主語', <p>答えは <i>I come ... every day</i> と現在形で、毎日の習慣です。</p>,
            'How のあとに続く形は？', ['do you come', 'did you come', 'does you come'], 'do you come',
            <p>相手は you、答えは現在形なので do you come。does は主語が3人称単数のとき、did は過去のときです。</p>),
          st(3, '③ 答え', null,
            '(1) に入る英語3語は？', ['you do come', 'did you come', 'do you come', 'are you come', 'does you come'], 'do you come',
            <p>How do you come to school, Sota? 答えの <i>I come by bike every day.</i> が現在形なので did は合いません。you do come は語順の誤り、are は一般動詞と合わず、does は主語 you と合いません。</p>),
        ],
      },
      {
        id: '2', title: '(2) グラフの (A)〜(C)', knowledge: ['比較 more ~ than', 'as ~ as'],
        originalText: orig(r2Intro, <>(2)　図の (A)、(B)、(C) に入るものの組み合わせとして正しいものを選びなさい。</>),
        steps: [
          st(1, '① as ~ as を使う', <p>ソウタは <i>coming by car is as popular as coming by train.</i> と言っています。as ~ as は「同じくらい」です。</p>,
            '電車（Train）と同じ人数の空欄は？', ['(C)', '(A)', '(B)'], '(C)',
            <p>Train は 30人。同じ 30人なのは (C) なので、(C) が車（Car）です。</p>),
          st(2, '② more ~ than を使う', <p>エマは <i>walking is more popular than taking the bus.</i> と言っています。残りは (A) 90人と (B) 45人です。</p>,
            '徒歩（Walk）にあたるのは？', ['(A)', '(B)'], '(A)',
            <p>徒歩はバスより人気なので、多い方の (A) 90人が徒歩、(B) 45人がバスです。</p>),
          st(3, '③ 答え', null,
            '(A)(B)(C) の組み合わせは？', ['(A) Bus (B) Walk (C) Car', '(A) Walk (B) Car (C) Bus', '(A) Car (B) Bus (C) Walk', '(A) Walk (B) Bus (C) Car', '(A) Bus (B) Car (C) Walk'], '(A) Walk (B) Bus (C) Car',
            <p>as popular as coming by train から (C) が車、more popular than taking the bus から (A) が徒歩、(B) がバスです。</p>),
        ],
      },
      {
        id: '3', title: '(3) 図を見て空所に入る英語', knowledge: ['差を表す比較 〜 more ... than'],
        originalText: orig(r2Intro, <>(3)　図を参考に、本文中の <B n={3} /> に入る適切な英語を選びなさい。</>),
        steps: [
          st(1, '① 何と何を比べるか', <p>文は <B n={3} /> students come to school by bike than on foot. です。than があるので比較級の文です。</p>,
            '比べている2つは？', ['自転車と徒歩', '自転車とバス', '徒歩と電車'], '自転車と徒歩',
            <p>by bike（自転車で）と on foot（徒歩で）を比べています。</p>),
          st(2, '② 差を求める', <p>図から、自転車は 120人、徒歩は (A) の 90人です。</p>,
            '人数の差は？', ['30人', '210人', '45人'], '30人',
            <p>120 − 90 ＝ 30（人）。</p>),
          st(3, '③ 答え', <p>「…より30人多くの生徒」は、差の数を比較級の前に置いて thirty more students と表します。</p>,
            '(3) に入る英語は？', ['More thirty', 'Thirty many', 'Thirty more', 'Thirty most', 'Thirty much'], 'Thirty more',
            <p>Thirty more students come to school by bike than on foot. 差（thirty）は比較級 more の前に置きます。than があるので most（最上級）や many（原級）は使えません。</p>),
        ],
      },
      {
        id: '4', title: '(4) 下線部 That の内容', knowledge: ['指示語 that'],
        originalText: orig(r2Intro, <>(4)　下線部の That が指す内容として最も適切なものを選びなさい。</>),
        steps: [
          st(1, '① 直前の発言', <p>That は直前のエマの発言を受けています。</p>,
            'エマが直前に紹介したことは？', ['ドイツの町で、家族が交代で子どもを車で送ること', 'ドイツの町に自転車専用の道があること', '日本の道がせまいこと'], 'ドイツの町で、家族が交代で子どもを車で送ること',
            <p><i>Three or four families take turns driving their children to school. One car carries four or five children.</i> です。自転車専用道路の話はこのあとに出てきます。</p>),
          st(2, '② あとの文で確かめる', <p>ソウタは続けて <i>It can reduce the number of cars on the road.</i> と言います。</p>,
            '車の数が減るのはなぜ？', ['1台に4〜5人の子どもを乗せるから', 'みんなが電車で通うから', '車を使うのを禁止するから'], '1台に4〜5人の子どもを乗せるから',
            <p>いくつかの家族が交代で1台に乗り合わせるので、道路を走る車が減ります。</p>),
          st(3, '③ 答え', null,
            'That が指す内容は？', ['エマの町には自転車専用の道があること', '3〜4家族が交代で、子どもたちを車で学校へ送ること', '家が遠い生徒は車で通学すること', '車がたくさんの二酸化炭素を出すこと', '家族がそれぞれ自分の車で子どもを送ること'], '3〜4家族が交代で、子どもたちを車で学校へ送ること',
            <p>根拠は <i>Three or four families take turns driving their children to school.</i> 「それぞれ自分の車で」では車は減らず、直後の <i>It can reduce the number of cars</i> と合いません。</p>),
        ],
      },
      {
        id: '5', title: '(5) 最後の空所', knowledge: ['対話の要旨'],
        originalText: orig(r2Intro, <>(5)　本文中の <B n={5} /> に入る英語として最も適切なものを選びなさい。</>),
        steps: [
          st(1, '① 直前の流れ', <p>エマ <i>If more students come by bike or on foot, we can help the environment.</i> ソウタ <i>Choosing how to get to school is something we can do every day.</i></p>,
            '2人が同意していることは？', ['通学手段の選び方で環境を守れる', '車で通うほうが安全だ', 'ドイツに引っ越すべきだ'], '通学手段の選び方で環境を守れる',
            <p>自転車や徒歩で通えば環境に役立ち、それは毎日できることだ、という流れです。</p>),
          st(2, '② あとの文で確かめる', <p>エマは最後に <i>Then many students will start to think about the environment.</i> と言っています。</p>,
            'ソウタの発表の内容は何についての話？', ['環境', '部活動', '宿題'], '環境',
            <p>発表を聞いた生徒が環境について考えるようになる内容です。</p>),
          st(3, '③ 答え', null,
            '(5) に入る英語は？', ['we should come to school by car every day', 'the way we come to school can help the earth', 'bikes produce a lot of CO2', 'Germany has no special roads for bikes', 'walking to school is not safe at all'], 'the way we come to school can help the earth',
            <p>the way we come to school can help the earth（学校への来方で地球を助けられる）。車で毎日、は環境の話と逆。CO2を出すのは車、ドイツには自転車専用の道がある、と本文にあるので他は誤りです。</p>),
        ],
      },
    ],
  },

  r3: {
    id: 'r3',
    title: '英語 大問5 類題3：スマホの使用時間と睡眠',
    subs: [
      {
        id: '1', title: '(1) 空所に入る3語（疑問文）', knowledge: ['How many ＋ 名詞 ＋ 疑問文の語順'],
        originalText: orig(r3Intro, <>(1)　本文中の <B n={1} /> に入る適切な英語3語を選びなさい。</>),
        steps: [
          st(1, '① 答えの文を見る', <p>ハルカは <i>I usually sleep only about six hours.</i> と答えています。</p>,
            '答えの動詞と時制は？', ['sleep の現在形', 'sleep の過去形', 'be動詞の現在形'], 'sleep の現在形',
            <p>usually（ふだん）とともに現在形 sleep を使っています。ふだんの習慣です。</p>),
          st(2, '② 疑問文の語順', <p>How many hours のあとは、ふつうの疑問文の語順「do ＋ 主語 ＋ 動詞の原形」が続きます。</p>,
            '正しい語順は？', ['do ＋ you ＋ sleep', 'you ＋ do ＋ sleep', 'do ＋ you ＋ sleeping'], 'do ＋ you ＋ sleep',
            <p>疑問文は do を主語の前に出し、動詞は原形にします。</p>),
          st(3, '③ 答え', null,
            '(1) に入る英語3語は？', ['did you sleep', 'you do sleep', 'does you sleep', 'do you sleep', 'do you sleeping'], 'do you sleep',
            <p>How many hours do you sleep every night? 答え <i>I usually sleep</i> が現在形なので did は合わず、does は主語 you と合いません。you do sleep は語順、sleeping は原形でない誤りです。</p>),
        ],
      },
      {
        id: '2', title: '(2) 図1の (A)〜(C)', knowledge: ['比較 more ~ than', 'not as ~ as', '倍数 twice as many'],
        originalText: orig(r3Intro, <>(2)　図1の (A)、(B)、(C) に入るものの組み合わせとして正しいものを選びなさい。</>),
        steps: [
          st(1, '① 人数のわかる手がかり', <p>ハルカは <i>Only twelve students use their smartphones for studying</i> と言っています。</p>,
            '勉強（Studying）にあたる空欄は？', ['(C)', '(B)', '(A)'], '(C)',
            <p>12人なのは (C) です。</p>),
          st(2, '② twice as many を使う', <p>続けて <i>twice as many students use them for sending messages.</i> とあります。</p>,
            'メッセージを送る（Messages）人数と空欄は？', ['24人で (B)', '36人で (A)', '6人で該当なし'], '24人で (B)',
            <p>12 × 2 ＝ 24（人）で (B)。残る (A) 36人は、メッセージより人気で動画ほどではないゲームです（<i>Playing games is more popular than sending messages, but it is not as popular as watching videos.</i>）。</p>),
          st(3, '③ 答え', null,
            '(A)(B)(C) の組み合わせは？', ['(A) Messages (B) Games (C) Studying', '(A) Games (B) Studying (C) Messages', '(A) Studying (B) Messages (C) Games', '(A) Games (B) Messages (C) Studying', '(A) Messages (B) Studying (C) Games'], '(A) Games (B) Messages (C) Studying',
            <p>勉強 12人＝(C)、その2倍のメッセージ 24人＝(B)、ゲーム 36人＝(A)。36 は 24 より多く 48 より少ないので、ゲームの比較の文とも一致します。</p>),
        ],
      },
      {
        id: '3', title: '(3) 表2を見て空所に入る英語', knowledge: ['差を表す比較 〜 less'],
        originalText: orig(r3Intro, <>(3)　表2を参考に、本文中の <B n={3} /> に入る適切な英語を選びなさい。</>),
        steps: [
          st(1, '① 表を読む', <p>3時間より長く使う生徒と、1時間未満の生徒の平均睡眠時間を比べます。</p>,
            'それぞれの平均睡眠時間は？', ['3時間より長い：6時間、1時間未満：8時間', '3時間より長い：7時間、1時間未満：8時間', '3時間より長い：8時間、1時間未満：6時間'], '3時間より長い：6時間、1時間未満：8時間',
            <p>表2の一番下が6時間、一番上が8時間です。</p>),
          st(2, '② 長いか短いか', <p>主語は「3時間より長く使う生徒」です。8 − 6 ＝ 2 時間。</p>,
            '3時間より長く使う生徒の睡眠は？', ['2時間短い', '2時間長い', '同じ'], '2時間短い',
            <p>6時間は8時間より2時間短いので、less（より少なく）を使います。</p>),
          st(3, '③ 答え', <p>差（two hours）を比較級の前に置きます。hours は複数形です。</p>,
            '(3) に入る英語は？', ['two hours longer', 'less two hours', 'two hour less', 'two hours less', 'two hours little'], 'two hours less',
            <p>Students who use smartphones for more than three hours sleep two hours less than students who use them for less than one hour. longer は逆の意味、less two hours は語順、two hour は複数の s がなく、little は比較級ではありません。</p>),
        ],
      },
      {
        id: '4', title: '(4) 下線部 That の内容', knowledge: ['指示語 that'],
        originalText: orig(r3Intro, <>(4)　下線部の That が指す内容として最も適切なものを選びなさい。</>),
        steps: [
          st(1, '① 直前の発言', <p>That の直前で、スミス先生は高校生のころの家族の決まりを話しています。</p>,
            'その決まりの内容は？', ['毎晩9時に家族全員の電話を居間に置く', '毎晩9時に寝る', '電話を寝室に置く'], '毎晩9時に家族全員の電話を居間に置く',
            <p><i>We put all our phones in the living room at nine every night.</i> です。</p>),
          st(2, '② あとの文で確かめる', <p>ハルカは <i>but I think it&apos;s a good rule.</i>、スミス先生は <i>At first it was hard</i> と続けます。</p>,
            'That は何についての話？', ['家族の決まり', '画面の光', 'ハルカの睡眠時間'], '家族の決まり',
            <p>good rule（よい決まり）と言っているので、That は家族の決まりを指します。</p>),
          st(3, '③ 答え', null,
            'That が指す内容は？', ['スマートフォンの画面の光で眠りにくくなること', '毎晩9時に家族全員の電話を居間に置くこと', '毎晩9時に家族全員が寝ること', '家族全員が電話を自分の寝室に置くこと', 'ハルカが毎晩6時間しか寝ないこと'], '毎晩9時に家族全員の電話を居間に置くこと',
            <p>根拠は <i>We put all our phones in the living room at nine every night.</i> と直後の <i>it&apos;s a good rule</i>。9時に寝るとは言っていません。</p>),
        ],
      },
      {
        id: '5', title: '(5) 最後の空所', knowledge: ['対話の要旨'],
        originalText: orig(r3Intro, <>(5)　本文中の <B n={5} /> に入る英語として最も適切なものを選びなさい。</>),
        steps: [
          st(1, '① 直前の発言', <p>ハルカは <i>I don&apos;t want to feel sleepy in class anymore.</i> と言い、So でつなげています。</p>,
            'ハルカがしたいことは？', ['よく眠れるようにする', 'もっと動画を見る', '授業中に寝る'], 'よく眠れるようにする',
            <p>授業中に眠くなりたくない、だから…という流れなので、よく眠るための行動が入ります。</p>),
          st(2, '② 本文の手がかり', <p>表2では使用時間が長いほど睡眠が短く、スミス先生は画面の光が眠りをさまたげると言いました。</p>,
            'よく眠るためにできることは？', ['寝る前にスマートフォンを使わない', '寝る直前までスマートフォンを使う', '電話をベッドのそばに置く'], '寝る前にスマートフォンを使わない',
            <p><i>The light from the screen makes it hard to fall asleep.</i> から、寝る前に使わないのがよいとわかります。</p>),
          st(3, '③ 答え', null,
            '(5) に入る英語は？', ['watch more videos at night', 'use my smartphone for more than three hours', 'stop using my smartphone one hour before going to bed', 'sleep only six hours every night', 'put my phone next to my bed'], 'stop using my smartphone one hour before going to bed',
            <p>So I will stop using my smartphone one hour before going to bed. ほかはどれも睡眠を短くする行動で、「眠くなりたくない」と合いません。</p>),
        ],
      },
    ],
  },

  r4: {
    id: 'r4',
    title: '英語 大問5 類題4：外国人観光客と地方の観光',
    subs: [
      {
        id: '1', title: '(1) 空所に入る3語（疑問文）', knowledge: ['主語をたずねる疑問文 How many ＋ 名詞 ＋ 動詞'],
        originalText: orig(r4Intro, <>(1)　本文中の <B n={1} /> に入る適切な英語3語を選びなさい。</>),
        steps: [
          st(1, '① 答えの文を見る', <p>ダイキは <i>About 4,000 foreign visitors come here every year.</i> と答えています。</p>,
            'この文の主語は？', ['foreign visitors', '4,000', 'here'], 'foreign visitors',
            <p>About 4,000 foreign visitors が主語、come が動詞です。</p>),
          st(2, '② 主語をたずねる疑問文', <p>How many foreign visitors が主語になる疑問文では、do を使わず「疑問詞＋主語＋動詞」の語順になります。</p>,
            '正しい形は？', ['How many foreign visitors come ...?', 'How many do foreign visitors come ...?', 'How many foreign visitors do come ...?'], 'How many foreign visitors come ...?',
            <p>主語をたずねるときは、ふつうの文と同じ語順のままです。答えも現在形 come です。</p>),
          st(3, '③ 答え', null,
            '(1) に入る英語3語は？', ['do foreign visitors come', 'foreign visitors comes', 'foreign visitors come', 'foreign visitors came', 'visitors foreign come'], 'foreign visitors come',
            <p>How many foreign visitors come to our town every year? 主語が複数なので comes は誤り、答えが現在形 come なので came も誤り。do を入れる形は主語をたずねる疑問文では使いません。</p>),
        ],
      },
      {
        id: '2', title: '(2) 円グラフの (A)〜(C)', knowledge: ['最上級 the second most', '比較 more ~ than'],
        originalText: orig(r4Intro, <>(2)　図の (A)、(B)、(C) に入るものの組み合わせとして正しいものを選びなさい。</>),
        steps: [
          st(1, '① the second most を使う', <p>ダイキは <i>Food is the second most popular reason</i> と言っています。</p>,
            '2番目に多い空欄は？', ['(A)', '(B)', '(C)'], '(A)',
            <p>温泉 35% が1番、(A) 25% が2番目です。(A) が食べ物（Food）です。</p>),
          st(2, '② more ~ than を使う', <p>続けて <i>nature is more popular than the festival.</i> とあります。残りは (B) 20% と (C) 15% です。</p>,
            '自然（Nature）にあたるのは？', ['(B)', '(C)'], '(B)',
            <p>自然は祭りより多いので (B) 20% が自然、(C) 15% が祭りです。</p>),
          st(3, '③ 答え', null,
            '(A)(B)(C) の組み合わせは？', ['(A) Nature (B) Food (C) Festival', '(A) Food (B) Nature (C) Festival', '(A) Food (B) Festival (C) Nature', '(A) Festival (B) Nature (C) Food', '(A) Nature (B) Festival (C) Food'], '(A) Food (B) Nature (C) Festival',
            <p>the second most popular で (A) が食べ物、more popular than the festival で (B) 自然、(C) 祭りです。</p>),
        ],
      },
      {
        id: '3', title: '(3) 図を見て空所に入る英語', knowledge: ['最上級 the most popular'],
        originalText: orig(r4Intro, <>(3)　図を参考に、本文中の <B n={3} /> に入る適切な英語を選びなさい。</>),
        steps: [
          st(1, '① 図を読む', <p>文は Hot springs are the <B n={3} /> reason. です。</p>,
            '温泉（Hot springs）はグラフで何番目？', ['1番目（35%）', '2番目（25%）', '3番目（20%）'], '1番目（35%）',
            <p>35% で最も大きい割合です。</p>),
          st(2, '② 形を決める', <p>「最も人気のある」は最上級です。popular は長い語なので most を使います。</p>,
            'popular の最上級は？', ['most popular', 'popularest', 'more popular'], 'most popular',
            <p>popular のように長い形容詞は、-est ではなく most をつけます。</p>),
          st(3, '③ 答え', null,
            '(3) に入る英語は？', ['more popular', 'most popular', 'popularest', 'much popular', 'best popular'], 'most popular',
            <p>Hot springs are the most popular reason. 前に the があり、比べる than もないので最上級です。more は比較級、popularest は誤った形、best は good の最上級で popular と並べません。</p>),
        ],
      },
      {
        id: '4', title: '(4) 下線部 it の内容', knowledge: ['指示語 it'],
        originalText: orig(r4Intro, <>(4)　下線部の it が指す内容として最も適切なものを選びなさい。</>),
        steps: [
          st(1, '① 文の意味', <p><i>I&apos;ll never forget it.</i> は「それを決して忘れないだろう」。忘れられない出来事を探します。</p>,
            'リー先生が直前に話した出来事は？', ['去年の夏、小さな村の農家に泊まったこと', '東京や京都を観光したこと', '町の温泉に入ったこと'], '去年の夏、小さな村の農家に泊まったこと',
            <p><i>Last summer, I stayed at a farmer&apos;s house in a small village.</i> です。</p>),
          st(2, '② 中身をくわしく', <p>続く文 <i>I picked vegetables with the family and cooked dinner together.</i> も同じ体験の説明です。</p>,
            '農家でしたことは？', ['家族と野菜をとり、一緒に夕食を作った', '一人で野菜を買った', '農家の人に英語を教えた'], '家族と野菜をとり、一緒に夕食を作った',
            <p>picked vegetables（野菜をとった）、cooked dinner together（一緒に夕食を作った）です。</p>),
          st(3, '③ 答え', null,
            'it が指す内容は？', ['ダイキが英語でポスターを作っていること', '小さな村の農家に泊まり、家族と野菜をとって夕食を一緒に作ったこと', '東京や京都の有名な場所を訪れたこと', '町が外国人観光客に調査をしたこと', '農家に泊まり、一人で夕食を作ったこと'], '小さな村の農家に泊まり、家族と野菜をとって夕食を一緒に作ったこと',
            <p>根拠は <i>I stayed at a farmer&apos;s house ... I picked vegetables with the family and cooked dinner together.</i> 夕食は家族と一緒（together）に作っているので「一人で」は誤りです。</p>),
        ],
      },
      {
        id: '5', title: '(5) 最後の空所', knowledge: ['対話の要旨'],
        originalText: orig(r4Intro, <>(5)　本文中の <B n={5} /> に入る英語として最も適切なものを選びなさい。</>),
        steps: [
          st(1, '① リー先生の考え', <p><i>In big cities, you can see famous places, but you can&apos;t often see people&apos;s everyday life.</i> と <i>But for visitors, it is special.</i></p>,
            '観光客にとって特別なのは？', ['その土地の人の日常生活', '大都市の有名な場所', '自分の国でできること'], 'その土地の人の日常生活',
            <p>大都市ではなかなか見られない日常生活や農作業が、観光客には特別だと言っています。</p>),
          st(2, '② ダイキの気づき', <p>ダイキは <i>Then everyday things in our town can be special for visitors.</i> と言い、So でまとめます。</p>,
            'ダイキの結論に近いのは？', ['町のふだんの暮らしを観光に生かす', '大都市のまねをする', '観光客を減らす'], '町のふだんの暮らしを観光に生かす',
            <p>町のふだんのことが観光客には特別になる、という気づきから結論を出しています。</p>),
          st(3, '③ 答え', null,
            '(5) に入る英語は？', ['stop inviting foreign visitors', 'only talk about Tokyo and Kyoto', 'show visitors the everyday life of the people here', 'close the hot springs to visitors', 'tell visitors that farm work is not special'], 'show visitors the everyday life of the people here',
            <p>So I think our town should show visitors the everyday life of the people here. 農作業は「観光客には特別」とあるので、最後の選択肢は逆です。ほかも本文の流れと合いません。</p>),
        ],
      },
    ],
  },

  r5: {
    id: 'r5',
    title: '英語 大問5 類題5：部活動の人気調べとボランティア',
    subs: [
      {
        id: '1', title: '(1) 空所に入る3語（疑問文）', knowledge: ['What do you do ...?', '現在形の疑問文'],
        originalText: orig(r5Intro, <>(1)　本文中の <B n={1} /> に入る適切な英語3語を選びなさい。</>),
        steps: [
          st(1, '① 答えの文を見る', <p>マイは <i>We clean the park near our school every month.</i> と答えています。</p>,
            'トムがたずねたのは？', ['ボランティア部で何をしているか', 'ボランティア部の部員数', 'ボランティア部に入った理由'], 'ボランティア部で何をしているか',
            <p>公園の掃除や老人ホームの訪問など、活動内容を答えています。「何をするか」は What ... do でたずねます。</p>),
          st(2, '② 時制と主語', <p>答えは every month をともなう現在形 clean です。トムはマイ（you）にたずねています。</p>,
            'What のあとの形は？', ['do you do', 'did you do', 'does you do'], 'do you do',
            <p>現在の習慣なので do、主語は you。最後の do は「する」という一般動詞です。</p>),
          st(3, '③ 答え', null,
            '(1) に入る英語3語は？', ['are you do', 'do you doing', 'did you do', 'does you do', 'do you do'], 'do you do',
            <p>What do you do in the volunteer club? 答え <i>We clean ... every month.</i> が現在形なので did は合いません。are you do、do you doing は動詞の形、does you は主語との組み合わせの誤りです。</p>),
        ],
      },
      {
        id: '2', title: '(2) 表の (A)〜(C)', knowledge: ['as many ~ as', '倍数 twice as many ~ as'],
        originalText: orig(r5Intro, <>(2)　表の (A)、(B)、(C) に入るものの組み合わせとして正しいものを選びなさい。</>),
        steps: [
          st(1, '① as many ~ as を使う', <p>マイは <i>The tennis team has as many members as the soccer team.</i> と言っています。</p>,
            'テニス部（Tennis team）にあたる空欄は？', ['(A)', '(B)', '(C)'], '(A)',
            <p>サッカー部は30人。同じ30人なのは (A) です。</p>),
          st(2, '② twice as many を使う', <p>続けて <i>the brass band has twice as many members as the art club.</i> とあります。残りは (B) 24人と (C) 12人です。</p>,
            '吹奏楽部（Brass band）と美術部（Art club）は？', ['吹奏楽部 (B)、美術部 (C)', '吹奏楽部 (C)、美術部 (B)'], '吹奏楽部 (B)、美術部 (C)',
            <p>24 は 12 の2倍なので、吹奏楽部が (B) 24人、美術部が (C) 12人です。</p>),
          st(3, '③ 答え', null,
            '(A)(B)(C) の組み合わせは？', ['(A) Brass band (B) Tennis team (C) Art club', '(A) Tennis team (B) Art club (C) Brass band', '(A) Tennis team (B) Brass band (C) Art club', '(A) Art club (B) Brass band (C) Tennis team', '(A) Brass band (B) Art club (C) Tennis team'], '(A) Tennis team (B) Brass band (C) Art club',
            <p>as many members as the soccer team で (A) テニス部、twice as many members as the art club で (B) 吹奏楽部・(C) 美術部です。twice の向きを逆に読むと (B)(C) を取り違えます。</p>),
        ],
      },
      {
        id: '3', title: '(3) 表を見て空所に入る英語', knowledge: ['最上級 the fewest'],
        originalText: orig(r5Intro, <>(3)　表を参考に、本文中の <B n={3} /> に入る適切な英語を選びなさい。</>),
        steps: [
          st(1, '① 表を読む', <p>文は The volunteer club has <B n={3} /> members of all the clubs. です。ボランティア部は8人です。</p>,
            '8人は表の中でどうなっている？', ['いちばん少ない', 'いちばん多い', '2番目に少ない'], 'いちばん少ない',
            <p>表の中で8人が最も少ない人数です。of all the clubs（全部の部の中で）も最上級の目印です。</p>),
          st(2, '② 語を選ぶ', <p>members は数えられる名詞です。数えられる名詞が「少ない」は few、その最上級は fewest です。</p>,
            '使う語は？', ['few の最上級', 'little の最上級', 'few の比較級'], 'few の最上級',
            <p>数えられる名詞には few を使います。of all があるので比較級ではなく最上級です。</p>),
          st(3, '③ 答え', null,
            '(3) に入る英語は？', ['the fewer', 'fewest the', 'the fewest', 'the most few', 'the less'], 'the fewest',
            <p>The volunteer club has the fewest members of all the clubs. the fewer は比較級、fewest the は語順、the most few は誤った形、less は数えられない名詞に使う語の比較級です。</p>),
        ],
      },
      {
        id: '4', title: '(4) 下線部 it の内容', knowledge: ['指示語 it'],
        originalText: orig(r5Intro, <>(4)　下線部の it が指す内容として最も適切なものを選びなさい。</>),
        steps: [
          st(1, '① 直前の発言', <p>マイの <i>Twenty hours? Did you like it?</i> は、直前のトムの発言を受けています。</p>,
            'トムが直前に話したことは？', ['オーストラリアの学校では年に20時間ボランティア活動をしなければならなかったこと', 'サッカー部が人気であること', 'フードバンクで男性に会ったこと'], 'オーストラリアの学校では年に20時間ボランティア活動をしなければならなかったこと',
            <p><i>every student had to do volunteer work for twenty hours a year.</i> です。フードバンクの話はこのあとです。</p>),
          st(2, '② トムの答えで確かめる', <p>トムは <i>At first, I didn&apos;t.</i> と答え、そのあと楽しめるようになった話をします。</p>,
            'トムが最初は好きではなかったのは？', ['ボランティア活動をすること', 'マイの部活動', 'オーストラリアの学校'], 'ボランティア活動をすること',
            <p>最後に <i>I started to enjoy volunteer work.</i> とあるので、話題はボランティア活動です。</p>),
          st(3, '③ 答え', null,
            'it が指す内容は？', ['マイが老人ホームで歌を歌うこと', '1年に20時間、ボランティア活動をすること', 'オーストラリアの学校に通うこと', 'フードバンクで男性にお礼を言われたこと', '1年に20時間、部活動をすること'], '1年に20時間、ボランティア活動をすること',
            <p>根拠は <i>every student had to do volunteer work for twenty hours a year.</i> マイが Twenty hours? と聞き返していることからも、20時間のボランティア活動を指すとわかります。</p>),
        ],
      },
      {
        id: '5', title: '(5) 最後の空所', knowledge: ['対話の要旨'],
        originalText: orig(r5Intro, <>(5)　本文中の <B n={5} /> に入る英語として最も適切なものを選びなさい。</>),
        steps: [
          st(1, '① 部員が少ない理由', <p>トム <i>Many students may think volunteer work is hard or boring.</i> マイ <i>That&apos;s why our club has so few members.</i></p>,
            '部員が少ない理由は？', ['ボランティアは大変でつまらないと思われているから', '練習がないから', '部員が多すぎるから'], 'ボランティアは大変でつまらないと思われているから',
            <p>多くの生徒がボランティアを hard or boring だと思っている、と2人は考えています。</p>),
          st(2, '② 2人の体験', <p>トムは男性の笑顔を見て楽しめるようになり、マイも老人ホームの人が笑うとうれしいと言いました。</p>,
            '2人の体験からわかることは？', ['ボランティアは相手も自分も笑顔にする', 'ボランティアはやはりつまらない', 'ボランティアは一人でするべきだ'], 'ボランティアは相手も自分も笑顔にする',
            <p><i>an old man said &quot;Thank you&quot; to me with a big smile</i> と <i>When people at the nursing home smile, I feel happy, too.</i> が根拠です。</p>),
          st(3, '③ 答え', null,
            '(5) に入る英語は？', ['volunteer work is always hard and boring', 'the soccer team needs more members', 'volunteer work can make both us and others happy', 'students in Australia do not do volunteer work', 'our club cleans the park only once a year'], 'volunteer work can make both us and others happy',
            <p>I want more students to know that volunteer work can make both us and others happy. 「大変でつまらない」は誤解を広める内容、オーストラリアでは20時間していた、公園の掃除は毎月、なので他は誤りです。</p>),
        ],
      },
    ],
  },

  r6: {
    id: 'r6',
    title: '英語 大問5 類題6：給食の食品ロスと海外の取り組み',
    subs: [
      {
        id: '1', title: '(1) 空所に入る3語（疑問文）', knowledge: ['How much ＋ 数えられない名詞'],
        originalText: orig(r6Intro, <>(1)　本文中の <B n={1} /> に入る適切な英語3語を選びなさい。</>),
        steps: [
          st(1, '① 答えの文を見る', <p>ケンは <i>We left 51 kilograms in one week.</i> と答えています。</p>,
            'ケンが答えているのは？', ['残した食べ物の量', '残した日', '残した理由'], '残した食べ物の量',
            <p>51 kilograms（51キログラム）は量です。</p>),
          st(2, '② many か much か', <p>food（食べ物）は数えられない名詞として使っています。</p>,
            '量をたずねる疑問詞は？', ['How much food', 'How many food', 'How many foods'], 'How much food',
            <p>数えられない名詞の量は How much ＋ 名詞 でたずねます。many は数えられる名詞の複数形に使います。</p>),
          st(3, '③ 答え', <p>空所のあとに did your class leave と疑問文の語順が続くことも確認します。</p>,
            '(1) に入る英語3語は？', ['How many food', 'How much foods', 'How much food', 'How food much', 'What much food'], 'How much food',
            <p>How much food did your class leave last week? 答えが <i>51 kilograms</i> と量なので How much。food は数えられない名詞なので many や foods は誤り、How food much は語順の誤りです。</p>),
        ],
      },
      {
        id: '2', title: '(2) グラフの (A)〜(C)', knowledge: ['最上級 the most', 'as much ~ as'],
        originalText: orig(r6Intro, <>(2)　図の (A)、(B)、(C) に入るものの組み合わせとして正しいものを選びなさい。</>),
        steps: [
          st(1, '① the most を使う', <p>ケンは <i>We left the most vegetables</i> と言っています。</p>,
            '野菜（Vegetables）にあたる空欄は？', ['(A)', '(B)', '(C)'], '(A)',
            <p>いちばん多いのは (A) 18kg です。</p>),
          st(2, '② as much ~ as を使う', <p>続けて <i>we left as much soup as meat.</i> とあります。肉（Meat）は 6kg です。</p>,
            'スープ（Soup）にあたる空欄は？', ['(C)', '(B)'], '(C)',
            <p>肉と同じ 6kg なのは (C)。残る (B) 12kg が魚（Fish）です。</p>),
          st(3, '③ 答え', null,
            '(A)(B)(C) の組み合わせは？', ['(A) Fish (B) Vegetables (C) Soup', '(A) Vegetables (B) Soup (C) Fish', '(A) Soup (B) Fish (C) Vegetables', '(A) Vegetables (B) Fish (C) Soup', '(A) Fish (B) Soup (C) Vegetables'], '(A) Vegetables (B) Fish (C) Soup',
            <p>the most vegetables で (A) 野菜、as much soup as meat で (C) スープ、残りの (B) が魚です。合計 9＋18＋12＋6＋6＝51kg で、ケンの答えとも一致します。</p>),
        ],
      },
      {
        id: '3', title: '(3) 図を見て空所に入る英語', knowledge: ['倍数表現 twice as ~ as'],
        originalText: orig(r6Intro, <>(3)　図を参考に、本文中の <B n={3} /> に入る適切な英語を選びなさい。</>),
        steps: [
          st(1, '① 図の量を読む', <p>文は The amount of vegetables we left was <B n={3} /> that of rice. です。that は the amount を指します。</p>,
            '野菜とご飯の量は？', ['野菜 18kg、ご飯 9kg', '野菜 12kg、ご飯 9kg', '野菜 9kg、ご飯 18kg'], '野菜 18kg、ご飯 9kg',
            <p>(2)より (A) 野菜は 18kg、Rice は 9kg です。</p>),
          st(2, '② 何倍か、どの形容詞か', <p>18 ÷ 9 ＝ 2 で2倍。主語は the amount（量）なので、「量が多い」は large で表します。</p>,
            '使う語は？', ['twice と large', 'twice と many', 'half と large'], 'twice と large',
            <p>amount の大きさは large / small で表します。many は数えられる名詞の数に使う語です。</p>),
          st(3, '③ 答え', null,
            '(3) に入る英語は？', ['twice as larger as', 'as twice large as', 'twice as large as', 'twice large as', 'twice as many as'], 'twice as large as',
            <p>The amount of vegetables we left was twice as large as that of rice. as と as の間は原級なので larger は誤り、twice は as の前、twice large as は前の as が欠けています。amount に many は使いません。</p>),
        ],
      },
      {
        id: '4', title: '(4) 下線部 that の内容', knowledge: ['指示語 that'],
        originalText: orig(r6Intro, <>(4)　下線部の that が指す内容として最も適切なものを選びなさい。</>),
        steps: [
          st(1, '① 同じ文の中を見る', <p>下線部を含む文の前で、ケンは <i>If students serve themselves, they won&apos;t leave much food.</i> と言っています。</p>,
            'ケンが学校でもできると考えたことは？', ['生徒が自分で盛りつけること', '小盛りか大盛りかを選ぶこと', 'すべての皿に同じ量を盛ること'], '生徒が自分で盛りつけること',
            <p>serve themselves（自分で盛りつける）が直前の内容です。</p>),
          st(2, '② どの国の話か', <p>マルタン先生は2つの例を紹介しました。フランスは小盛り・大盛りを選ぶ、フィンランドは生徒が自分で盛りつける、です。</p>,
            'ケンが取り入れたいのはどちらの例？', ['フィンランドの例', 'フランスの例'], 'フィンランドの例',
            <p><i>There, students serve lunch by themselves, so they take only the amount they can eat.</i> はフィンランドの話で、ケンの serve themselves と一致します。</p>),
          st(3, '③ 答え', null,
            'that が指す内容は？', ['生徒が小盛りか大盛りかを選ぶこと', 'すべての皿に同じ量の食べ物を盛ること', '生徒が自分で、食べられる量だけ盛りつけること', '残した給食の量をはかること', '農家の人に感謝の手紙を書くこと'], '生徒が自分で、食べられる量だけ盛りつけること',
            <p>根拠は <i>If students serve themselves, they won&apos;t leave much food.</i> と、フィンランドの <i>they take only the amount they can eat</i>。小盛り・大盛りはフランスの例で、ケンが that の直前で話した内容ではありません。</p>),
        ],
      },
      {
        id: '5', title: '(5) 最後の空所', knowledge: ['対話の要旨'],
        originalText: orig(r6Intro, <>(5)　本文中の <B n={5} /> に入る英語として最も適切なものを選びなさい。</>),
        steps: [
          st(1, '① ケンの提案', <p>ケンは <i>I think we can do that in our school, too.</i> と言っていました。that は (4) で確かめた内容です。</p>,
            'ケンが学校でやりたいことは？', ['生徒が自分で盛りつける', '同じ量を盛る', '野菜を減らす'], '生徒が自分で盛りつける',
            <p>(4) の答え「生徒が自分で、食べられる量だけ盛りつけること」です。</p>),
          st(2, '② 文の形', <p>最後の文は I&apos;ll ask my teacher if students can <B n={5} />.（生徒が〜できるか先生に聞く）。can のあとは動詞の原形です。</p>,
            '空所の形は？', ['動詞の原形から始まる', '動詞の過去形から始まる', '名詞だけ'], '動詞の原形から始まる',
            <p>助動詞 can のあとなので原形から始まる語句が入ります。</p>),
          st(3, '③ 答え', null,
            '(5) に入る英語は？', ['leave more vegetables', 'serve their own lunch', 'eat lunch in France', 'put the same amount on every plate', 'grow vegetables in Finland'], 'serve their own lunch',
            <p>I&apos;ll ask my teacher if students can serve their own lunch. 同じ量を盛るのは今の学校のやり方で、ケンが変えたい点です。ほかは本文の提案と関係がありません。</p>),
        ],
      },
    ],
  },
};
