import Nav from "../components/nav/Nav";

function UserLayout({ children }: any) {

  return (
    <>
      <Nav />
      <div>{children}</div>
    </>
  )
}

export default UserLayout;
