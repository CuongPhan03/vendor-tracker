import { Spinner } from '@heroui/react';
import { Outlet } from "react-router-dom";
import { useGetMe } from "../../hooks/useGetMe";
import Header from './Header';

export default function MainLayout() {
  const { data: user, isPending, isError } = useGetMe();

  if (isError) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-danger">Something went wrong</p>
      </div>
    );
  }

  if (!user?.email || isPending) {
    return <div className="h-screen flex items-center justify-center"><Spinner /></div>;
  }

  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}