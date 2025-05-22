export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};

export const currencyFormatterForField = (value: string) => {
    if (!value) return "";

    const number = Number(value);
    const amount = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(number / 100);

    return `${amount}`;
}

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

export const formatTimestamp = (timestampString: string): string => {
    const timestamp = new Date(`1970-01-01T${timestampString}`);
    return timestamp.toLocaleString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

export const formatFileName = (title: string): string => {
    const accentMap: Record<string, string> = {
        'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a',
        'é': 'e', 'è': 'e', 'ê': 'e',
        'í': 'i', 'ì': 'i', 'î': 'i',
        'ó': 'o', 'ò': 'o', 'ô': 'o', 'õ': 'o',
        'ú': 'u', 'ù': 'u', 'û': 'u', 'ü': 'u',
        'ç': 'c', 'ñ': 'n', 'ý': 'y', 'œ': 'oe'
    };

    return title
        .toLowerCase()
        .replace(/[àáâãéèêíìîóòôõúùûüçñýœ]/g, char => accentMap[char] || char)
        .replace(/[^a-z0-9]/g, '_');
}

export const shortenUuid = (uuid: string): string => {
    if (!uuid || uuid.length < 12) {
        return uuid;
    }
    const start = uuid.substring(0, 8);
    const end = uuid.substring(uuid.length - 4);
    return `${start}...${end}`;
}
