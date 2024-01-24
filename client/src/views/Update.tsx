import BackButton from "../components/BackButton";
import UpdateExperience from "../components/UpdateExperience";

function Update() {
  return (
    <div>
      <div className="detailsHeader">
        <BackButton />
        <h1>update your story</h1>
      </div>
      <UpdateExperience />
      {/* //REVIEW 4 break lines, really? CSS!!! */}
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

export default Update;
