function SearchBar({ value, onChange, placeholder = "Search food or restaurant" }) {
  return (
    <div className="search-bar">
      <span>⌕</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export default SearchBar;
