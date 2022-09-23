import { createHash } from "crypto";

export type Score = {
    groupId: string;
    name: string;
    numberOfTries: number;
    numberOfTriesOnMaxScore: number;
    minMoves: number;
};

type Updater = ((score: Score) => void) | null;
type Loader = ((groupId: string, limitCount: number) => Promise<Array<Score>>) | null;
type SingleLoader = ((groupId: string, userName: string) => Promise<Score | null>) | null;
type SignInRequester = (() => void) | null;

class ScoreBoard {

    private static currentUserName: string | null = null;
    private static saveScore: Updater = null;
    private static loadScore: SingleLoader = null;
    private static loadScores: Loader = null;
    private static signIn: SignInRequester = null;

    public static registerUpdater(updater: Updater) {
        this.saveScore = updater;
    }

    public static registerLoader(loader: Loader) {
        this.loadScores = loader;
    }

    public static registerSingleLoader(singleLoader: SingleLoader) {
        this.loadScore = singleLoader;
    }

    public static registerSignInRequester(signInRequester: SignInRequester) {
        this.signIn = signInRequester;
    }

    public static async addScore(
        groupId: string,
        numberOfTries: number,
        moves: number
    ) {
        if (this.currentUserName) {
            const hashedId = this.getHash(groupId);
            // check if record exists with the current ID before.
            let netNumberOfTries = numberOfTries;
            let netNumberOfTriesOnMaxScore = netNumberOfTries;
            let netMaxScore = moves;
            if (this.loadScore) {
                const prevScore = await this.loadScore(hashedId, this.currentUserName);
                if (prevScore) {
                    netNumberOfTries += prevScore.numberOfTries;
                    if (moves < prevScore.minMoves) {
                        netNumberOfTriesOnMaxScore = netNumberOfTries;
                    } else {
                        netNumberOfTriesOnMaxScore = prevScore.numberOfTriesOnMaxScore;
                        netMaxScore = prevScore.minMoves;
                    }
                }

                const scoreToSave = {
                    groupId: hashedId,
                    name: this.currentUserName,
                    numberOfTries: netNumberOfTries,
                    numberOfTriesOnMaxScore: netNumberOfTriesOnMaxScore,
                    minMoves: netMaxScore
                }
                if (this.saveScore) {
                    this.saveScore(scoreToSave);
                }
            } else {
                console.log("ScoreBoard:addScore():loadScore is not assigned.");
            }
        } else {
            console.log("ScoreBoard:addScore():Currently not signed in.");
            // recommend sign in to make score.
            if (this.signIn) {
                this.signIn();
            }

        }
    }

    public static async getHighScore(groupId: string, countLimit: number = 5) {
        // check signed in.
        let scores = Array<Score>();
        if (!this.currentUserName) {
            if (this.signIn) {
                this.signIn();
            }
        }

        if (this.currentUserName) {
            const hashedId = this.getHash(groupId);
            if (this.loadScores) {
                scores = await this.loadScores(hashedId, countLimit);
                console.log(scores);
            } else {
                console.log(`loadScores is ${this.loadScores}`);
            }
        }

        return scores;
    }

    public static onAuthStateChanged(userName: string | null) {
        this.currentUserName = userName;
        console.log(userName);
    }

    private static getScore(groupId: string, userName: string) {

    }

    private static getHash(input: string) {
        const hash = createHash("sha256");
        hash.update(input);
        const hashedData = hash.digest("hex");
        return hashedData;
    }


}

export default ScoreBoard;