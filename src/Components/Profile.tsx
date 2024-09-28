import styled from "styled-components";
import { InterTweet } from "./TimeLine";
import { ChangeEvent, useEffect, useState } from "react";
import { collection, limit, onSnapshot, orderBy, query, Unsubscribe, where } from "firebase/firestore";
import { auth, fireStore, storage } from "../../firebase";
import Tweet from "./Tweet";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";

const Wrapper = styled.div`
  margin-top: 50px;
  overflow: scroll;
`;

const Tweets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 50px;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
`;

const ProfileInput = styled.input`
  display: none;
`;

const ProfileImg = styled.img`
  width: 100%;
`;

const Label = styled.label`
  width: 150px;
  height: 150px;
  border: 1px solid white;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const ProfileNameInfo = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileName = styled.span`
  font-weight: 600;
`;

const EditName = styled.span`
  margin-left: 10px;
  &>svg{
    width: 20px;
  }
  cursor: pointer;
`;

export default function Profile() {
  const [tweets, setTweets] = useState<InterTweet[]>([]);
  const user = auth.currentUser;
  const [url, setUrl] = useState(user?.photoURL);
  const [name, setName] = useState(user?.displayName);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { target: { files } } = e;
    if (user) {
      if (files && files.length === 1) {
        const file = files[0];
        const storageRef = ref(storage, `profile/${user.uid}`);
        const result = await uploadBytes(storageRef, file);
        const photoURL = await getDownloadURL(result.ref);
        await updateProfile(user, {
          photoURL,
        })
        setUrl(user.photoURL);
      }
    }
  }

  const handleEdit = async () => {
    const newName = window.prompt('Edit your name!');
    if (user && newName) {
      await updateProfile(user, {
        displayName: newName,
      });
      setName(user.displayName);
    }
  }

  useEffect(() => {
    let unSubscribe: Unsubscribe;
    if (user) {
      const collectionRef = collection(fireStore, 'Tweet');
      const q = query(collectionRef, orderBy('createdAt', 'desc'), limit(25), where('userId', "==", user.uid));
      unSubscribe = onSnapshot(q, {
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
      });
    }

    return () => unSubscribe && unSubscribe();
  }, [])

  return (
    <Wrapper>
      <ProfileInfo>
        <Label htmlFor="profile">
          {!!url ? <ProfileImg src={url} />
            : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
            </svg>}
        </Label>
        <ProfileInput type="file" id="profile" onChange={handleChange} />
        <ProfileNameInfo>
          <ProfileName>{name ?? 'Anonymous'}</ProfileName>
          <EditName onClick={handleEdit}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
              <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
            </svg>
          </EditName>
        </ProfileNameInfo>
      </ProfileInfo>
      <Tweets>
        {tweets.map(tweet => <Tweet key={tweet.id} {...tweet} />)}
      </Tweets>
    </Wrapper>
  );
}