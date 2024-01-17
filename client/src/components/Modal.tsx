import { ReactElement } from "react";
import "../styles/modal.css";

type ModalProps = {
  //   title: string;
  message: ReactElement | ReactElement[] | string;
  onClose: () => void;
  image?: JSX.Element | string;
};

const Modal = ({ message, onClose, image }: ModalProps) => {
  return (
    <div className="modal-background ">
      <div className="modal-content">
        <div className="modal-header">
          <button
            onClick={onClose}
            // style={{ , padding: "8px" }}
          >
            close
          </button>
          <hr />
        </div>

        <div className="m-4 flex flex-col items-center justify-center">
          {image && <div className="image-container">{image}</div>}

          <p className="message text-center text-lg">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
