type Props = {
  children: React.ReactNode;
  onClick: () => void;
};

export default function Link({ children, onClick }: Props) {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </a>
  );
}
