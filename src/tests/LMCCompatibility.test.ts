import { controlUnit } from "../code/vonNeumann";
//* Check if compatible with other LMC simulators by testing thier compiled example assembly programs that is up to
//* LMC standard, otherwise are not included.
//x LMC standard is explained in the dissetation.
describe("Testing based on other LMC program's examples to test if this is up to LMC standard",() => {
    describe("Peter Higginson's LMC assembly program examples", () => {
        //* operands (not instruction codes) under 99 have thier first zero removed to be compatible with this LMC.
        //* Example: "032" -> "32".
        test('"add" program', async () => {
            /*
            INP
            STA 99
            INP
            ADD 99
            OUT
            HLT
            // Output the sum of two numbers
            */
            let compiled: number[] = [901,399,901,199,902,0];
            let predefinedInputs: number[] = [20,300];
            let simulator: controlUnit = new controlUnit(compiled,predefinedInputs);
            expect(await simulator.cycle()).toStrictEqual(['320']);
        });
        test('"add/subtr" program', async () => {
            /*
            INP
            STA FIRST
            INP
            ADD FIRST
            OUT
            INP
            SUB FIRST
            OUT
            HLT
            FIRST   DAT
            // Input three numbers.
            // Output the sum of the first two
            // and the third minus the first
            */
            let compiled: number[] = [901, 309, 901, 109, 902, 901, 209, 902, 0, 0];
            let predefinedInputs: number[] = [20,300,41];
            let simulator: controlUnit = new controlUnit(compiled,predefinedInputs);
            expect(await simulator.cycle()).toStrictEqual(['320','21']);
        });
        test('"ascii" program', async () => {
            /*
            lda space
            sta char
            loop    lda char
            otc
            add one
            sta char
            sub max
            brz end
            bra loop
            end     hlt
            space   dat 32
            one     dat 1
            max     dat 127
            char    dat
            // output the basic ASCII characters
            */
            let compiled: number[] = [510, 313, 513, 903, 111, 313, 212, 709, 602, 0, 32, 1, 127, 0];
            let predefinedInputs: number[] = [20,300,41];
            let simulator: controlUnit = new controlUnit(compiled,predefinedInputs);
            expect(await simulator.cycle()).toStrictEqual(
                [" ", "!", "\"", "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?", "@", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\\", "]", "^", "_", "`", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "{", "|", "}", "~"]
            );
        });
        test('"ascii table" program', async () => {
            /*
            lda space
            sta char
            loop    lda char
            out
            lda space
            otc
            lda char
            otc
            add one
            sta char
            sub max
            brz end
            bra loop
            end     hlt
            space   dat 32
            one     dat 1
            max     dat 97
            char    dat
            */
            let compiled: number[] = [514, 317, 517, 902, 514, 922, 517, 922, 115, 317, 216, 713, 602, 0, 32, 1, 97, 0];
            let predefinedInputs: number[] = [];
            let simulator: controlUnit = new controlUnit(compiled,predefinedInputs);
            expect(await simulator.cycle()).toStrictEqual(
                ["32", " "," ", "33", " ", "!", "34", " ", "\"", "35", " ", "#", "36", " ", "$", "37", " ", "%", "38", " ", "&", "39", " ", "'", "40", " ", "(", "41", " ", ")", "42", " ", "*", "43", " ", "+", "44", " ", ",", "45", " ", "-", "46", " ", ".", "47", " ", "/", "48", " ", "0", "49", " ", "1", "50", " ", "2", "51", " ", "3", "52", " ", "4", "53", " ", "5", "54", " ", "6", "55", " ", "7", "56", " ", "8", "57", " ", "9", "58", " ", ":", "59", " ", ";", "60", " ", "<", "61", " ", "=", "62", " ", ">", "63", " ", "?", "64", " ", "@", "65", " ", "A", "66", " ", "B", "67", " ", "C", "68", " ", "D", "69", " ", "E", "70", " ", "F", "71", " ", "G", "72", " ", "H", "73", " ", "I", "74", " ", "J", "75", " ", "K", "76", " ", "L", "77", " ", "M", "78", " ", "N", "79", " ", "O", "80", " ", "P", "81", " ", "Q", "82", " ", "R", "83", " ", "S", "84", " ", "T", "85", " ", "U", "86", " ", "V", "87", " ", "W", "88", " ", "X", "89", " ", "Y", "90", " ", "Z", "91", " ", "[", "92", " ", "\\", "93", " ", "]", "94", " ", "^", "95", " ", "_", "96", " ", "`"]
            );
        });
    });
    describe("101 Computing's LMC assembly program examples",() => {
        //* instruction codes (not operands) with 2 digits have a zero between them (example) to be compatable with this LMC.
        //* Example "36" -> "306".
        test('"Adding 2 inputs" program', async () => {
            /*
            INP
            STA num1
            INP
            ADD num1
            OUT
            HLT
            num1  DAT
            */
            let compiled: number[] = [901, 306, 901, 106, 902, 0, 0];
            let predefinedInputs: number[] = [20,300];
            let simulator: controlUnit = new controlUnit(compiled,predefinedInputs);
            expect(await simulator.cycle()).toStrictEqual(["320"]);
        });
        test('"Max of 2 inputs" program', async () => {
            /*
            INP
            STA num1
            INP
            STA num2
            SUB num1
            BRP pos
            LDA num1
            OUT
            BRA exit
            pos LDA num2
            OUT
            exit    HLT
            num1    DAT
            num2    DAT
            */
            let compiled: number[] = [901, 312, 901, 313, 212, 809, 512, 902, 611, 513, 902, 0, 0, 0];
            let predefinedInputs: number[] = [20,300];
            let simulator: controlUnit = new controlUnit(compiled,predefinedInputs);
            expect(await simulator.cycle()).toStrictEqual(["300"]);
        });
        test('"Count down timer" program', async () => {
            /*
            INP
            loop    OUT
            STA count
            SUB one
            STA count
            BRP loop
            HLT
            one     DAT 1
            count   DAT
            */
            let compiled: number[] = [901, 902, 308, 207, 308, 801, 0, 1, 0];
            let predefinedInputs: number[] = [10];
            let simulator: controlUnit = new controlUnit(compiled,predefinedInputs);
            expect(await simulator.cycle()).toStrictEqual(["10","9","8","7","6","5","4","3","2","1","0"]);
        });
        test('"Multiplying 2 inputs" program', async () => {
            /*
            INP
            STA NUM1
            INP
            STA NUM2
            LOOP    LDA TOTAL
            ADD NUM1
            STA TOTAL
            LDA NUM2
            SUB ONE
            STA NUM2
            BRP LOOP
            LDA TOTAL
            SUB NUM1
            STA TOTAL
            OUT
            HLT
            NUM1    DAT
            NUM2    DAT
            ONE     DAT 1
            TOTAL   DAT 0
            */
            let compiled: number[] = [901, 316, 901, 317, 519, 116, 319, 517, 218, 317, 84, 519, 216, 319, 902, 0, 0, 0, 1, 0];
            let predefinedInputs: number[] = [10, 11];
            let simulator: controlUnit = new controlUnit(compiled,predefinedInputs);
            expect(await simulator.cycle()).toStrictEqual(["110"]);
        });
        test('"Triangluar Numbers" program', async () => {
            //* Only does the first ten numbers
            /*
            loop    LDA number
            ADD counter
            OUT
            STA number
            LDA counter
            ADD one
            STA counter
            LDA ten
            SUB counter
            BRP loop
            HLT

            counter DAT 1
            number  DAT 0
            one     DAT 1
            ten     DAT 10
            */
            let compiled: number[] = [512, 111, 902, 312, 511, 113, 311, 514, 211, 80, 0, 1, 0, 1, 10];
            let predefinedInputs: number[] = [];
            let simulator: controlUnit = new controlUnit(compiled,predefinedInputs);
            expect(await simulator.cycle()).toStrictEqual(["1", "3", "6", "10", "15", "21", "28", "36", "45", "55"]);
        });
        test('"Factorial of..." program', async () => {
            /*
            INP
            STA final
            BRZ oneval
            SUB one
            STA iteration
            STA counter
            LDA final
            STA num
            mult      LDA iteration
            BRZ end
            SUB one
            BRZ end
            LDA final
            ADD num
            STA final
            LDA counter
            SUB one
            STA counter
            SUB one
            BRZ next
            BRA mult
            next      LDA final
            STA num
            LDA iteration
            SUB one
            STA iteration
            STA counter
            SUB one
            BRZ end
            BRA mult
            end       LDA final
            OUT
            HLT
            oneval    LDA one
            OUT
            HLT
            final     DAT 0
            counter   DAT 0
            one       DAT 1
            iteration DAT 0
            num       DAT 0
            */
            let compiled: number[] = [901, 336, 733, 238, 339, 337, 536, 340, 539, 730, 238, 730, 536, 140, 336, 537, 238, 337, 238, 721, 68, 536, 340, 539, 238, 339, 337, 238, 730, 68, 536, 902, 0, 538, 902, 0, 0, 0, 1, 0, 0];
            let predefinedInputs: number[] = [5];
            let simulator: controlUnit = new controlUnit(compiled,predefinedInputs);
            expect(await simulator.cycle()).toStrictEqual(["120"]);
        });
        //* missing Indirect Addressing and Immediate Addressing because they contradict the LMC standard
    });
    describe("pbrinkmeier's LMC assembly program example",() => {
        test('"takes two inputs and puts their difference in the outbox" program (basically subtracting the 1st number from the 2nd number)', async () => {
            /*
            INP
            STA first
            INP
            STA second
            LDA first
            SUB second
            OUT
            COB
            first   DAT 0
            second  DAT 0
            */
            let compiled: number[] = [901, 308, 901, 309, 508, 209, 902, 0, 0, 0];
            let predefinedInputs: number[] = [300,20];
            let simulator: controlUnit = new controlUnit(compiled,predefinedInputs);
            expect(await simulator.cycle()).toStrictEqual(["280"]);
        });
    });
    describe("Wellingborough School's LMC assembly program examples",() => {
        //* Wellingborough School's LMC compiles assembly code different to others -
        //* it accounts for the line number of each code line.
        //* Hence the spread between zeros.
        test('"Example 1 - Add two numbers together" program', async () => {
            /*
            start	INP
            STA	A
            INP
            ADD	A
            OUT
            HLT
            A   DAT 0
            */
            let compiled: number[] = [901, 320, 901, 120, 902, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            let predefinedInputs: number[] = [600, 40];
            let simulator: controlUnit = new controlUnit(compiled,predefinedInputs);
            expect(await simulator.cycle()).toStrictEqual(["640"]);
        });
        test('"Example 2 - Output a pattern of 1s and 0s" program', async () => {
            /*
            start	LDA	one
            OUT
            LDA	zero
            OUT
            LDA	count
            SUB	one
            STA	count
            BRP	start
            HLT
            one DAT 1
            zero    DAT 0
            count   DAT 3
            */
            let compiled: number[] = [520, 902, 521, 902, 522, 220, 322, 800, 0, 813, 522, 902, 0, 522, 121, 322, 523, 607, 0, 0, 1, 0, 3, 0, 0];
            let predefinedInputs: number[] = [];
            let simulator: controlUnit = new controlUnit(compiled,predefinedInputs);
            expect(await simulator.cycle()).toStrictEqual(["1","0","1","0","1","0","1","0"]);
        });
        test('"Example 3 - Calculate the square of a number', async () => {
            /*
            start	INP
            STA	number
            LDA	zero
            STA	sum
            STA	count
            loop	LDA	sum
            ADD	number
            STA	sum
            LDA	count
            ADD	one
            STA	count
            SUB	number
            BRP	finish
            BRA	loop
            finish	LDA	sum
            OUT
            HLT
            number	DAT
            sum	DAT
            count	DAT
            zero	DAT	0
            one	DAT	1
            */
            let compiled: number[] = [901, 330, 533, 331, 332, 531, 130, 331, 532, 134, 332, 230, 814, 605, 531, 902, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
            let predefinedInputs: number[] = [9];
            let simulator: controlUnit = new controlUnit(compiled,predefinedInputs);
            expect(await simulator.cycle()).toStrictEqual(["81"]);
        });
        test('"Example 4 - Integer division', async () => {
            /*
            start	INP
            STA	dividend
            INP
            STA	divisor
            LDA	zero
            STA	answer
            LDA	dividend
            loop	SUB	divisor
            STA	dividend
            BRP	greater
            LDA	answer
            OUT
            HLT
            greater	LDA	answer
            ADD	one
            STA	answer
            LDA	dividend
            BRA	loop
            zero	DAT	0
            one	DAT	1
            answer	DAT
            dividend	DAT
            divisor	DAT
            */
            let compiled: number[] = [901, 323, 901, 324, 520, 322, 523, 224, 323, 813, 522, 902, 0, 522, 121, 322, 523, 607, 0, 0, 0, 1, 0, 0, 0];
            let predefinedInputs: number[] = [19,4];
            let simulator: controlUnit = new controlUnit(compiled,predefinedInputs);
            expect(await simulator.cycle()).toStrictEqual(["4"]);
        });
    });
    //* taking example from trincot's example program is not possible because it does not display the compiled code (only pre-compiled)
    describe("Paul's blog's LMC assembly program examples",() => {
        //* operands (not instruction codes) under 99 have thier first zero removed to be compatible with this LMC.
        //* Example: "032" -> "32".
        test('"Max of 3 numbers" program', async () => {
            /*
            INP
            STA M0
            INP
            STA M1
            INP
            STA M2
            SUB M1
            BRP J1
            LDA M1
            STA M2
            J1  LDA M2
            SUB M0
            BRP J2
            LDA M0
            STA M2
            J2  LDA M2
            OUT
            HLT
            M0  DAT
            M1  DAT
            M2  DAT
            */
            let compiled: number[] = [901, 318, 901, 319, 901, 320, 219, 810, 519, 320, 520, 218, 815, 518, 320, 520, 902, 0, 0, 0, 0,];
            let predefinedInputs: number[] = [213, 987, 88];
            let simulator: controlUnit = new controlUnit(compiled,predefinedInputs);
            expect(await simulator.cycle()).toStrictEqual(["987"]);
        });
        test('"Multiply 2 numbers" program', async () => {
            /*
            INP
            STA R0
            INP
            STA R1
            LOOP LDA R1
            BRZ END
            SUB ONE
            STA R1
            LDA RES
            ADD R0
            STA RES
            BRA LOOP
            END  LDA RES
            OUT
            R1   DAT
            R0   DAT
            RES  DAT
            ONE  DAT 1
            */
            let compiled: number[] = [901, 315, 901, 314, 514, 712, 217, 314, 516, 115, 316, 604, 516, 902, 0, 0, 0, 1];
            let predefinedInputs: number[] = [4, 5];
            let simulator: controlUnit = new controlUnit(compiled,predefinedInputs);
            expect(await simulator.cycle()).toStrictEqual(["20"]);
        });
        //* As of this moment, the "Shift left" program is inaccessable (404 error)
        test('"Copy N inputs to an array" (self-modifying) program', async () => {
            /*
            INP
            STA C
            L    LDA C
            BRZ C
            SUB ONE
            STA C
            LDA T
            ADD ONE
            STA T
            ADD STAOP
            STA STAI
            INP
            STAI DAT
            BRA L
            C    DAT
            ONE  DAT 1
            STAOP DAT 300
            T    DAT 49
            */
            let compiled: number[] = [901, 314, 514, 714, 215, 314, 517, 115, 317, 116, 312, 901, 0, 602, 0, 1, 300, 49];
            let predefinedInputs: number[] = [5, 10, 101, 14, 998, 8];
            let simulator: controlUnit = new controlUnit(compiled,predefinedInputs);
            expect(await simulator.cycle()).toStrictEqual([]);
        });
        test('"Sieve of Erastothenes" (self-modifying) program', async () => {
            /*
            LOOP LDA C
            ADD ONE
            STA C
            SUB V69
            BRP END
            LDA C
            ADD LDINS
            STA READINS
            READINS DAT
            BRZ PRIME
            BRA LOOP
            PRIME
            LDA C
            OUT
            STA R
            WRITELOOP
            LDA R
            SUB V69
            BRP LOOP
            LDA R
            ADD STINS
            STA WRINS
            LDA C
            WRINS DAT
            LDA R
            ADD C
            STA R
            BRA WRITELOOP
            END HLT
            V69 DAT 69
            LDINS DAT 531
            STINS DAT 331
            C DAT 1
            ONE DAT 1
            R DAT
            */
            let compiled: number[] = [530, 131, 330, 227, 826, 530, 128, 308, 0, 711, 600, 530, 902, 332, 532, 227, 800, 532, 129, 321, 530, 0, 532, 130, 332, 614, 0, 69, 531, 331, 1, 1, 0];
            let predefinedInputs: number[] = [];
            let simulator: controlUnit = new controlUnit(compiled,predefinedInputs);
            expect(await simulator.cycle()).toStrictEqual(["2", "3", "5", "7", "11", "13", "17", "19", "23", "29", "31", "37", "41", "43", "47", "53", "59", "61", "67"]);
        });
        //* Cannot use "Sort input" program because it puposely uterilise overflows but value range is 0 to 999 instead of -999 to 999 - giving different results.
    });
});