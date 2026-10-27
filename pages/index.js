import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";
import CoinList from "../components/CoinsList/CoinList";
import { markets, filterCoins } from "../lib/markets.mjs";
export default function Home({ coins, mode, error }) {
  const [query, setQuery] = useState(""),
    [sort, setSort] = useState("cap"),
    [saved, setSaved] = useState([]),
    [onlySaved, setOnlySaved] = useState(false),
    [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("crypto-watchlist") || "[]");
      if (Array.isArray(data))
        setSaved(data.filter((x) => typeof x === "string"));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem("crypto-watchlist", JSON.stringify(saved));
      } catch {}
    }
  }, [saved, ready]);
  function toggle(id) {
    setSaved((items) =>
      items.includes(id) ? items.filter((x) => x !== id) : [...items, id],
    );
  }
  const visible = filterCoins(
    onlySaved ? coins.filter((c) => saved.includes(c.id)) : coins,
    query,
    sort,
  );
  return (
    <Layout>
      <section className="hero">
        <div>
          <p className="eyebrow">
            <span className="status-dot" />{" "}
            {mode === "demo" ? "SAMPLE MARKET" : "LIVE MARKET SNAPSHOT"}
          </p>
          <h1>
            A little window.
            <br />
            <span>A whole market.</span>
          </h1>
          <p className="hero-copy">
            Follow your curiosity. Find your favorites.
            <br />
            Keep a finger on the pulse.
          </p>
        </div>
        <div className="pulse-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="gem">◇</div>
          <span className="orbit-dot" />
          <span className="art-label">ON THE PULSE</span>
        </div>
      </section>
      <p className="data-notice">
        {mode === "demo"
          ? "Demo mode · illustrative values, not live prices. Your watchlist stays on this device."
          : "Live snapshot from CoinGecko · refresh this page to update. Prices may be delayed."}
      </p>
      <section className="market" aria-label="Coin explorer">
        <div className="market-toolbar">
          <div className="tabs">
            <button
              aria-pressed={!onlySaved}
              onClick={() => setOnlySaved(false)}
            >
              All coins <span>{coins.length}</span>
            </button>
            <button aria-pressed={onlySaved} onClick={() => setOnlySaved(true)}>
              Watchlist <span>{saved.length}</span>
            </button>
          </div>
          <div className="filters">
            <SearchBar
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <label className="sort-label">
              Sort
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="cap">Market cap</option>
                <option value="change">24h change</option>
                <option value="name">Name</option>
              </select>
            </label>
          </div>
        </div>
        {error ? (
          <div className="empty" role="alert">
            <span aria-hidden="true">☁</span>
            <h2>A quiet moment.</h2>
            <p>{error}</p>
            <a href="/" className="button">
              Try again ↗
            </a>
          </div>
        ) : (
          <>
            <div className="table-head" aria-hidden="true">
              <span>COIN</span>
              <span>PRICE</span>
              <span>24H CHANGE</span>
              <span className="cap-column">MARKET CAP</span>
              <span>SAVE</span>
            </div>
            <CoinList filteredCoins={visible} saved={saved} onToggle={toggle} />
            {!visible.length && (
              <div className="empty" role="status">
                <span aria-hidden="true">◇</span>
                <h2>
                  {onlySaved && !query
                    ? "Your orbit starts here."
                    : "No coins in this corner."}
                </h2>
                <p>
                  {onlySaved && !query
                    ? "Tap a star in All coins to start a watchlist."
                    : "Try another name or ticker symbol."}
                </p>
                <button
                  className="button"
                  onClick={() => {
                    setQuery("");
                    setOnlySaved(false);
                  }}
                >
                  Explore all coins ↗
                </button>
              </div>
            )}
          </>
        )}
        <p className="result-count" aria-live="polite">
          {visible.length} {visible.length === 1 ? "coin" : "coins"} in view
        </p>
      </section>
    </Layout>
  );
}
export async function getServerSideProps() {
  return { props: await markets() };
}
