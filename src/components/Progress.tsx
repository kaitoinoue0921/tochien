'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export const PROGRESS_KEY = 'tochien_completed';

function readKeys(): string[] {
  try {
    return Object.keys(JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}'));
  } catch {
    return [];
  }
}

function useCompletedKeys() {
  const [keys, setKeys] = useState<string[]>([]);
  useEffect(() => setKeys(readKeys()), []);
  return keys;
}

/** 小問1つ分のクリア済みバッジ */
export function ClearBadge({ id }: { id: string }) {
  const keys = useCompletedKeys();
  if (!keys.includes(id)) return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-emerald-500 px-2 py-0.5 rounded-full">
      <CheckCircle2 className="w-3 h-3" />
      クリア済
    </span>
  );
}

/** 大問ごとの「n / m クリア」表示。prefix は "r7/q1" のような形式 */
export function ProgressPill({ prefix, total }: { prefix: string; total: number }) {
  const keys = useCompletedKeys();
  const done = keys.filter((k) => k.startsWith(prefix + '/')).length;
  if (done === 0) return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-700 px-2 py-0.5 rounded-full">
      <CheckCircle2 className="w-3 h-3" />
      {Math.min(done, total)} / {total} クリア
    </span>
  );
}

/** トップ用: これまでにクリアした問題の合計 */
export function ClearedCount() {
  const keys = useCompletedKeys();
  if (keys.length === 0) return null;
  return (
    <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 px-4 py-2 rounded-full text-sm font-bold">
      🏆 これまでにクリアした問題：{keys.length} 問
    </div>
  );
}
