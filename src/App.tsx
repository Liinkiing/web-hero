import React, {FunctionComponent, useEffect, useState} from 'react';
import styled from 'styled-components';
import DebugController from './components/DebugController';
import {useRaf} from './utils/hooks';
import gameStore from './store/GameStore';
import audioEngine from './AudioEngine';

interface StyledProps {
  background: string;
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
`;

const App: FunctionComponent = () => {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    console.log('loading sounds');
    audioEngine.init()
      .then(() => {
        console.log('finished loading');
        setLoaded(true)
      });
  }, []);

  if (!loaded) {
    return null
  }

  useRaf();
  const background = gameStore.backgroundColor;
  return (
    <AppInner className="App" background={background}>
      <main>
        <DebugController/>
      </main>
    </AppInner>
  );
};

export default App;
