'use client';

import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface MathTextProps {
  math: string;
  block?: boolean;
}

export function MathText({ math, block = false }: MathTextProps) {
  if (block) {
    return (
      <div className="my-4 overflow-x-auto overflow-y-hidden max-w-full pb-2 scrollbar-hide">
        <BlockMath math={math} />
      </div>
    );
  }
  return <InlineMath math={math} />;
}

// 簡易的に文章内に数式を埋め込むためのコンポーネント
// 例: <TextWithMath text="関数 $y=ax^2$ について" />
export function TextWithMath({ text }: { text: string }) {
  // $ で囲まれた部分を数式として扱う簡易パーサー
  const parts = text.split(/(\$.*?\$)/g);
  
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          const math = part.slice(1, -1);
          return <InlineMath key={i} math={math} />;
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
