import React from "react";
import DICE from "../service/getContract";
import './index.css';

/**
 * UI_VERSION = Major.Minor.BuildNumber　
 * Major: 新功能，如：新增一种游戏，新支持一个链等
 * Minor: 合约更新
 * BuildNumber: 仅UI更新，或存量功能增强
 */
const UI_VERSION = '0.1.1';

const Version = React.memo(() => {

  return (
    <div className={ 'version' }>
      <span>{ `Contract Address: ${ DICE.address }` }</span>
      <span>{ `UI Version: ${ UI_VERSION }` }</span>
    </div>
  )
})

export default Version;