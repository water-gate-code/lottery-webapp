import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function Result() {
  const { result } = useParams();
  const { t } = useTranslation();
  return <h6 className="display-6 my-5">{t("game.result", { result })}</h6>;
}
