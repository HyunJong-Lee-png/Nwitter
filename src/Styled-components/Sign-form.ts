import styled from "styled-components";

export const Title = styled.div`
  font-size: 70px;
  margin: 50px 0;
  &>svg{
    width: 50px;
    fill: white;
  }
  &>span{
    margin-right: 10px;
  }
`;

export const Wrapper = styled.div`
  max-width: 480px;
  margin: 0 auto;
  text-align: center;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

export const Input = styled.input`
  padding: 15px;
  border-radius: 25px;
  font-size: 16px;
`;

export const Button = styled.button`
  padding: 15px;
  border-radius: 25px;
  background-color: #3FA2F6;
  font-size: 16px;
  cursor: pointer;
  opacity: 0.7;
  &:hover{
    opacity: 1;
    transition: opacity 0.5s ease-in-out;
  }
`;

export const Error = styled.div`
  font-weight: 600;
  color:tomato;
  margin-top: 20px;
`;

export const AuthNav = styled.div`
  font-size: 14px;
  &>a{
    color:#3FA2F6;
    margin-left: 10px;
  }
  margin-top: 20px;
`;

export const SocialLogin = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 25px;
  color:black;
  width: 80%;
  margin: 0 auto;
  margin-top: 20px;
  padding: 8px 0;
  font-weight: 600;
  cursor: pointer;
`;

export const Img = styled.img`
  width: 25px;
`;