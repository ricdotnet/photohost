function UserLayout({ children }: any) {
  return (<>
    <div className="h-[70px] bg-slate-500 w-full"></div>
    <div>{children}</div>
  </>)
}

export default UserLayout;
