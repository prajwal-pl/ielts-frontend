import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ClerkProvider, SignIn, SignUp } from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./App.tsx";
import { Toaster } from "sonner";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/sign-up"
            element={
              <div className="flex justify-center items-center h-screen">
                <SignUp />
              </div>
            }
          />
          <Route
            path="/sign-in"
            element={
              <div className="flex justify-center items-center h-screen">
                <SignIn />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ClerkProvider>
  </StrictMode>
);
