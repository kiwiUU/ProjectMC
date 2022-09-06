import { Global } from '@emotion/react'
import { FC } from "react";

const Fonts = () => (
  <Global
    styles={`
      /* latin */
      @font-face {
        font-family: 'Heading Font Roboto-Condensed';
        src: url('./fonts/Roboto-Condensed.ttf') format('truetype');
      }
      /* latin */
      @font-face {
        font-family: 'Body Font Roboto-Condensed';
        src: url('./fonts/Roboto-Condensed.ttf') format('truetype');
      }
      /* latin */
      @font-face {
        font-family: 'Symtext';
        src: url('./fonts/Symtext.ttf') format('truetype');
      }
    `}
  />
)

export default Fonts