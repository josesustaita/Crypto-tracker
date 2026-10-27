import Link from "next/link";
import Layout from "../../components/Layout";
import { coinDetail } from "../../lib/markets.mjs";
const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});
export default function Coin({ coin, mode, error }) {
  if (error)
    return (
      <Layout>
        <div className="empty" role="alert">
          <h1>A quiet moment.</h1>
          <p>{error}</p>
          <Link href="/" className="button">
            Back to the market ↗
          </Link>
        </div>
      </Layout>
    );
  return (
    <Layout title={`${coin.name} · Crypto Tracker`}>
      <section className="detail">
        <Link href="/" className="back">
          ← Back to all coins
        </Link>
        <p className="eyebrow">
          {mode === "demo" ? "SAMPLE MARKET" : "LIVE SNAPSHOT"}
        </p>
        <div
          className="detail-icon"
          style={{ color: coin.color, background: coin.color + "22" }}
          aria-hidden="true"
        >
          {coin.symbol.slice(0, 1).toUpperCase()}
        </div>
        <p className="ticker">{coin.symbol.toUpperCase()}</p>
        <h1>{coin.name}</h1>
        <p className="detail-price">{money.format(coin.current_price)}</p>
        <span
          className={`change ${coin.price_change_percentage_24h < 0 ? "negative" : "positive"}`}
        >
          {coin.price_change_percentage_24h >= 0 ? "+" : ""}
          {coin.price_change_percentage_24h.toFixed(2)}% over 24h
        </span>
        <dl className="detail-stats">
          <div>
            <dt>Market cap</dt>
            <dd>{money.format(coin.market_cap)}</dd>
          </div>
          <div>
            <dt>24h trading volume</dt>
            <dd>{money.format(coin.total_volume)}</dd>
          </div>
        </dl>
        <p className="data-notice">
          {mode === "demo"
            ? "Illustrative sample values, not live prices."
            : "Snapshot from CoinGecko. Refresh to update."}
        </p>
      </section>
    </Layout>
  );
}
export async function getServerSideProps(context) {
  const result = await coinDetail(context.params.id);
  if (!result.coin && !result.error) return { notFound: true };
  return { props: result };
}
