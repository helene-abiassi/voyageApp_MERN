import { ChangeEvent, useContext, useEffect, useState } from "react";
import "../styles/SearchBox.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export interface SearchBoxProps {
  onCriteriaSearch: (criteria: string) => void;
  onCitySearch: (city: string) => void;
}

function SearchBox({ onCriteriaSearch, onCitySearch }: SearchBoxProps) {
  const [searchCriteria, setSearchCriteria] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [searchCityInput, setSearchCityInput] = useState("");

  const { user } = useContext(AuthContext);

  const handleCriteriaChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const criteria = e.target.value;
    setSearchCriteria(criteria);
    onCriteriaSearch(criteria);
    if (criteria === "Sort By") {
      setSearchCriteria("");
      onCriteriaSearch("");
    }
  };

  const handleCityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const normalizedQuery = e.target.value.toLowerCase();
    setSearchCityInput(normalizedQuery);
  };

  const handleSearchClick = () => {
    setSearchCity(searchCityInput);

    onCitySearch(searchCityInput);
  };

  const resetFilters = () => {
    // setSearchCriteria("");
    setSearchCity("");
    setSearchCityInput("");
    onCriteriaSearch("");
    onCitySearch("");
  };

  useEffect(() => {
    // onCriteriaSearch("")
    // handleSearchClick();
  }, [searchCityInput]);

  return (
    <div className="mainSearchBox">
      <div className="searchBox">
        <div className="searchRow">
          <select className="dropdownSearch" onChange={handleCriteriaChange}>
            <option value={""}>Sort By</option>
            <option value={"Most Bookmarked"}>Most Bookmarked</option>
            <option value={"Newest"}>Newest</option>
            <option value={"Oldest"}>Oldest</option>
            <option value={"Most Commented"}>Most Commented</option>
          </select>{" "}
          {user ? (
            <Link to={"/submit"} style={{ color: "black", fontSize: "18px" }}>
              {" "}
              <strong style={{ fontSize: "18px" }}>+</strong> Add your own
            </Link>
          ) : (
            <button
              style={{ backgroundColor: "transparent" }}
              onClick={() => {
                alert("You need to log in first!");
              }}
            >
              {" "}
              <p style={{ fontSize: "18px", backgroundColor: "transparent" }}>
                <strong>+</strong> Add your own
              </p>
            </button>
          )}
        </div>
        <div className="">
          <div className="">
            <input
              className="searchInputBox"
              type="text"
              placeholder="Search by city..."
              value={searchCityInput}
              onChange={handleCityChange}
            />

            <button className="nakdButton" onClick={handleSearchClick}>
              Search
            </button>
          </div>
        </div>

        <button className="resetButton" onClick={resetFilters}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default SearchBox;
