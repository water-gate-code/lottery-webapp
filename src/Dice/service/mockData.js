export const MOCK_CREATE_DICE = ['0xadsfasdfasdfdfdfasdfasdftre'];
//  {
//     gambers: [{
//         name: '张小敬',
//         address: '0xadsfasdfasdfdfdfasdfasdftre',
//         select: 'big',
//     }],
//     diceId: 456,
// };

export const MOCK_JOIN_DICE = {
  gambers: [{
    name: '李必', address: '0xadsfasdfasdfdfdfasdfas234234', select: 'small',
  }, {
    name: '张小敬', address: '0xadsfasdfasdfdfdfasdfasdftre', select: 'big',
  }], diceId: 456,
}

export const MOCK_DICE_LIST = [{
  diceId: 123, gambers: [{
    name: '张小敬', address: '0xadsfasdfasdfasdfwer', select: 'big',
  }, {
    name: '', address: '', select: 'small',
  }],
}, {
  diceId: 234, gambers: [{
    name: '', address: '', select: 'big',
  }, {
    name: '李必', address: '0xadsfasdfasdfaasdfasdftre', select: 'small',
  }],

}, {
  diceId: 456, gambers: [{
    name: '檀棋', address: '0xadsfasdfasdfdfdfasdfasdftre', select: 'big',
  }, {
    name: '', address: '', select: 'small',
  }]
},];

export const MOCK_RESULT = {
  result: 5
}

export const MOCK_DICE_STATUS = {
  diceId: 456, gambers: [{
    name: '檀棋', address: '0xadsfasdfasdfdfdfasdfasdftre', select: 'big',
  }, {
    name: '李必', address: '0xadsfasdfasdfdfdfasd', select: 'small',
  }]
}