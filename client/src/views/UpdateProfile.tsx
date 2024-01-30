import BackButton from "../components/BackButton";
import UpdateProfile from "../components/UpdateProfile";
import "../styles/ProfilePage.css";

function UpdateProfileView() {
  return (
    <div className="pageBody">
      <div className="detailsHeader">
        <BackButton />
        <h1>update your profile</h1>
      </div>
      <UpdateProfile />
      <br />
    </div>
  );
}

export default UpdateProfileView;
