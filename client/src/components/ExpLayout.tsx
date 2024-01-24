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
  // REVIEW IF "experiences" are coming sorted in order of storage in the database, or any other not "decided by you" order, I would sort them. IMO opinion they should be initially sorted from mine first, then the rest ...(kiddin ...but I'd say newest first)
  const [filteredExperiences, setFilteredExperiences] = useState(experiences);

  const { experienceType } = useParams();

  const handleCitySearch = (city: string) => {
    if (!experiences) {
      return;
    }
    console.log("experiences :>> ", experiences);
    let tempExperiences = [...experiences];

    if (city) {
      tempExperiences = tempExperiences.filter((experience) =>
        // PREVIEW  Coding style. either you use {return ....} when you have one single line of code, or you don't , like below, but be consistent.
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
      //REVIEW having a "default" statement, i would name a case "default". I wrote a whole comment about the default statement and its position, until i realised these is an actual "default" 🤨 .
      //REVIEW additonally this sorting is repeated 3 times: case default, case oldest and default statement. Couldn't you make it with just one?
      case "default":
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

  const filterByExperience = () => {
    if (!experiences || !experienceType) {
      return;
    }

    const tempExperiences = experiences.filter(
      (experience) => experience.experienceType === experienceType
    );

    setFilteredExperiences(tempExperiences);
  };

  useEffect(() => {
    fetchExperiences();
    filterByExperience();
  }, [experienceType]);

  return (
    <div>
      <div className="mainBodyExp">
        <br />
        <div className="logoSearchbar">
          <img
            // REVIEW mezcla de styles...
            style={{ width: "7%" }}
            src="https://res.cloudinary.com/dfm1r4ikr/image/upload/v1697317643/voyageApp/logo-variations-02_uffxcy.png"
            alt=""
          />
        </div>
        <SearchBox
          // REVIEW not quite convinced by the naming below. It took me some minutes to realise. Why giving a different name to the prop name and to the function?
          onCriteriaSearch={handleCriteriaSearch}
          onCitySearch={handleCitySearch}
        />
        <div className="expTypeNavbar">
          <NavLink to={"all"}>all </NavLink> <span> | </span>
          <NavLink to={"hiking"}> hiking </NavLink> <span> | </span>
          <NavLink to={"wildlife"}> wildlife</NavLink> <span> | </span>
          <NavLink to={"roadtrips"}>roadtrips</NavLink> <span> | </span>
          <NavLink to={"citywalk"}>city walks</NavLink>
          <span> | </span>
          <NavLink to={"scenery"}>scenery</NavLink>
          <span> | </span>
          <NavLink to={"faunaflora"}>fauna & flora</NavLink>
        </div>
        <Outlet />

        <div className="storyCards">
          {/* {filteredExperiences && filteredExperiences.length === 0 ? (
            <h2>No encounters found.</h2>
          ) : experiences && experiences.length === 0 ? (
            <h2>No encounters found.</h2>
          ) : null} isLoading ? (
            <Loader />
          ) :*/}
          {/*  //REVIEW filteredExperiences and experiences are the same thing, and you should try to use just one. It would be a nice logic exercise to think about a way of doing all with the same variable  */}
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
            experiences.map((experience, expID) => (
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
            <div>
              {!experiences ? <h2>...something went wrong...</h2> : null}
            </div>
          )}
        </div>
      </div>
      <br />
      <br />
      <br />
    </div>
  );
}

export default ExpLayout;
