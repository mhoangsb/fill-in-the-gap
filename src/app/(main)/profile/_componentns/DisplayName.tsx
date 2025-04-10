"use client";

import changeDisplayName from "@/server-actions/changeDisplayName";
import { ChangeDisplayNameServerActionErrorCode } from "@/utils/types";
import useServerActionWithPendingState from "@/utils/useServerActionWithPendingState";
import { useState } from "react";

export default function DisplayName({
  initialDisplayName,
}: {
  initialDisplayName: string;
}) {
  const [isChangeDisplayNamePending, changeDisplayNameServerAction] =
    useServerActionWithPendingState(changeDisplayName);
  const [oldName, setOldName] = useState(initialDisplayName);
  const [currentName, setCurrentName] = useState(initialDisplayName);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasNameChanged = oldName !== currentName;

  const handleSaveNewDisplayName = async () => {
    if (isChangeDisplayNamePending) {
      return;
    }

    const res = await changeDisplayNameServerAction(currentName);

    if (!res.isOk) {
      if (res.errorCode === ChangeDisplayNameServerActionErrorCode.NotAuthenticated) {
        throw new Error("This code shouldn't run");
      }

      if (res.errorCode === ChangeDisplayNameServerActionErrorCode.NameExisted) {
        setErrorMessage("Tên đã được sử dụng. Vui lòng chọn tên khác.");
        return;
      }
    }

    setOldName(currentName);
    setErrorMessage(null);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-y-1">
        <label className="flex-1/2">Tên hiển thị:</label>
        <div className="flex min-w-56 flex-1/2 justify-between border-2 border-dashed border-gray-800 focus-within:border-gray-600">
          <input
            value={currentName}
            onChange={(e) => setCurrentName(e.currentTarget.value)}
            className="min-w-44 grow px-4 py-2 focus:outline-none"
            type="text"
            minLength={1}
          />
          {hasNameChanged && (
            <button
              className="cursor-pointer border-l-2 border-dashed border-gray-800 px-4 text-sm hover:border-gray-600 hover:underline hover:underline-offset-2"
              onClick={handleSaveNewDisplayName}
            >
              {isChangeDisplayNamePending ? (
                <div className="mx-auto size-4 animate-spin border border-gray-500"></div>
              ) : (
                "Lưu"
              )}
            </button>
          )}
        </div>
      </div>
      {errorMessage && (
        <p className="mt-2 text-right text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}
