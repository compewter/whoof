export function getObjValues(obj){
  let valueMap = {}
  Object.keys(obj).forEach((key)=>{
    valueMap[key] = obj[key].value
  })
  return valueMap
}

export function objToArrayOfValues(obj, keyToUse){
  let values = []
  Object.keys(obj).forEach((id)=>{
    let foundObject = obj[id]
    if(foundObject && foundObject[keyToUse]){
      values.push(foundObject[keyToUse])
    }
  })
  return values
}