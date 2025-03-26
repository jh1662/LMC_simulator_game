import fs from 'fs';
//^ imported to read the HTML file
import path from 'path';
//^ imported to resolve the location of the HTML file
//: linking HTML file only once because nothing will change it from original DOM and saves computational time
const html = fs.readFileSync(path.resolve('src/frames/', 'simulator.html'), 'utf8');
document.body.innerHTML = html;
/* All ids in simulator.HTML
editorTable
line-0
0-0
input-0-0
0-1
input-0-1
0-2
input-0-2
line-1
1-0
input-1-0
1-1
input-1-1
1-2
input-1-2
menu
timeOrStep
reset
compile
run
manual
submitInput
toggleMode
toggleDisplay
registerProgramCounter
registerInstruction
registerAddress
registerAccumulator
flow
operation
result
input
output
predefinedInputs
displayBox
status
memoryTable
*/
//* Saperated by wells
describe("Testing invalid elements to make sure tests are actually working", () => {
    test("Fetching element by non-existant id", () => {
        const htmlElement = document.getElementById('doesNotExist');
        expect(htmlElement).toEqual(null);
        //^ if cannot find element, null will be retuned instead
        expect(htmlElement instanceof HTMLElement).not.toEqual(true);
        //^ if is null, then it should not be an element
    });
    test("Fetching element but treating it as a different HTML element type", () => {
        const htmlElement = document.getElementById('menu');
        expect(htmlElement).not.toEqual(null);
        expect(htmlElement instanceof HTMLSpanElement).not.toEqual(true);
        //^ 'menu' should be a button, not span.
    });
    test("Fetching element but accessing a property that does not exist in that element type", () => {
        const htmlElement = document.getElementById('menu');
        expect(htmlElement).not.toEqual(null);
        //: Is button but not input element
        expect(htmlElement instanceof HTMLButtonElement).toEqual(true);
        expect(htmlElement instanceof HTMLInputElement).not.toEqual(true);
        expect(htmlElement.placeholder).toEqual(undefined);
        //^ Tries to access a property that is availible in 'HTMLInputElement' but not in 'HTMLButtonElement'.
        //^ When accessing a non-existant property, TS returns 'undefined'.
        //^ Source - https://tc39.es/ecma262/#sec-frompropertydescriptor .
    });
});
describe("Testing register textbox elements", () => {
    test("Program counter register", () => {
        const htmlElement = document.getElementById('registerProgramCounter');
        //^ attempt to get the HTML element to test (hence why type is 'any' as it could be null)
        //: each of these 'expect' statements are purposely done in this order as the ealier one makes sure the later one can be tested
        expect(htmlElement).not.toEqual(null);
        //^ see if HTML element object was sucessfully fetched or not.
        expect(htmlElement instanceof HTMLInputElement).toEqual(true);
        //^ test if the specific/specialised class of the HTML element is 'HTMLInputElement' (for textboxes)
        expect(htmlElement.readOnly).toEqual(true);
        //^ test a property of the object -  in this case, testing if the text boc is read-only or not
    });
    test("Instruction/opcode register", () => {
        const htmlElement = document.getElementById('registerInstruction');
        expect(htmlElement).not.toEqual(null);
        expect(htmlElement instanceof HTMLInputElement).toEqual(true);
        expect(htmlElement.readOnly).toEqual(true);
    });
    test("Address/operand register", () => {
        const htmlElement = document.getElementById('registerAddress');
        expect(htmlElement).not.toEqual(null);
        expect(htmlElement instanceof HTMLInputElement).toEqual(true);
        expect(htmlElement.readOnly).toEqual(true);
    });
    test("Accumulator register", () => {
        const htmlElement = document.getElementById('registerAccumulator');
        expect(htmlElement).not.toEqual(null);
        expect(htmlElement instanceof HTMLInputElement).toEqual(true);
        expect(htmlElement.readOnly).toEqual(true);
    });
});
describe("Testing ALU elements (all textboxs)", () => {
    test("Flow", () => {
        const htmlElement = document.getElementById('flow');
        expect(htmlElement).not.toEqual(null);
        expect(htmlElement instanceof HTMLInputElement).toEqual(true);
        expect(htmlElement.readOnly).toEqual(true);
    });
    test("Operation", () => {
        const htmlElement = document.getElementById('operation');
        expect(htmlElement).not.toEqual(null);
        expect(htmlElement instanceof HTMLInputElement).toEqual(true);
        expect(htmlElement.readOnly).toEqual(true);
    });
    test("Result", () => {
        const htmlElement = document.getElementById('result');
        expect(htmlElement).not.toEqual(null);
        expect(htmlElement instanceof HTMLInputElement).toEqual(true);
        expect(htmlElement.readOnly).toEqual(true);
    });
});
describe("Testing input/output (IO) elements (all textboxes)", () => {
    test("Input", () => {
        const htmlElement = document.getElementById('input');
        expect(htmlElement).not.toEqual(null);
        expect(htmlElement instanceof HTMLInputElement).toEqual(true);
        expect(htmlElement.readOnly).toEqual(true);
        //^ '.readOnly' should not be effected if textbox disabled or not.
    });
    test("Outputs", () => {
        const htmlElement = document.getElementById('output');
        expect(htmlElement).not.toEqual(null);
        expect(htmlElement instanceof HTMLInputElement).toEqual(true);
        expect(htmlElement.readOnly).toEqual(true);
    });
    test("Pre-defined inputs", () => {
        const htmlElement = document.getElementById('predefinedInputs');
        expect(htmlElement).not.toEqual(null);
        expect(htmlElement instanceof HTMLInputElement).toEqual(true);
        expect(htmlElement.readOnly).toEqual(false);
        //^ Is 'false' instead of true because user is expected to input before
        //^ program execution of pre-defined inputs are wanted.
    });
});
describe("Control panel (group of buttons in bottom left)", () => {
    //* All buttons' HTML code do not declare a JS function "onclick"
    //* because that is handeled by the methods instead for modularity and organisation.
    /* Button ids here due to more vague nameing conventions.
    - menu
    - timeOrStep
    - reset
    - compile
    - run
    - manual
    - submitInput
    - toggleMode
    - toggleDisplay
    */
    test("To menu", () => {
        const htmlElement = document.getElementById('menu');
        expect(htmlElement).not.toEqual(null);
        expect(htmlElement instanceof HTMLButtonElement).toEqual(true);
    });
    test("execution method ('timeOrStep')", () => {
        const htmlElement = document.getElementById('timeOrStep');
        expect(htmlElement).not.toEqual(null);
        expect(htmlElement instanceof HTMLButtonElement).toEqual(true);
    });
    test("reset", () => {
        const htmlElement = document.getElementById('reset');
        expect(htmlElement).not.toEqual(null);
        expect(htmlElement instanceof HTMLButtonElement).toEqual(true);
    });
    test("compile", () => {
        const htmlElement = document.getElementById('compile');
        expect(htmlElement).not.toEqual(null);
        expect(htmlElement instanceof HTMLButtonElement).toEqual(true);
    });
    test("run", () => {
        const htmlElement = document.getElementById('run');
        expect(htmlElement).not.toEqual(null);
        expect(htmlElement instanceof HTMLButtonElement).toEqual(true);
    });
    test("manual", () => {
        const htmlElement = document.getElementById('manual');
        expect(htmlElement).not.toEqual(null);
        expect(htmlElement instanceof HTMLButtonElement).toEqual(true);
    });
    test("submit input", () => {
        //* Disabled in sprint 2
        const htmlElement = document.getElementById('submitInput');
        expect(htmlElement).not.toEqual(null);
        expect(htmlElement instanceof HTMLButtonElement).toEqual(true);
    });
    test("toggle mode (light/dark moddle switching)", () => {
        const htmlElement = document.getElementById('toggleMode');
        expect(htmlElement).not.toEqual(null);
        expect(htmlElement instanceof HTMLButtonElement).toEqual(true);
    });
    test("toggle display (switching between objective and Little Man activity)", () => {
        const htmlElement = document.getElementById('toggleDisplay');
        expect(htmlElement).not.toEqual(null);
        expect(htmlElement instanceof HTMLButtonElement).toEqual(true);
    });
});
describe("The first two lines of texboxes in the script editor", () => {
    //* Only tested the ids of the textbox and table because cell and rows ids are not called.
    //* Row and cells have ids for sake of integrity and good coding practive.
    test("testing the table containing the token textboxes (label, opcode, and operand)", () => {
        //* the table which contains the script editor token textboxes.
        const htmlElement = document.getElementById('editorTable');
        expect(htmlElement).not.toEqual(null);
        expect(htmlElement instanceof HTMLTableElement).toEqual(true);
    });
    describe("Testing the pre-generated cells only", () => {
        //* these are generated as the original DOMs, new lines are dynamicly generated when needed.
        describe("First row of token textboses (second row in table)", () => {
            test("label", () => {
                const htmlElement = document.getElementById('input-0-0');
                expect(htmlElement).not.toEqual(null);
                expect(htmlElement instanceof HTMLInputElement).toEqual(true);
            });
            test("opcode", () => {
                const htmlElement = document.getElementById('input-0-1');
                expect(htmlElement).not.toEqual(null);
                expect(htmlElement instanceof HTMLInputElement).toEqual(true);
            });
            test("operand", () => {
                const htmlElement = document.getElementById('input-0-2');
                expect(htmlElement).not.toEqual(null);
                expect(htmlElement instanceof HTMLInputElement).toEqual(true);
            });
        });
        describe("Second row of token textboses (third row in table)", () => {
            test("label", () => {
                const htmlElement = document.getElementById('input-1-0');
                expect(htmlElement).not.toEqual(null);
                expect(htmlElement instanceof HTMLInputElement).toEqual(true);
            });
            test("opcode", () => {
                const htmlElement = document.getElementById('input-1-1');
                expect(htmlElement).not.toEqual(null);
                expect(htmlElement instanceof HTMLInputElement).toEqual(true);
            });
            test("operand", () => {
                const htmlElement = document.getElementById('input-1-2');
                expect(htmlElement).not.toEqual(null);
                expect(htmlElement instanceof HTMLInputElement).toEqual(true);
            });
        });
    });
});
describe("Simulator's status", () => {
    //! status
    //! objective
});
