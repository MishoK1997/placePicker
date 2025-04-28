import { forwardRef, useImperativeHandle,useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const Modal = forwardRef(function Modal({ children, open, onClose}, ref) {
  const dialog = useRef();

  // useImperativeHandle(ref, () => {
  //   return {
  //     open: () => {
  //       dialog.current.showModal();
  //     },
  //     close: () => {
  //       dialog.current.close();
  //     },
  //   };
  // });

  useEffect(()=> {
    if(open) {
      dialog.current.showModal();
    }else {
      dialog.current.close();
    }
  }, [open])

  return createPortal(
    // <dialog className="modal" ref={dialog} open={open}>
    <dialog className="modal" ref={dialog} onClose={onClose}>
      {open? children: null}
    </dialog>,
    document.getElementById('modal')
  );
});

export default Modal;
