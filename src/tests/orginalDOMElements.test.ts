const fs = require('fs');
const path = require('path');

// Load the HTML file
const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');

// Set the loaded HTML as the body's innerHTML
document.body.innerHTML = html;


describe("Testing register textbox elements", () => {
    test("Program Counter", () => {
        const htmlElement:any = document.getElementById('');
        expect(htmlElement).not.toEqual(null);
        expect(htmlElement instanceof HTMLInputElement).toEqual(true);
        expect(htmlElement.readonly).toEqual(true);
    })
})