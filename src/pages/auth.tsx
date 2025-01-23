import { SignIn } from "@clerk/clerk-react";

const Authentication = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignIn />
    </div>
  );
};

export default Authentication;
