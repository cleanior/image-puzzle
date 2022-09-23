
interface ScoreBoardButtonProps {
    scoreBoardActivated: boolean;
    onClick: () => void;
};

const ScoreBoardButton = ({ scoreBoardActivated, onClick }: ScoreBoardButtonProps) => {
    return <button onClick={() => {
        console.log("Score Board Clicked!!");
        onClick();
    }}>{scoreBoardActivated ?
        "Back to Puzzle" :
        "Score Board"}
    </button>;
}

export default ScoreBoardButton;