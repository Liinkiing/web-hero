import React, {FunctionComponent} from 'react';
import {observer} from "mobx-react-lite";
import gameStore from "../store/GameStore";
import {useRaf} from "../utils/hooks";

const DebugController: FunctionComponent = () => {
  useRaf()
  const { guitarInput } = gameStore

  return (
    <div>
      <h1>Debug controller </h1>
      {guitarInput.pressedButtons.map(button => <div key={button}>{button}</div>)}
    </div>
  );
}

export default observer(
  DebugController
);
