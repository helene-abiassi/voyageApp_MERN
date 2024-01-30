import BackButton from "../components/BackButton";
import UpdateExperience from "../components/UpdateExperience";

function Update() {
  return (
    <div className="pageBody">
      <div className="detailsHeader">
        <BackButton />
        <h1>update your story</h1>
      </div>
      <UpdateExperience />
      <br />
    </div>
  );
}

export default Update;
