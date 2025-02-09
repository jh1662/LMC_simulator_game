"use strict";
document.addEventListener('DOMContentLoaded', main);
function main() {
    const testMsg = "Hello world!";
    const message = document.getElementById('message');
    if (message != null) {
        message.textContent = testMsg;
    }
}
