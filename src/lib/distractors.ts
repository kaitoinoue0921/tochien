// 選択肢を毎回作り直す。
// 正解が「数値＋単位」の形なら、その数値をずらした誤答をその場で作り、
// 元から用意してある誤答（よくある間違い）と混ぜてランダムに選ぶ。
// 数値でない答えは元の選択肢を並び替えるだけ。

const UNIT = '(?:cm³|cm²|cm|km|m|°|度|通り|人|枚|倍|個|円|本|分|秒|回|点|kg|g|mL|L|%|番目|日|時間|歳|週|冊|台|匹|問)?';
const NUM_RE = new RegExp(`^([−-]?)(\\d+(?:\\.\\d+)?)(?:\\/(\\d+))?((?:√\\d+)?(?:\\/\\d+)?\\s*π?\\s*${UNIT})$`);

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fmt(v: number, decimals: number) {
  return decimals > 0 ? v.toFixed(decimals) : String(Math.round(v));
}

/** 正解の数値をずらした誤答の候補。数値の形でなければ空配列 */
export function numericVariants(correct: string, minus: string): string[] {
  const m = correct.trim().match(NUM_RE);
  if (!m) return [];
  const [, sign, numStr, den, rest] = m;
  const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;
  const step = Math.pow(10, -decimals);
  const n = parseFloat(numStr) * (sign ? -1 : 1);
  const out = new Set<string>();

  // 単位・π・√つきの正の答えに負の誤答を出すと一目でばれるので出さない
  const allowNegative = n < 0 || rest.trim() === '';
  // 128√3/3 のような形は分子を分母の倍数でずらす（約分前の形を作らない）
  const restDen = rest.match(/\/(\d+)/);
  const stepMul = restDen ? parseInt(restDen[1], 10) : 1;
  const gcd = (x: number, y: number): number => (y === 0 ? Math.abs(x) : gcd(y, x % y));

  const build = (val: number, d?: string) => {
    if (val === 0 && (d || rest.trim())) return; // 0/3 や 0π は作らない
    if (val < 0 && !allowNegative) return;
    if (d === '1') d = undefined;
    if (d && decimals === 0 && gcd(Math.round(val), parseInt(d, 10)) > 1) return; // 2/4 などは出さない
    if (restDen && decimals === 0 && gcd(Math.round(val), stepMul) > 1 && gcd(Math.round(n), stepMul) === 1) return;
    const s = (val < 0 ? minus : '') + fmt(Math.abs(val), decimals) + (d ? `/${d}` : '') + rest;
    if (s !== correct.trim()) out.add(s);
  };

  const st = step * stepMul;
  // 近い値は片側に寄せて取る（±1,±2だと正解が真ん中に来て当てられる）
  const near = shuffled([1, 2, 3, -1, -2, -3]).slice(0, 4);
  const typical = [n * 2]; // よくある間違い: 2倍・半分・符号
  if (Number.isInteger(n) && n % 2 === 0) typical.push(n / 2);
  if (n !== 0) typical.push(-n);
  if (Number.isInteger(n) && Math.abs(n) >= 20) typical.push(n + 10, n - 10);
  const vals = [...near.map((k) => n + k * st), ...shuffled(typical)];
  for (const v of vals) build(Math.round(v / step) * step, den);

  if (den) {
    const d = parseInt(den, 10);
    for (const nd of shuffled([d + 1, d - 1, d * 2])) if (nd >= 2) build(n, String(nd));
    build(parseInt(den, 10) * (n < 0 ? -1 : 1), numStr); // 分母分子の逆
  }
  return [...out];
}

const JP = /[ぁ-んァ-ヶ一-龠]/g;
const SQUARES = new Set([0, 1, 4, 9, 16, 25, 36, 49, 64, 81, 100]);

/** 式・座標などの答えから、数字を1か所だけ変えた／符号を1か所だけ変えた「まちがい探し」の誤答を作る */
export function textVariants(correct: string, minus: string): string[] {
  const c = correct.trim();
  if ((c.match(JP) || []).length > 4) return []; // 文章の答えは触らない
  const out = new Set<string>();
  const add = (s: string) => {
    if (s === c || s.includes('NaN')) return;
    if (/(^|[^\d.])0\/\d/.test(s) || /(^|[^\d.])(\d+)\/\2(?!\d)/.test(s)) return; // 0/2 や 2/2 は出さない
    out.add(s);
  };

  for (const m of c.matchAll(/\d+(?:\.\d+)?/g)) {
    const i = m.index!, numStr = m[0];
    const prev = c[i - 1] ?? '', next = c[i + numStr.length] ?? '';
    if (prev === '.' || next === '.') continue;
    const n = parseFloat(numStr);
    if ([90, 180, 360].includes(n)) continue;
    const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;
    const step = Math.pow(10, -decimals);
    const cands = [n + step, n - step];
    if (n >= 2 && decimals === 0) cands.push(n * 2);
    for (const v of cands) {
      const r = Math.round(v / step) * step;
      if (r < 0) continue;
      if (r === 0 && (prev === '/' || /[a-zA-Zπ√(]/.test(next))) continue; // 0x や /0 は作らない
      if (r === 1 && /[a-zA-Zπ(√]/.test(next) && !/\d/.test(prev)) continue; // 1x という書き方はしない
      if (prev === '√' && SQUARES.has(r)) continue;
      add(c.slice(0, i) + fmt(r, decimals) + c.slice(i + numStr.length));
    }
  }
  // 符号を1か所だけ反転
  for (const m of c.matchAll(/ ([+−-]) /g)) {
    const flip = m[1] === '+' ? minus : '+';
    add(c.slice(0, m.index!) + ` ${flip} ` + c.slice(m.index! + 3));
  }
  for (const m of c.matchAll(/(^|[(,=\s])([−-])(?=\d)/g)) {
    const at = m.index! + m[1].length;
    add(c.slice(0, at) + c.slice(at + 1));
  }
  return [...out];
}

/** 毎回ちがう選択肢を返す。数値の答えは6択、式・座標などは4択、文章は元の選択肢のまま（正解は必ず含む） */
export function buildOptions(options: string[], correct: string): string[] {
  const authored = options.filter((o) => o !== correct);
  const minus = [correct, ...options].some((o) => o.includes('-')) ? '-' : '−';
  const notAuthored = (g: string) => !options.includes(g);

  let generated = shuffled(numericVariants(correct, minus).filter(notAuthored));
  let total = 6;
  if (generated.length === 0) {
    generated = shuffled(textVariants(correct, minus).filter(notAuthored));
    total = 4;
  }
  if (generated.length === 0) return shuffled(options);

  // 本に載っている「よくある間違い」は全部残し、足りない分を作った誤答で埋める
  const picked = [...authored, ...generated].slice(0, Math.max(total - 1, authored.length));
  return shuffled([correct, ...picked]);
}
