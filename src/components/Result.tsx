import { useParams } from "react-router-dom";

export function Result() {
  const { result } = useParams();
  return <h6 className="display-6 my-5">You {result}</h6>;
}
