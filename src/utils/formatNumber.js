// Memformat angka besar menjadi format singkat: 1K, 1M, 1B
export const formatNumber = (number) => {
  if (number >= 1_000_000_000)
    return (number / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  if (number >= 1_000_000)
    return (number / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (number >= 1_000)
    return (number / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return number;
};
