import { eigoData } from '@/data/eigo';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ClearBadge } from '@/components/Progress';
import { Book, ChevronLeft } from 'lucide-react';

export function generateStaticParams() {
  return Object.keys(eigoData).map((questionId) => ({ questionId }));
}

export default async function EigoQuestionMenu({ params }: { params: Promise<{ questionId: string }> }) {
  const resolvedParams = await params;
  const data = eigoData[resolvedParams.questionId];
  if (!data) return notFound();

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center gap-4 border-b-2 border-emerald-500 pb-4">
        <Link href="/" className="text-slate-500 hover:text-emerald-500 transition-colors">
          <ChevronLeft className="w-8 h-8" />
        </Link>
        <Book className="w-8 h-8 text-emerald-500" />
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          {data.title}
        </h2>
      </div>

      <p className="text-slate-600 dark:text-slate-300">
        解きたい小問を選んでください。1問ずつサクッと挑戦できます！
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.subs.map(sub => (
          <Link href={`/eigo/${resolvedParams.questionId}/${sub.id}`} key={sub.id} className="block group">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-md group-hover:border-emerald-400">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {sub.title}
              </h3>
              <div className="mb-2"><ClearBadge id={`eigo/${resolvedParams.questionId}/${sub.id}`} /></div>
              
              {sub.knowledge.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {sub.knowledge.map((k, i) => (
                    <span key={i} className="text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/50">
                      {k}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
