import { UserButton } from "@clerk/clerk-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { fetchResults } from "@/lib/utils";

type Props = {
  userId: string | null;
};

const Feedback = ({ userId }: Props) => {
  const [results, setResults] = useState([]);

  const fetchData = async () => {
    if (userId) {
      const data = await fetchResults(userId);
      setResults(data?.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  console.log(results);

  return (
    <div>
      <div className="p-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold ">Result & Review</h1>
          <p className="text-lg text-muted-foreground">
            View all the answers with score
          </p>
        </div>
        <UserButton />
      </div>

      <div className="p-4">
        {results?.map((result: any) => (
          <Accordion key={result.id} type="single" collapsible>
            <AccordionItem value={result.id}>
              <AccordionTrigger>{result?.question}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p className="text-sm font-normal">
                    <span className="font-semibold text-lg">Answer: </span>
                    {result?.transcript}
                  </p>
                  <p className="text-sm font-normal">
                    <span className="font-semibold text-lg">AI Analysis: </span>
                    {result?.AIResponse}
                  </p>

                  <p className="text-sm font-normal">
                    <span className="font-semibold text-lg">Score: </span>
                    {result?.score}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default Feedback;
