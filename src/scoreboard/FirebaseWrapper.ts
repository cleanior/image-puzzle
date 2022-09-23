import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, User } from "firebase/auth";
import {
    collection,
    doc,
    Firestore,
    getDoc,
    getDocs,
    getFirestore,
    limit,
    orderBy,
    query,
    setDoc
} from "firebase/firestore"

import ScoreBoard, { Score } from "./ScoreBoard";

class FirebaseWrapper {

    private static firebaseApp: FirebaseApp;
    private static firebaseAuth: Auth;
    private static firestore: Firestore;

    public static initialize = () => {
        const firebaseConfig = {
            apiKey: process.env.REACT_APP_API_KEY,
            authDomain: process.env.REACT_APP_AUTH_DOMAIN,
            projectId: process.env.REACT_APP_PROJECT_ID,
            storageBucket: process.env.REACT_APP_STROAGE_BUCKET,
            messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
            appId: process.env.REACT_APP_APP_ID
        };

        this.bindEventHandler();

        this.firebaseApp = initializeApp(firebaseConfig);
        this.initializeAuth();
        this.firestore = getFirestore(this.firebaseApp);

        console.log("FirebaseWrapper:initialize() done.");
    }

    private static getDoc = async (groupId: string, userName: string) => {
        const documentSnapshot = await getDoc(doc(this.firestore, groupId, userName));
        const data = documentSnapshot.data();
        if (data) {
            return data as Score;
        } else {
            return null;
        }
    }

    private static getDocs = async (groupId: string, limitCount: number = 100) => {
        console.log("getDoc start.");
        const resultData = Array<Score>();
        const q = collection(this.firestore, groupId);
        console.log(q);
        const queryOrderedByScore = query(q, orderBy("minMoves"), limit(limitCount));
        const querySnapshot = await getDocs(queryOrderedByScore);
        querySnapshot.forEach((queryDocumentSnapshot) => {
            const data = queryDocumentSnapshot.data() as Score;
            console.dir(data);
            resultData.push(data);
        })

        console.log("getDoc done.");
        return resultData;
    }

    private static setDoc = async (score: Score) => {
        console.log("setDoc", score);
        await setDoc(doc(this.firestore, score.groupId, score.name), score);

        // for (let index = 0; index < 50; index++) {
        //     const randomNumber = Math.floor(Math.random() * 100);
        //     const nextScore = {
        //         groupId: score.groupId,
        //         name: score.name + index,
        //         numberOfTries: randomNumber,
        //         numberOfTriesOnMaxScore: randomNumber - 10,
        //         minMoves: randomNumber
        //     };
        //     setDoc(doc(this.firestore, nextScore.groupId, nextScore.name), nextScore);
        // }
    }

    private static bindEventHandler = () => {
        this.getDoc = this.getDoc.bind(this);
        this.getDocs = this.getDocs.bind(this);
        this.setDoc = this.setDoc.bind(this);
        this.onAuthChanged = this.onAuthChanged.bind(this);
        this.signIn = this.signIn.bind(this);

        ScoreBoard.registerUpdater(this.setDoc);
        ScoreBoard.registerSingleLoader(this.getDoc);
        ScoreBoard.registerLoader(this.getDocs);
        ScoreBoard.registerSignInRequester(this.signIn);
        console.log("FirebaseWrapper:bindEventHandler complete.");
    }

    private static onAuthChanged(user: User | null) {
        let userName = null;
        if (user) {
            userName = user.email;
        }
        ScoreBoard.onAuthStateChanged(userName);
    }

    private static initializeAuth = () => {
        this.firebaseAuth = getAuth(this.firebaseApp);
        onAuthStateChanged(this.firebaseAuth, this.onAuthChanged);
    }

    private static async signIn() {
        console.log("FirebaseWrapper:signIn()")
        const githubProvider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(this.firebaseAuth, githubProvider);
        console.log(userCredential);
    }
};

FirebaseWrapper.initialize();

export default FirebaseWrapper;