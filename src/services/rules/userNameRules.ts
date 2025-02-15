


export default function userNameRules(userName: string): boolean {

    // Nome de usuário deve conter de 10 a 20 caracteres
    if (userName.length >= 10 || userName.length <= 20) {
        return true;

    } else {
        return false;
    }
}