// فاصله ویرایش (Levenshtein): حداقل تعداد تغییر (افزودن، حذف، جایگزینی)
// برای تبدیل رشته a به رشته b
export function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,       // حذف
        dp[i][j - 1] + 1,       // افزودن
        dp[i - 1][j - 1] + cost // جایگزینی
      );
    }
  }
  return dp[a.length][b.length];
}

// برمی‌گرداند حداکثر `limit` شهر پیشنهادی (حساس به حروف کوچک و بزرگ)
export function getSuggestions(input, cities, limit = 3) {
  if (!input) return [];

  // برای ورودی کوتاه، غلط املایی مجاز نیست؛ هرچه ورودی بلندتر، تحمل بیشتر
  const maxDistance = input.length <= 2 ? 0 : input.length <= 4 ? 1 : 2;

  const scored = cities.map((city) => {
    // فاصله ورودی با همان تعداد حرف ابتدای شهر
    const distance = levenshtein(input, city.slice(0, input.length));
    return { city, distance };
  });

  return scored
    .filter((item) => item.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance || a.city.localeCompare(b.city))
    .slice(0, limit)
    .map((item) => item.city);
}
