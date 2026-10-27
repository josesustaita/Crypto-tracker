import test from "node:test";
import assert from "node:assert/strict";
import {
  markets,
  coinDetail,
  filterCoins,
  demoCoins,
  normalizeCoin,
} from "../lib/markets.mjs";
test("demo mode never calls a provider", async () => {
  const r = await markets({
    mode: "demo",
    fetcher: () => {
      throw new Error("network");
    },
  });
  assert.equal(r.coins.length, 6);
  assert.equal(r.mode, "demo");
});
test("search accepts symbols and sort does not mutate the source", () => {
  const original = demoCoins.map((c) => c.id);
  assert.equal(filterCoins(demoCoins, "ETH")[0].id, "ethereum");
  assert.equal(filterCoins(demoCoins, "", "change")[0].id, "chainlink");
  assert.deepEqual(
    demoCoins.map((c) => c.id),
    original,
  );
});
test("live errors stay live and are never silently replaced with samples", async () => {
  const r = await markets({
    mode: "live",
    fetcher: async () => ({ ok: false }),
  });
  assert.equal(r.mode, "live");
  assert.deepEqual(r.coins, []);
  assert.ok(r.error);
});
test("malformed upstream responses fail gracefully", async () => {
  const r = await markets({
    mode: "live",
    fetcher: async () => ({
      ok: true,
      json: async () => ({ error: "rate limit" }),
    }),
  });
  assert.ok(r.error);
});
test("missing or invalid details do not make external requests", async () => {
  assert.equal(
    (
      await coinDetail("../private", {
        mode: "live",
        fetcher: () => {
          throw new Error("must not call");
        },
      })
    ).coin,
    null,
  );
  assert.equal((await coinDetail("unknown", { mode: "demo" })).coin, null);
});
test("nullable numeric fields have safe defaults", () => {
  assert.equal(
    normalizeCoin({
      ...demoCoins[0],
      total_volume: null,
      price_change_percentage_24h: null,
    }).total_volume,
    0,
  );
});
test("live details use the coin endpoint and handle unknown IDs", async () => {
  let url;
  const r = await coinDetail("bitcoin", {
    mode: "live",
    fetcher: async (value) => {
      url = value;
      return {
        ok: true,
        json: async () => ({
          id: "bitcoin",
          name: "Bitcoin",
          symbol: "btc",
          market_data: {
            current_price: { usd: 10 },
            market_cap: { usd: 100 },
            total_volume: { usd: 20 },
            price_change_percentage_24h: 1,
          },
        }),
      };
    },
  });
  assert.ok(url.includes("/coins/bitcoin?"));
  assert.equal(r.coin.current_price, 10);
  assert.equal(
    (
      await coinDetail("unknown", {
        mode: "live",
        fetcher: async () => ({ status: 404 }),
      })
    ).coin,
    null,
  );
});
