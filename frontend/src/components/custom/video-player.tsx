import VideoController from "./controller";

export default function VideoPlayer() {
  return (
    <>
      <iframe
        className="w-full h-[210px] md:h-[350px] lg:h-[450px]"
        src="https://www.youtube.com/embed/AZ0WM6U48lI"
        title="YouTube video player"
        frameBorder="0"
        // allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
      <VideoController />
      <div className=" hidden md:flex w-full justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">asdfasfafasfasfasfasfdasfasf</h3>
          <p>Added by: user123</p>
        </div>
        <div className="flex flex-col items-end">
          <p>Upvoted: 8</p>
          <p>Downvoted: 8</p>
        </div>
      </div>
    </>
  );
}
