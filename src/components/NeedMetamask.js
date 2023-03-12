export function NeedMetamask() {
  return (
    <div className="container text-center my-5 py-5">
      <h6 className="display-6 my-5">
        You need to install Metamask before play
      </h6>

      <a
        className="btn btn-primary button"
        href="https://metamask.io/download/"
        target="_blank"
        rel="noreferrer"
      >
        <strong>
          <span className="fs-5">Install Metamask</span>
        </strong>
      </a>
    </div>
  );
}
