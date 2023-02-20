import './index.css';

const Loading = (props) => {
    const {text: ' Loading'} = props;
    return (
        <div className="loading">
            {text}
        </div>
    )
}

export default Loading;