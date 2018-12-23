import React, {FunctionComponent, useRef, useState} from 'react';
import {Fret} from '../../utils/interfaces';
import styled, {css} from 'styled-components';
import {show} from '../../styles/keyframes';
import {GuitarEvents} from '../../input/GuitarInput';
import {useGuitarEvent} from '../../utils/hooks';
import {wait} from '../../utils/promises';
import {List} from "../../utils/extensions";
import audioEngine from "../../AudioEngine";

interface Props {
  fret: Fret,
  show: boolean
}

export const mapFretToColor = (fret: Fret, opacity: number = 1): string => {
  switch (fret) {
    case 'GREEN_FRET':
      return `rgba(0,255,0,${String(opacity)})`
    case 'RED_FRET':
      return `rgba(255,0,0,${String(opacity)})`
    case 'YELLOW_FRET':
      return `rgba(255,255,0,${String(opacity)})`
    case 'BLUE_FRET':
      return `rgba(0,0,255,${String(opacity)})`
    case 'ORANGE_FRET':
      return `rgba(255,165,0,${String(opacity)})`
  }
}

const FretButtonInner = styled.div<Props>`
  transition: all 0.1s;
  visibility: ${(props: Props) => props.show ? 'visible' : 'hidden'};
  background: ${(props: Props) => mapFretToColor(props.fret)};
  margin: 20px;
  padding: 10px;
  box-shadow: 0 0 30px ${(props: Props) => mapFretToColor(props.fret, 0.15)};
  ${(props: Props) => props.show && css`animation ${show} 0.15s`};
  &.strumming {
    transform: scale(1.1);
    box-shadow: 0 0 60px ${(props: Props) => mapFretToColor(props.fret, 0.5)};
  }
`

const FretButton: FunctionComponent<Props> = (props) => {
  const { fret, show } = props
  const ref = useRef<HTMLDivElement>(null)
  useGuitarEvent(GuitarEvents.Strum, async () => {
    if (!show || !ref.current) { return; }
    audioEngine.play(fret)
    ref.current.classList.add('strumming')
    document.body.classList.add('strumming')
    await wait(150)
    ref.current.classList.remove('strumming')
    document.body.classList.remove('strumming')

  }, [show])

  useGuitarEvent(GuitarEvents.StrumRelease, () => {
    if (!show || !ref.current) { return; }
    ref.current.classList.remove('strumming')
    document.body.classList.remove('strumming')
  }, [show])

  return (
    <FretButtonInner {...props} ref={ref}>
      {fret}
    </FretButtonInner>
  )
}

FretButton.defaultProps = {
  show: true
}

export default FretButton
