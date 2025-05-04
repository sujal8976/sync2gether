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

const Hero = lazy(() => import("./pages/public/landing"));
const Signup = lazy(() => import("./pages/auth/signup"));
const Login = lazy(() => import("./pages/auth/login"));

const Home = lazy(() => import("./pages/room/home"));
const Room = lazy(() => import("./pages/room/room"));

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
            <div className="flex justify-center items-center w-screen h-[100svh]">
              <Spinner className="size-20" />
            </div>
          }
        >
          <Navbar />
          <main className="flex-1">
            <Routes>

              {/* public Routes - these should be accessible when NOT authenticated */}
              <Route
                path="/"
                element={
                  <ProtectedRoute
                  isAuthenticated={!getUser()}
                  redirect="/room"
                  />
                }
              >
                <Route path="" element={<Hero />} />
                <Route path="auth/login" element={<Login />} />
                <Route path="auth/signup" element={<Signup />} />
              </Route>
              
              {/* protected routes - these should be accessible when authenticated */}
              <Route
                path="/"
                element={
                  <ProtectedRoute
                    isAuthenticated={!!getUser()}
                    redirect="/"
                  />
                }
              >
                <Route path="room" element={<Home />} />
                <Route path="room/:roomId" element={<Room />} />
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
