const withBackHome = (Component) => {
    return (props) => {
        const goBackFunc = useCallback(() => {
            if(props & props.goBack){
                props.goBack()
            }
        }, [props.goBack]);
        return (
            <div>
                 <button
                    type="button"
                    className="btn btn-primary"
                    onClick={goBackFunc}
                >
                    Go back
                </button>
                <Component {...props}/>
            </div>
        )
    }
}

export default withBackHome;