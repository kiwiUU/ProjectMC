import { Global } from '@emotion/react'
import { FC } from "react";

const Fonts = () => (
  <Global
    styles={`
      /* latin */
      @font-face {
        font-family: 'Heading Font Name';
        src: url('./fonts/Symtext.ttf') format('truetype');
      }
      /* latin */
      @font-face {
        font-family: 'Body Font Name';
        src: url('./fonts/Symtext.ttf') format('truetype')
      }
    `}
  />
)

export default Fonts