import { useRouteError } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Topbar } from "./Topbar";

export function ErrorPage() {
  const error: any = useRouteError();
  const { t } = useTranslation();
  return (
    <div>
      <Topbar />

      <div className="App container text-center mt-5">
        <h1 className="display-6">{t("errorPage.title")}</h1>
        <p className="lead">{t("errorPage.sorry")}</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </div>
  );
}
