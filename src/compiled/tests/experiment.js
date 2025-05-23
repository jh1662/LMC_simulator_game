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
//x Discontinued because testing code (that doesn't call any part of the project) is easier to do online - https://www.programiz.com/javascript/online-compiler/ .
//x However, will still put here what I put on the online compiler.
const list = ["1", "2", "3"];
//@ts-ignore
const element = list[1];
const regex = /^-?\d{1,3}$/;
//: success
console.log(regex.test("000"));
console.log(regex.test("00"));
console.log(regex.test("0"));
console.log(regex.test("1"));
console.log(regex.test("12"));
console.log(regex.test("123"));
console.log(regex.test("999"));
console.log(regex.test("-999"));
console.log(regex.test("-023"));
//: fail
console.log(regex.test("-1000"));
console.log(regex.test("1000"));
console.log(regex.test("10.0"));
