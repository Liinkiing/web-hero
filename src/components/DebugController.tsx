import React, {FunctionComponent} from 'react';
import {useGamepads, useRaf} from "../utils/hooks";

const DebugController: FunctionComponent = () => {
  const elapsed = useRaf()
  const guitar = useGamepads().find(gamepad => /(guitar)|(hero)/i.test(gamepad.id))
  if (!guitar) {
    return null
  }

  return (
    <div>
      <h1>Debug controller </h1>
      {guitar.buttons.map((button, index) =>
        <div key={index}>{button.pressed ? 'pressé' : 'non pressé'}</div>
      )}
    </div>
  );
}

export default DebugController;
