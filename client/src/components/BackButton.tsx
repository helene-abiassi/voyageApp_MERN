import { useNavigate } from "react-router-dom";

function BackButton() {
  const NavigateTo = useNavigate();

  const goBack = () => {
    NavigateTo(-1);
  };

  return (
    <div>
      <button
        style={{
          fontSize: "36pt",
          color: "black",
          backgroundColor: "transparent",
        }}
        onClick={goBack}
      >
        ←
      </button>
    </div>
  );
}

export default BackButton;
