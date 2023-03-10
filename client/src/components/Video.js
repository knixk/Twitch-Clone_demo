import React from "react";
import ReactPlayer from "react-player";

function Video() {
  return (
    <div className="video-container">
      <ReactPlayer
        url="https://www.youtube.com/watch?v=BQDh7qu2k1o"
        muted={true}
        controls={false}
        playing={true}
        width="100%"
        height="100%"
      ></ReactPlayer>
    </div>
  );
}

export default Video;
