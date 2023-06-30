import { useState, useEffect } from 'react';

type Props = {
  id?: string;
  title: string;
  open: boolean;
  // show: (open: boolean) => void;
  show: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
};

// const showDialog = (dialog: number, show = true, data?: SpeciesInfo) => {
//   switch (dialog) {
//     case Dialogs.UPLOAD_IMAGE_DIALOG:
//       setShowUploadDialog(show);
//       break;
//     case Dialogs.ADD_SPECIES_DIALOG:
//       if (data) setSpeciesDialog(data);
//       setShowSpeciesDialog(show);
//       break;
//   }
// };

export default function Dialog({ id, title, open, show, children }: Props) {
  // const [isOpen, setIsOpen] = useState(false);

  const handleClose = (e: React.FormEvent) => {
    e.preventDefault();
    show(false);
    // setIsOpen(false);
    // close();
  };

  // useEffect(() => {
  //   setIsOpen(open);
  // }, [open]);

  return (
    <dialog id={id} open={open}>
      <form className="form" /* onSubmit={handleSubmit(onSubmit)} */>
        <article>
          <header>
            <a href="#" aria-label="Close" className="close" onClick={handleClose}></a>
            <div><b>{title}</b></div>
          </header>
          {children}
        </article>
      </form>
    </dialog>
  );
}
