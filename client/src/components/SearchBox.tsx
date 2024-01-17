import { ChangeEvent, useContext, useEffect, useState } from "react";
import "../styles/SearchBox.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Modal from "./Modal";

export interface SearchBoxProps {
  onCriteriaSearch: (criteria: string) => void;
  onCitySearch: (city: string) => void;
}

function SearchBox({ onCriteriaSearch, onCitySearch }: SearchBoxProps) {
  const [searchCriteria, setSearchCriteria] = useState("default");
  const [searchCity, setSearchCity] = useState("");
  const [searchCityInput, setSearchCityInput] = useState("");

  const { user } = useContext(AuthContext);

  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCriteriaChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const criteria = e.target.value;
    setSearchCriteria(criteria);
    onCriteriaSearch(criteria);
    if (criteria === "") {
      setSearchCriteria("default");
      onCriteriaSearch("");
    }
  };

  const handleCityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const normalizedQuery = e.target.value.toLowerCase();
    setSearchCityInput(normalizedQuery);
    setSearchCity(searchCityInput);

    onCitySearch(searchCityInput);
  };

  // const handleSearchClick = () => {
  //   setSearchCity(searchCityInput);
  //   onCitySearch(searchCityInput);
  // };

  const resetFilters = async () => {
    await setSearchCity("");
    await setSearchCityInput("");
    await onCriteriaSearch("");
    await setSearchCriteria("default");
    await onCitySearch("");
  };

  useEffect(() => {}, [searchCityInput]);

  return (
    <div className="mainSearchBox">
      <div className="searchBox">
        <div className="searchRow">
          <select
            className="dropdownSearch"
            onChange={handleCriteriaChange}
            value={searchCriteria}
          >
            <option value={"default"}>Sort By</option>
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
              onClick={handleShowModal}
            >
              {" "}
              <p
                style={{
                  fontSize: "18px",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                }}
              >
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

            {/* <button className="nakdButton" onClick={handleSearchClick}>
              Search
            </button> */}
            <button className="nakdButton" onClick={resetFilters}>
              Reset
            </button>
          </div>
        </div>
        {showModal && (
          <Modal
            message="You need to log in first!!"
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
}

export default SearchBox;
