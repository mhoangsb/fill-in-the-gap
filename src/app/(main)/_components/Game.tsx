"use client";

import { Roboto_Mono } from "next/font/google";

import { useEffect, useState } from "react";

import getNewQuestion, { QuestionSendToClient } from "@/server-actions/getNewQuestion";
import showAnswer from "@/server-actions/showAnswer";
import createNewMatch from "@/server-actions/createNewMatch";
import saveMatchResult from "@/server-actions/saveMatchResult";
import submitAnswer from "@/server-actions/submitAnswer";
import useServerActionWithPendingState from "@/utils/useServerActionWithPendingState";

import {
  HEALTH_BOOST,
  HEALTH_COST_SHOW_ANSWER,
  HEALTH_PENALTY_WRONG_ANSWER,
  INITIAL_HEALTH,
  INITIAL_SCORE,
  SCORE_PER_CORRECT_ANSWER,
  SCORE_PER_HEALTH_BOOST,
} from "@/utils/constants";
import transformToRichChars from "@/utils/transformToRichChars";
import getWords from "@/utils/getWords";

import Tally from "./Tally";
import SpinningSquare from "./SpinningSquare";
import PromptToLoginDialog from "./PromptToLoginDialog";
import NotEnoughHealthToShowAnswerDialog from "./NotEnoughHealthToShowAnswerDialog";

import { signIn, useSession } from "next-auth/react";

import { MatchStatus, RichChar, Word } from "@/utils/types";

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

  const [matchStatus, setMatchStatus] = useState<MatchStatus>("QuestionOngoing");
  const [score, setScore] = useState<number>(INITIAL_SCORE);
  const [health, setHealth] = useState<number>(INITIAL_HEALTH);

  const [question, setQuestion] = useState<RichChar[]>(
    transformToRichChars(initialQuestion.text, initialQuestion.hiddenCharIndexes),
  );
  const [author, setAuthor] = useState<string>(initialQuestion.author);

  // SA is short for ServerAction
  const [isSubmitAnswerPending, submitAnswerSA] =
    useServerActionWithPendingState(submitAnswer);
  const [isGetNewQuestionPending, getNewQuestionSA] =
    useServerActionWithPendingState(getNewQuestion);
  const [isShowingAnswerPending, showAnswerSA] =
    useServerActionWithPendingState(showAnswer);
  const [isCreateNewMatchPending, createNewMatchSA] =
    useServerActionWithPendingState(createNewMatch);

  const [
    isNotEnoughHealthToShowAnswerDialogOpen,
    setIsNotEnoughHealthToShowAnswerDialogOpen,
  ] = useState(false);
  const [isPromptToLoginDialogOpen, setIsPromptToLoginDialogOpen] = useState(false);

  const { data: authSession } = useSession();

  const words: Word[] = getWords(question);

  const showAnswerCore = async () => {
    const res = await showAnswerSA(matchToken);

    if (!res.isOk) {
      console.log(res);
      throw new Error(
        "showAnswer returned an error code. This should never happen in production",
      );
    }

    const answer: string = res.payload.originQuote;

    const questionWithHiddenCharsShown: RichChar[] = [...question];

    for (const richChar of questionWithHiddenCharsShown) {
      if (richChar.isHidden) {
        richChar.char = answer[richChar.originalIndex];
      }
    }

    setQuestion(questionWithHiddenCharsShown);

    // health cannot be below 0
    const newHealth = Math.max(health - HEALTH_COST_SHOW_ANSWER, 0);
    setHealth(newHealth);

    if (newHealth > 0) {
      setMatchStatus("QuestionFinished");
    } else {
      setMatchStatus("MatchFinished");
    }
  };

  const startNewMatchCore = async () => {
    const newMatchToken = await createNewMatchSA();
    setMatchToken(newMatchToken);

    const res = await getNewQuestionSA(newMatchToken);

    if (!res.isOk) {
      console.log(res);
      throw new Error(
        "createNewMatch returned an error code. This should never happen in production",
      );
    }

    const questionChars = transformToRichChars(
      res.payload.text,
      res.payload.hiddenCharIndexes,
    );

    setQuestion(questionChars);
    setAuthor(res.payload.author);
    setMatchStatus("QuestionOngoing");
    setScore(INITIAL_SCORE);
    setHealth(INITIAL_HEALTH);
  };

  const handleUserInputToHiddenChar = (originalIndex: number, newChar: string) => {
    const newQuestion = [...question];

    if (!newQuestion[originalIndex].isHidden) {
      throw new Error(
        "My code is flawed. User is modifying not hidden char." +
          "This code should never run in production.",
      );
    }

    newQuestion[originalIndex].char = newChar;

    setQuestion(newQuestion);
  };

  const handleUserSubmitAnswer = async () => {
    if (isSubmitAnswerPending) {
      return;
    }

    const fullQuote = question.map((char) => char.char).join("");

    const res = await submitAnswerSA(matchToken, fullQuote);

    if (!res.isOk) {
      console.log(res);
      throw new Error(
        "submitAnswer returned an error code. This should never happen in production",
      );
    }

    if (res.payload.isCorrect) {
      const newScore = score + SCORE_PER_CORRECT_ANSWER;
      setScore(newScore);

      const shouldPlayerGetHealthBoost = newScore % SCORE_PER_HEALTH_BOOST === 0;
      if (shouldPlayerGetHealthBoost) {
        setHealth(health + HEALTH_BOOST);
      }

      setMatchStatus("QuestionFinished");
    } else {
      // health cannot be below 0
      const newHealth = Math.max(health - HEALTH_PENALTY_WRONG_ANSWER, 0);
      setHealth(newHealth);

      if (newHealth <= 0) {
        setMatchStatus("MatchFinished");
        showAnswerCore();
      }
    }
  };

  const handleUserProcessToNextQuestion = async () => {
    const res = await getNewQuestionSA(matchToken);

    if (!res.isOk) {
      console.log(res);
      throw new Error(
        "getNewQuestion returned an error code. This should never happen in production",
      );
    }

    const questionChars = transformToRichChars(
      res.payload.text,
      res.payload.hiddenCharIndexes,
    );

    setQuestion(questionChars);
    setAuthor(res.payload.author);
    setMatchStatus("QuestionOngoing");
  };

  const handleUserShowAnswer = () => {
    if (health > HEALTH_COST_SHOW_ANSWER) {
      showAnswerCore();
    } else {
      setIsNotEnoughHealthToShowAnswerDialogOpen(true);
    }
  };

  const handleUserStartNewMatch = async () => {
    if (authSession) {
      await saveMatchResult(matchToken);
      await startNewMatchCore();
      return;
    }

    setIsPromptToLoginDialogOpen(true);
  };

  const handleUserLoginThenStartNewMatch = async () => {
    // Call signIn() will redirect user away from the current page, to the login page.
    // Thus, all state will be lost, including matchToken state, which is needed when
    // making the request (after user got redirect back to this page) to the server to
    // link current match with user account in DB.
    //
    // For the above reason, save matchToken state to sessionStorage so that I can
    // retrieve it after user got redirect back here (in useEffect)
    sessionStorage.setItem("matchToken", matchToken);

    // This AuthJS's signIn() function will redirect user away from this page, to the sign
    // in page.
    signIn();
  };

  useEffect(() => {
    // See also: handleUserLoginThenStartNewMatch()
    const previousMatchToken = sessionStorage.getItem("matchToken");

    if (previousMatchToken) {
      saveMatchResult(previousMatchToken);
    }

    sessionStorage.removeItem("matchToken");
  }, []);

  return (
    <div className="mt-28 px-4 sm:px-10">
      {/* Question section */}
      <div>
        <div className={`${robotoMono.className} text-center text-lg sm:text-2xl`}>
          {words.map((word, i) => (
            <div key={i} className="mt-1 mr-[1ch] inline-block">
              {word.map((char, j) => {
                if (char.isHidden) {
                  return (
                    <input
                      key={j}
                      type="text"
                      maxLength={1}
                      className="mx-0.5 w-[1ch] border-b border-gray-400 transition-shadow outline-none focus:border-gray-400"
                      autoCapitalize="none"
                      value={char.char}
                      onChange={(e) =>
                        handleUserInputToHiddenChar(char.originalIndex, e.target.value)
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

      {/* Button section */}
      <div className="mx-auto mt-7 flex max-w-md gap-3">
        {matchStatus === "QuestionOngoing" && (
          <>
            <button
              className="flex-1 cursor-pointer border-2 border-dashed border-gray-600 px-4 py-2 hover:border-gray-400"
              onClick={handleUserSubmitAnswer}
            >
              {isSubmitAnswerPending ? <SpinningSquare /> : <span>Gửi đáp án</span>}
            </button>
            <button
              className="flex-1 cursor-pointer border-2 border-dashed border-gray-600 px-4 py-2 hover:border-gray-400"
              onClick={handleUserShowAnswer}
            >
              {isShowingAnswerPending ? (
                <SpinningSquare />
              ) : (
                <span>Hiện đáp án (-{HEALTH_COST_SHOW_ANSWER} máu)</span>
              )}
            </button>
          </>
        )}

        {matchStatus === "QuestionFinished" && (
          <button
            className="flex-1 cursor-pointer border-2 border-dashed border-gray-600 px-4 py-2 hover:border-gray-400"
            onClick={handleUserProcessToNextQuestion}
          >
            {isGetNewQuestionPending ? <SpinningSquare /> : "Câu hỏi tiếp theo"}
          </button>
        )}

        {matchStatus === "MatchFinished" && (
          <button
            className="flex-1 cursor-pointer border-2 border-dashed border-gray-600 px-4 py-2 hover:border-gray-400"
            onClick={handleUserStartNewMatch}
          >
            {isCreateNewMatchPending ? (
              <SpinningSquare />
            ) : (
              "Ván đầu đã kết thúc. Bắt đầu ván mới"
            )}
          </button>
        )}
      </div>

      {/* Score + Health section */}
      <div className="mt-7 flex justify-center gap-3">
        <Tally label="Điểm" value={score} />
        <Tally label="Máu" value={health} />
      </div>

      {/* Dialogs */}
      <NotEnoughHealthToShowAnswerDialog
        currentHealth={health}
        isDialogOpen={isNotEnoughHealthToShowAnswerDialogOpen}
        onOpenChange={setIsNotEnoughHealthToShowAnswerDialogOpen}
        onUserShowAnswerAnyway={showAnswerCore}
      />

      <PromptToLoginDialog
        isDialogOpen={isPromptToLoginDialogOpen}
        onOpenChange={setIsPromptToLoginDialogOpen}
        onUserProcessAnonymously={startNewMatchCore}
        onUserProcessWithLogin={handleUserLoginThenStartNewMatch}
      />
    </div>
  );
}
