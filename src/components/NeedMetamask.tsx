import { useTranslation } from "react-i18next";

export function NeedMetamask() {
  const { t } = useTranslation();
  return (
    <div className="container text-center my-5 py-5">
      <h6 className="display-6 my-5">{t("needInstallMetamask")}</h6>

      <a
        className="btn btn-primary button"
        href="https://metamask.io/download/"
        target="_blank"
        rel="noreferrer"
      >
        <strong>
          <span className="fs-5">{t("installMetamask")}</span>
        </strong>
      </a>
    </div>
  );
}
