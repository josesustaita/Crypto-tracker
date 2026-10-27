import Head from "next/head";
import Link from "next/link";
export default function Layout({
  children,
  title = "Crypto Tracker · on the pulse",
}) {
  return (
    <div className="layout">
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content="A curious little window into crypto markets. Browse coins, explore details, and build a watchlist."
        />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="theme-color" content="#111a22" />
      </Head>
      <header className="nav">
        <Link href="/" className="brand">
          <span className="brand-mark" aria-hidden="true">
            ◇
          </span>{" "}
          crypto<span className="brand-light">tracker</span>
        </Link>
        <span className="nav-note">BY JOSE SUSTAITA</span>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <span>Stay curious. Keep perspective.</span>
        <span>USD · CoinGecko in live mode</span>
      </footer>
    </div>
  );
}
