import { Compiler } from "../code/compiler";
/* Templates:
test('[TEST NAME HERE]', () => {
    const preCompiled:string[][] = [
        []
    ];

    const compiler:Compiler = new Compiler();
    const compiled:number[] = compiler.validateAndCompile(preCompiled);

    expect(compiled).toStrictEqual([]);
});

describe("Testing valid code without labels",() => {});

*/
describe("Testing validation and compilation by script's labels and operands",() => {
    //* labels and operands are done together because how they are intertwined with each other
    describe("Testing valid code without labels but has operand",() => {
        test('Original pre-compiled script of the "add/subtr" program (from LMCCompatibility.test.ts) - 2 operands of the same address', () => {
            const preCompiled:string[][] = [
                //* represents 2D list values fetched from the frontend's assembly code editor.
                ["", "INP", ""],
                ["", "STA", "99"],
                ["", "INP", ""],
                ["", "ADD", "99"],
                ["", "OUT", ""],
                ["", "HLT", ""]
            ];

            //: instantiate then apply compiler to script.
            const compiler:Compiler = new Compiler();
            console.log("ready");
            const compiled:number[]|string = compiler.validateAndCompile(preCompiled);
            //^ If valid, return compiled script as number[],
            //^ otherwise, return error message as string.
            //^ Caller function can know which return kind it is by checking return type.
            console.log("set");

            expect(compiled).toStrictEqual([901,399,901,199,902,0]);
        });
        test('All branch instructions - 3 operands of different addresses', () => {
            const preCompiled:string[][] = [
                ["", "INP", ""],
                ["", "OUT", ""],
                ["", "BRZ", "5"],
                ["", "BRP", "6"],
                ["", "BRA", "7"],
                ["", "OUT", ""],
                ["", "OUT", ""],
                ["", "OUT", ""],
                ["", "HLT", ""],
            ];

            const compiler:Compiler = new Compiler();
            const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

            expect(compiled).toStrictEqual([901,902,705,806,607,902,902,902,0]);
        });
        test('Using DAT - one single operand address', () => {
            const preCompiled:string[][] = [
                ["", "LDA", "3"],
                ["", "OUT", ""],
                ["", "HLT", ""],
                ["", "DAT", "10"]
            ];

            const compiler:Compiler = new Compiler();
            const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

            expect(compiled).toStrictEqual([503, 902, 0, 10]);
        });
    });
    test('Using DAT - but storring -999 instead of 10', () => {
        const preCompiled:string[][] = [
            ["", "LDA", "3"],
            ["", "OUT", ""],
            ["", "HLT", ""],
            ["", "DAT", "-999"]
        ];

        const compiler:Compiler = new Compiler();
        const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

        expect(compiled).toStrictEqual([503, 902, 0, -999]);
    });
    describe("Testing valid code with labels and only labels for the operand",() => {
        //*
        test('Modified pre-compiled script of the "add/subtr" program (from LMCCompatibility.test.ts) - DAT at beginning', () => {
            const preCompiled:string[][] = [
                ["BUFFER", "DAT", "0"],
                //^ Cannot really referance label without declaring in thus to use of DAT here.
                //^ Dispite this, more DAT tests will still be tested for better debugging when using automatic testing.
                ["", "INP", ""],
                ["", "STA", "BUFFER"],
                ["", "INP", ""],
                ["", "ADD", "BUFFER"],
                ["", "OUT", ""],
                ["", "HLT", ""],
            ];

            const compiler:Compiler = new Compiler();
            const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

            expect(compiled).toStrictEqual([0,901,300,901,100,902,0]);
            //^ buffer should be at memory address '0'
        });
        test('Another modified pre-compiled script of the "add/subtr" program (from LMCCompatibility.test.ts) - DAT at end', () => {
            const preCompiled:string[][] = [
                ["", "INP", ""],
                ["", "STA", "BUFFER"],
                ["", "INP", ""],
                ["", "ADD", "BUFFER"],
                ["", "OUT", ""],
                ["", "HLT", ""],
                ["BUFFER", "DAT", ""]
                //^ DAT now at the end to test if label referancing works before declaration (it should work)
            ];

            const compiler:Compiler = new Compiler();
            const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

            expect(compiled).toStrictEqual([901,306,901,106,902,0,0]);
            //^ buffer should be memory address '6'
        });
        test('All branch instructions - 3 operands of different label addresses', () => {
            const preCompiled:string[][] = [
                ["", "INP", ""],
                ["", "OUT", ""],
                ["", "BRZ", "one"],
                //^ 'one' is interpreted as a label, not as '1'.
                ["", "BRP", "two"],
                ["", "BRA", "three"],
                ["", "OUT", ""],
                ["one", "OUT", ""],
                ["two", "OUT", ""],
                ["three", "HLT", ""]
            ];

            const compiler:Compiler = new Compiler();
            const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

            expect(compiled).toStrictEqual([901,902,705,806,607,902,902,902,0]);
            //^ 'one, 'two', 'three' should be at addresses '5', '6', '7' respectively
        });
        test('All branch instructions - 3 operands of different label addresses with extreme naming', () => {
            const preCompiled:string[][] = [
                ["", "INP", ""],
                ["", "OUT", ""],
                ["", "BRZ", " o ne "],
                //^ whitepace before, in-middle, and after label
                ["", "BRP", "t2wo22"],
                //^ label contains numerical digits inside and at end but not at the beginning
                ["", "BRA", "i"],
                //^ label is a singular character
                ["", "OUT", ""],
                [" o ne ", "OUT", ""],
                ["t2wo22", "OUT", ""],
                ["i", "HLT", ""]
            ];

            const compiler:Compiler = new Compiler();
            const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

            expect(compiled).toStrictEqual([901,902,705,806,607,902,902,902,0]);
            //^ ' o ne ', 't2wo22', 'i' should be at addresses '5', '6', '7' respectively
        });
        test('Modified pre-compiled script of the "add/subtr" program (from LMCCompatibility.test.ts) - variations of the same label', () => {
            const preCompiled:string[][] = [
                ["buffer1", "DAT", ""],
                //^ all label referances should all referance the same label
                ["", "INP", ""],
                ["", "STA", " b    uf fer1 "],
                //^ label with whitespacing
                ["", "INP", ""],
                ["", "ADD", "bUFFeR1"],
                //^ label with some letters in upper-case
                ["", "OUT", " B u F f E R 1 "],
                //^ label with both whitespacing and some upper-case
                ["", "HLT", ""]
            ];

            const compiler:Compiler = new Compiler();
            const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

            expect(compiled).toStrictEqual([901,300,901,100,902,0]);
            //^ buffer1 should be at memory address '0'
        });
        test('Program wihtout any operands', () => {
            const preCompiled:string[][] = [
                ["", "INP", ""],
                ["", "SHL", ""],
                ["", "SHR", ""],
                ["", "OUT", ""],
                ["", "HLT", ""]
            ];

            const compiler:Compiler = new Compiler();
            const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

            expect(compiled).toStrictEqual([901, 401, 402, 902, 0]);
        });
        test('Declared labels that never got referanced', () => {
            const preCompiled:string[][] = [
                ["one", "INP", ""],
                ["", "STA", ""],
                ["three", "OUT", ""],
                ["three", "OUT", ""]
            ];

            const compiler:Compiler = new Compiler();
            const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

            expect(compiled).toStrictEqual([901,504,902,0]);
        });
    });
});
describe("Testing validation and compilation by script's opcodes",() => {
    //* Unlike the other test groups, these test groups are only for compilation and not for execution so sake of more conciece testing
    describe("opcodes that require a corrosponding operand",() => {
        test("all valid",() => {
            const preCompiled:string[][] = [
                //* made to be compiled, not executed
                ["", "ADD", "99"],
                ["", "SUB", "99"],
                ["", "STA", "99"],
                ["", "LDA", "99"],
                ["", "BRA", "99"],
                ["", "BRZ", "99"],
                ["", "BRP", "99"],
                ["", "DAT", "99"],
            ];

            const compiler:Compiler = new Compiler();
            const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

            expect(compiled).toStrictEqual([199,299,399,599,699,799,899,99]);
        });
    });
});


