import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../stores/userStore";
import { removeCookie } from "../../utils/cookie";

export default function Header() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);

  function handleLogout() {
    clearUser();
    removeCookie("accessToken");
    navigate("/login", { replace: true });
  }

  return (
    <header className="flex items-center justify-between bg-slate-900 px-6 py-3">
      <h1 className="text-xl font-semibold text-white">Vendor Tracker</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-white/90">{user?.name}</span>
        <Button variant="danger-soft" onPress={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}