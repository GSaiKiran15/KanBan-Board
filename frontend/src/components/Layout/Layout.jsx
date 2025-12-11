import { Navigate } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import useUser from "../../useUser";

export default function Layout({ children }) {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          color: "#e0e0e0",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <NavBar />
      <main style={{ minHeight: "calc(100vh - 60px)" }}>{children}</main>
    </>
  );
}
