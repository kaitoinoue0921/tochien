import { eigoData } from '@/data/eigo';
import Client from './Client';

export function generateStaticParams() {
  return Object.entries(eigoData).flatMap(([questionId, q]) =>
    q.subs.map((s) => ({ questionId, subId: s.id }))
  );
}

export default function Page({ params }: { params: Promise<{ questionId: string; subId: string }> }) {
  return <Client params={params} />;
}
