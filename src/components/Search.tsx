'use client';

import React, { useState } from "react";

interface SearchProps {
  placeholder?: string;
  initialQuery?: string;
  onSearch: (query: string) => void; // callback prop
}

export default function Search({
  placeholder,
  initialQuery = "",
  onSearch,
}: SearchProps): JSX.Element {
  const [term, setTerm] = useState(initialQuery);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSearch(term);
  };

  const handleClick = () => {
    onSearch(term);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder={placeholder || "Search..."}
        value={term}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="search-input"
      />
      <button onClick={handleClick} className="search-button">
        Search
      </button>
    </div>
  );
}
