interface ShowOrderButtonProps {
    onClick: () => void;
    show?: boolean;
}

const ShowOrderButton = ({ onClick, show = true }: ShowOrderButtonProps) => {
    return show ? <button onClick={onClick}>Show Order</button> : <></>;
}

export default ShowOrderButton;