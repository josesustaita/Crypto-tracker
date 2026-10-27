import Coins from "../Coins";
export default function CoinList({ filteredCoins, saved = [], onToggle }) {
  return (
    <ul className="coin-list">
      {filteredCoins.map((coin, index) => (
        <Coins
          key={coin.id}
          coin={coin}
          index={index}
          saved={saved.includes(coin.id)}
          onToggle={onToggle}
        />
      ))}
    </ul>
  );
}
