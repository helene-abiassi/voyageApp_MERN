import { useEffect } from "react";

function Experiences() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return <div className="mainBodyExp"></div>;
}

export default Experiences;
