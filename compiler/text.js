function genPropNode (k, v) {
  return {
    type: 'Property',
    key: {
      type: 'Identifier',
      name: k
    },
    computed: false,
    value: {
      type: 'Literal',
      value: v
    },
    kind: 'init',
    method: false,
    shorthand: false
  }
}

module.exports = {
  compile (objNode, px2remTags) {
    const props = objNode.properties
    let hasLines = false
    for (let i = 0, l = props.length; i < l; i++) {
      const propNode = props[i]
      const keyNode = propNode.key
      const keyType = keyNode.type
      const keyNodeValStr = keyType === 'Literal' ? 'value' : 'name'
      const keyName = keyNode[keyNodeValStr]
      const valNode = propNode.value
      if (keyName === 'lines') {
        hasLines = true
        keyNode[keyNodeValStr] = 'webkitLineClamp'
      }
      else if (px2remTags.indexOf(keyName) > -1) {
        propNode.value = {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: '_px2rem'
          },
          arguments: [valNode, { type: 'Literal', value: 75 }]
        }
      }
    }
    if (hasLines) {
      objNode.properties = props.concat([
        genPropNode('overflow', 'hidden'),
        genPropNode('textOverflow', 'ellipsis')
      ])
    }
  }
}
