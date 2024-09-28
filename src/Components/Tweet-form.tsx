import { addDoc, collection, updateDoc } from "firebase/firestore";
import { ChangeEvent, FormEvent, MouseEvent, useState } from "react";
import styled from "styled-components";
import { auth, fireStore, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { FirebaseError } from "firebase/app";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const TextArea = styled.textarea`
  border-radius: 20px;
  border: 2px solid white;
  padding: 20px;
  outline: none;
  font-size: 16px;
  resize: none;
  color: white;
  background-color: black;
  &:focus{
    border: 2px solid #3FA2F6;
  }
`;

const Input = styled.input`
  display: none;
`;

const Label = styled.label`
  border: 2px solid #3FA2F6;
  border-radius: 20px;
  text-align: center;
  padding: 10px;
  color: #3FA2F6;
  cursor: pointer;
  font-size: 16px;
  position: relative;
  opacity: 0.7;
  &:hover{
    opacity: 1;
    transition: opacity 0.3s ease-in-out;
  }
`;

const Cancel = styled.span`
  position: absolute;
  right: 20px;
  color: tomato;
  z-index: 100;
`;

const Button = styled.button`
  background-color: #3FA2F6;
  border-radius: 20px;
  padding: 10px;
  opacity: 0.7;
  border: 2px solid white;
  cursor: pointer;
  font-size: 16px;
  &:hover{
    opacity: 1;
    transition: opacity 0.5s ease-in-out;
  }
`;

export default function TweetForm() {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>();
  const [post, setPost] = useState(false);


  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { target: { files } } = e;
    if (files && files.length === 1) {
      setFile(files[0]);
    }
  };

  const handleCancel = (e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    setFile(null);
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      try {
        setPost(true);
        const docRef = await addDoc(collection(fireStore, 'Tweet'), {
          userId: user.uid,
          message,
          createdAt: Date.now(),
          userName: user.displayName || 'Anonymous',
        });
        if (file) {
          const storageRef = ref(storage, `image/${user.uid}/${docRef.id}`);
          const result = await uploadBytes(storageRef, file);
          const photoURL = await getDownloadURL(result.ref);
          await updateDoc(docRef, {
            photoURL,
          })
        }
        setFile(null);
        setMessage('');
      } catch (e) {
        if (e instanceof FirebaseError) {
          console.log(e.message);
        }
      } finally {
        setPost(false);
      }
    };
  }

  return (
    <Form onSubmit={handleSubmit}>
      <TextArea rows={5} placeholder="Write Anything~!" value={message} onChange={handleChange} />
      <Input id='file' type="file" onChange={handleFileChange} />
      <Label htmlFor="file">{file ? `${file.name} 첨부 완료 ☑️` : 'Add ImageFile ➡️'}
        <Cancel onClick={handleCancel}>취소</Cancel>
      </Label>
      <Button>{post ? 'Wait for Posting...' : 'PostTweet'}</Button>
    </Form>
  );
}