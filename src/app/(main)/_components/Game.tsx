"use client";

import { Roboto_Mono } from "next/font/google";

import getNewQuestion, { QuestionSendToClient } from "@/server-actions/getNewQuestion";
import {
  HEALTH_BOOST,
  HEALTH_COST_SHOW_ANSWER,
  HEALTH_PENALTY_WRONG_ANSWER,
  INITIAL_HEALTH,
  INITIAL_SCORE,
  SCORE_PER_CORRECT_ANSWER,
  SCORE_PER_HEALTH_BOOST,
} from "@/utils/constants";
import { useState } from "react";
import Tally from "./Tally";
import useServerActionWithPendingState from "@/utils/useServerActionWithPendingState";
import submitAnswer from "@/server-actions/submitAnswer";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import showAnswer from "@/server-actions/showAnswer";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
});

export default function Game({
  initialMatchToken,
  initialQuestion,
}: {
  initialMatchToken: string;
  initialQuestion: QuestionSendToClient;
}) {
  const [matchToken, setMatchToken] = useState<string>(initialMatchToken);
  const [question, setQuestion] = useState<QuestionCharacter[]>(
    getQuestionCharacters(initialQuestion.text, initialQuestion.missingCharacterIndexes),
  );
  const [missingCharIndexes, setMissingCharIndexes] = useState<number[]>(
    initialQuestion.missingCharacterIndexes,
  );
  const [author, setAuthor] = useState<string>(initialQuestion.author);
  const [score, setScore] = useState<number>(INITIAL_SCORE);
  const [health, setHealth] = useState<number>(INITIAL_HEALTH);
  const [matchStatus, setMatchStatus] = useState<MatchStatus>("QuestionOngoing");
  const [isSubmitAnswerPending, submitAnswerServerAction] =
    useServerActionWithPendingState(submitAnswer);
  const [isGetNewQuestionPending, getNewQuestionServerAction] =
    useServerActionWithPendingState(getNewQuestion);
  const [isShowingAnswerPending, showAnswerServerAction] =
    useServerActionWithPendingState(showAnswer);
  const [
    isNotEnoughHealthToShowAnswerDialogOpen,
    setIsNotEnoughHealthToShowAnswerDialogOpen,
  ] = useState(false);

  const questionSegments = getQuestionSegments(question);

  const setNewCharacterValue = (questionTextIndex: number, newChar: string) => {
    const newQuestion = [...question];

    if (!newQuestion[questionTextIndex].isHiddenChar) {
      throw new Error("This code should never run");
    }

    newQuestion[questionTextIndex].char = newChar;

    setQuestion(newQuestion);
  };

  const handleSubmitAnswer = async () => {
    if (isSubmitAnswerPending) {
      return;
    }

    const fullQuote = question.map((char) => char.char).join("");

    const result = await submitAnswerServerAction(matchToken, fullQuote);

    if (!result.isOk) {
      console.log(result);
      throw new Error("Error");
    }

    if (result.payload.isCorrect) {
      setScore(score + SCORE_PER_CORRECT_ANSWER);

      if ((score + SCORE_PER_CORRECT_ANSWER) % SCORE_PER_HEALTH_BOOST === 0) {
        setHealth(health + HEALTH_BOOST);
      }

      setMatchStatus("QuestionFinished");
    } else {
      const newHealth = health - HEALTH_PENALTY_WRONG_ANSWER;
      setHealth(newHealth);

      if (newHealth <= 0) {
        setMatchStatus("MatchFinished");
      }
    }
  };

  const handleGetNewQuestion = async () => {
    const res = await getNewQuestionServerAction(matchToken);

    if (!res.isOk) {
      console.log(res);
      throw new Error("Error");
    }

    const questionCharacters = getQuestionCharacters(
      res.payload.text,
      res.payload.missingCharacterIndexes,
    );

    setQuestion(questionCharacters);
    setAuthor(res.payload.author);
    setMissingCharIndexes(res.payload.missingCharacterIndexes);
    setMatchStatus("QuestionOngoing");
  };

  const handleShowAnswer = () => {
    if (health > HEALTH_COST_SHOW_ANSWER) {
      showAnswerCore();
    } else {
      setIsNotEnoughHealthToShowAnswerDialogOpen(true);
    }
  };

  const showAnswerCore = async () => {
    const res = await showAnswerServerAction(matchToken);

    if (!res.isOk) {
      console.log(res);
      throw new Error("Error");
    }

    const answer = res.payload.originQuote;

    setQuestion(getQuestionCharacters(answer, missingCharIndexes));

    // health cannot be below 0
    const newHealth = Math.max(health - HEALTH_COST_SHOW_ANSWER, 0);
    setHealth(newHealth);

    if (newHealth > 0) {
      setMatchStatus("QuestionFinished");
    } else {
      setMatchStatus("MatchFinished");
    }
  };

  const handleStartNewMatch = async () => {};

  return (
    <div className="mt-28 px-4 sm:px-10">
      <div>
        <div className={`${robotoMono.className} text-center text-lg sm:text-2xl`}>
          {questionSegments.map((segment, i) => (
            <div key={i} className="mr-[1ch] inline-block">
              {segment.map((char, j) => {
                if (char.isHiddenChar) {
                  return (
                    <input
                      key={j}
                      type="text"
                      maxLength={1}
                      className="mx-0.5 w-[1ch] border-b border-gray-400 transition-shadow outline-none focus:border-gray-400"
                      value={char.char}
                      onChange={(e) =>
                        setNewCharacterValue(char.originalIndex, e.target.value)
                      }
                    />
                  );
                }
                return <span key={j}>{char.char}</span>;
              })}
            </div>
          ))}
        </div>
        <div className="mt-7 px-3 text-right sm:px-10">{`- ${author} -`}</div>
      </div>

      <div className="mx-auto mt-7 flex max-w-md gap-3">
        {matchStatus === "QuestionOngoing" && (
          <>
            <button
              className="flex-1 cursor-pointer border-2 border-dashed border-gray-600 px-4 py-2 hover:border-gray-400"
              onClick={handleSubmitAnswer}
            >
              {isSubmitAnswerPending ? <LoadingDiv /> : <span>Gửi đáp án</span>}
            </button>
            <button
              className="flex-1 cursor-pointer border-2 border-dashed border-gray-600 px-4 py-2 hover:border-gray-400"
              onClick={handleShowAnswer}
            >
              {isShowingAnswerPending ? (
                <LoadingDiv />
              ) : (
                <span>Hiện đáp án (-{HEALTH_COST_SHOW_ANSWER} máu)</span>
              )}
            </button>
          </>
        )}
        {matchStatus === "QuestionFinished" && (
          <button
            className="flex-1 cursor-pointer border-2 border-dashed border-gray-600 px-4 py-2 hover:border-gray-400"
            onClick={handleGetNewQuestion}
          >
            {isGetNewQuestionPending ? <LoadingDiv /> : "Câu hỏi tiếp theo"}
          </button>
        )}
        {matchStatus === "MatchFinished" && (
          <button
            className="flex-1 cursor-pointer border-2 border-dashed border-gray-600 px-4 py-2 hover:border-gray-400"
            onClick={handleStartNewMatch}
          >
            Ván đầu đã kết thúc. Bắt đầu ván mới
          </button>
        )}
      </div>

      <div className="mt-7 flex justify-center gap-3">
        <Tally label="Điểm" value={score} />
        <Tally label="Máu" value={health} />
      </div>

      <AlertDialog
        open={isNotEnoughHealthToShowAnswerDialogOpen}
        onOpenChange={setIsNotEnoughHealthToShowAnswerDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Máu của bạn đang quá thấp</AlertDialogTitle>
            <AlertDialogDescription>
              {`Cần ${HEALTH_COST_SHOW_ANSWER} máu để hiện đáp án. Bạn đang có ${health} máu. Vòng chơi sẽ kết thúc nếu bạn đồng ý hiện đáp án.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={showAnswerCore}>
              Vẫn hiện đáp án
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function LoadingDiv() {
  return <div className="mx-auto size-4 animate-spin border border-gray-500"></div>;
}

type MatchStatus = "QuestionOngoing" | "QuestionFinished" | "MatchFinished";

/**
 * Originally, question text is string (each character is also a string)
 *
 * QuestionCharacter type represent each character (string) but with extra
 * information like is the current character a hidden one, and if it is,
 * what is its index in the original question text.
 */
type QuestionCharacter =
  | {
      isHiddenChar: true;
      originalIndex: number;
      char: string;
    }
  | {
      isHiddenChar: false;
      char: string;
    };

/**
 * Convert question text of type string to type QuestionCharacter
 */
function getQuestionCharacters(
  questionText: string,
  missingCharIndexes: number[],
): QuestionCharacter[] {
  return questionText.split("").map((char, i) => {
    if (!missingCharIndexes.includes(i)) {
      return {
        isHiddenChar: false,
        char,
      };
    }

    return {
      isHiddenChar: true,
      originalIndex: i,

      // TODO: I don't like using underscore as placeholder
      char: char === "_" ? "" : char,
    };
  });
}

/**
 * Segment is a list of QuestionCharacter that will be displayed in the same line
 * For example: "ferrari" but not "fer
 * rari"
 */
function getQuestionSegments(
  questionCharacters: QuestionCharacter[],
): Array<QuestionCharacter[]> {
  const segmentList: Array<QuestionCharacter[]> = [];

  let tempSegment: QuestionCharacter[] = [];

  for (let i = 0; i < questionCharacters.length; ++i) {
    const char = questionCharacters[i];

    if (!char.isHiddenChar && char.char === " ") {
      segmentList.push(tempSegment);
      tempSegment = [];
    }

    tempSegment.push(char);
  }

  if (tempSegment.length) {
    segmentList.push(tempSegment);
  }

  return segmentList;
}
