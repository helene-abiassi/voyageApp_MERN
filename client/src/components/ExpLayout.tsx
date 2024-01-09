import { useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import ExpCards from "./ExpCard";
import { ExperiencesContext } from "../context/ExperiencesContext";
import Loader from "./Loader";
import SearchBox from "./SearchBox";
import { AuthContext } from "../context/AuthContext";

function ExpLayout() {
  const { experiences, fetchExperiences } = useContext(ExperiencesContext);
  const { isLoading } = useContext(AuthContext);
  const [filteredExperiences, setFilteredExperiences] = useState(experiences);

  const handleCitySearch = (city: string) => {
    if (!experiences) {
      return;
    }

    let tempExperiences = [...experiences];

    if (city) {
      tempExperiences = tempExperiences.filter((experience) =>
        experience.location.city.toLowerCase().includes(city.toLowerCase())
      );
    }
    setFilteredExperiences(tempExperiences);
  };

  const handleCriteriaSearch = (criteria: string) => {
    if (!experiences) {
      return;
    }

    let tempExperiences = [...experiences];

    switch (criteria) {
      case "Most Bookmarked":
        tempExperiences = tempExperiences.sort(
          (a, b) => b.bookmarked_by.length - a.bookmarked_by.length
        );
        break;
      case "Newest":
        tempExperiences = tempExperiences.sort(
          (a, b) =>
            new Date(b.publication_date).getTime() -
            new Date(a.publication_date).getTime()
        );
        break;
      case "Oldest":
        tempExperiences = tempExperiences.sort(
          (a, b) =>
            new Date(a.publication_date).getTime() -
            new Date(b.publication_date).getTime()
        );
        break;
      case "Most Commented":
        tempExperiences = tempExperiences.sort(
          (a, b) => b.comments!.length - a.comments!.length
        );
        break;
      default:
        tempExperiences = tempExperiences.sort(
          (a, b) =>
            new Date(b.publication_date).getTime() -
            new Date(a.publication_date).getTime()
        );
        break;
    }

    setFilteredExperiences(tempExperiences);
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  return (
    <div className="mainBodyExp">
      {/* <h1>experiences</h1> */}
      <br />
      <div className="logoSearchbar">
        <img
          style={{ width: "7%" }}
          src="https://res.cloudinary.com/dfm1r4ikr/image/upload/v1697317643/voyageApp/logo-variations-02_uffxcy.png"
          alt=""
        />
      </div>
      <SearchBox
        onCriteriaSearch={handleCriteriaSearch}
        onCitySearch={handleCitySearch}
      />
      <div className="expTypeNavbar">
        <NavLink to={"all"}>all </NavLink> <span> | </span>
        <NavLink to={"hiking"}> hiking </NavLink> <span> | </span>
        <NavLink to={"wildlife"}> wildlife</NavLink> <span> | </span>
        <NavLink to={"roadtrips"}>roadtrips</NavLink> <span> | </span>
        <NavLink to={"citywalks"}>city walks</NavLink>
        <span> | </span>
        <NavLink to={"wildlife"}>scenery</NavLink>
        <span> | </span>
        <NavLink to={"wildlife"}>fauna & flora</NavLink>
      </div>
      <br />
      <Outlet />
      <div>
        <div className="storyCards">
          {filteredExperiences && filteredExperiences.length > 0 ? (
            filteredExperiences.map((experience, expID) => (
              <div key={expID}>
                <ExpCards
                  key={"1" + experience.publication_date}
                  experience={experience}
                />
              </div>
            ))
          ) : experiences && experiences.length > 0 ? (
            experiences
              .slice()
              .sort(
                (a, b) =>
                  new Date(b.publication_date).getTime() -
                  new Date(a.publication_date).getTime()
              )
              .map((experience, expID) => (
                <div key={expID}>
                  <ExpCards
                    key={"1" + experience.publication_date}
                    experience={experience}
                  />
                </div>
              ))
          ) : isLoading ? (
            <Loader />
          ) : (
            <h2>...something went wrong...</h2>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExpLayout;
