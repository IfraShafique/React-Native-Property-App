export const formatPrice = (price: number):string => {
    if (price >= 10000000) {
        const crore = (price / 10000000).toFixed(1).replace(/\.0$/, '');
        return `$${crore} Cr`;
    }
    if (price >= 100000) {
        const lakh = (price / 100000).toFixed(1).replace(/\.0$/, '');
        return `$${lakh} L`;
    }
    return `$${price.toLocaleString()}`;
}