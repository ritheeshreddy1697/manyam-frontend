import { useLocation } from "react-router-dom";

export default function PageWrapper({ children }) {
  const location = useLocation();

  // Home page should NOT have top padding
  const isHome = location.pathname === "/";

  return (
    <main className={isHome ? "" : "pt-24"}>
      {children}
    </main>
  );
}
