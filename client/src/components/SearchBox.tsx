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
    //REVIEW this type of comparissons are not great. better !criteria, right?
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

  // const resetFilters = () => {
  //    setSearchCity("");
  //    setSearchCityInput("");
  //    onCriteriaSearch("");
  //    setSearchCriteria("default");
  //    onCitySearch("");
  // };

  useEffect(() => {}, [searchCityInput]);

  return (
    <div className="mainSearchBox">
      <div className="searchRow">
        {user ? (
          <Link to={"/submit"} className="nakdButton">
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
      <br />

      <div>
        <input
          className="searchInputBox"
          type="text"
          placeholder="Search by city..."
          value={searchCityInput}
          onChange={handleCityChange}
        />
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
      </div>
      {/* <button className="nakdButton" onClick={resetFilters}>
          Reset
        </button> */}

      {showModal && (
        <Modal
          message="You need to log in first!!"
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default SearchBox;
