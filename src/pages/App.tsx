import { useUser } from "@clerk/clerk-react";
import TestInterface from "../components/global/test-interface";

export default function Home() {
  const { user } = useUser();
  const userId = user?.id;
  console.log(userId);
  return (
    <div>
      <TestInterface userId={userId!} />
    </div>
  );
}
