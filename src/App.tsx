import React, {FunctionComponent} from 'react';
import styled from "styled-components";
import DebugController from "./components/DebugController";
import {useRaf} from "./utils/hooks";
import gameStore from "./store/GameStore";

interface StyledProps {
  background: string,
}

const AppInner = styled.div<StyledProps>`
  
  transition: all 0.1s;
  text-align: center;
  background-color: ${(props: StyledProps) => props.background};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;

  .App-logo {
    animation: App-logo-spin infinite 20s linear;
    height: 40vmin;
  }
  
  .App-link {
    color: #61dafb;
  }
  
  @keyframes App-logo-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

const App: FunctionComponent = () => {
  useRaf()
  const background = gameStore.backgroundColor
  return (
    <AppInner className="App" background={background}>
      <main>
        <DebugController/>
      </main>
    </AppInner>
  );
}

export default App;
