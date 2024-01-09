import { useEffect } from "react";
import BucketList from "../components/BucketList";
import ProfileCard from "../components/ProfileCard";
import "../styles/ProfilePage.css";

function Profile() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <h1>profile</h1>
      <div className="profileBox">
        <ProfileCard />
        {/* <BucketList /> */}
      </div>
    </div>
  );
}

export default Profile;
