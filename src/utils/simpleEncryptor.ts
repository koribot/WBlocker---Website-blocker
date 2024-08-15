// Todo: improve this
export function simpleEncryptor(str:string):{success:boolean, data: any}{
  if(typeof str==="string"){
    let encrypted = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)*str.length;
        encrypted = (encrypted << 5) - encrypted + char;
        encrypted |= 0;  
    }
    return {success: true, data: encrypted}
  }else{
    console.error(`${str} should be type of string but received: ${typeof str}`)
    return {success: false, data: "Error"}
    
  }
}