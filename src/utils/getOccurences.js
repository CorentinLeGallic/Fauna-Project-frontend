export default function getOccurences(value, array) {
    return array.reduce((accumulator, currentValue) => (currentValue === value ? accumulator + 1 : accumulator), 0);
}