type Title = {
  children: React.ReactNode;
};
const Title = ({ children }: Title) => {
  return <h1 className="text-antiflashwhite text-3xl text-center">{children}</h1>;
};

export default Title;
