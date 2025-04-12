export default function AboutPage() {
  return (
    <>
      <h1 className="sr-only">Thông tin trang web</h1>
      <div className="mx-auto mt-28 max-w-3xl px-4 sm:px-10">
        <h2 className="mb-5 border-b-2 border-dashed border-gray-600 pb-1 text-lg">
          Giới thiệu
        </h2>
        <p className="my-4">
          Chào mọi người. Mình là mhoangsb. Mình là người tạo ra trang web này.
        </p>
        <p className="my-4">{`Fill In The Gap là trang web giúp mọi người vừa được thử thách trình độ
             tiếng Anh, vừa được đọc những câu châm ngôn hay, bổ ích.`}</p>
        <p className="my-4">
          Mọi người có thể xem các project mình đã làm tại portfolio website{" "}
          <a
            href="https://mhoangsb.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-3 hover:text-gray-400"
          >
            mhoangsb.com
          </a>
          .
        </p>
        <p className="my-4">
          Source code của trang web này được mình public trên Github repo{" "}
          <a
            href="https://github.com/mhoangsb/fill-in-the-gap"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-3 hover:text-gray-400"
          >
            mhoangsb/fill-in-the-gap
          </a>
          .
        </p>
      </div>
    </>
  );
}

// TODO: make question easier relative to score
