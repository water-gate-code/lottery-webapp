import { useState } from "react";
import { play } from '../../service/utils';

const usePlayingGame = () => {
    const [diceShaking, setDiceShaking] = useState(false);
    const [diceNumber, setDiceNumber] = useState(0);

    const startPlaying = () => {
        setDiceShaking(true);
        play()
            .then((res) => {
                setDiceShaking(false);
                setDiceNumber(res.result);
            })
            .catch((err) => {
                // setDiceNumber(res.result);
                setDiceShaking(false);
            });
    }
    return {
        diceShaking,
        startPlaying,
        diceNumber,
    }
};

export default usePlayingGame;