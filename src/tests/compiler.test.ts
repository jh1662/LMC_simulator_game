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
describe("Testing valid code without labels",() => {
    test('"add/subtr" program (from LMCCompatibility.test.ts)', () => {
        const preCompiled:string[][] = [
            //* represents 2D list values fetched from the frontend's assembly code editor.
            []
        ];

        //: instantiate then apply compiler to script.
        const compiler:Compiler = new Compiler();
        const compiled:number[]|string = compiler.validateAndCompile(preCompiled);
        //^ If valid, return compiled script as number[],
        //^ otherwise, return error message as string.
        //^ Caller function can know which return kind it is by checking return type.

        expect(compiled).toStrictEqual();
    });
});

