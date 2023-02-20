const Button = (props) => {
    const {text, onClick} = props;
    return (
        <button
            type="button"
            className="btn btn-primary"
            onClick={onClick}
        >
            {text}
        </button>
    )
}

export default Button;