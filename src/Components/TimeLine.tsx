import { useEffect, useState } from "react";
import styled from "styled-components";
import { fireStore } from "../../firebase";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import Tweet from "./Tweet";

export interface InterTweet {
  id: string;
  userId: string;
  message: string;
  createdAt: number;
  userName: string;
  photoURL?: string;
}

const Tweets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 50px;
`;

export default function TimeLine() {
  const [tweets, setTweets] = useState<InterTweet[]>([]);

  useEffect(() => {
    const collectionRef = collection(fireStore, 'Tweet');
    const q = query(collectionRef, orderBy('createdAt', 'desc'), limit(25));

    const unSubscribe = onSnapshot(q, {
      next(snapshot) {
        const docs = snapshot.docs.map(doc => {
          const { userId, userName, createdAt, message, photoURL } = doc.data();
          return {
            id: doc.id,
            userId, userName, createdAt, message, photoURL,
          }
        }
        );
        setTweets(docs);
      },
      error(error) {
        console.log(error.message);
      },
    })

    return () => unSubscribe();
  }, [])
  
  return (
    <Tweets>
      {tweets.map(tweet => <Tweet key={tweet.id}{...tweet} />)}
    </Tweets>
  );
}