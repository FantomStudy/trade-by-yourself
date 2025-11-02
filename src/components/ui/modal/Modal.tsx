import type { ReactNode } from "react";

import { createPortal } from "react-dom";

import { Button } from "../button/Button";
import { CrossIcon } from "../icons/CrossIcon";

import styles from "./Modal.module.css";

interface ModalProps {
  content: ReactNode;
  onClose: () => void;
}

export const Modal = ({ content, onClose }: ModalProps) => {
  return createPortal(
    <div className={styles.modal}>
      <div className={styles.backdrop} onClick={onClose} role="none" />
      <div className={styles.content}>
        <Button
          className={styles.closeButton}
          size="icon"
          variant="ghost"
          onClick={onClose}
        >
          <CrossIcon />
        </Button>
        {content}
      </div>
    </div>,
    document.body
  );
};
