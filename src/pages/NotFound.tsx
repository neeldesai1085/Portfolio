import { Link } from "react-router-dom";
import { useEffect } from "react";
import { usePortfolioStore } from "../store/portfolioStore";
import ProfileHeader from "../components/ProfileHeader";

export function NotFound() {

  const { theme } = usePortfolioStore();
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <>
      <ProfileHeader />
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-primary">404</h1>
          <p className="mb-4 text-xl text-muted-foreground">
            Oops! Page not found
          </p>
          <Link to="/" className="text-primary underline hover:text-primary/70">
            Return to Home
          </Link>
        </div>
      </div>
    </>
  );
}

export default NotFound;