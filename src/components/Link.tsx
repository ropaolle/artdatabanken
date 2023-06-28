// export default function Footer() {
//   return <footer className="container">&copy; RopaOlle.se 2023</footer>;
// }

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
        // setPage(page);
      }}
    >
      {children}
    </a>
  );
}
