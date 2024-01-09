import BackButton from "../components/BackButton";
import SubmitExperience from "../components/SubmitExperience";

function Submit() {
  return (
    <div>
      <div className="submitHeader">
        <div className="backButton">
          <BackButton />
        </div>
        <h1>submit your story</h1>
      </div>
      <SubmitExperience />
    </div>
  );
}

export default Submit;
