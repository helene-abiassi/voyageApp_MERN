import BackButton from "../components/BackButton";
import SubmitExperience from "../components/SubmitExperience";

function Submit() {
  return (
    <div>
      <div className="submitHeader">
        <div className="backButton">
          <BackButton />
        </div>
        <h1>share your story</h1>
      </div>
      <SubmitExperience />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

export default Submit;
