export default function SearchBar(props) {
  return (
    <label className="search-label">
      <svg
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 5 5" />
      </svg>
      <span className="sr-only">Search coins by name or symbol</span>
      <input type="search" placeholder="Find a coin or symbol…" {...props} />
    </label>
  );
}
