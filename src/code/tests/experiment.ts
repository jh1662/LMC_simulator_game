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

//x Discontinued because testing code (that doesn't call any part of the project) is easier to do online - https://www.programiz.com/javascript/online-compiler/ .
//x However, will still put here what I put on the online compiler.





const list:string[] = ["1","2","3"];

//@ts-ignore
const element:string = list[1];