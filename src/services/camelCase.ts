export function toCamelCase(str:string) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|[\s-_])/g, (match, index) => {
        if (/\s|_|-/.test(match)) return '';
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
}