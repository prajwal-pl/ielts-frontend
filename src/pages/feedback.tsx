import Feedback from "@/components/global/feedback";
import { useUser } from "@clerk/clerk-react";
import React from "react";

type Props = {};

const FeedbackRoute = (props: Props) => {
  const { user } = useUser();
  const userId = user?.id;

  console.log(userId);
  return (
    <div>
      <Feedback userId={userId!} />
    </div>
  );
};

export default FeedbackRoute;
