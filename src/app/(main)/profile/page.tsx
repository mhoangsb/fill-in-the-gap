import { auth, signIn, signOut } from "@/auth";
import DisplayName from "./_componentns/DisplayName";
import prisma from "@/utils/prisma";

// Don't put this inside ProfilePage() function
// Otherwise session variable (inside ProfilePage function)
// will be sent to the client due to JS function's closure
async function signInServerAction() {
  "use server";
  await signIn();
}

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    return (
      <div className="mx-auto mt-28 flex max-w-5xl flex-col items-center px-4 sm:px-10">
        <p className="">Đăng nhập để lưu lịch sử chơi + tham gia bảng xếp hạng.</p>
        <button
          className="mt-10 cursor-pointer border-2 border-dashed border-gray-600 px-4 py-2 hover:border-gray-400"
          onClick={signInServerAction}
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  if (!session.user?.email) {
    throw new Error("Cannot obtain user email after logging in");
  }

  const userInDB = await prisma.user.findUniqueOrThrow({
    where: {
      email: session.user.email,
    },
  });

  return (
    <div className="mx-auto mt-28 max-w-3xl px-4 sm:px-10">
      <h1 className="sr-only">Profile</h1>
      <div>
        <h2 className="mb-5 border-b-2 border-dashed border-gray-600 pb-1 text-lg">
          Thông tin tài khoản
        </h2>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-y-1">
          <label className="flex-1/2">Email:</label>
          <input
            value={userInDB.email}
            disabled
            className="flex-1/2 cursor-not-allowed border-2 border-dashed border-gray-800 px-4 py-2"
          />
        </div>
        <DisplayName initialDisplayName={userInDB.displayName} />
      </div>

      <button
        onClick={async () => {
          "use server";

          await signOut();
        }}
      >
        Sign out
      </button>
    </div>
  );
}
