import createNewMatch from "@/server-actions/createNewMatch";
import getNewQuestion from "@/server-actions/getNewQuestion";
import Game from "./_components/Game";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const initialMatchToken = await createNewMatch();

  const initialQuestionResponse = await getNewQuestion(initialMatchToken);

  if (!initialQuestionResponse.isOk) {
    throw new Error("Your code is f**ked");
  }

  const initialQuestion = initialQuestionResponse.payload;

  return (
    <div className="mx-auto max-w-5xl">
      <Game initialMatchToken={initialMatchToken} initialQuestion={initialQuestion} />
    </div>
  );
}
