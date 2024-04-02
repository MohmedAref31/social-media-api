export const objectSanitizer = (obj, ...fields)=>{
    let newObj = {};
    fields.forEach(field=> newObj[field] = obj[field])
    return newObj
}