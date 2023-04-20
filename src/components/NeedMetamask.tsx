import { useTranslation } from "react-i18next";
import { InstallMetamaskBtn } from "./InstallMetamaskBtn";

export function NeedMetamask() {
  const { t } = useTranslation();
  return (
    <div className="container text-center my-5 py-5">
      <h6 className="display-6 my-5">{t("needInstallMetamask")}</h6>
      <InstallMetamaskBtn />
    </div>
  );
}
