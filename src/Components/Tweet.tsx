import styled from "styled-components";
import { InterTweet } from "./TimeLine";
import { collection, deleteDoc, doc } from "firebase/firestore";
import { auth, fireStore } from "../../firebase";
import { FirebaseError } from "firebase/app";

const Wrapper = styled.div`
  border: 2px solid white;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  padding: 20px;
  height: 100px;
  position: relative;
`;

const TweetInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  &>span:first-child{
    font-weight: 600;
  }
`;

const TweetPhoto = styled.img`
  width: 150px;
  border-radius: 20px;
`;

const DeleteTweet = styled.div`
  position: absolute;
  right: 3px;
  top: 3px;
  width: 25px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;


export default function Tweet({ id: docId, userName, userId, message, photoURL }: InterTweet) {
  const user = auth.currentUser;

  const handleDelete = async () => {
    const confirm = window.confirm('Are you want to delete this tweet?');
    if (confirm) {
      try {
        const docRef = doc(collection(fireStore, 'Tweet'), docId);
        console.log(docRef.id)
        await deleteDoc(docRef);
      } catch (e) {
        if (e instanceof FirebaseError) {
          console.log(e.message);
        }
      }
    }
  }

  return (
    <Wrapper>
      <TweetInfo>
        <span>{userName}</span>
        <span>{message}</span>
      </TweetInfo>
      {photoURL ? <TweetPhoto src={photoURL} /> : null}
      {user?.uid === userId ? <DeleteTweet onClick={handleDelete}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
        </svg>
      </DeleteTweet> : null}
    </Wrapper>
  );
}