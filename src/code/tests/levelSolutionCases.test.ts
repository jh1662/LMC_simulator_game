//: for level checker tests
import { LevelChecker } from "../levelChecker.js";
import { Compiler } from "../compiler.js";

import { levelData, Level } from "../levelData.js";
//^ for data integrety tests

/// beforeAll(() => {});
//^ Tried using 'beforeAll' but not worth as setting up variables requires initialisation and read (TS-1155 and TS-6133) as well as needing arguments (TS-2554).
//x Instead, a helper custom function is used to help with the repetitive assertions.

enum LevelType{ tutorial, partial, contextual }
//^ Easier identification of level types.
//^ big formula is concidered a special kind of contexual type.
//^ correction is concidered a special kind of contexual type.

//#region helper functions
async function checkerHelper3Star(level:number):Promise<string>{
    try{
        const compiler:Compiler = new Compiler();
        //^ To compile the solution into accepcted compiled form and check example solution's validity.
        const checker:LevelChecker = new LevelChecker(level);
        //^ To check submission script by checking if its execution matches the 'cases' (class calls 'ControlUnit' during testing).
        const scriptSolution:string[][] = checker.getExample();
        //^ Assume that user submits the same as the example solution allowing testing of both submittng scripts and the example solution's validity.
        const uppercaseScriptSolution:string[][] = scriptSolution.map( (line:string[]):string[] => line.map((token:string):string => token.toUpperCase()) );
        //^ To simulate SimulatorUI's capitalisation feature.
        //^ Sources - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map and https://stackoverflow.com/questions/29719329/convert-array-into-upper-case .
        const compiledSolution:number[] = compiler.validateAndCompile(uppercaseScriptSolution);
        //^ Attempt to compile script.
        console.log(compiledSolution);
        //^ For debugging purposes - has example solution compiled properly?
        console.log(compiler.getMessage);
        //^ For debugging purposes - explaination of compiler's result.
        expect(compiledSolution).not.toBe([-1]);
        //^ If [-1], then solution script is not valid.
        checker.setUserCompiled(compiledSolution);
        //^ Submitt successfully compiled script to level checker.
        const levelStatus:number = await checker.assessScript();
        //^ Assess submitted script
        console.log(checker.getMessage());
        //^ For debugging purposes - explaination of checker's level script checking result.
        console.log(`Level #${level} star count:${levelStatus}`);
        //^ Also for debugging purposes - to see what was actual star count.
        expect(levelStatus).toBe(3);
        //^ Expected to get '3' (3-star) as example solution is always within 3-star criteria/limits.
    }
    catch(jestError){ return (jestError as Error).message; }
    return "";
}
async function checkerHelperCustom(level:number,scriptCompiled:number[]):Promise<number>{
    //* Less automatic and more manual as an invalid-checking alternative to 'checkerHelper3Star'.
    //* Ommited the compiler part because it compiler has its own test file ans was used in 'checkerHelper3Star' because the example solution was not compiled.
    //* Does not have try-block like other helper function because no there are no 'expect' statements to possibly throw invalid/jest error.
    const checker:LevelChecker = new LevelChecker(level);
    checker.setUserCompiled(scriptCompiled);
    const levelStatus:number = await checker.assessScript();
    //^ Get either 0 (fail), 1, 2, or 3 stars.
    return levelStatus;
}
function integretyHelper(level:number, levelType:LevelType):string{
    try{
        const currentLevel:Level|undefined = levelData[level-1];
        //^ minus 1 because level number is one above corrosponding index (example: level #1 has insex of 0)
        expect(currentLevel).not.toBeUndefined();
        //^ check if data for specified level exists
        if(currentLevel == undefined){ return "Custome error - unexpected error happend - first parameter value is undefined!!!"; }
        //^ Solved TS-18048 but is if-statement is never satisfied because if it would then the above expect
        //^ statement would of fail and end the current test beforehand by throwing an error immediately.
        //: Should be present and populated in all levels.
        //: Not checked for undefined as interface forbids that.
        expect(currentLevel.objective).not.toBe('');
        expect(currentLevel.exampleCase).not.toBe([]);

        switch(levelType){
            case LevelType.tutorial:
                //: unpopulated
                expect(currentLevel.exampleSolution).toBe(undefined);
                expect(currentLevel.cases).toBe(undefined);
                expect(currentLevel.stars).toBe(undefined);

                //: populated
                expect(currentLevel.patrialScript).not.toBe(undefined);
                expect(currentLevel.patrialScript).not.toBe([]);

                break;
            case LevelType.partial:
                //* All attributes must be populated
                //: populated
                expect(currentLevel.patrialScript).not.toBe(undefined);
                expect(currentLevel.patrialScript).not.toBe([]);
                expect(currentLevel.exampleSolution).not.toBe(undefined);
                expect(currentLevel.exampleSolution).not.toBe([]);
                expect(currentLevel.cases).not.toBe(undefined);
                expect(currentLevel.cases).not.toBe([]);
                expect(currentLevel.stars).not.toBe(undefined);
                if (currentLevel.stars){
                    //^ Solved TS-18048
                    expect(currentLevel.stars[2]).not.toBe(null);
                    expect(currentLevel.stars[3]).not.toBe(null);
                }
                break;
            default: //< LevelType.contexual
                expect(currentLevel.patrialScript).toBe(undefined);
                //^ unpopulated
                //: populated
                expect(currentLevel.exampleSolution).not.toBe(undefined);
                expect(currentLevel.exampleSolution).not.toBe([]);
                expect(currentLevel.cases).not.toBe(undefined);
                expect(currentLevel.cases).not.toBe([]);
                expect(currentLevel.stars).not.toBe(undefined);
                if (currentLevel.stars){
                    //^ Solved TS-18048
                    expect(currentLevel.stars[2]).not.toBe(null);
                    expect(currentLevel.stars[3]).not.toBe(null);
                }
        }
    }
    catch(jestError){ return (jestError as Error).message; }
    return "";
}
//#endregion
describe('Testing level data integrety', () => {
    describe('Testing each level if valid to their type', () => {
        describe('Tutorial/introduction levels (level #1-8)', () => {
            test('level #1', () => {
                const result:string = integretyHelper(1, LevelType.tutorial);
                console.log(result);
                expect(result).toBe("");
                //^ if string is empty (""), then helper result experienced no jest-thrown errors
            });
            test('level #2', () => {
                const result:string = integretyHelper(2, LevelType.tutorial);
                console.log(result);
                expect(result).toBe("");
            });
            test('level #3', () => {
                const result:string = integretyHelper(3, LevelType.tutorial);
                console.log(result);
                expect(result).toBe("");
            });
            test('level #4', () => {
                const result:string = integretyHelper(4, LevelType.tutorial);
                console.log(result);
                expect(result).toBe("");
            });
            test('level #5', () => {
                const result:string = integretyHelper(5, LevelType.tutorial);
                console.log(result);
                expect(result).toBe("");
            });
            test('level #6', () => {
                const result:string = integretyHelper(6, LevelType.tutorial);
                console.log(result);
                expect(result).toBe("");
            });
            test('level #7', () => {
                const result:string = integretyHelper(7, LevelType.tutorial);
                console.log(result);
                expect(result).toBe("");
            });
            test('level #8', () => {
                const result:string = integretyHelper(8, LevelType.tutorial);
                console.log(result);
                expect(result).toBe("");
            });
        });
        describe('Correction and partial levels (level #9, #11, #12, #15, #18 and #19)', () => {
            describe('Correction levels (level #9, #12 and #19)', () => {
                test('level #9', () => {
                    const result:string = integretyHelper(9, LevelType.partial);
                    console.log(result);
                    expect(result).toBe("");
                });
                test('level #12', () => {
                    const result:string = integretyHelper(12, LevelType.partial);
                    console.log(result);
                    expect(result).toBe("");
                });
                test('level #19', () => {
                    const result:string = integretyHelper(19, LevelType.partial);
                    console.log(result);
                    expect(result).toBe("");
                });
            });
            describe('Partial levels (level #11, #15 and #18)', () => {
                test('level #11', () => {
                    const result:string = integretyHelper(11, LevelType.partial);
                    console.log(result);
                    expect(result).toBe("");
                });
                test('level #15', () => {
                    const result:string = integretyHelper(15, LevelType.partial);
                    console.log(result);
                    expect(result).toBe("");
                });
                test('level #18', () => {
                    const result:string = integretyHelper(18, LevelType.partial);
                    console.log(result);
                    expect(result).toBe("");
                });
            });
        });
        describe('Big formula and contexual levels (level #10, #13, #14, #16, #17, and #20)', () => {
            describe('Big formula levels (level #10 and #20)', () => {
                test('level #10', () => {
                    const result:string = integretyHelper(10, LevelType.contextual);
                    console.log(result);
                    expect(result).toBe("");
                });
                test('level #20', () => {
                    const result:string = integretyHelper(20, LevelType.contextual);
                    console.log(result);
                    expect(result).toBe("");
                });
            });
            describe('Contextual levels (level #13, #14, #16, and #17)', () => {
                test('level #13', () => {
                    const result:string = integretyHelper(13, LevelType.contextual);
                    console.log(result);
                    expect(result).toBe("");
                });
                test('level #14', () => {
                    const result:string = integretyHelper(14, LevelType.contextual);
                    console.log(result);
                    expect(result).toBe("");
                });
                test('level #16', () => {
                    const result:string = integretyHelper(16, LevelType.contextual);
                    console.log(result);
                    expect(result).toBe("");
                });
                test('level #17', () => {
                    const result:string = integretyHelper(17, LevelType.contextual);
                    console.log(result);
                    expect(result).toBe("");
                });
            });
        });
    });
    describe('Testing levels as inncorrect types', () => {
        describe('Tutorial/introduction - level #1', () => {
            test('as partial', () => {
                const result:string = integretyHelper(1, LevelType.partial);
                console.log(result);
                expect(result).not.toBe("");
            });
            test('as contextual', () => {
                const result:string = integretyHelper(1, LevelType.contextual);
                console.log(result);
                expect(result).not.toBe("");
            });
        });
        describe('partial - level #9', () => {
            test('as tutorial/introduction', () => {
                const result:string = integretyHelper(9, LevelType.tutorial);
                console.log(result);
                expect(result).not.toBe("");
            });
            test('as contextual', () => {
                const result:string = integretyHelper(9, LevelType.contextual);
                console.log(result);
                expect(result).not.toBe("");
            });
        });
        describe('contexual - level #10', () => {
            test('as partial', () => {
                const result:string = integretyHelper(10, LevelType.partial);
                console.log(result);
                expect(result).not.toBe("");
            });
            test('as tutorial/introduction', () => {
                const result:string = integretyHelper(10, LevelType.partial);
                console.log(result);
                expect(result).not.toBe("");
            });
        });
    });
});
describe('Testing level checking', () => {
    describe('Successful checks testing', () => {
        describe('Levels #9-10', () => {
            test('Level 9', async () => {
                const result:string = await checkerHelper3Star(9);
                console.log(result);
                expect(result).toEqual("");
            });
            test('Level 10', async () => {
                const result:string = await checkerHelper3Star(10);
                console.log(result);
                expect(result).toEqual("");
            });
        });
        describe('Levels #11-20', () => {
            test('Level 11', async () => {
                const result:string = await checkerHelper3Star(11);
                console.log(result);
                expect(result).toEqual("");
            });
            test('Level 12', async () => {
                const result:string = await checkerHelper3Star(12);
                console.log(result);
                expect(result).toEqual("");
            });
            test('Level 13', async () => {
                const result:string = await checkerHelper3Star(13);
                console.log(result);
                expect(result).toEqual("");
            });
            test('Level 14', async () => {
                const result:string = await checkerHelper3Star(14);
                console.log(result);
                expect(result).toEqual("");
            });
            test('Level 15', async () => {
                const result:string = await checkerHelper3Star(15);
                console.log(result);
                expect(result).toEqual("");
            });
            test('Level 16', async () => {
                const result:string = await checkerHelper3Star(16);
                console.log(result);
                expect(result).toEqual("");
            });
            test('Level 17', async () => {
                const result:string = await checkerHelper3Star(17);
                console.log(result);
                expect(result).toEqual("");
            });
            test('Level 18', async () => {
                const result:string = await checkerHelper3Star(18);
                console.log(result);
                expect(result).toEqual("");
            });
            test('Level 19', async () => {
                const result:string = await checkerHelper3Star(19);
                console.log(result);
                expect(result).toEqual("");
            });
            test('Level 20', async () => {
                const result:string = await checkerHelper3Star(20);
                console.log(result);
                expect(result).toEqual("");
            });
        });
    });
    describe('More detailed check testing', () => {
        describe('Unsuccessful check testing', () => {
            test('Different program', async () => { await checkerHelperCustom(9,[901, 901, 902]) });
            //^ Instead of comparing inputs, the user's compiled program simply takes in two inputs and outputs the 2nd input.
            //^ This program is completely different so it gets 0 stars indicating that level objective failed to be satisfied.
            test('Infinite loop program', async () => { await checkerHelperCustom(9,[901, 316, 901, 602]) });
            //^ Instead of comparing inputs, the user's compiled program simply takes in two inputs and outputs the 2nd input but
            //^ then always loop/branch back to the outputting in an infinite loop until timeout.
            //! Due to script relying on the ControlUnit's timeout feature to end, execution will take long time.
            //! Took around 20 seconds last time, will be quicker without the debug console logs.
            test('incorrect star count', async () => {
                //* To show that it does not just give ant star count.
                const stars:number = await checkerHelperCustom(9,[901, 312, 901, 313, 212, 809, 512, 902, 611, 513, 902, 0, 0, 0]);
                expect(stars).not.toBe(0);
                expect(stars).not.toBe(1);
                expect(stars).not.toBe(2);
            });
        });
        describe('Successful check testing', () => {
            test('3-star message', async () => {
                const stars:number = await checkerHelperCustom(9,[901, 312, 901, 313, 212, 809, 512, 902, 611, 513, 902, 0, 0, 0]);
                //^ Similar to "test('level #9', () => {integretyHelper(9, LevelType.partial);} );" but
                //^ returns the star count.
                //^ This test also help show that both 'checkerHelperCustom' and 'checkerHelper3Star' do not deviate.
                expect(stars).toBe(3);
            });
            test('2-star message - lower limit', async () => {
                const stars:number = await checkerHelperCustom(9,[901, 312, 901, 313, 212, 809, 512, 902, 611, 513, 902, 0, 0, 0, 0]);
                //^ Same script but has an extra HLT instruction appended to the end to be at the lower limit of being concidered 2-star.
                expect(stars).toBe(2);
            });
            test('2-star message - higher limit', async () => {
                const stars:number = await checkerHelperCustom(9,[901, 312, 901, 313, 212, 809, 512, 902, 611, 513, 902, 0, 0, 0, 0, 0, 0, 0, 0]);
                //^ Same script but has 5 HLT instructions appended to the end to be at the higher limit of being concidered 2-star.
                expect(stars).toBe(2);
            });
            test('1-star message', async () => {
                const stars:number = await checkerHelperCustom(9,[901, 312, 901, 313, 212, 809, 512, 902, 611, 513, 902, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
                //^ Same script but has 6 HLT instructions appended to the end to exceed the upper limit of being concidered 2-star.
                expect(stars).toBe(1);
            });
        });
    });
});
