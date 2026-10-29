import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import 'katex/dist/katex.min.css'

export const metadata: Metadata = {
  title: 'とちEn! - 栃木県公立入試 英語 長文・グラフ問題特訓 -',
  description: '栃木県立高校入試の英語（対話文とグラフ）をステップバイステップで解くサイトです。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-300`}>
        <header className="sticky top-0 z-40 bg-emerald-600 dark:bg-emerald-800 text-white px-4 py-3 shadow-md transition-colors duration-300">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-black tracking-wider">🔥 とちEn! <span className="hidden sm:inline text-sm font-normal ml-2 opacity-80">栃木県公立入試 英語特訓</span></h1>
            <Link href="/" className="text-emerald-100 hover:text-white transition-colors font-bold whitespace-nowrap">ホーム</Link>
          </div>
        </header>
        <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8">
          {children}
        </main>
        <footer className="bg-slate-800 dark:bg-slate-950 text-slate-400 dark:text-slate-500 text-center p-4 text-sm mt-8 transition-colors duration-300">
          &copy; 2026 Tochigi English Step-by-Step
        </footer>
      </body>
    </html>
  )
}
