import { useUser } from "@clerk/clerk-react";
import TestInterface from "../components/global/test-interface";

export default function Home() {
  const { user, isSignedIn, isLoaded } = useUser();
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  if (!isSignedIn) {
    window.location.href = "/sign-in";
  }
  const userId = user?.id;
  console.log(userId);
  return (
    <div>
      <TestInterface userId={userId!} />
    </div>
  );
}
