export const demoCoins = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "btc",
    current_price: 67420.18,
    market_cap: 1320000000000,
    total_volume: 28600000000,
    price_change_percentage_24h: 2.34,
    color: "#f4aa55",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "eth",
    current_price: 3521.64,
    market_cap: 423000000000,
    total_volume: 14200000000,
    price_change_percentage_24h: 1.78,
    color: "#a4a9f3",
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "sol",
    current_price: 148.92,
    market_cap: 66800000000,
    total_volume: 3100000000,
    price_change_percentage_24h: -1.25,
    color: "#9ce8c5",
  },
  {
    id: "chainlink",
    name: "Chainlink",
    symbol: "link",
    current_price: 14.28,
    market_cap: 8600000000,
    total_volume: 294000000,
    price_change_percentage_24h: 3.42,
    color: "#7ca7f8",
  },
  {
    id: "avalanche-2",
    name: "Avalanche",
    symbol: "avax",
    current_price: 35.46,
    market_cap: 14000000000,
    total_volume: 418000000,
    price_change_percentage_24h: -0.63,
    color: "#ed9c9d",
  },
  {
    id: "polkadot",
    name: "Polkadot",
    symbol: "dot",
    current_price: 6.84,
    market_cap: 9800000000,
    total_volume: 187000000,
    price_change_percentage_24h: 0.92,
    color: "#ef9ac7",
  },
];
export const validId = (id) =>
  typeof id === "string" && /^[a-z0-9][a-z0-9-]{0,79}$/.test(id);
export function normalizeCoin(coin) {
  if (
    !validId(coin.id) ||
    typeof coin.name !== "string" ||
    typeof coin.symbol !== "string" ||
    !Number.isFinite(coin.current_price)
  )
    throw new Error("Invalid market response");
  return {
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    current_price: coin.current_price,
    market_cap: Number.isFinite(coin.market_cap) ? coin.market_cap : 0,
    total_volume: Number.isFinite(coin.total_volume) ? coin.total_volume : 0,
    price_change_percentage_24h: Number.isFinite(
      coin.price_change_percentage_24h,
    )
      ? coin.price_change_percentage_24h
      : 0,
    color: coin.color || "#95b5d4",
  };
}
export async function markets({
  mode = process.env.CRYPTO_DATA_MODE || "demo",
  key = process.env.COINGECKO_API_KEY,
  fetcher = fetch,
} = {}) {
  if (mode === "demo")
    return { coins: demoCoins.map(normalizeCoin), mode: "demo", error: null };
  if (mode !== "live")
    return {
      coins: [],
      mode: "live",
      error: "Set CRYPTO_DATA_MODE to demo or live.",
    };
  try {
    const response = await fetcher(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false",
      {
        headers: key ? { "x-cg-demo-api-key": key } : {},
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!response.ok) throw new Error("Provider unavailable");
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Invalid response");
    return { coins: data.map(normalizeCoin), mode: "live", error: null };
  } catch {
    return {
      coins: [],
      mode: "live",
      error: "Market data is taking a breather. Refresh to try again.",
    };
  }
}
export async function coinDetail(
  id,
  {
    mode = process.env.CRYPTO_DATA_MODE || "demo",
    key = process.env.COINGECKO_API_KEY,
    fetcher = fetch,
  } = {},
) {
  if (!validId(id)) return { coin: null, mode, error: null };
  if (mode === "demo")
    return {
      coin: demoCoins.find((c) => c.id === id) || null,
      mode,
      error: null,
    };
  if (mode !== "live")
    return {
      coin: null,
      mode: "live",
      error: "Set CRYPTO_DATA_MODE to demo or live.",
    };
  try {
    const response = await fetcher(
      `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(id)}?localization=false&tickers=false&community_data=false&developer_data=false`,
      {
        headers: key ? { "x-cg-demo-api-key": key } : {},
        signal: AbortSignal.timeout(8000),
      },
    );
    if (response.status === 404) return { coin: null, mode, error: null };
    if (!response.ok) throw new Error("Provider unavailable");
    const data = await response.json(),
      market = data.market_data;
    const coin = normalizeCoin({
      ...data,
      current_price: market?.current_price?.usd,
      market_cap: market?.market_cap?.usd,
      total_volume: market?.total_volume?.usd,
      price_change_percentage_24h: market?.price_change_percentage_24h,
    });
    return { coin, mode, error: null };
  } catch {
    return {
      coin: null,
      mode,
      error: "Market data is taking a breather. Refresh to try again.",
    };
  }
}
export function filterCoins(coins, query, sort = "cap") {
  const term = query.trim().toLowerCase();
  return coins
    .filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.symbol.toLowerCase().includes(term),
    )
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : sort === "change"
          ? b.price_change_percentage_24h - a.price_change_percentage_24h
          : b.market_cap - a.market_cap,
    );
}
