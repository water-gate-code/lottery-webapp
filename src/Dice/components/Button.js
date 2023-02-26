const Button = (props) => {
  const { text, onClick } = props;
  return (
    <button
      type="button"
      className="btn btn-primary button"
      onClick={ onClick }
    >
      { text }
    </button>
  )
}

export default Button;