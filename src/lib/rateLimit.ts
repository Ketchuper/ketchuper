// シンプルなメモリベースのレート制限
// 本番環境では各インスタンスで独立して動作

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// IPアドレスごとのリクエスト記録
const rateLimitMap = new Map<string, RateLimitEntry>();

// 定期的に古いエントリをクリーンアップ（メモリリーク防止）
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 60000); // 1分ごとにクリーンアップ

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * レート制限チェック
 * @param identifier IPアドレスまたはユーザー識別子
 * @param limit 制限回数（デフォルト: 3回/分）
 * @param windowMs 時間窓（デフォルト: 60秒）
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 3,
  windowMs: number = 60000
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  // エントリが存在しない、または時間窓が過ぎている場合
  if (!entry || now > entry.resetTime) {
    const resetTime = now + windowMs;
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime,
    });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: resetTime,
    };
  }

  // 制限を超えている場合
  if (entry.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: entry.resetTime,
    };
  }

  // カウントを増やす
  entry.count++;
  return {
    success: true,
    limit,
    remaining: limit - entry.count,
    reset: entry.resetTime,
  };
}

/**
 * IPアドレスを取得（Vercel環境対応）
 */
export function getClientIP(headers: Headers): string {
  // Vercelの場合、x-forwarded-for または x-real-ip を使用
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // フォールバック（開発環境）
  return 'unknown';
}
