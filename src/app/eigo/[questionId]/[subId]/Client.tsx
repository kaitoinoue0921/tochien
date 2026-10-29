'use client';

import React from 'react';
import { eigoData } from '@/data/eigo';
import { notFound } from 'next/navigation';
import { StepLayout } from '@/components/StepLayout';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { SubNav } from '@/components/SubNav';

export default function R5SubQuestionPage({ params }: { params: Promise<{ questionId: string, subId: string }> }) {
  const resolvedParams = React.use(params);
  const data = eigoData[resolvedParams.questionId];
  if (!data) return notFound();

  const sub = data.subs.find(s => s.id === resolvedParams.subId);
  if (!sub) return notFound();

  return (
    <div className="space-y-4">
      <Link href={`/eigo/${resolvedParams.questionId}`} className="inline-flex items-center gap-1 text-slate-500 hover:text-emerald-500 font-medium transition-colors mb-4">
        <ChevronLeft className="w-5 h-5" />
        {data.title} の問題一覧に戻る
      </Link>
      
      <StepLayout
        title={sub.title}
        progressKey={`eigo/${resolvedParams.questionId}/${resolvedParams.subId}`}
        knowledge={sub.knowledge}
        questionText={
          <div className="space-y-4 text-sm leading-relaxed border-2 border-slate-300 dark:border-slate-600 p-6 rounded-xl bg-white dark:bg-slate-900 shadow-inner">
            <h3 className="font-bold border-b border-slate-300 pb-2 mb-4 text-slate-800 dark:text-slate-100">【元の問題文】</h3>
            {sub.originalText}
          </div>
        }
        steps={sub.steps}
      />
      <SubNav base={`/eigo/${resolvedParams.questionId}`} subs={data.subs} current={sub.id} />
    </div>
  );
}
