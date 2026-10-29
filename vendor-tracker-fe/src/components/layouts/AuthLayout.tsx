import { useEffect } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import { getCookie } from '../../utils/cookie';

export default function AuthLayout() {
  const navigate = useNavigate()

  useEffect(() => {
    const accessToken = getCookie('accessToken');

    if (accessToken) navigate('/', { replace: true });
  }, []);

  return <Outlet />;
}