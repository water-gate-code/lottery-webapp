import { useTranslation } from "react-i18next";

export function InstallMetamaskBtn() {
  const { t } = useTranslation();
  return (
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
  );
}
