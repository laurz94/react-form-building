export function toTitleCase(value: string) {
    // Insert a space before each uppercase letter and convert the string to lowercase
    const result = value.trim().replace(/([A-Z])/g, ' $1').toLowerCase();
    // Capitalize the first letter of each word
    return result.replace(/\b\w/g, char => char.toUpperCase()).trim();
}
