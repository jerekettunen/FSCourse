interface HeaderProps {
  courseName: string;
}

const Header = (props: HeaderProps) => {
  return (
    <header>
      <h1>{props.courseName}</h1>
    </header>
  );
}
export default Header;