import React from "react";
import DICE from "../service/getContract";
import './index.css';

const Version = React.memo(() => {
  return (
    <div className={'version'}>
      <span>{ `Contract Address: ${ DICE.address }` }</span>
      <span>UI Version: 0.1.0</span>
    </div>
  )
})

export default Version;