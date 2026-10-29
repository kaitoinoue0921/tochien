import Link from 'next/link';
import type { ReactNode } from 'react';
import { BookOpen, GraduationCap, Calculator, Shapes, BarChart2, Beaker, Users } from 'lucide-react';
import { ClearedCount, ProgressPill } from '@/components/Progress';
import { eigoData } from '@/data/eigo';

type Card = {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
  color: string;
  progress?: { prefix: string; total: number };
};

type Theme = { card: string; icon: string };

// Tailwindは完全なクラス名しか拾えないので、テーマは文字列リテラルで持つ
const themes: Record<string, Theme> = {
  indigo: { card: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 dark:hover:border-indigo-500', icon: 'text-indigo-500 dark:text-indigo-400' },
  teal: { card: 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800 hover:border-teal-400 dark:hover:border-teal-500', icon: 'text-teal-500 dark:text-teal-400' },
  rose: { card: 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 hover:border-rose-400 dark:hover:border-rose-500', icon: 'text-rose-500 dark:text-rose-400' },
  amber: { card: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 hover:border-amber-400 dark:hover:border-amber-500', icon: 'text-amber-500 dark:text-amber-400' },
  pink: { card: 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800 hover:border-pink-400 dark:hover:border-pink-500', icon: 'text-pink-500 dark:text-pink-400' },
  cyan: { card: 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800 hover:border-cyan-400 dark:hover:border-cyan-500', icon: 'text-cyan-500 dark:text-cyan-400' },
  sky: { card: 'bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800 hover:border-sky-400 dark:hover:border-sky-500', icon: 'text-sky-500 dark:text-sky-400' },
  orange: { card: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 hover:border-orange-400 dark:hover:border-orange-500', icon: 'text-orange-500 dark:text-orange-400' },
  emerald: { card: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-500', icon: 'text-emerald-500 dark:text-emerald-400' },
};

function card(
  year: string,
  q: string,
  data: Record<string, { subs: unknown[] }>,
  theme: keyof typeof themes,
  title: string,
  description: string,
  icon: (cls: string) => ReactNode = (cls) => <BookOpen className={`w-8 h-8 ${cls}`} />,
): Card {
  const total = data[q]?.subs.length ?? 0;
  return {
    title,
    description,
    href: `/${year}/${q}`,
    icon: icon(themes[theme].icon),
    color: themes[theme].card,
    progress: { prefix: `${year}/${q}`, total },
  };
}

function eigoCards(prefix: string, theme: keyof typeof themes): Card[] {
  const d = eigoData as Record<string, { title: string; subs: { title: string }[] }>;
  return Object.keys(d)
    .filter((k) => k.startsWith(prefix))
    .map((k) => card('eigo', k, eigoData, theme, d[k].title, d[k].subs.map((x) => x.title.replace(/^問\d\S*\s*/, '')).join('、'), (c) => <BookOpen className={`w-8 h-8 ${c}`} />));
}

const sections: { title: string; label?: string; border: string; cards: Card[] }[] = [
  {
    title: '英語 実力テスト 大問5（対話文とグラフを読む）',
    label: '英語 実力テスト',
    border: 'border-sky-500',
    cards: eigoCards('k', 'sky'),
  },
  {
    title: '英語 類題（対話文とグラフ・図を読む）',
    label: '英語 類題',
    border: 'border-sky-500',
    cards: eigoCards('r', 'cyan'),
  },
];
function qNum(href: string) {
  return Number(href.match(/(\d+)$/)?.[1] ?? 0);
}

// 「令和7年 大問1：基本の小問集合」→「基本の小問集合」
function shortTitle(title: string) {
  return title.replace(/^.*?大問\d+\s*[：:（(]?\s*/, '').replace(/[）)]$/, '');
}

function yearLabel(title: string) {
  return title.match(/^令和\d+年度/)?.[0] ?? title;
}

function ProblemCard({ prob }: { prob: Card }) {
  return (
    <Link href={prob.href} className="block group">
      <div className="flex gap-4 items-start bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 h-full shadow-sm transition-all group-hover:border-emerald-400 group-hover:shadow-md">
        <div className="shrink-0 w-14 text-center">
          <div className="text-[11px] font-bold text-slate-400 leading-none">大問</div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 leading-tight">{qNum(prob.href)}</div>
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-300">{shortTitle(prob.title)}</h4>
          {prob.description && <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mt-1 line-clamp-2">{prob.description}</p>}
          {prob.progress && (
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
              <span>全{prob.progress.total}問</span>
              <ProgressPill prefix={prob.progress.prefix} total={prob.progress.total} />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="space-y-10 pb-12">
      <section className="text-center space-y-4 bg-white dark:bg-slate-800 px-5 py-7 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 leading-snug">
          栃木県立高校入試 英語を<br className="sm:hidden" />1ステップずつ解く
        </h2>
        <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
          対話文とグラフを読む問題で、あと数点上げたい栃木の中学生のための特訓サイトです。
          大問を選び、小問を1つずつ解いていきます。
        </p>
        <p className="inline-block bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 px-3 py-1.5 rounded-lg text-sm font-bold">
          ⚠️ 適当に押すと罵倒されます。計算用紙を用意して挑むこと
        </p>
        <div className="flex flex-wrap justify-center items-center gap-3">
          <ClearedCount />
          <a
            href="https://kaitoinoue0921.github.io/tochimasu/"
            className="inline-flex items-center gap-2 text-sm bg-white dark:bg-slate-800 hover:border-indigo-400 border border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 font-bold py-2.5 px-5 rounded-full shadow-sm"
          >
            <GraduationCap className="w-4 h-4 shrink-0" />
            数学版 とちます！
          </a>
        </div>
      </section>

      <nav className="sticky top-[52px] z-30 -mx-4 px-4 py-2 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-2 overflow-x-auto">
          {sections.map((sec, i) => (
            <a
              key={sec.title}
              href={`#y${i}`}
              className="shrink-0 text-sm font-bold px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-400 hover:text-emerald-700"
            >
              {sec.label ?? yearLabel(sec.title)}
            </a>
          ))}
        </div>
      </nav>

      {sections.map((sec, i) => (
        <section key={sec.title} id={`y${i}`}>
          <h3 className={`text-xl font-bold text-slate-800 dark:text-slate-100 border-l-4 ${sec.border} pl-3 mb-4`}>
            {sec.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[...sec.cards].sort((a, b) => qNum(a.href) - qNum(b.href)).map((prob) => (
              <ProblemCard key={prob.href} prob={prob} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
