import { useEffect } from "react";
import ProfileCard from "../components/ProfileCard";
import "../styles/ProfilePage.css";

function Profile() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pageBody">
      <h1></h1>
      <div className="profileBox">
        <ProfileCard />
      </div>
      <br />
    </div>
  );
}

export default Profile;
