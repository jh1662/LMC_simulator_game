import { Compiler } from "../compiler";
//* Every script is fully captialised because the UI makes all characters upper-case before returning the script.
//* This also apply to no white spaces in the script as UI removed them before hand.
//#region LMC compatability and up to standards
describe("Testing LMC compatibility with others and if up to standard", () => {
    /*
    test("", () => {
        const preCompiled:string[][] = [
            ["", "", ""],
            ["", "", ""]
        ];

        const compiler:Compiler = new Compiler();
        const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

        expect(compiled).toStrictEqual([]);
    });
    */
    describe("Peter Higginson's LMC assembly program examples", () => {
        test('"add" program', () => {
            const preCompiled = [
                ["", "INP", ""],
                ["", "STA", "99"],
                ["", "INP", ""],
                ["", "ADD", "99"],
                ["", "OUT", ""],
                ["", "HLT", ""]
            ];
            const compiler = new Compiler();
            const compiled = compiler.validateAndCompile(preCompiled);
            expect(compiled).toStrictEqual([901, 399, 901, 199, 902, 0]);
        });
        test('"add/subtr" program', () => {
            const preCompiled = [
                ["", "INP", ""],
                ["", "STA", "FIRST"],
                ["", "INP", ""],
                ["", "ADD", "FIRST"],
                ["", "OUT", ""],
                ["", "INP", ""],
                ["", "SUB", "FIRST"],
                ["", "OUT", ""],
                ["", "HLT", ""],
                ["FIRST", "DAT", ""]
            ];
            const compiler = new Compiler();
            const compiled = compiler.validateAndCompile(preCompiled);
            expect(compiled).toStrictEqual([901, 309, 901, 109, 902, 901, 209, 902, 0, 0]);
        });
        test('"ascii" program', () => {
            const preCompiled = [
                ["", "LDA", "SPACE"],
                ["", "STA", "CHAR"],
                ["LOOP", "LDA", "CHAR"],
                ["", "OTC", ""],
                ["", "ADD", "ONE"],
                ["", "STA", "CHAR"],
                ["", "SUB", "MAX"],
                ["", "BRZ", "END"],
                ["", "BRA", "LOOP"],
                ["END", "HLT", ""],
                ["SPACE", "DAT", "32"],
                ["ONE", "DAT", "1"],
                ["MAX", "DAT", "127"],
                ["CHAR", "DAT", ""]
            ];
            const compiler = new Compiler();
            const compiled = compiler.validateAndCompile(preCompiled);
            expect(compiled).toStrictEqual([510, 313, 513, 903, 111, 313, 212, 709, 602, 0, 32, 1, 127, 0]);
        });
        test('"ascii table" program', () => {
            const preCompiled = [
                ["", "LDA", "SPACE"],
                ["", "STA", "CHAR"],
                ["LOOP", "LDA", "CHAR"],
                ["", "OUT", ""],
                ["", "LDA", "SPACE"],
                ["", "OTC", ""],
                ["", "LDA", "CHAR"],
                ["", "OTC", ""],
                ["", "ADD", "ONE"],
                ["", "STA", "CHAR"],
                ["", "SUB", "MAX"],
                ["", "BRZ", "END"],
                ["", "BRA", "LOOP"],
                ["END", "HLT", ""],
                ["SPACE", "DAT", "32"],
                ["ONE", "DAT", "1"],
                ["MAX", "DAT", "97"],
                ["CHAR", "DAT", ""]
            ];
            const compiler = new Compiler();
            const compiled = compiler.validateAndCompile(preCompiled);
            expect(compiled).toStrictEqual([514, 317, 517, 902, 514, 903, 517, 903, 115, 317, 216, 713, 602, 0, 32, 1, 97, 0]);
        });
    });
    describe("101 Computing's LMC assembly program examples", () => {
        test('Adding 2 inputs" program', () => {
            const preCompiled = [
                ["", "INP", ""],
                ["", "STA", "NUM1"],
                ["", "INP", ""],
                ["", "ADD", "NUM1"],
                ["", "OUT", ""],
                ["", "HLT", ""],
                ["NUM1", "DAT", ""]
            ];
            const compiler = new Compiler();
            const compiled = compiler.validateAndCompile(preCompiled);
            expect(compiled).toStrictEqual([901, 306, 901, 106, 902, 0, 0]);
        });
        test('Max of 2 inputs" program', () => {
            const preCompiled = [
                ["", "INP", ""],
                ["", "STA", "NUM1"],
                ["", "INP", ""],
                ["", "STA", "NUM2"],
                ["", "SUB", "NUM1"],
                ["", "BRP", "POS"],
                ["", "LDA", "NUM1"],
                ["", "OUT", ""],
                ["", "BRA", "EXIT"],
                ["POS", "LDA", "NUM2"],
                ["", "OUT", ""],
                ["EXIT", "HLT", ""],
                ["NUM1", "DAT", ""],
                ["NUM2", "DAT", ""]
            ];
            const compiler = new Compiler();
            const compiled = compiler.validateAndCompile(preCompiled);
            expect(compiled).toStrictEqual([901, 312, 901, 313, 212, 809, 512, 902, 611, 513, 902, 0, 0, 0]);
        });
        test('"Count down timer" program', () => {
            const preCompiled = [
                ["", "INP", ""],
                ["LOOP", "OUT", ""],
                ["", "STA", "COUNT"],
                ["", "SUB", "ONE"],
                ["", "STA", "COUNT"],
                ["", "BRP", "LOOP"],
                ["", "HLT", ""],
                ["ONE", "DAT", "1"],
                ["COUNT", "DAT", ""]
            ];
            const compiler = new Compiler();
            const compiled = compiler.validateAndCompile(preCompiled);
            expect(compiled).toStrictEqual([901, 902, 308, 207, 308, 801, 0, 1, 0]);
        });
        test('"Multiplying 2 inputs" program', () => {
            const preCompiled = [
                ["", "INP", ""],
                ["", "STA", "NUM1"],
                ["", "INP", ""],
                ["", "STA", "NUM2"],
                ["LOOP", "LDA", "TOTAL"],
                ["", "ADD", "NUM1"],
                ["", "STA", "TOTAL"],
                ["", "LDA", "NUM2"],
                ["", "SUB", "ONE"],
                ["", "STA", "NUM2"],
                ["", "BRP", "LOOP"],
                ["", "LDA", "TOTAL"],
                ["", "SUB", "NUM1"],
                ["", "STA", "TOTAL"],
                ["", "OUT", ""],
                ["", "HLT", ""],
                ["NUM1", "DAT", ""],
                ["NUM2", "DAT", ""],
                ["ONE", "DAT", "1"],
                ["TOTAL", "DAT", "0"]
            ];
            const compiler = new Compiler();
            const compiled = compiler.validateAndCompile(preCompiled);
            expect(compiled).toStrictEqual([901, 316, 901, 317, 519, 116, 319, 517, 218, 317, 804, 519, 216, 319, 902, 0, 0, 0, 1, 0]);
        });
        test('"Triangluar Numbers" program', () => {
            const preCompiled = [
                ["LOOP", "LDA", "NUMBER"],
                ["", "ADD", "COUNTER"],
                ["", "OUT", ""],
                ["", "STA", "NUMBER"],
                ["", "LDA", "COUNTER"],
                ["", "ADD", "ONE"],
                ["", "STA", "COUNTER"],
                ["", "LDA", "TEN"],
                ["", "SUB", "COUNTER"],
                ["", "BRP", "LOOP"],
                ["", "HLT", ""],
                ["COUNTER", "DAT", "1"],
                ["NUMBER", "DAT", "0"],
                ["ONE", "DAT", "1"],
                ["TEN", "DAT", "10"]
            ];
            const compiler = new Compiler();
            const compiled = compiler.validateAndCompile(preCompiled);
            expect(compiled).toStrictEqual([512, 111, 902, 312, 511, 113, 311, 514, 211, 800, 0, 1, 0, 1, 10]);
        });
        test('"Factorial of..." program', () => {
            const preCompiled = [
                ["", "INP", ""],
                ["", "STA", "FINAL"],
                ["", "BRZ", "ONEVAL"],
                ["", "SUB", "ONE"],
                ["", "STA", "ITERATION"],
                ["", "STA", "COUNTER"],
                ["", "LDA", "FINAL"],
                ["", "STA", "NUM"],
                ["MULT", "LDA", "ITERATION"],
                ["", "BRZ", "END"],
                ["", "SUB", "ONE"],
                ["", "BRZ", "END"],
                ["", "LDA", "FINAL"],
                ["", "ADD", "NUM"],
                ["", "STA", "FINAL"],
                ["", "LDA", "COUNTER"],
                ["", "SUB", "ONE"],
                ["", "STA", "COUNTER"],
                ["", "SUB", "ONE"],
                ["", "BRZ", "NEXT"],
                ["", "BRA", "MULT"],
                ["NEXT", "LDA", "FINAL"],
                ["", "STA", "NUM"],
                ["", "LDA", "ITERATION"],
                ["", "SUB", "ONE"],
                ["", "STA", "ITERATION"],
                ["", "STA", "COUNTER"],
                ["", "SUB", "ONE"],
                ["", "BRZ", "END"],
                ["", "BRA", "MULT"],
                ["END", "LDA", "FINAL"],
                ["", "OUT", ""],
                ["", "HLT", ""],
                ["ONEVAL", "LDA", "ONE"],
                ["", "OUT", ""],
                ["", "HLT", ""],
                ["FINAL", "DAT", "0"],
                ["COUNTER", "DAT", "0"],
                ["ONE", "DAT", "1"],
                ["ITERATION", "DAT", "0"],
                ["NUM", "DAT", "0"]
            ];
            const compiler = new Compiler();
            const compiled = compiler.validateAndCompile(preCompiled);
            expect(compiled).toStrictEqual([901, 336, 733, 238, 339, 337, 536, 340, 539, 730, 238, 730, 536, 140, 336, 537, 238, 337, 238, 721, 608, 536, 340, 539, 238, 339, 337, 238, 730, 608, 536, 902, 0, 538, 902, 0, 0, 0, 1, 0, 0]);
        });
    });
    describe("Wellingborough School's LMC assembly program examples", () => {
        //* All tests' expected compiled scripts are different then the tested compiled scripts in LMCCompatability.test.ts
        //* because compiler doesn't include empty lines in its compiled script unlike Wellingborough School's LMC compiler.
        test('"Example 1 - Add two numbers together" program', () => {
            const preCompiled = [
                ["START", "INP", ""],
                ["", "STA", "A"],
                ["", "INP", ""],
                ["", "ADD", "A"],
                ["", "OUT", ""],
                ["", "HLT", ""],
                ["A", "DAT", "0"]
            ];
            const compiler = new Compiler();
            const compiled = compiler.validateAndCompile(preCompiled);
            expect(compiled).toStrictEqual([901, 306, 901, 106, 902, 0, 0]);
            //^ Changed from "[901, 320, 901, 120, 902, 0, 0]" beacuse compiler removes empty lines in compiled script.
        });
        test('"Example 2 - Output a pattern of 1s and 0s" program', () => {
            const preCompiled = [
                ["START", "LDA", "ONE"],
                ["", "OUT", ""],
                ["", "LDA", "ZERO"],
                ["", "OUT", ""],
                ["", "LDA", "COUNT"],
                ["", "SUB", "ONE"],
                ["", "STA", "COUNT"],
                ["", "BRP", "START"],
                ["", "HLT", ""],
                ["ONE", "DAT", "1"],
                ["ZERO", "DAT", "0"],
                ["COUNT", "DAT", "3"]
            ];
            const compiler = new Compiler();
            const compiled = compiler.validateAndCompile(preCompiled);
            expect(compiled).toStrictEqual([509, 902, 510, 902, 511, 209, 311, 800, 0, 1, 0, 3]);
            //^ Changed from "[520, 902, 521, 902, 522, 220, 322, 800, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 3]"
        });
        test('"Example 3 - Calculate the square of a number', () => {
            const preCompiled = [
                ["START", "INP", ""],
                ["", "STA", "NUMBER"],
                ["", "LDA", "ZERO"],
                ["", "STA", "SUM"],
                ["", "STA", "COUNT"],
                ["LOOP", "LDA", "SUM"],
                ["", "ADD", "NUMBER"],
                ["", "STA", "SUM"],
                ["", "LDA", "COUNT"],
                ["", "ADD", "ONE"],
                ["", "STA", "COUNT"],
                ["", "SUB", "NUMBER"],
                ["", "BRP", "FINISH"],
                ["", "BRA", "LOOP"],
                ["FINISH", "LDA", "SUM"],
                ["", "OUT", ""],
                ["", "HLT", ""],
                ["NUMBER", "DAT"],
                ["SUM", "DAT", ""],
                ["COUNT", "DAT", ""],
                ["ZERO", "DAT", "0"],
                ["ONE", "DAT", "1"]
            ];
            const compiler = new Compiler();
            const compiled = compiler.validateAndCompile(preCompiled);
            expect(compiled).toStrictEqual([901, 317, 520, 318, 319, 518, 117, 318, 519, 121, 319, 217, 814, 605, 518, 902, 0, 0, 0, 0, 0, 1]);
            //^ changed from "[901, 330, 533, 331, 332, 531, 130, 331, 532, 134, 332, 230, 814, 605, 531, 902, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]"
        });
        test('"Example 4 - Integer division', () => {
            const preCompiled = [
                ["START", "INP", ""],
                ["", "STA", "DIVIDEND"],
                ["", "INP", ""],
                ["", "STA", "DIVISOR"],
                ["", "LDA", "ZERO"],
                ["", "STA", "ANSWER"],
                ["", "LDA", "DIVIDEND"],
                ["LOOP", "SUB", "DIVISOR"],
                ["", "STA", "DIVIDEND"],
                ["", "BRP", "GREATER"],
                ["", "LDA", "ANSWER"],
                ["", "OUT", ""],
                ["", "HLT", ""],
                ["GREATER", "LDA", "ANSWER"],
                ["", "ADD", "ONE"],
                ["", "STA", "ANSWER"],
                ["", "LDA", "DIVIDEND"],
                ["", "BRA", "LOOP"],
                ["ZERO", "DAT", "0"],
                ["ONE", "DAT", "1"],
                ["ANSWER", "DAT", ""],
                ["DIVIDEND", "DAT", ""],
                ["DIVISOR", "DAT", ""]
            ];
            const compiler = new Compiler();
            const compiled = compiler.validateAndCompile(preCompiled);
            expect(compiled).toStrictEqual([901, 321, 901, 322, 518, 320, 521, 222, 321, 813, 520, 902, 0, 520, 119, 320, 521, 607, 0, 1, 0, 0, 0]);
            //^ changed from "[901, 323, 901, 324, 520, 322, 523, 224, 323, 813, 522, 902, 0, 522, 121, 322, 523, 607, 0, 0, 0, 1, 0, 0, 0]"
        });
    });
    describe("Paul's blog's LMC assembly program examples", () => {
        test('"Max of 3 numbers" program', () => {
            const preCompiled = [
                ["", "INP", ""],
                ["", "STA", "M0"],
                ["", "INP", ""],
                ["", "STA", "M1"],
                ["", "INP", ""],
                ["", "STA", "M2"],
                ["", "SUB", "M1"],
                ["", "BRP", "J1"],
                ["", "LDA", "M1"],
                ["", "STA", "M2"],
                ["J1", "LDA", "M2"],
                ["", "SUB", "M0"],
                ["", "BRP", "J2"],
                ["", "LDA", "M0"],
                ["", "STA", "M2"],
                ["J2", "LDA", "M2"],
                ["", "OUT", ""],
                ["", "HLT", ""],
                ["M0", "DAT", ""],
                ["M1", "DAT", ""],
                ["M2", "DAT", ""]
            ];
            const compiler = new Compiler();
            const compiled = compiler.validateAndCompile(preCompiled);
            expect(compiled).toStrictEqual([901, 318, 901, 319, 901, 320, 219, 810, 519, 320, 520, 218, 815, 518, 320, 520, 902, 0, 0, 0, 0]);
        });
        test('"Multiply 2 numbers" program', () => {
            const preCompiled = [
                ["", "INP", ""],
                ["", "STA", "R0"],
                ["", "INP", ""],
                ["", "STA", "R1"],
                ["LOOP", "LDA", "R1"],
                ["", "BRZ", "END"],
                ["", "SUB", "ONE"],
                ["", "STA", "R1"],
                ["", "LDA", "RES"],
                ["", "ADD", "R0"],
                ["", "STA", "RES"],
                ["", "BRA", "LOOP"],
                ["END", "LDA", "RES"],
                ["", "OUT", ""],
                ["R1", "DAT", ""],
                ["R0", "DAT", ""],
                ["RES", "DAT", ""],
                ["ONE", "DAT", "1"]
            ];
            const compiler = new Compiler();
            const compiled = compiler.validateAndCompile(preCompiled);
            expect(compiled).toStrictEqual([901, 315, 901, 314, 514, 712, 217, 314, 516, 115, 316, 604, 516, 902, 0, 0, 0, 1]);
        });
        test('"Copy N inputs to an array" (self-modifying) program', () => {
            const preCompiled = [
                ["", "INP", ""],
                ["", "STA", "C"],
                ["L", "LDA", "C"],
                ["", "BRZ", "C"],
                ["", "SUB", "ONE"],
                ["", "STA", "C"],
                ["", "LDA", "T"],
                ["", "ADD", "ONE"],
                ["", "STA", "T"],
                ["", "ADD", "STAOP"],
                ["", "STA", "STAI"],
                ["", "INP", ""],
                ["STAI", "DAT"],
                ["", "BRA", "L"],
                ["C", "DAT", ""],
                ["ONE", "DAT", "1"],
                ["STAOP", "DAT", "300"],
                ["T", "DAT", "49"]
            ];
            const compiler = new Compiler();
            const compiled = compiler.validateAndCompile(preCompiled);
            expect(compiled).toStrictEqual([901, 314, 514, 714, 215, 314, 517, 115, 317, 116, 312, 901, 0, 602, 0, 1, 300, 49]);
        });
        test('"Sieve of Erastothenes" (self-modifying) program', () => {
            const preCompiled = [
                ["LOOP", "LDA", "C"],
                ["", "ADD", "ONE"],
                ["", "STA", "C"],
                ["", "SUB", "V69"],
                ["", "BRP", "END"],
                ["", "LDA", "C"],
                ["", "ADD", "LDINS"],
                ["", "STA", "READINS"],
                ["READINS", "DAT", ""],
                ["", "BRZ", "PRIME"],
                ["", "BRA", "LOOP"],
                ["PRIME", "LDA", "C"],
                ["", "OUT", ""],
                ["", "STA", "R"],
                ["WRITELOOP", "LDA", "R"],
                ["", "SUB", "V69"],
                ["", "BRP", "LOOP"],
                ["", "LDA", "R"],
                ["", "ADD", "STINS"],
                ["", "STA", "WRINS"],
                ["", "LDA", "C"],
                ["WRINS", "DAT", ""],
                ["", "LDA", "R"],
                ["", "ADD", "C"],
                ["", "STA", "R"],
                ["", "BRA", "WRITELOOP"],
                ["END", "HLT", ""],
                ["V69", "DAT", "69"],
                ["LDINS", "DAT", "531"],
                ["STINS", "DAT", "331"],
                ["C", "DAT", "1"],
                ["ONE", "DAT", "1"],
                ["R", "DAT", ""]
            ];
            const compiler = new Compiler();
            const compiled = compiler.validateAndCompile(preCompiled);
            expect(compiled).toStrictEqual([530, 131, 330, 227, 826, 530, 128, 308, 0, 711, 600, 530, 902, 332, 532, 227, 800, 532, 129, 321, 530, 0, 532, 130, 332, 614, 0, 69, 531, 331, 1, 1, 0]);
        });
    });
});
//#endregion
