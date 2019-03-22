export default function deepClone (values) {
  let copy
  // 处理基本数据类型 null undefined
  if (values === null || typeof values !== 'object') return values

  // 处理数组
  if (values instanceof Array) {
    copy = []
    for (let i = 0; i < values.length; i++) {
      copy[i] = deepClone(values[i])
    }
    return copy
  }

  // 处理对象
  if (values instanceof Object) {
    copy = {}
    for (let attr in values) {
      if (values.hasOwnProperty(attr)) {
        copy[attr] = deepClone(values[attr])
      }
    }
    return copy
  }

  throw Error('大哥，请告诉我你传进来一个什么值??')
}
