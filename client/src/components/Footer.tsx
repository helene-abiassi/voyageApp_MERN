import "../styles/Footer.css";
function Footer() {
  return (
    <div>
      <footer>
        <a target="_blank" href="https://github.com/helene-abiassi">
          <i
            className="fa fa-github"
            style={{ fontSize: "30px", color: "white" }}
          ></i>
        </a>
        {"  "}{" "}
        <a
          target="_blank"
          href="https://github.com/helene-abiassi"
          style={{ color: "white", paddingLeft: "15pt" }}
        >
          {" "}
          Helene Abi Assi
        </a>
      </footer>
    </div>
  );
}

export default Footer;
