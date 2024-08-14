export function validEmail(string){
    return string.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-])+([a-zA-Z]{1,})$/)
}

export function validPassword(params) {
   return params.match(/^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,16}$/)
}