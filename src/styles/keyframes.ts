import {keyframes} from 'styled-components';

export const scale = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.3);
  }
`

export const show = keyframes`
  0% {
    filter: blur(10px);
    transform: scale(0.7);
  }
  100% {
    filter: blur(0);
    transform: scale(1);
  }
`
