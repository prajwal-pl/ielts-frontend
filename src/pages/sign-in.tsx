import { SignIn } from "@clerk/clerk-react";

type Props = {};

const SignInPage = (props: Props) => {
  return (
    <div>
      <SignIn path="/sign-in" />
    </div>
  );
};

export default SignInPage;
