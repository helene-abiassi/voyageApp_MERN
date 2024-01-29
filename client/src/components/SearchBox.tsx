import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Modal from "./Modal";
import "../styles/SearchBox.css";

export interface SearchBoxProps {
  onCriteriaSearch: (criteria: string) => void;
  onCitySearch: (city: string) => void;
}

function SearchBox({ onCriteriaSearch, onCitySearch }: SearchBoxProps) {
  const { user } = useContext(AuthContext);

  const [searchCriteria, setSearchCriteria] = useState("default");
  const [searchCity, setSearchCity] = useState("");
  const [searchCityInput, setSearchCityInput] = useState("");
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
    if (criteria === "default") {
      setSearchCriteria("");
      onCriteriaSearch("");
    }
  };

  const handleCityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const normalizedQuery = e.target.value.toLowerCase();
    setSearchCityInput(normalizedQuery);
    setSearchCity(searchCityInput);

    onCitySearch(searchCityInput);
  };

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
          <button className="nakdButton" onClick={handleShowModal}>
            {" "}
            <strong>+</strong> Add your own
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
