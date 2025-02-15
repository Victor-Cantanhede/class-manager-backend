


export default function passwordRules(password: string): string | boolean {

    // Senha possui entre 10 e 20 caracteres?
    const characters: boolean = password.length >= 10 && password.length <= 20;

    // Senha possui ao menos 1 letra maiúscula e 1 minúscula?
    const hasUppercaseAndLowercase: boolean = /^(?=.*[a-z])(?=.*[A-Z])/.test(password);

    // Senha possui caracteres especiais?
    const hasSpecialCharacters: boolean = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // Senha possui ao menos 1 letra e 1 número?
    const hasLettersAndNumbers: boolean = /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(password);


    // Verificando se a senha atende aos requisitos de cadastramento
    const validatePasswordCreation = (): string | true => {

        // Validando requisitos
        const requirements: { [key: string]: boolean } = {
            'A senha deve ter entre 10 e 20 caracteres': characters,
            'A senha deve ter ao menos 1 letra maiúscula e 1 minúscula': hasUppercaseAndLowercase,
            'A senha deve ter ao menos 1 caractere especial': hasSpecialCharacters,
            'A senha deve ter ao menos 1 letra e 1 número': hasLettersAndNumbers
        };

        const invalidRequirements = Object.keys(requirements).filter(rule => !requirements[rule]);

        if (invalidRequirements.length > 0) {
            return `A senha criada não atende aos requisitos: \n- ${invalidRequirements.join('\n- ')}`;
        }

        // Caso tudo esteja certo a função retornará true
        return true;
    }

    return validatePasswordCreation();
}