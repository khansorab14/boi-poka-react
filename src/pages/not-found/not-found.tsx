import { Player } from "@lottiefiles/react-lottie-player";

const NotFound = () => {
  return (
    <>
      <div className="cm-not-found">
        <Player
          style={{ height: "20rem", width: "20rem" }}
          background=""
          src="assets/animations/not-found.json"
          loop
          autoplay
        />
      </div>
    </>
  );
};

export default NotFound;
