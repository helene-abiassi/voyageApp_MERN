import "../styles/Footer.css";
import { FaGithub } from "react-icons/fa";

function Footer() {
  return (
    <div>
      <footer>
        <a
          // style={{ color: "white" }}
          target="_blank"
          href="https://github.com/helene-abiassi"
        >
          {" "}
          <span className="githubIcon">
            <FaGithub /> Helene Abi Assi
          </span>
        </a>
      </footer>
    </div>
  );
}

export default Footer;
