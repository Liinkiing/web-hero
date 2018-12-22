import React, {FunctionComponent} from 'react';
import {observer} from "mobx-react-lite";
import gameStore from "../store/GameStore";
import {useRaf} from "../utils/hooks";
import FretButton from "./guitar/FretButton";
import styled from "styled-components";

const DebugInner = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 1200px;
`

const DebugController: FunctionComponent = () => {
  useRaf()
  const { isFretPressed } = gameStore

  return (
    <>
      <h1>Debug controller </h1>
      <DebugInner>
        <FretButton show={isFretPressed("GREEN_FRET")} fret="GREEN_FRET"/>
        <FretButton show={isFretPressed("RED_FRET")} fret="RED_FRET"/>
        <FretButton show={isFretPressed("YELLOW_FRET")} fret="YELLOW_FRET"/>
        <FretButton show={isFretPressed("BLUE_FRET")} fret="BLUE_FRET"/>
        <FretButton show={isFretPressed("ORANGE_FRET")} fret="ORANGE_FRET"/>
      </DebugInner>
    </>
  );
}

export default observer(
  DebugController
);
