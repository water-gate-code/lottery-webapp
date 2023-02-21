import { useEffect, useState } from "react";
import { getCurrentActiveDice } from '../../service/utils';

const useFetchGames = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchTimes, setFetchTimes] = useState(0);

    useEffect(() => {
        let didCancel = false;
        setLoading(true);
        getCurrentActiveDice()
        .then((data) => {
            setLoading(false);
            if(didCancel){
                return;
            }
            setGames(data);
        })
        .catch((error) => {
            setLoading(false);
            console.log('getCurrentActiveDice err: ',JSON.stringify(error));
        });

        return () => {
            didCancel = true;
        }
    }, [fetchTimes]);

    return {
        games,
        ListLoading: loading,
        refetchGames: () => setFetchTimes(times => times + 1)
    }
}

export default useFetchGames;