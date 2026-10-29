import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Sub = { id: string; title: string };

/** 小問ページ下部の「前の問題／次の問題」 */
export function SubNav({ base, subs, current }: { base: string; subs: Sub[]; current: string }) {
  const i = subs.findIndex((s) => s.id === current);
  const prev = subs[i - 1];
  const next = subs[i + 1];
  const cls = 'flex-1 flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 hover:border-emerald-400';
  return (
    <nav className="flex gap-3 pt-6">
      {prev ? (
        <Link href={`${base}/${prev.id}`} className={cls}>
          <ChevronLeft className="w-5 h-5 shrink-0 text-emerald-500" />
          <span className="min-w-0 truncate">前：{prev.title}</span>
        </Link>
      ) : <div className="flex-1" />}
      {next ? (
        <Link href={`${base}/${next.id}`} className={`${cls} justify-end text-right`}>
          <span className="min-w-0 truncate">次：{next.title}</span>
          <ChevronRight className="w-5 h-5 shrink-0 text-emerald-500" />
        </Link>
      ) : (
        <Link href={base} className={`${cls} justify-end`}>大問の一覧へ戻る<ChevronRight className="w-5 h-5 shrink-0 text-emerald-500" /></Link>
      )}
    </nav>
  );
}
