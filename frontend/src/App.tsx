import { Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";

import Navbar from "./components/layout/navbar";
import Provider from "./provider";
import { Spinner } from "./components/loading/animated-Loading";
import ProtectedRoute from "./components/utils/protected-route";
import api from "./services/api";
import { useUserStore } from "./store/user";

const Hero = lazy(() => import("./pages/public/landing"));
const Signup = lazy(() => import("./pages/auth/signup"));
const Login = lazy(() => import("./pages/auth/login"));

const Home = lazy(() => import("./pages/room/home"));
const RoomWrapper = lazy(() => import("./pages/room/room-wrapper"));

const PageNotFound = lazy(() => import("./pages/not-found"));

function App() {
  const { getUser, setUser } = useUserStore();
  const [authReady, setAuthReady] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me");

        if (response.status === 200) {
          setUser({
            username: response.data?.user?.username,
            email: response.data?.user?.email,
            id: response.data?.user?.id,
            accessToken: response.data?.user?.accessToken,
          });
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      } catch (error) {
      } finally {
        setAuthReady(true);
      }
    };

    fetchUser();
  }, [setUser]);

  return (
    <>
      <Provider>
        <Navbar />
        <Suspense
          fallback={
            <div className="flex justify-center items-center w-screen h-[100svh]">
              <Spinner className="size-20" />
            </div>
          }
        >
          <main className="flex-1">
            {authReady ? (
              <Routes>
                {/* public Routes - these should be accessible when NOT authenticated */}
                <Route
                  element={
                    <ProtectedRoute
                      isAuthenticated={!getUser()}
                      redirect="/room"
                    />
                  }
                >
                  <Route path="/" element={<Hero />} />
                  <Route path="auth/login" element={<Login />} />
                  <Route path="auth/signup" element={<Signup />} />
                </Route>

                {/* protected routes - these should be accessible when authenticated */}
                <Route
                  element={
                    <ProtectedRoute
                      isAuthenticated={!!getUser()}
                      redirect="/"
                    />
                  }
                >
                  <Route path="/room" element={<Home />} />
                  <Route path="/room/:roomId" element={<RoomWrapper />} />
                </Route>

                {/* Not Found Page */}
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            ) : (
              <div className="flex justify-center items-center w-screen h-[100svh]">
                <Spinner className="size-20" />
              </div>
            )}
          </main>
        </Suspense>
      </Provider>
    </>
  );
}

export default App;
