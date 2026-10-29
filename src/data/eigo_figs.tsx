import React from 'react';

// 英語の図。白背景固定。
const t = 'text-[11px] font-bold';
function Wrap({ children, caption }: { children: React.ReactNode; caption?: string }) {
  return (
    <div className="my-3 flex flex-col items-center">
      <div className="bg-white rounded-lg p-2">{children}</div>
      {caption && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-center">{caption}</p>}
    </div>
  );
}

/** 棒グラフ。bars の label は棒の下、value は棒の上（人）。 */
export function BarChartFig({ title, bars, unit = '人', yMax = 15, caption }: { title: string; bars: { label: string; value: number }[]; unit?: string; yMax?: number; caption?: string }) {
  const W = 340, H = 220, L = 34, B = 40, T = 34;
  const bw = (W - L - 14) / bars.length;
  const Y = (v: number) => H - B - ((H - B - T) * v) / yMax;
  return (
    <Wrap caption={caption}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-80 h-auto">
        <text x={W / 2} y="16" textAnchor="middle" className={t} fill="#0f172a">{title}</text>
        {[0, 5, 10, 15].filter((v) => v <= yMax).map((v) => (
          <g key={v}>
            <line x1={L} y1={Y(v)} x2={W - 8} y2={Y(v)} stroke="#cbd5e1" />
            <text x={L - 4} y={Y(v) + 4} textAnchor="end" className={t} fill="#334155">{v}</text>
          </g>
        ))}
        {bars.map((b, i) => (
          <g key={i}>
            <rect x={L + i * bw + bw * 0.18} y={Y(b.value)} width={bw * 0.64} height={Y(0) - Y(b.value)} fill="#64748b" />
            <text x={L + i * bw + bw / 2} y={Y(b.value) - 4} textAnchor="middle" className={t} fill="#0f172a">{b.value}{unit}</text>
            <rect x={L + i * bw + 3} y={H - B + 6} width={bw - 6} height="20" fill="#fff" stroke="#334155" />
            <text x={L + i * bw + bw / 2} y={H - B + 20} textAnchor="middle" className={t} fill="#0f172a">{b.label}</text>
          </g>
        ))}
      </svg>
    </Wrap>
  );
}

/** コンビニ弁当・新商品などを四季で示す簡易図（図2） */
export function SeasonsFig() {
  const seasons = ['春', '夏', '秋', '冬'];
  return (
    <Wrap caption="図2（さおりがコンビニで、季節ごとに新発売のスイーツを見つける）">
      <svg viewBox="0 0 340 130" className="w-80 h-auto">
        {seasons.map((s, i) => (
          <g key={s}>
            <rect x={10 + i * 80} y="8" width="76" height="70" fill="#f8fafc" stroke="#334155" />
            <text x={48 + i * 80} y="24" textAnchor="middle" className={t} fill="#0f172a">{s}</text>
            <circle cx={48 + i * 80} cy="48" r="12" fill="#fde68a" stroke="#92400e" />
            <rect x={20 + i * 80} y="62" width="56" height="12" fill="#1e293b" />
            <text x={48 + i * 80} y="72" textAnchor="middle" className="text-[9px] font-bold" fill="#fff">新発売</text>
          </g>
        ))}
        <rect x="10" y="92" width="60" height="30" fill="#e2e8f0" stroke="#334155" />
        <text x="40" y="111" textAnchor="middle" className={t} fill="#0f172a">コンビニ</text>
        <circle cx="120" cy="104" r="6" fill="#64748b" />
        <line x1="120" y1="110" x2="120" y2="124" stroke="#64748b" strokeWidth="3" />
        <text x="134" y="112" className={t} fill="#0f172a">さおり（Saori）</text>
        <line x1="95" y1="98" x2="72" y2="62" stroke="#0f172a" />
      </svg>
    </Wrap>
  );
}

/** 図3：お弁当の配達と、おばあさんの家の近くの店 */
export function ElderlyFig() {
  return (
    <Wrap caption="図3（左：お弁当の配達　右：おばあさんの家の近くの店）">
      <svg viewBox="0 0 340 170" className="w-80 h-auto">
        <rect x="4" y="4" width="160" height="160" fill="#f8fafc" stroke="#334155" />
        <text x="84" y="22" textAnchor="middle" className={t} fill="#0f172a">店員がお弁当を届ける</text>
        <circle cx="52" cy="50" r="9" fill="#94a3b8" /><rect x="42" y="60" width="20" height="30" fill="#94a3b8" />
        <circle cx="112" cy="50" r="9" fill="#cbd5e1" /><rect x="102" y="60" width="20" height="30" fill="#cbd5e1" />
        <rect x="66" y="72" width="22" height="12" fill="#fde68a" stroke="#92400e" />
        <rect x="14" y="100" width="142" height="56" fill="#fff" stroke="#334155" />
        <text x="22" y="118" className="text-[10px] font-bold" fill="#0f172a">「毎日料理することができない</text>
        <text x="22" y="133" className="text-[10px] font-bold" fill="#0f172a">ので、このお弁当を食べられて</text>
        <text x="22" y="148" className="text-[10px] font-bold" fill="#0f172a">うれしいです。」</text>
        <rect x="176" y="4" width="160" height="160" fill="#f8fafc" stroke="#334155" />
        <rect x="226" y="14" width="60" height="20" fill="#fff" stroke="#334155" /><text x="256" y="28" textAnchor="middle" className="text-[10px] font-bold" fill="#0f172a">おばあさん宅</text>
        <rect x="184" y="52" width="66" height="30" fill="#fff" stroke="#334155" /><text x="217" y="70" textAnchor="middle" className="text-[10px] font-bold" fill="#0f172a">スーパー</text>
        <rect x="262" y="52" width="66" height="30" fill="#fff" stroke="#334155" /><text x="295" y="70" textAnchor="middle" className="text-[10px] font-bold" fill="#0f172a">コンビニ</text>
        <rect x="184" y="92" width="66" height="64" fill="#e2e8f0" /><text x="217" y="128" textAnchor="middle" className="text-[10px] font-bold" fill="#0f172a">カートで買い物</text>
        <rect x="262" y="92" width="66" height="64" fill="#e2e8f0" /><text x="295" y="128" textAnchor="middle" className="text-[10px] font-bold" fill="#0f172a">レジで会話</text>
      </svg>
    </Wrap>
  );
}
