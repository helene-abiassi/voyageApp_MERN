import BackButton from "../components/BackButton";
import UpdateProfile from "../components/UpdateProfile";
import "../styles/ProfilePage.css";

function UpdateProfileView() {
  return (
    <div>
      <div className="detailsHeader">
        <BackButton />
        <h1>update your profile</h1>
      </div>
      <UpdateProfile />
      {/* //REVIEW 🤌🏽🤌🏽🤌🏽🤌🏽 */}
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

export default UpdateProfileView;
