interface ShowOrderButtonProps {
    onClick: () => void;
}

const ShowOrderButton = ({ onClick }: ShowOrderButtonProps) => {
    return <button onClick={onClick}>Show Order</button>;
}

export default ShowOrderButton;