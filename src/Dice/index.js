// User join:
//      Game [Create Button]
//      View all Dice status, with [Join Button][Refresh Button]
// User Click [Create Button]:
//      Choose Dice Type: big/small. (should be number)
//      Connect Wallet / Loading
//      Create Game / Loading
//      Into Game Room / Done
// User Click [Join Button]:
//      Connect Wallet / Loading
//      Join Game / Loaing
//        - Failed by room fulfilled 
//      Into Game Room / Done
//      
//
// User In Game Room:
//      Keep Polling room status
//      One User in the Room, Show Waiting      
//      Two User in the Room, Show Play
// One of the User Click Play:
//      Call play / Shaking Dice
//      Get Result / Stop Dice and show Result
//
improt withBackHome from "../enhancers/withBackHome";
import Button from "../components/Button";
import Loading from "../components/Loading";

const Dice = React.memo(()=> {
    const createRoom = useCallback(() => {
        console.log('createRoom');
    }, []);
    const refreshRoom = useCallback(() => {
        console.log('refreshRoom');
    }, []);
    const joinRoom = useCallback((roomId) => {
        console.log('joinRoom');
    }, []);
   return (
    <div>
        <Button onClick={createRoom} text={'Create Room'}/>
        <Button onClick={refreshRoom} text={'Refresh Room'}/>
        <Button onClick={joinRoom} text={'Join Room'}/>
    </div>
   )
});

export default withBackHome(Dice);