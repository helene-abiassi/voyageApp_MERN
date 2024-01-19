import BackButton from "../components/BackButton";
import UpdateProfile from "../components/UpdateProfile";

function UpdateProfileView() {
  return (
    <div>
      <div className="detailsHeader">
        <BackButton />
        <h1>update your profile</h1>
      </div>
      <UpdateProfile />
    </div>
  );
}

export default UpdateProfileView;
