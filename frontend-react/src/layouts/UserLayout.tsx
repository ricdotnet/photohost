import Nav from '../components/nav/Nav';

function UserLayout({ children }: any) {

  return (
    <>
      <Nav/>
      <div className="px-10">
        <div className="max-w-[1280px] mx-auto">{children}</div>
      </div>
    </>
  );
}

export default UserLayout;
