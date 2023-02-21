import { useCallback } from "react";
import Button from "../components/Button";

const withBackHome = (Component) => {
    return (props) => {
        window.alert(`props: ${JSON.stringify(props)}`);

        const goBackFunc = useCallback(() => {
            window.alert('has nogo back function')

            if(props & props.goBack){
                window.alert('has go back function')
                props.goBack()
            }
        }, [props]);

        return (
            <div>
                <Button onClick={goBackFunc} text={"Go back"}/>
                <Component {...props}/>
            </div>
        )
    }
}

export default withBackHome;