/* eslint-disable react/prop-types */
import classes from "./Search.module.css";

const Search = ({ searchTerm, setSearchTerm, placeholder }) => {
  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  return (
    <div className={classes.searchBox}>
      <input
        className={classes.searchBoxInput}
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default Search;
