import "../styles/Footer.css";
function Footer() {
  return (
    <div>
      <footer>
        <a
          style={{ color: "white" }}
          target="_blank"
          href="https://github.com/helene-abiassi"
        >
          {" "}
          <i className="fa fa-github" style={{ fontSize: "30px" }}></i>{" "}
          <span>Helene Abi Assi</span>
        </a>
      </footer>
    </div>
  );
}

export default Footer;
