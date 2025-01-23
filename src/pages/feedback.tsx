import Feedback from "@/components/global/feedback";
import { useUser } from "@clerk/clerk-react";

const FeedbackRoute = () => {
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
