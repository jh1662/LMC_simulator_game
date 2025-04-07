import { ControlUnit } from "../vonNeumann";
/* extremities not tested due to those being supposed to be dealt by the LMC compiler:
 * RAM cell out-of-bounds values
 * Invalid instruction codes
 * Invlaid address values
*/
//! ALU overflow/underflow status is only partially tested because it only gets used in the second sprint.

describe("Testing",() => {
    describe("Testing each instruction",() => {
        //* most instruction tests also uses other instructions but will do atleast one test per instruction
        //* do easier find out which specific instruction is malfunctioning when atleast one of the test.
        describe("arithmetic instuctions",() => {
            test("ADD (2+3)", async () => {
                //* Store input (2) and store it, input again (3) then output the result of adding it to the stored number (2+3 = 5).
                let compiled:number[] = [901, 306, 901, 106, 902, 0, 0];
                //^ inp, sta OPERAND, inp, add OPERAND, out,
                //^ hlt, OPERAND dat
                let simulator:ControlUnit = new ControlUnit(compiled, [2,3]);
                simulator.changeSpeed(1);
                expect(await simulator.cycle()).toStrictEqual(['5']);
                //^ expected result
                expect(simulator.getArithmeticStatus()).toStrictEqual(1);
                //^ Testing if no underflow or overflow is detected in that one ALU opertaion.
                //^ enum 'numberStatus.normal' is equivalent to one.
            });
            test("SUB (2-5)", async () => {
                //* Store input (5) and store it, input again (2) then output the result of getting subtracted by the stored number (2-5 = -3).
                let compiled:number[] = [901, 306, 901, 206, 902, 0, 0];
                //^ inp, sta OPERAND, inp, sub OPERAND, out,
                //^ hlt, OPERAND dat
                let simulator:ControlUnit = new ControlUnit(compiled, [5,2]);
                simulator.changeSpeed(1);
                expect(await simulator.cycle()).toStrictEqual(['-3']);
                expect(simulator.getArithmeticStatus()).toStrictEqual(1);
                //^ Testing if no underflow or overflow is detected in that one ALU opertaion.
                //^ enum 'numberStatus.normal' is equivalent to one.
            });
            test("ADD (2+3) but with different instructions for (easier identifications of errors)", async () => {
                //* Because all others uses DAT.
                //* Store input (5) and store it, input again (2) then output the result of getting subtracted by the stored number (2-5 = -3).
                let compiled:number[] = [901, 309, 901, 109, 902];
                //^ inp, sta 9, inp, add 9, out,
                //^ hlt
                let simulator:ControlUnit = new ControlUnit(compiled, [2,3]);
                simulator.changeSpeed(1);
                expect(await simulator.cycle()).toStrictEqual(['5']);
                expect(simulator.getArithmeticStatus()).toStrictEqual(1);
                //^ Testing if no underflow or overflow is detected in that one ALU opertaion.
                //^ enum 'numberStatus.normal' is equivalent to one.
            });
        });
        describe("shifting instuctions",() => {
            //* take input, then shift it before outputting it
            describe("3 digits",() => {
                describe("positive",() => {
                    test("LSH (123)", async () => {
                        let compiled:number[] = [901, 401, 902];
                        //^ inp, lsh, out,
                        //^ hlt
                        let simulator:ControlUnit = new ControlUnit(compiled, [123]);
                        simulator.changeSpeed(1);
                        expect(await simulator.cycle()).toStrictEqual(["230"]);
                    });
                    test("RSH (123)", async () => {
                        let compiled:number[] = [901, 402, 902];
                        //^ inp, rsh, out,
                        //^ hlt
                        let simulator:ControlUnit = new ControlUnit(compiled, [123]);
                        simulator.changeSpeed(1);
                        expect(await simulator.cycle()).toStrictEqual(["12"]);
                    });
                });
                describe("negative",() => {
                    test("LSH (-123)", async () => {
                        let compiled:number[] = [901, 401, 902];
                        //^ inp, lsh, out,
                        //^ hlt
                        let simulator:ControlUnit = new ControlUnit(compiled, [-123]);
                        simulator.changeSpeed(1);
                        expect(await simulator.cycle()).toStrictEqual(["-230"]);
                    });
                    test("RSH (-123)", async () => {
                        let compiled:number[] = [901, 402, 902];
                        //^ inp, rsh, out,
                        //^ hlt
                        let simulator:ControlUnit = new ControlUnit(compiled, [-123]);
                        simulator.changeSpeed(1);
                        expect(await simulator.cycle()).toStrictEqual(["-12"]);
                    });
                });
            });
            describe("2 digits",() => {
                describe("positive",() => {
                    test("LSH (45)", async () => {
                        let compiled:number[] = [901, 401, 902];
                        //^ inp, lsh, out,
                        //^ hlt
                        let simulator:ControlUnit = new ControlUnit(compiled, [45]);
                        simulator.changeSpeed(1);
                        expect(await simulator.cycle()).toStrictEqual(["450"]);
                    });
                    test("RSH (45)", async () => {
                        let compiled:number[] = [901, 402, 902];
                        //^ inp, rsh, out,
                        //^ hlt
                        let simulator:ControlUnit = new ControlUnit(compiled, [45]);
                        simulator.changeSpeed(1);
                        expect(await simulator.cycle()).toStrictEqual(["4"]);
                    });
                });
                describe("negative",() => {
                    test("LSH (-45)", async () => {
                        let compiled:number[] = [901, 401, 902];
                        //^ inp, lsh, out,
                        //^ hlt
                        let simulator:ControlUnit = new ControlUnit(compiled, [-45]);
                        simulator.changeSpeed(1);
                        expect(await simulator.cycle()).toStrictEqual(["-450"]);
                    });
                    test("RSH (-45)", async () => {
                        let compiled:number[] = [901, 402, 902];
                        //^ inp, rsh, out,
                        //^ hlt
                        let simulator:ControlUnit = new ControlUnit(compiled, [-45]);
                        simulator.changeSpeed(1);
                        expect(await simulator.cycle()).toStrictEqual(["-4"]);
                    });
                });
            });
            describe("1 digit",() => {
                describe("positive",() => {
                    test("LSH (6)", async () => {
                        let compiled:number[] = [901, 401, 902];
                        //^ inp, lsh, out,
                        //^ hlt
                        let simulator:ControlUnit = new ControlUnit(compiled, [6]);
                        simulator.changeSpeed(1);
                        expect(await simulator.cycle()).toStrictEqual(["60"]);
                    });
                    test("RSH (6)", async () => {
                        let compiled:number[] = [901, 402, 902];
                        //^ inp, rsh, out,
                        //^ hlt
                        let simulator:ControlUnit = new ControlUnit(compiled, [6]);
                        simulator.changeSpeed(1);
                        expect(await simulator.cycle()).toStrictEqual(["0"]);
                    });
                });
                describe("negative",() => {
                    test("LSH (-6)", async () => {
                        let compiled:number[] = [901, 401, 902];
                        //^ inp, lsh, out,
                        //^ hlt
                        let simulator:ControlUnit = new ControlUnit(compiled, [-6]);
                        simulator.changeSpeed(1);
                        expect(await simulator.cycle()).toStrictEqual(["-60"]);
                    });
                    test("RSH (-6)", async () => {
                        let compiled:number[] = [901, 402, 902];
                        //^ inp, rsh, out,
                        //^ hlt
                        let simulator:ControlUnit = new ControlUnit(compiled, [-6]);
                        simulator.changeSpeed(1);
                        expect(await simulator.cycle()).toStrictEqual(["0"]);
                    });
                });
            });
        });
        describe("Branching instructions",() => {
            //* take input, branch to after the halt line, then output
            describe("BRA (branch always)",() => {
                test("using '6'", async () => {
                    let compiled:number[] = [901, 603, 0, 902, 0];
                    //^ inp, bra BRANCH,
                    //^ hlt, BRANCH out,
                    //^ hlt
                    let simulator:ControlUnit = new ControlUnit(compiled, [6]);
                    simulator.changeSpeed(1);
                    expect(await simulator.cycle()).toStrictEqual(["6"]);
                    //^ if BRA does not work, it would not output anything
                });
            });
            describe("BRZ (branch if accumulator value is '0')",() => {
                test("using '0'", async () => {
                    let compiled:number[] = [901, 703, 0, 902, 0];
                    //^ inp, brz BRANCH,
                    //^ hlt, BRANCH out,
                    //^ hlt
                    let simulator:ControlUnit = new ControlUnit(compiled, [0]);
                    simulator.changeSpeed(1);
                    expect(await simulator.cycle()).toStrictEqual(["0"]);
                    //^ if BRZ does not work, it would not output anything
                });
                test("using '1'", async () => {
                    let compiled:number[] = [901, 703, 0, 902, 0];
                    //^ inp, brz BRANCH,
                    //^ hlt, BRANCH out,
                    //^ hlt
                    let simulator:ControlUnit = new ControlUnit(compiled, [1]);
                    simulator.changeSpeed(1);
                    expect(await simulator.cycle()).toStrictEqual([]);
                    //^ if BRZ does not work properly, "1" would be outputted
                });
                test("using '-1'", async () => {
                    let compiled:number[] = [901, 703, 0, 902, 0];
                    //^ inp, brz BRANCH,
                    //^ hlt, BRANCH out,
                    //^ hlt
                    let simulator:ControlUnit = new ControlUnit(compiled, [-1]);
                    simulator.changeSpeed(1);
                    expect(await simulator.cycle()).toStrictEqual([]);
                    //^ if BRZ does not work properly, "-1" would be outputted
                });
            });
            describe("BRP (branch if accumulator value is positive or '0')",() => {
                test("BRP - with '0'", async () => {
                    let compiled:number[] = [901, 803, 0, 902, 0];
                    //^ inp, brp BRANCH,
                    //^ hlt, BRANCH out,
                    //^ hlt
                    let simulator:ControlUnit = new ControlUnit(compiled, [0]);
                    simulator.changeSpeed(1);
                    expect(await simulator.cycle()).toStrictEqual(["0"]);
                    //^ if BRZ does not work, it would not output anything
                });
                test("BRP - with '1'", async () => {
                    let compiled:number[] = [901, 803, 0, 902, 0];
                    //^ inp, brp BRANCH,
                    //^ hlt, BRANCH out,
                    //^ hlt
                    let simulator:ControlUnit = new ControlUnit(compiled, [1]);
                    simulator.changeSpeed(1);
                    expect(await simulator.cycle()).toStrictEqual(["1"]);
                    //^ if BRZ does not work, it would not output anything
                });
                test("BRP - with '-1'", async () => {
                    let compiled:number[] = [901, 803, 0, 902, 0];
                    //^ inp, brp BRANCH,
                    //^ hlt, BRANCH out,
                    //^ hlt
                    let simulator:ControlUnit = new ControlUnit(compiled, [-1]);
                    simulator.changeSpeed(1);
                    expect(await simulator.cycle()).toStrictEqual([]);
                    //^ if BRZ does not work properly, "-1" would be outputted
                });
            });
        });
        describe("io instructions",() => {
            describe("inputting",() => {
                //* take input and then outputting the input
                describe("extremities",() => {
                    test("input '-999'", async () => {
                        let compiled:number[] = [901, 902, 0];
                        //^ inp, out,
                        //^ hlt
                        let simulator:ControlUnit = new ControlUnit(compiled, [-999]);
                        simulator.changeSpeed(1);
                        expect(await simulator.cycle()).toStrictEqual(['-999']);
                    });
                    test("input '0'", async () => {
                        let compiled:number[] = [901, 902, 0];
                        //^ inp, out,
                        //^ hlt
                        let simulator:ControlUnit = new ControlUnit(compiled, [0]);
                        simulator.changeSpeed(1);
                        expect(await simulator.cycle()).toStrictEqual(['0']);
                    });
                    test("input '999'", async () => {
                        let compiled:number[] = [901, 902, 0];
                        //^ inp, out,
                        //^ hlt
                        let simulator:ControlUnit = new ControlUnit(compiled, [999]);
                        simulator.changeSpeed(1);
                        expect(await simulator.cycle()).toStrictEqual(['999']);
                    });
                });
                describe("By digit count",() => {
                    test("input one digit ('5')", async () => {
                        let compiled:number[] = [901, 902, 0];
                        //^ inp, out,
                        //^ hlt
                        let simulator:ControlUnit = new ControlUnit(compiled, [5]);
                        simulator.changeSpeed(1);
                        expect(await simulator.cycle()).toStrictEqual(['5']);
                    });
                    test("input two digits ('50')", async () => {
                        let compiled:number[] = [901, 902, 0];
                        //^ inp, out,
                        //^ hlt
                        let simulator:ControlUnit = new ControlUnit(compiled, [50]);
                        simulator.changeSpeed(1);
                        expect(await simulator.cycle()).toStrictEqual(['50']);
                    });
                    test("input three digits ('500')", async () => {
                        let compiled:number[] = [901, 902, 0];
                        //^ inp, out,
                        //^ hlt
                        let simulator:ControlUnit = new ControlUnit(compiled, [500]);
                        simulator.changeSpeed(1);
                        expect(await simulator.cycle()).toStrictEqual(['500']);
                    });
                    //* cannot test redundant digits (like '005') becuase inputs are integers.
                });

            });
            describe("outputing",() => {
                //* loading from memory, then outputting them in one way or another
                describe("integers",() => {
                    test("output '10' as positive (without input)", async () => {
                        let compiled:number[] = [503, 902, 0, 10];
                        //^ lda TEN, out,
                        //^ hlt, TEN dat 10
                        let simulator:ControlUnit = new ControlUnit(compiled, []);
                        simulator.changeSpeed(1);
                        expect(await simulator.cycle()).toStrictEqual(["10"]);
                    });
                    test("output '-10' as negative (without input)", async () => {
                        //* check if output integers and memory include negatives
                        let compiled:number[] = [503, 902, 0, -10];
                        //^ lda TEN, out,
                        //^ hlt, TEN dat -10
                        let simulator:ControlUnit = new ControlUnit(compiled, []);
                        simulator.changeSpeed(1);
                        expect(await simulator.cycle()).toStrictEqual(["-10"]);
                    });
                    //* testing outputting extremities (-999, 0, and 999) and digits (5, 50, and 500)
                    //* has already been done in the inputting tests thus will not be repeated.
                });
                describe("visable ASCII characters (without input)",() => {
                    test("output 'A' (without input)", async () => {
                        //* check if output integers and memory include negatives
                        let compiled:number[] = [503, 903, 0, 65];
                        //^ lda TEN, oct,
                        //^ hlt, TEN dat 65
                        let simulator:ControlUnit = new ControlUnit(compiled, []);
                        simulator.changeSpeed(1);
                        expect(await simulator.cycle()).toStrictEqual(["A"]);
                    });
                    describe("extremities",() => {
                        test("output spacebar whitespace - first visable (exception to the whitespace) extended ASCII char (without input)", async () => {
                            //* check if output integers and memory include negatives
                            let compiled:number[] = [503, 903, 0, 33];
                            //^ lda TEN, oct,
                            //^ hlt, TEN dat 33
                            let simulator:ControlUnit = new ControlUnit(compiled, []);
                            simulator.changeSpeed(1);
                            expect(await simulator.cycle()).toStrictEqual(["!"]);
                        });
                        test("output 'ÿ' - last visable extended ASCII char (without input)", async () => {
                            //* check if output integers and memory include negatives
                            let compiled:number[] = [503, 903, 0, 255];
                            //^ lda TEN, oct,
                            //^ hlt, TEN dat 255
                            let simulator:ControlUnit = new ControlUnit(compiled, []);
                            simulator.changeSpeed(1);
                            expect(await simulator.cycle()).toStrictEqual(["ÿ"]);
                        });
                    });
                    describe("invalid characters",() => {
                        test("output from number 31 (without input)", async () => {
                            //* check if output integers and memory include negatives
                            let compiled:number[] = [503, 903, 0, 31];
                            //^ lda TEN, oct,
                            //^ hlt, TEN dat 31
                            let simulator:ControlUnit = new ControlUnit(compiled, []);
                            simulator.changeSpeed(1);
                            expect(await simulator.cycle()).toStrictEqual(["[?]"]);
                        });
                        test("output from number 256 (without input)", async () => {
                            //* check if output integers and memory include negatives
                            let compiled:number[] = [503, 903, 0, 256];
                            //^ lda TEN, oct,
                            //^ hlt, TEN dat 256
                            let simulator:ControlUnit = new ControlUnit(compiled, []);
                            simulator.changeSpeed(1);
                            expect(await simulator.cycle()).toStrictEqual(["[?]"]);
                        });
                        test("output from number -1 (without input)", async () => {
                            //* check if output integers and memory include negatives
                            let compiled:number[] = [503, 903, 0, -1];
                            //^ lda TEN, oct,
                            //^ hlt, TEN dat -1
                            let simulator:ControlUnit = new ControlUnit(compiled, []);
                            simulator.changeSpeed(1);
                            expect(await simulator.cycle()).toStrictEqual(["[?]"]);
                        });
                    });
                });

            });
        });

        test("STA", async () => {
            //* take input, store it, then input another time but load the first stored input to output
            let compiled:number[] = [901, 306, 901, 506, 902, 0, 0];
            //^ inp, sta FIRST, inp, lda FIRST, out
            //^ hlt, FIRST dat
            let simulator:ControlUnit = new ControlUnit(compiled, [10,20]);
            simulator.changeSpeed(1);
            expect(await simulator.cycle()).toStrictEqual(['10']);
        });
        test("LDA", async () => {
            //* simply load number from memory and output it
            let compiled:number[] = [503, 902, 0, 6];
            //^ lda STORAGE, out,
            //^ hlt, STORAGE dat 6
            let simulator:ControlUnit = new ControlUnit(compiled, []);
            simulator.changeSpeed(1);
            expect(await simulator.cycle()).toStrictEqual(["6"]);
        });

    });
    describe("Testing ALU's operation extremities",() => {
        //* Addition or subtraction beyond the range (-999 to 999).
        //* Load number the add/sub with another number and let the ALU deal with the overflow and underflows.
        test("Underflow - -999 minus 1", async () => {
            let compiled:number[] = [504, 205, 902, 0, -999, 1];
            //^ lda NUM, sub ONE, out,
            //^ hlt, NUM dat -999, ONE dat 1
            let simulator:ControlUnit = new ControlUnit(compiled, []);
            simulator.changeSpeed(1);
            expect(await simulator.cycle()).toStrictEqual(['999']);
            //^ expect result of operation to be "999"
            expect(simulator.getArithmeticStatus()).toStrictEqual(0);
            //^ Testing if an underflow is detected.
            //^ enum 'numberStatus.underflow' is equivalent to zero.
        });
        test("Overflow - 999 plus one", async () => {
            let compiled:number[] = [504, 105, 902, 0, 999, 1];
            //^ lda NUM, add ONE, out,
            //^ hlt, NUM dat 999, ONE dat 1
            let simulator:ControlUnit = new ControlUnit(compiled, []);
            simulator.changeSpeed(1);
            expect(await simulator.cycle()).toStrictEqual(['-999']);
            //^ expect result of operation to be "-999"
            expect(simulator.getArithmeticStatus()).toStrictEqual(2);
            //^ Testing if an overflow is detected.
            //^ enum 'numberStatus.overflow' is equivalent to two.
        });
        test("Adding the highest value to itself - 999 plus 999", async () => {
            let compiled:number[] = [504, 105, 902, 0, 999, 999];
            //^ lda NUM, add ONE, out,
            //^ hlt, NUM dat 999, ONE dat 1
            let simulator:ControlUnit = new ControlUnit(compiled, []);
            simulator.changeSpeed(1);
            expect(await simulator.cycle()).toStrictEqual(['-1']);
            //^ expect result of operation to be "-1"
            //^ Is '-1' instead of '0' because it takes one increment to do overflow/underflow.
            expect(simulator.getArithmeticStatus()).toStrictEqual(2);
            //^ Testing if an overflow is detected.
            //^ enum 'numberStatus.overflow' is equivalent to two.
        });
    });
    describe("Testing PC's extremity - by breaking loop",() => {
        //* Program Counter at 99 and increments but resets to zero instead to stay within memomry address contraints.
        test("Incrementing the maximum value (should reset to 0)", async () => {
            let compiled:number[] = [508, 398, 509, 399, 510, 902, 798, 0, 111, 310, 0, -1];
            //^ lda CHANGE, sta 98, lda STORE, sta 99, lda CURRENT, out, brz 98,
            //^ hlt, CHANGE dat 111, STORE dat 310, CURRENT dat 0, dat -1
            let simulator:ControlUnit = new ControlUnit(compiled, []);
            simulator.changeSpeed(1);
            expect(await simulator.cycle()).toStrictEqual(['0','-1']);
            //^ if PC doesn't reset it would only '0'.
        });
    });
    test("Testing automatic timeout by the cycle count limit", async () => {
        //* Cannot test manual timeout/stop due to requiring use of user interaction, let alone with frontend.
        let compiled:number[] = [505, 106, 902, 305, 600, 0, 1];
        //^ lda CHANGE, sta 98, lda STORE, sta 99, lda CURRENT, out, brz 98,
        //^ hlt, CHANGE dat 111, STORE dat 310, CURRENT dat 0, dat -1
        let simulator:ControlUnit = new ControlUnit(compiled, []);
        simulator.changeSpeed(1);
        expect(await simulator.cycle()).toStrictEqual(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60"]);
        //^ Only goes up to "60" for output because the first 5 lines are continuously looped 60 times.
        //^ 5 multiplied by 60 is 300 which is the cycle count limit for timeout - does exectly as expected.
    });
});

