import { useForm } from "react-hook-form";
import { AuthNav, Button, Error, Form, Input, Title, Wrapper } from "../Styled-components/Sign-form";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase";
import { useState } from "react";
import { FirebaseError } from "firebase/app";
import { Link, useNavigate } from "react-router-dom";
import GoogleBtn from "../Components/GoogleBtn";

interface InputState {
  name: string;
  email: string;
  password: string;
}

export default function CreateAccount() {
  const { register, handleSubmit } = useForm<InputState>();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validate = async (data: InputState) => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      if (data.name) {
        await updateProfile(credential.user, {
          displayName: data.name,
        })
      }
      navigate('/login');
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    }
  }

  return (
    <Wrapper>
      <Title>
        <span>Create</span>
        <svg viewBox="0 0 24 24" aria-hidden="true" className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1nao33i r-rxcuwo r-1777fci r-m327ed r-494qqr"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
      </Title>
      <Form onSubmit={handleSubmit(validate)}>
        <Input
          type="text"
          placeholder="name"
          {...register('name')} />
        <Input
          type="email"
          placeholder="email"
          {...register('email')} />
        <Input
          type="password"
          placeholder="password"
          {...register('password')} />
        <Button>CreateAccount</Button>
      </Form>
      <Error>{error}</Error>
      <AuthNav>Are you already have account?<Link to={'/login'}>Sign In &rarr;</Link></AuthNav>
      <GoogleBtn />
    </Wrapper>
  );
}