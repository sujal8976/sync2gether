import { Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";

import Navbar from "./components/layout/navbar";
import Provider from "./provider";
import { Spinner } from "./components/loading/animated-Loading";
import ProtectedRoute from "./components/utils/protected-route";
import api from "./services/api";
import { useUserStore } from "./store/user";
import { toast } from "sonner";
import { isAxiosError } from "axios";

const Signup = lazy(() => import("./pages/auth/signup"));
const Redirect = lazy(() => import("./pages/public/redirect"));
const Home = lazy(() => import("./pages/room/home"));
const Login = lazy(() => import("./pages/auth/login"));
const PageNotFound = lazy(() => import("./pages/not-found"));

function App() {
  const { getUser, setUser } = useUserStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me");

        if (response.status === 200) {
          setUser({
            username: response.data?.user?.username,
            email: response.data?.user?.email,
            id: response.data?.user?.id,
          });
        }
      } catch (error) {
        if (isAxiosError(error)) {}
        else toast.error("something went wrong");
      }
    };

    fetchUser();
  }, [setUser]);

  return (
    <>
      <Provider>
        <Suspense
          fallback={
            <div className="flex justify-center items-center w-screen h-screen">
              <Spinner className="size-20" />
            </div>
          }
        >
          <Navbar />
          <main className="flex-1">
            <Routes>

              {/* public Routes - these should be accessible when NOT authenticated */}
              <Route path="/" element={<Redirect />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute
                    isAuthenticated={!getUser()}
                    redirect="/room"
                  />
                }
              >
                <Route path="auth/login" element={<Login />} />
                <Route path="auth/signup" element={<Signup />} />
              </Route>
              
              {/* protected routes - these should be accessible when authenticated */}
              <Route
                path="/"
                element={
                  <ProtectedRoute
                    isAuthenticated={!!getUser()}
                    redirect="/auth/login"
                  />
                }
              >
                <Route path="" element={<Home />} />
              </Route>
              {/* Not Found Page */}
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </main>
        </Suspense>
      </Provider>
    </>
  );
}

export default App;
