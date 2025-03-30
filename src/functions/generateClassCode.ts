

// Função para gerar código de turma baseado na data e hora
const generateClassCode = (): string => {
    const getCurrentDateTime = new Date().toLocaleString('pt-br', { hour12: false });
    const newClassCode = getCurrentDateTime.replace(/\D/g, "");

    return newClassCode;
}

export default generateClassCode;