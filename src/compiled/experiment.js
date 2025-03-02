"use strict";
function generateCharList() {
    const charList = [];
    for (let i = 32; i <= 255; i++) {
        charList.push(String.fromCharCode(i));
    }
    return charList;
}
;
function printList(list) {
    list.forEach((char, index) => {
        const unicodeValue = index + 32;
        console.log(`Character: ${char} \t Unicode: \\u${unicodeValue.toString(16).padStart(4, '0')}`);
    });
}
;
printList(generateCharList());
console.log('\\');
console.log('[?]');
