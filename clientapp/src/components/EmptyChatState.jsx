import { AppName, ImagesSrc } from "../constant/constant";

function EmptyChatState() {
  return (
    <div className="col-md-9 p-0 chat-col">

      <div
        className="d-flex flex-column justify-content-center align-items-center h-100 text-center bg-light"
        style={{ minHeight: "100vh" }}
      >
        <img
          src={ImagesSrc.empty_ph}
          alt="No Chat Selected"
          width="120"
          className="mb-4"
        />

        <h4 className="fw-bold">Welcome to {AppName}</h4>

        <p className="text-muted">
          Select a conversation from the sidebar to start chatting.
        </p>

        {/* <button className="btn btn-primary mt-2">
          Start New Chat
        </button> */}
      </div>

    </div>
  );
};

export default EmptyChatState