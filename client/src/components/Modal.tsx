import { ReactElement } from "react";
import "../styles/modal.css";

type ModalProps = {
  message: ReactElement | ReactElement[] | string;
  onClose: () => void;
  image?: JSX.Element | string;
};

const Modal = ({ message, onClose, image }: ModalProps) => {
  return (
    <div className="modal-background ">
      <div className="modal-content">
        <div className="modal-header">
          <button onClick={onClose}>close</button>
          <hr />
        </div>

        <div>
          {image && <div className="image-container">{image}</div>}

          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
