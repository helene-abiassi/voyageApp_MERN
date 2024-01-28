import { useNavigate } from "react-router-dom";

function BackButton() {
  const NavigateTo = useNavigate();

  const goBack = () => {
    NavigateTo(-1);
  };

  return (
    <div>
      <button className="backButton" onClick={goBack}>
        ←
      </button>
    </div>
  );
}

export default BackButton;
