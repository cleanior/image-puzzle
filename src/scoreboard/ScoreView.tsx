import { useEffect, useState } from "react";
import FirebaseWrapper from "./FirebaseWrapper";
import ScoreBoard, { Score } from "./ScoreBoard";
import "./ScoreView.module.css"

type ScoreViewProps = {
    countLimit?: number;
    show?: boolean;
    src: string;
}

const tableHeader = () => {
    return <thead>
        <tr>
            <th>Rank</th>
            <th>User Name</th>
            <th>Moves</th>
        </tr>
    </thead>;
}

const useHighScores = (countLimit: number = 5, groupId: string, show: boolean) => {
    const [scores, setScores] = useState(Array<Score>());
    useEffect(() => {
        if (show) {
            console.log(FirebaseWrapper);
            const getHighScore = async () => {
                const scores = await ScoreBoard.getHighScore(groupId, countLimit);
                setScores(scores);
            };
            getHighScore();
        }
    }, [countLimit, groupId, show]);

    return scores;
}

const ScoreView = ({ countLimit = 5, show = false, src }: ScoreViewProps) => {
    const groupId = src;
    const scores = useHighScores(countLimit, groupId, show);

    return show ? <table>
        {tableHeader()}
        <tbody>{
            scores.map((score, index) => {
                return <tr key={score.name + index}>
                    <td>{index + 1}</td>
                    <td>{score.name}</td>
                    <td>{score.minMoves}</td>
                </tr>;
            })
        }</tbody>
    </table> : <></>;
}

export default ScoreView;