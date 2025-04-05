document.addEventListener('DOMContentLoaded', main)

function main(){
    const testMsg: string = "Hello world!"
    const message: HTMLElement | null = document.getElementById('message');
    if (message != null) {message.textContent = testMsg;}
}