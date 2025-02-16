function generateCharList():string[] {
    const charList: string[] = [];
    for (let i = 32; i <= 255; i++) {charList.push(String.fromCharCode(i));}
    return charList;
};

function printList(list:string[]) {
    list.forEach((char, index) => {
        const unicodeValue = index + 32;
        console.log(`Character: ${char} \t Unicode: \\u${unicodeValue.toString(16).padStart(4, '0')}`);
    })
};
printList(generateCharList());

console.log('\\');
console.log('[?]');