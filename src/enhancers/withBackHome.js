import Button from "../components/Button";

const withBackHome = (Component) => {
    return (props) => {
        const goBackFunc = useCallback(() => {
            if(props & props.goBack){
                props.goBack()
            }
        }, [props.goBack]);
        return (
            <div>
                <Button onClick={goBackFunc} text={"Go back"}/>
                <Component {...props}/>
            </div>
        )
    }
}

export default withBackHome;