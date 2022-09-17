import React from "react";
import { SearchFieldProps } from "./interface/ImainData";


const SearchField: React.FC<SearchFieldProps> = ({ onSearch, isLoading }) => {
  return (
    <div className="input-group position-relative">
      <input
        id="keySearch"
        className="form-control"
        placeholder="search"
        onChange={(e) => onSearch(e.target.value)}
        onFocus= {(e) => ''}
      />
      {isLoading && (
        <span
          className="position-absolute  m-1"
          style={{ right: 5, zIndex: 10000 }}
        >
          <div className="spinner-border spinner-border-small" role="status" />
        </span>
      )}
    </div>
  );
};

export default SearchField;
