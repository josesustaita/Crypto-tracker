import Link from "next/link";
const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});
const compact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});
export default function Coins({ coin, index, saved, onToggle }) {
  const change = coin.price_change_percentage_24h;
  return (
    <li
      className="coin-row"
      style={{ "--delay": `${Math.min(index, 8) * 35}ms` }}
    >
      <Link href={`/coin/${coin.id}`} className="coin-name">
        <span
          className="coin-icon"
          style={{ background: coin.color + "22", color: coin.color }}
          aria-hidden="true"
        >
          {coin.symbol.slice(0, 1).toUpperCase()}
        </span>
        <span>
          <strong>{coin.name}</strong>
          <small>{coin.symbol.toUpperCase()}</small>
        </span>
      </Link>
      <span className="price">{money.format(coin.current_price)}</span>
      <span className={`change ${change < 0 ? "negative" : "positive"}`}>
        {change < 0 ? "↘" : "↗"} {Math.abs(change).toFixed(2)}%
      </span>
      <span className="market-cap cap-column">
        {compact.format(coin.market_cap)}
      </span>
      <button
        className="save"
        aria-label={`${saved ? "Remove" : "Add"} ${coin.name} ${saved ? "from" : "to"} watchlist`}
        aria-pressed={saved}
        onClick={() => onToggle(coin.id)}
      >
        {saved ? "★" : "☆"}
      </button>
    </li>
  );
}
