'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, CheckCircle2, RotateCcw, AlertCircle, Timer, Flame, Skull } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { buildOptions } from '@/lib/distractors';

export interface StepQuiz {
  type: 'choice' | 'input';
  question: string;
  options?: string[]; // for choice
  correctAnswer: string;
  explanation: React.ReactNode;
}

export interface Step {
  id: number;
  title?: string;
  content?: React.ReactNode;
  quiz?: StepQuiz;
}

interface StepLayoutProps {
  title: string;
  knowledge?: string[];
  questionText: React.ReactNode;
  steps: Step[];
  progressKey?: string; // クリア記録のキー。未指定ならtitle
}

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function StepLayout({ title, knowledge, questionText, steps, progressKey }: StepLayoutProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepStates, setStepStates] = useState<Record<number, { 
    isCorrect: boolean; 
    selectedAnswer?: string;
    lockUntil?: number; // timestamp for penalty
    scoldingMessage?: string;
    misses?: number; // このステップで間違えた回数
  }>>({});
  // この問題を通してのミス回数（やり直しても消えない。報告に出す）
  const [totalMisses, setTotalMisses] = useState(0);
  const [resetNotice, setResetNotice] = useState(false);
  const [restartAt, setRestartAt] = useState<number | null>(null);
  // 問題文はスクロールしても上に貼りつける（固定ヘッダーの真下）
  const [headerH, setHeaderH] = useState(0);
  const [questionOpen, setQuestionOpen] = useState(true);
  useEffect(() => {
    const h = document.querySelector('header');
    if (!h) return;
    const update = () => setHeaderH(h.getBoundingClientRect().height);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(h);
    return () => ro.disconnect();
  }, []);
  const [now, setNow] = useState(Date.now());
  // 選択肢は開くたび・やり直すたびに並び替える（正解の位置を覚えて押せないように）
  // SSRとの不一致を避けるため、マウント後に並び替える
  const [optionOrder, setOptionOrder] = useState<Record<number, string[]>>({});
  const shuffleOptions = () => {
    const next: Record<number, string[]> = {};
    for (const st of steps) {
      if (st.quiz?.type === 'choice' && st.quiz.options) next[st.id] = buildOptions(st.quiz.options, st.quiz.correctAnswer);
    }
    setOptionOrder(next);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(shuffleOptions, []);

  // ロック明けにやり直し（ページ移動時はタイマーごと消える）
  useEffect(() => {
    if (restartAt === null) return;
    const t = setTimeout(() => { setRestartAt(null); restartFromTop(); }, Math.max(0, restartAt - Date.now()));
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restartAt]);

  // Timer loop for updating the penalty countdown
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(interval);
  }, []);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setStepStates({});
    setTotalMisses(0);
    setResetNotice(false);
    shuffleOptions();
  };

  // 間違えたら、この問題をSTEP 1からやり直し（消去法で進めないように）
  const restartFromTop = () => {
    setCurrentStep(0);
    setStepStates({});
    setResetNotice(true);
    shuffleOptions();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scoldingMessages = [
    "は？マジで言ってんの？猿でももう少し考えるぞ！！",
    "お前の頭は飾りか！？問題文の日本語読めないのか！！",
    "ポチポチすんな！！適当にやって受かる高校なんてねぇよ！！",
    "ふざけるな！そんなんで合格できると思ってんのか！顔洗って出直せ！！",
    "おい、鉛筆持ってるか？まさか脳内だけで解ける天才のつもりか！？",
    "適当に選んで正解して、お前の実力になるとでも思ってんのか！！",
    "その指へし折るぞ！もっと真剣に考えてからクリックしろ！！",
    "寝ぼけてんのか！？こんな問題で間違えるなんてあり得ないぞ！！",
    "お前の適当な1クリックが、入試本番での不合格の1クリックになるんだぞ！！",
    "おい！今テキトーに押しただろ！ちゃんと考えてから選べ！！",
    "直感で当たるほど入試は甘くないぞ！もう一度計算し直せ！！",
    "おい！今のクリック速度、計算式書いてないのモロバレだぞ！！",
    "適当な勘でマークシート塗って、受かる確率計算してみろ！！",
    "そんな適当な選択で人生決めていいのか！？",
    "今、目つぶって押しただろ！？真面目にやれ！！",
    "お前の直感の当たらなさは異常だ！大人しく計算しろ！！",
    "指先だけで受験を乗り切るつもりか！？シャーペンを握れ！！",
    "ゲーム感覚でやってんじゃねえぞ！お前の未来がかかってるんだぞ！！",
    "今のは完全に「どれでもいいや」の押し方だったな！見え透いてるぞ！！",
    "そんなテキトーな解答で、今までよく生きてこれたな！！",
    "おい！図形を描け！補助線を引け！頭の中だけでできるわけないだろ！！",
    "計算用紙が真っ白なのが目に浮かぶぞ！ちゃんと手を動かせ！！",
    "運に任せるな！お前の運はとっくに尽きてるぞ！！",
    "そのポチポチ、まさか『エンターテインメント』だと思ってないか！？",
    "おいおい、まさか今の間違え方で『惜しかった』とか思ってないよな！？",
    "こんなところで躓いてたら、高校の英語で爆発するぞ！！",
    "勘違いするな！今の不正解は『挑戦した証』じゃなくて『ただのサボり』だ！！",
    "「まぁいっか」で済ますな！その1問で泣く受験生を山ほど見てきたぞ！！",
    "見直ししたか！？してないよな！？だから間違えるんだよ！！",
    "お前のその『適当ボタン連打』、親が見たら泣くぞ！！"
  ];

  const handleChoiceSelect = (stepId: number, option: string, correctAnswer: string) => {
    const currentState = stepStates[stepId] || { isCorrect: false };
    
    // 既に正解している、またはペナルティ中なら何もしない
    if (currentState.isCorrect) return;
    if (currentState.lockUntil && now < currentState.lockUntil) return;

    const isCorrect = option === correctAnswer;
    
    if (isCorrect) {
      setStepStates((prev) => {
        const nextState = {
          ...prev,
          [stepId]: { isCorrect: true, selectedAnswer: option }
        };
        
        // 全ステップクリア判定とlocalStorage保存
        const isAllComplete = steps.every(s => s.id === stepId || (nextState[s.id] && nextState[s.id].isCorrect));
        if (isAllComplete) {
          try {
            const completed = JSON.parse(localStorage.getItem('tochien_completed') || '{}');
            completed[progressKey ?? title] = { date: new Date().toISOString(), misses: totalMisses };
            localStorage.setItem('tochien_completed', JSON.stringify(completed));
          } catch(e) {}
        }
        
        return nextState;
      });
    } else {
      // 不正解: 5秒のペナルティ＋罵倒。選択肢は並び替え直す。
      // ロック明けにSTEP 1からやり直し
      const misses = (currentState.misses ?? 0) + 1;
      setTotalMisses((n) => n + 1);
      const step = steps.find((s) => s.id === stepId);
      if (step?.quiz?.options) {
        setOptionOrder((prev) => ({ ...prev, [stepId]: buildOptions(step.quiz!.options!, step.quiz!.correctAnswer) }));
      }
      const randomScolding = scoldingMessages[Math.floor(Math.random() * scoldingMessages.length)] + '\nSTEP 1からやり直しだ！！';
      setStepStates((prev) => ({
        ...prev,
        [stepId]: { 
          isCorrect: false, 
          selectedAnswer: undefined, // どれを間違えたかは残さない（消去法防止）
          lockUntil: Date.now() + 5000,
          scoldingMessage: randomScolding,
          misses,
        }
      }));
      setRestartAt(Date.now() + 5000);
    }
  };

  const isAllComplete = steps.every(s => stepStates[s.id]?.isCorrect);
  const missText = totalMisses === 0 ? 'ノーミス' : `ミス${totalMisses}回`;
  const shareText = encodeURIComponent(`🔥【とちEn!】\n「${title}」の特訓をクリアしました！（${missText}）\n\n#とちマス #栃木県公立入試`);

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8 transition-colors duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 border-b-2 border-emerald-500 pb-4">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {title}
          </h2>
          <div className="flex items-center gap-3">
            <div className="text-sm font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              全 {steps.length} ステップ
            </div>
          </div>
        </div>

        {/* 進捗バー (Progress Bar) */}
        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 mb-6 overflow-hidden">
          <div 
            className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(steps.filter(s => stepStates[s.id]?.isCorrect).length / steps.length) * 100}%` }}
          ></div>
        </div>
        
        {knowledge && knowledge.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-600">
              💡 使う知識
            </span>
            {knowledge.map((k, i) => (
              <span key={i} className="text-sm font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-800">{k}</span>
            ))}
          </div>
        )}

      </div>

      <div
        className="sticky z-30 -mt-4 bg-white dark:bg-slate-800 rounded-2xl shadow-md border-2 border-emerald-500 transition-colors duration-300"
        style={{ top: headerH + 8 }}
      >
        <button
          onClick={() => setQuestionOpen((o) => !o)}
          className="w-full flex items-center justify-between px-4 py-2 text-sm font-bold text-emerald-700 dark:text-emerald-300"
        >
          <span>問題</span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{questionOpen ? 'たたむ ▲' : 'ひらく ▼'}</span>
        </button>
        {questionOpen && (
          <div className="px-4 pb-4 md:px-6 max-h-[40vh] overflow-y-auto prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-200">
            {questionText}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          1回でも間違えたら、この問題はSTEP 1からやり直し。適当に押して進むことはできない。
          {totalMisses > 0 && <span className="ml-2 font-bold text-red-600 dark:text-red-400">ここまでのミス {totalMisses}回</span>}
        </p>
        {resetNotice && currentStep === 0 && (
          <div className="p-4 rounded-xl border-2 border-red-400 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200 font-bold">
            間違えたので最初からやり直し。今度は紙に書いて考えてから選ぶこと。
          </div>
        )}
        <AnimatePresence initial={false}>
          {steps.slice(0, currentStep + 1).map((step, index) => {
            const isLatest = index === currentStep;
            const hasQuiz = !!step.quiz;
            const state = stepStates[step.id] || { isCorrect: false };
            const canProceed = !hasQuiz || state.isCorrect;
            
            const isLocked = state.lockUntil ? now < state.lockUntil : false;
            const remainingSeconds = isLocked ? Math.ceil((state.lockUntil! - now) / 1000) : 0;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`bg-white dark:bg-slate-800 rounded-2xl border-2 p-6 shadow-sm transition-colors duration-300 ${
                  isLatest ? 'border-emerald-400 dark:border-emerald-500 ring-4 ring-emerald-50 dark:ring-emerald-900/30' : 'border-slate-200 dark:border-slate-700 opacity-80'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`text-sm md:text-base px-4 py-1.5 rounded-full font-bold text-white transition-colors flex items-center justify-center whitespace-nowrap ${
                    isLatest ? 'bg-emerald-500 dark:bg-emerald-600 shadow-sm' : 'bg-slate-400 dark:bg-slate-600'
                  }`}>
                    STEP {step.id} / {steps.length}
                  </div>
                  <h3 className={`text-lg font-bold transition-colors ${isLatest ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>
                    {step.title || `ステップ ${step.id}`}
                  </h3>
                  {state.isCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-500 dark:text-emerald-400 ml-auto" />}
                </div>
                
                <div className="pl-0 sm:pl-11 text-slate-700 dark:text-slate-200 min-w-0 overflow-x-auto">
                  {step.content && <div className="mb-4">{step.content}</div>}
                  
                  {hasQuiz && (
                    <div className="mt-6 p-5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
                      <p className="font-bold text-slate-800 dark:text-slate-100 mb-4">{step.quiz!.question}</p>
                      
                      {step.quiz!.type === 'choice' && (
                        <div className={`space-y-3 relative ${isLocked ? 'min-h-[19rem] sm:min-h-[15rem]' : ''}`}>
                          {isLocked && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-red-700/95 dark:bg-red-950/95 backdrop-blur-md rounded-xl p-4 sm:p-6 text-center animate-shake shadow-[0_0_50px_rgba(220,38,38,0.8)] overflow-hidden border-4 border-red-500">
                              <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-black/40 rounded-full blur-2xl"></div>
                              
                              <div className="z-20 flex gap-4 mb-2 sm:mb-4 text-red-300 animate-pulse">
                                <Flame className="w-8 h-8 sm:w-12 sm:h-12" />
                                <Skull className="w-8 h-8 sm:w-12 sm:h-12" />
                                <Flame className="w-8 h-8 sm:w-12 sm:h-12" />
                              </div>

                              <p className="text-white font-black text-lg sm:text-2xl md:text-3xl mb-3 sm:mb-6 break-words drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-snug z-20 whitespace-pre-wrap">
                                {state.scoldingMessage}
                              </p>
                              
                              <div className="bg-black/50 text-red-200 font-black py-2 px-4 sm:py-3 sm:px-8 rounded-full flex items-center gap-2 sm:gap-3 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] z-20 text-sm sm:text-base md:text-lg border-2 border-red-900/50">
                                <Timer className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse text-red-400" />
                                反省しろ！残り：{remainingSeconds}秒
                              </div>
                            </div>
                          )}

                          {(optionOrder[step.id] ?? step.quiz!.options)?.map((opt) => {
                            const isSelected = state.selectedAnswer === opt;
                            const isCorrectOpt = opt === step.quiz!.correctAnswer;
                            
                            let btnClass = "w-full text-left p-4 rounded-lg border-2 font-medium transition-all duration-200 ";
                            
                            if (state.isCorrect) {
                              if (isCorrectOpt) {
                                btnClass += "bg-emerald-100 border-emerald-500 text-emerald-900 dark:bg-emerald-900/40 dark:border-emerald-500 dark:text-emerald-100";
                              } else {
                                btnClass += "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 opacity-50";
                              }
                            } else {
                              if (isSelected && !isLocked) {
                                btnClass += "bg-red-50 border-red-400 text-red-900 dark:bg-red-900/30 dark:border-red-500 dark:text-red-100 animate-shake";
                              } else {
                                btnClass += "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-300 dark:hover:border-emerald-600";
                              }
                            }

                            return (
                              <button
                                key={opt}
                                disabled={state.isCorrect || isLocked}
                                onClick={() => handleChoiceSelect(step.id, opt, step.quiz!.correctAnswer)}
                                className={btnClass}
                              >
                                <span className="flex items-center gap-2">
                                  {state.isCorrect && isCorrectOpt && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                                  {isSelected && !state.isCorrect && !isLocked && <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />}
                                  {opt}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {state.isCorrect && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700"
                        >
                          <p className="text-emerald-700 dark:text-emerald-400 font-bold mb-2 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" /> 正解！
                          </p>
                          <div className="text-slate-700 dark:text-slate-300">
                            {step.quiz!.explanation}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {isLatest && currentStep < steps.length - 1 && canProceed && (
                    <div className="mt-6">
                      <button
                        onClick={nextStep}
                        className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-full inline-flex items-center gap-2 transition-transform active:scale-95 shadow-md"
                      >
                        次のステップへ <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  {isLatest && currentStep === steps.length - 1 && canProceed && (
                    <div className="mt-8 p-6 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl border border-emerald-200 dark:border-emerald-800/50 flex flex-col items-center justify-center space-y-4 transition-colors">
                      <p className="text-emerald-800 dark:text-emerald-300 font-bold text-xl flex items-center gap-2">
                        <CheckCircle2 className="w-8 h-8" />
                        最後まで解き切れました！お疲れ様です！
                      </p>
                      <button
                        onClick={reset}
                        className="text-emerald-700 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300 underline underline-offset-4 font-medium flex items-center gap-2 transition-colors mt-2"
                      >
                        <RotateCcw className="w-4 h-4" /> もう一度最初から解く
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isAllComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-12 p-8 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-500 rounded-2xl text-center space-y-6"
          >
            <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-emerald-700 dark:text-emerald-400">
              全ステップ クリア！！
            </h2>
            <p className="text-emerald-600 dark:text-emerald-300 font-medium">
              {totalMisses === 0 ? 'ノーミスでクリア。この調子でどんどん解いていこう！' : `ミス${totalMisses}回。次はノーミスを目指そう。`}
            </p>
            
            <div className="pt-6 border-t border-emerald-200 dark:border-emerald-800">
              <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80 mb-4 font-bold">
                ↓ 先生にクリアしたことを報告しよう ↓
              </p>
              <a
                href={`https://line.me/R/msg/text/?${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#06C755] hover:bg-[#05a546] text-white font-bold py-4 px-8 rounded-full transition-transform active:scale-95 shadow-md w-full sm:w-auto text-lg"
              >
                LINEで先生に報告する
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
