import { RouterProvider } from "react-router-dom"
import router from '../router.jsx'
import styled, { createGlobalStyle } from "styled-components"
import reset from "styled-reset";
import { useEffect, useState } from "react";
import { auth } from "../firebase.js";

const GlobalStyle = createGlobalStyle`
  ${reset}
  body{
    background-color: black;
    color:white;
  }
`;

const Loading = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function init() {
      await auth.authStateReady();
      setLoading(false);
    };
    init();
  }, [])

  return (
    <>
      <GlobalStyle />
      {loading ? <Loading>is Loading...</Loading> : <RouterProvider router={router} />}
    </>
  )
}

export default App
