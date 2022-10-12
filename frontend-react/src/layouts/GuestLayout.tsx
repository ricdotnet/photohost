function GuestLayout({ children }: any) {
  return (
    <div className="w-full h-full absolute flex justify-center items-center">
      {children}
    </div>
  )
}

export default GuestLayout;