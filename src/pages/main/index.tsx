import React from 'react'

import { Disconnected } from 'pages/disconnected'
import { Connected } from 'pages/connected'
import { useWeb3Context } from 'contexts/Web3Context'

export const Main = () => {
  const { status } = useWeb3Context()
  if (status._type === 'notAsked') {
    return <Disconnected></Disconnected>
  }
  if (status._type === 'connected') {
    return <Connected></Connected>
  } else {
    return null
  }
}
