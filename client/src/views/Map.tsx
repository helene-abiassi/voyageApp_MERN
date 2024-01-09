import { useEffect } from "react";
import Iframe from "react-iframe";
import LeafletMap from "../components/LeafletMap";

function Map() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <h1>map</h1>

      <div>
        <LeafletMap />
        {/* <Iframe
          url="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d310855.9162381616!2d12.80064200432946!3d52.50517049394729!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a84e3738ba29dd%3A0xdae41fea6be6cee4!2sBerlin!5e0!3m2!1sen!2sde!4v1697975644171!5m2!1sen!2sde"
          width="600"
          height="450"
          id="myId"
          className="myClassname"
          display="initial"
          position="relative"
          allowFullScreen
        /> */}
      </div>
    </div>
  );
}

export default Map;
