import Sidebar from './Sidebar';

function Layout({ children }) {
  return (
    <div className="md:flex">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}

export default Layout;