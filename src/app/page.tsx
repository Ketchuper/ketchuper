"use client";

import { getAllStoreIds, getStoreConfig } from "@/config/stores";

/**
 * ルート (/) = Review Booster の LP（サービス紹介・作成中用）
 * 店舗別の口コミ作成は /[storeId] へ。stores に追加した店舗がここに自動表示される。
 */
export default function ReviewBoosterLP() {
  const storeIds = getAllStoreIds();

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <p className="text-sm uppercase tracking-widest text-cyan-400/80 mb-2">Map Engine</p>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Review Booster
          </h1>
          <p className="mt-3 text-gray-400 text-sm">
            Google口コミの下書きをAIで自動作成
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-8 text-gray-300">
          <p className="text-lg font-medium text-white mb-2">LPサイトは準備中です</p>
          <p className="text-sm">サービス紹介ページを鋭意作成しています。</p>
        </div>

        <div className="space-y-3 pt-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">店舗別はこちら</p>
          <div className="flex flex-wrap justify-center gap-3">
            {storeIds.map((storeId, index) => {
              const config = getStoreConfig(storeId);
              if (!config) return null;
              const isFirst = index === 0;
              return (
                <a
                  key={storeId}
                  href={`/${storeId}`}
                  className={
                    isFirst
                      ? "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 transition-colors text-sm font-medium"
                      : "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-gray-200 hover:bg-white/15 transition-colors text-sm font-medium"
                  }
                >
                  {config.name}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
