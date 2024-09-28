import styled from "styled-components";
import TweetForm from "./Tweet-form";
import TimeLine from "./TimeLine";

const Wrapper = styled.div`
  margin-top: 50px;
  overflow: scroll;
  ::-webkit-scrollbar{
    display: none;
  }
`;

export default function Home() {

  return (
    <Wrapper>
      <TweetForm />
      <TimeLine />
    </Wrapper>
  );
}