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

describe("", () => {});
*/
//* Every script is fully captialised because the UI makes all characters upper-case before returning the script.
//* This also apply to no white spaces in the script as UI removed them before hand.
//#region labels, opcodes, and operands
describe("Testing validation and compilation by script's labels and operands",() => {
    //* labels and operands are done together because how they are intertwined with each other
    describe("Testing valid code without labels but has operand",() => {
        describe("Valid",() => {
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
        });
        describe("Invalid",() => {
            //: only differance in most of the error messages is the invalid value - the number between the parts
            const errorPart1:string = "Out-of-bounds address error at the operand of line 1 - label ";
            const errorPart2:string = " is integer but out of bounds (0-99)";

            test('address too high (100) - lowest number above range', () => {
                const preCompiled:string[][] = [
                    ["","INP",""],
                    ["","STA","100"],
                    ["","HLT",""]
                ];

                const compiler:Compiler = new Compiler();
                const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

                expect(compiled).toStrictEqual([-1]);
                expect(compiler.getMessage()).toStrictEqual(errorPart1+'"100"'+errorPart2);
            });
            test('address too high (-1) - highest number below range', () => {
                const preCompiled:string[][] = [
                    ["","INP",""],
                    ["","STA","-1"],
                    ["","HLT",""]
                ];

                const compiler:Compiler = new Compiler();
                const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

                expect(compiled).toStrictEqual([-1]);
                expect(compiler.getMessage()).toStrictEqual(errorPart1+'"-1"'+errorPart2);
            });

            test('address is decimal (5.5)', () => {
                const preCompiled:string[][] = [
                    ["","INP",""],
                    ["","STA","5.5"],
                    ["","HLT",""]
                ];

                const compiler:Compiler = new Compiler();
                const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

                expect(compiled).toStrictEqual([-1]);
                expect(compiler.getMessage()).toStrictEqual('non-alphanumeric error at the operand of line 1 - token "5.5" is not alphanumeric. Alphanumeric must only comprise of numbers digits (0-9) and letters (A-Z)');
                //^ Different as validation does not concider operands with a decimal point to be alphanumeric hence having the 'ErrorType.tokenNotAlphanumeric' error.
            });
        });
    });
    describe("Testing valid code with labels and only labels for the operand",() => {
        //* operands all capitalised and no whitespaces as those problems are done by the frontend
        describe("Valid", () => {
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
                    ["", "BRZ", "ONE"],
                    //^ 'one' is interpreted as a label, not as '1'.
                    ["", "BRP", "TWO"],
                    ["", "BRA", "THREE"],
                    ["", "OUT", ""],
                    ["ONE", "OUT", ""],
                    ["TWO", "OUT", ""],
                    ["THREE", "HLT", ""]
                ];

                const compiler:Compiler = new Compiler();
                const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

                expect(compiled).toStrictEqual([901,902,706,807,608,902,902,902,0]);
                //^ 'one, 'two', 'three' should be at addresses '5', '6', '7' respectively
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
                    ["ONE", "INP", ""],
                    ["", "STA", "99"],
                    ["", "OUT", ""],
                    ["THREE", "OUT", ""],
                    ["", "HLT", ""]
                ];

                const compiler:Compiler = new Compiler();
                const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

                expect(compiled).toStrictEqual([901,399,902,902,0]);
            });
            test('labels have number digits inside them but not as first character', () => {
                const preCompiled:string[][] = [
                    ["","INP",""],
                    ["","BRA","E1ND2"],
                    ["","OUT",""],
                    ["E1ND2","HLT",""]
                ];

                const compiler:Compiler = new Compiler();
                const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

                expect(compiled).toStrictEqual([901,603,902,0]);
            });
        });
        describe("Invalid", () => {
            test('referanced label not declared', () => {
                const preCompiled:string[][] = [
                    ["", "DAT", "0"],
                    ["", "INP", ""],
                    ["", "STA", "BUFFER"],
                    ["", "INP", ""],
                    ["", "ADD", "BUFFER"],
                    ["", "OUT", ""],
                    ["", "HLT", ""],
                ];

                const compiler:Compiler = new Compiler();
                const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

                expect(compiled).toStrictEqual([-1]);
                expect(compiler.getMessage()).toStrictEqual('Missing label error at the operand of line 2 - label "BUFFER" is called but cannot find code line with that label.');
            });
            test('referanced label begins with number digit than letters', () => {
                const preCompiled:string[][] = [
                    ["1BUFFER", "DAT", "0"],
                    ["", "INP", ""],
                    ["", "STA", "1BUFFER"],
                    ["", "INP", ""],
                    ["", "ADD", "1BUFFER"],
                    ["", "OUT", ""],
                    ["", "HLT", ""],
                ];

                const compiler:Compiler = new Compiler();
                const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

                expect(compiled).toStrictEqual([-1]);
                expect(compiler.getMessage()).toStrictEqual('Invalid label error at the label of line 0 - label "1BUFFER" is invalid. Use letters (A-Z) and numbers (0-9) only but must start with a letter.');
            });
        });
    });
});
describe("Testing validation and compilation by script's opcodes",() => {
    //* Unlike the other test groups, these test groups are only for compilation and not for execution so sake of more conciece testing
    test("invalid instuction (STO)",() => {
        const preCompiled:string[][] = [["", "STO", ""]];

        const compiler:Compiler = new Compiler();
        const compiled:number[] = compiler.validateAndCompile(preCompiled);

        expect(compiled).toStrictEqual([-1]);
        //^ '-1' means error from compilation process
        expect(compiler.getMessage()).toStrictEqual('Invalid token error at the opcode of line 0 - "STO" is not a valid opcode token. Valid opcodes: ADD, SUB, STA, LDA, SHL, SHR, BRA, BRZ, BRP, INP, OUT, HLT, DAT');
    });
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
        describe("each one invalid",() => {
            const errorExpectedOperandLine0:string = "operand expected error at the operand of line 0 - operand expected for opcode but got nothing";
            //^ Because these test will show the same error message, it is better to use a constant variable instead multiple long strings per text code.
            test("add (ADD)",() => {
                const preCompiled:string[][] = [["", "ADD", ""]];

                const compiler:Compiler = new Compiler();
                const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

                expect(compiled).toStrictEqual([-1]);
                expect(compiler.getMessage()).toStrictEqual(errorExpectedOperandLine0);
            });
            test("subtract (SUB)",() => {
                const preCompiled:string[][] = [["", "SUB", ""]];

                const compiler:Compiler = new Compiler();
                const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

                expect(compiled).toStrictEqual([-1]);
                expect(compiler.getMessage()).toStrictEqual(errorExpectedOperandLine0);
            });
            test("store to address (STA)",() => {
                const preCompiled:string[][] = [["", "STA", ""]];

                const compiler:Compiler = new Compiler();
                const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

                expect(compiled).toStrictEqual([-1]);
                expect(compiler.getMessage()).toStrictEqual(errorExpectedOperandLine0);
            });
            test("load to accumulator (LDA)",() => {
                const preCompiled:string[][] = [["", "LDA", ""]];

                const compiler:Compiler = new Compiler();
                const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

                expect(compiled).toStrictEqual([-1]);
                expect(compiler.getMessage()).toStrictEqual(errorExpectedOperandLine0);
            });
            test("branch always (BRA)",() => {
                const preCompiled:string[][] = [["", "BRA", ""]];

                const compiler:Compiler = new Compiler();
                const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

                expect(compiled).toStrictEqual([-1]);
                expect(compiler.getMessage()).toStrictEqual(errorExpectedOperandLine0);
            });
            test("branch if zero (BRZ)",() => {
                const preCompiled:string[][] = [["", "BRZ", ""]];

                const compiler:Compiler = new Compiler();
                const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

                expect(compiled).toStrictEqual([-1]);
                expect(compiler.getMessage()).toStrictEqual(errorExpectedOperandLine0);
            });
            test("branch if possitive or zero (BRP)",() => {
                const preCompiled:string[][] = [["", "BRP", ""]];

                const compiler:Compiler = new Compiler();
                const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

                expect(compiled).toStrictEqual([-1]);
                expect(compiler.getMessage()).toStrictEqual(errorExpectedOperandLine0);
            });
        });
    });
    describe("opcodes that require no corrosponding operand",() => {
        test("all valid",() => {
            const preCompiled:string[][] = [
                ["", "SHL", ""],
                ["", "SHR", ""],
                ["", "INP", ""],
                ["", "OUT", ""],
                ["", "OCT", ""],
                ["", "HLT", ""],
            ];

            const compiler:Compiler = new Compiler();
            const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

            expect(compiled).toStrictEqual([401,402,901,902,903,0]);
        });
        describe("each one invalid",() => {
            const errorUnexpectedOperandLine0:string = 'non-alphanumeric error at the operand of line 0 - token "invalidOperand" is not alphanumeric. Alphanumeric must only comprise of numbers digits (0-9) and letters (A-Z)'
            test("shift left (SHL)",() => {
                const preCompiled:string[][] = [["", "SHL", "invalidOperand"]];

                const compiler:Compiler = new Compiler();
                const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

                expect(compiled).toStrictEqual([-1]);
                expect(compiler.getMessage()).toStrictEqual(errorUnexpectedOperandLine0);
            });
            test("shift right (SHR)",() => {
                const preCompiled:string[][] = [["", "SHR", "invalidOperand"]];

                const compiler:Compiler = new Compiler();
                const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

                expect(compiled).toStrictEqual([-1]);
                expect(compiler.getMessage()).toStrictEqual(errorUnexpectedOperandLine0);
            });
            test("input (INP)",() => {
                const preCompiled:string[][] = [["", "INP", "invalidOperand"]];

                const compiler:Compiler = new Compiler();
                const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

                expect(compiled).toStrictEqual([-1]);
                expect(compiler.getMessage()).toStrictEqual(errorUnexpectedOperandLine0);
            });
            test("output (OUT)",() => {
                const preCompiled:string[][] = [["", "OUT", "invalidOperand"]];

                const compiler:Compiler = new Compiler();
                const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

                expect(compiled).toStrictEqual([-1]);
                expect(compiler.getMessage()).toStrictEqual(errorUnexpectedOperandLine0);
            });
            test("output as ASCII character (OCT)",() => {
                const preCompiled:string[][] = [["", "OCT", "invalidOperand"]];

                const compiler:Compiler = new Compiler();
                const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

                expect(compiled).toStrictEqual([-1]);
                expect(compiler.getMessage()).toStrictEqual(errorUnexpectedOperandLine0);
            });
            test("halt (HLT)",() => {
                const preCompiled:string[][] = [["", "HLT", "invalidOperand"]];

                const compiler:Compiler = new Compiler();
                const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

                expect(compiled).toStrictEqual([-1]);
                expect(compiler.getMessage()).toStrictEqual(errorUnexpectedOperandLine0);
            });
        });
        describe("Specifically the Data Location opcode (DAT)",() => {
            //* Extra and more vigorous testing for the ‘DAT’ due to its uniqueness as an opcode.
            //* Unlike all other opcodes:
            //*     - it is optional to have an corresponding operand
            //*     - corresponding operand has a larger range than other numerical operands
            //*     - the instruction itself does not get compiled (only the corresponding operand).
            describe("Valids",() => {
                test("just 'DAT' by itself",() => {
                    const preCompiled:string[][] = [["", "DAT", ""]];

                    const compiler:Compiler = new Compiler();
                    const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

                    expect(compiled).toStrictEqual([0]);
                    //^ When without operand, simulator defaults to storing '0' instead of nothing.
                });
                test("just 'DAT' and a label",() => {
                    const preCompiled:string[][] = [["LABEL", "DAT", ""]];

                    const compiler:Compiler = new Compiler();
                    const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

                    expect(compiled).toStrictEqual([0]);
                });
                test("just 'DAT' and a valid numerical operand",() => {
                    const preCompiled:string[][] = [["", "DAT", "68"]];

                    const compiler:Compiler = new Compiler();
                    const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

                    expect(compiled).toStrictEqual([68]);
                    //^ compiled is whatever the operand as the instruction 'DAT' itself does not get stored/compiled.
                });
                test("'DAT' with a label and valid numerical operand.",() => {
                    const preCompiled:string[][] = [["LABEL", "DAT", "68"]];

                    const compiler:Compiler = new Compiler();
                    const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

                    expect(compiled).toStrictEqual([68]);
                });
                test("using DAT to store the lowest possible integer",() => {
                    const preCompiled:string[][] = [["", "DAT", "-999"]];

                    const compiler:Compiler = new Compiler();
                    const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

                    expect(compiled).toStrictEqual([-999]);
                });
                test("using DAT to store the highest possible integer",() => {
                    const preCompiled:string[][] = [["", "DAT", "999"]];

                    const compiler:Compiler = new Compiler();
                    const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

                    expect(compiled).toStrictEqual([999]);
                });
                test("using DAT to store zero",() => {
                    const preCompiled:string[][] = [["", "DAT", "0"]];

                    const compiler:Compiler = new Compiler();
                    const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

                    expect(compiled).toStrictEqual([0]);
                });
            });
            describe("Invalids",() => {
                test("DAT refering an non-existant label",() => {
                    const preCompiled:string[][] = [["", "DAT", "LABEL"]];

                    const compiler:Compiler = new Compiler();
                    const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

                    expect(compiled).toStrictEqual([-1]);
                    expect(compiler.getMessage()).toStrictEqual('Missing label error at the operand of line 0 - label "LABEL" is called but cannot find code line with that label.');
                });
                test("DAT with the highest under-range number",() => {
                    const preCompiled:string[][] = [["", "DAT", "-1000"]];

                    const compiler:Compiler = new Compiler();
                    const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

                    expect(compiled).toStrictEqual([-1]);
                    expect(compiler.getMessage()).toStrictEqual('operand not expected error at the operand of line 0 - label "-1000" is integer but out of bounds (-999 - 999)');
                });
                test("DAT with the lowest over-range number",() => {
                    const preCompiled:string[][] = [["", "DAT", "1000"]];

                    const compiler:Compiler = new Compiler();
                    const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

                    expect(compiled).toStrictEqual([-1]);
                    expect(compiler.getMessage()).toStrictEqual('operand not expected error at the operand of line 0 - label "1000" is integer but out of bounds (-999 - 999)');
                });
                test("DAT with a decimal instead of an integer",() => {
                    const preCompiled:string[][] = [["", "DAT", "5.5"]];

                    const compiler:Compiler = new Compiler();
                    const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

                    expect(compiled).toStrictEqual([-1]);
                    expect(compiler.getMessage()).toStrictEqual('non-alphanumeric error at the operand of line 0 - token "5.5" is not alphanumeric. Alphanumeric must only comprise of numbers digits (0-9) and letters (A-Z)');
                });
            });

        });
    });
});
//#endregion
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
            const preCompiled:string[][] = [
                ["", "INP", ""],
                ["", "STA", "99"],
                ["", "INP", ""],
                ["", "ADD", "99"],
                ["", "OUT", ""],
                ["", "HLT", ""]
            ];

            const compiler:Compiler = new Compiler();
            const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

            expect(compiled).toStrictEqual([901,399,901,199,902,0]);
        });
        test('"add/subtr" program', () => {
            const preCompiled:string[][] = [
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

            const compiler:Compiler = new Compiler();
            const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

            expect(compiled).toStrictEqual([]);
        });
        test('"ascii" program', () => {
            const preCompiled:string[][] = [
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

            const compiler:Compiler = new Compiler();
            const compiled:number[]|string = compiler.validateAndCompile(preCompiled);

            expect(compiled).toStrictEqual([]);
        });

    });

});

