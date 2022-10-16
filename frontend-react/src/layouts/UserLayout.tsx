import Nav from '../components/nav/Nav';

function UserLayout({ children }: any) {

  return (
    <>
      <Nav/>
      <div className="px-4">
        <div className="max-w-[960px] mx-auto">{children}</div>
      </div>
    </>
  );
}

export default UserLayout;
