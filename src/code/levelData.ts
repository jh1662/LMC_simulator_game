/* Original idea:
export const levelData:object = {
    {},
};
*/
export interface Level {
    //* Object attributes listed in order from simple to complex data structure for easy population and organisation.
    objective:string;
    //^ Explaining the level
    exampleCase:string;
    //^ Example of inputs (except level 20) and corrosponding outputs
    stars?: { 2:number; 3:number; };
    //^ Not using list instead because it is only has a mere 2 elements and is easier to refer this way.
    //^ Purposely listed 3 then 2 instead of 2 then 3 due to being in a decending importance order.
    //^ Must be populated unless tutorial/instruction level.
    patrialScript?:[string, string, string][];
    //^ If level provides partially complete/correct script to display in assemvly code script editor.
    //^ Can be empty.
    //^ elements: label, opcode, operand.
    //^ Must be populated only if level is about correcting, completing an existing script, or a tutorial/instruction level.
    exampleSolution?:[string, string, string][];
    //^ If user have no idea (which they shouldn't), then they can see an example solution and learn from it.
    //^ Must be populated unless tutorial/instruction level.
    cases?:[number[], string[]][];
    //^ Must be populated with atleast one sub-list unless tutorial/instruction level.
    //^ 'number[]' is the pre-defined inputs (optional - can be empty).
    //^ 'string[]' is expected outputs.
}
export const levelData:Level[] = [
    //^ Simpler and quicker compute time to referance an object by index then a sub-object by key.
    //* If level does not have 'exampleSolution', 'cases' and 'stars', it is a tutorial/introduction level type.
    //* If level does not have 'patrialScript', it is either a contexual or a big formula level type.
    //* If level does has everything, it is either a correcting or a partial level type.
    /* Template:
    { //< Level :
        //* level.
        objective: '',
        exampleCase: '',
        stars: { 3:, 2: },
        patrialScript:
        exampleSolution:
        cases:
    },
    */
    //#region tutorial/introduction levels
    { //< level 1: relay - input then output
        objective: 'One of the core concepts of computers is that they take inputs and give outputs. Run and play around with this program to understand before doing the next program.',
        exampleCase: 'Inputting "8" to get "8".',
        /// stars: { 3:, 2: },
        //^ kept, despite redundancy, for standardisation
        patrialScript:[
            //^ Kept in 'patrialScript' instead of 'exampleSolution' because the editor always gets filled with 'patrialScript' automatically, unlike 'exampleSolution'.
            ["", "INP", ""],
            ["", "BRP", "positive"],
            ["", "BRZ", "zero"],
            ["", "HLT", ""],
            ["zero", "OUT", ""],
            ["", "OUT", ""],
            ["", "HLT", ""],
            ["positive", "OUT", ""],
            ["", "HLT", ""]
        ]
        /// exampleSolution:
        /// cases:
    },
    { //< level 2: adder calculator - store input then add
        objective: 'The other core concept is the process the input, to store or manipulate it, and output the result. Run and play around with this program to understand before doing the next program.',
        exampleCase: 'Inputting "2" and "3" to get "5".',
        /// stars: { 3:, 2: },
        patrialScript:[
            ["", "INP", ""],
            ["", "STA", "19"],
            ["", "INP", ""],
            ["", "ADD", "19"],
            ["", "OUT", ""],
            ["", "HLT", ""]
        ]
        /// exampleSolution:
        /// cases:
    },
    { //< level 3: withdrawal - load then subtract
        objective: 'There are many ways to process inputs, some can stored and used later, others can be subtracted intead of adding. Run and play around with this program to understand before doing the next program.',
        exampleCase: 'Inputting "2" and "3" to get "-1".',
        /// stars: { 3:, 2: },
        patrialScript:[
            ["", "INP", ""],
            ["", "STA", "19"],
            ["", "INP", ""],
            ["", "STA", "20"],
            ["", "LDA", "19"],
            ["", "SUB", "19"],
            ["", "OUT", ""],
            ["", "HLT", ""]
        ]
        /// exampleSolution:
        /// cases:
    },
    { //< level 4: hundred rounding - Shift right twice then left twice
        objective: 'Choosing method processing inputs depends of their use. Take this program which can give the rounded hundred of the input. It first shift to the right twice, to clear all but the left digit, then shift left twice to move it back to it being the digit of most significance.',
        exampleCase: 'Inputting "123" to get "100".',
        /// stars: { 3:, 2: },
        patrialScript:[
            ["", "INP", ""],
            ["", "SHR", ""],
            ["", "SHR", ""],
            ["", "SHL", ""],
            ["", "SHL", ""],
            ["", "OUT", ""],
            ["", "HLT", ""]
        ]
        /// exampleSolution:
        /// cases:
    },
    { //< level 5: character set - number to ASCII converter
        objective: 'Computers do not understand English so they need someway to store letters. They do that using a character set - corroponding number to letters. Try inputting numbers to get characters out.',
        exampleCase: 'Inputting "121" to get "y".',
        /// stars: { 3:, 2: },
        patrialScript:[
            ["", "INP", ""],
            ["toChar", "OTC", ""],
            ["", "HLT", ""]
        ]
        /// exampleSolution:
        /// cases:
    },
    { //< level 6: varaibles - add 10 to input
        objective: 'Not everything needs to be inputted, some can be stored as variables before the program starts. Take this program, for instance, which adds the stored 10 to the user input.',
        exampleCase: 'Inputting "2" to get "12".',
        /// stars: { 3:, 2: },
        patrialScript:[
            ["", "INP", ""],
            ["", "ADD", "ten"],
            ["", "OUT", ""],
            ["", "HLR", ""],
            ["ten", "DAT", "10"]
        ]
        /// exampleSolution:
        /// cases:
    },
    { //< level 7: selection (if-statements) - branching if zero then if zero/positive
        objective: 'Programs executes sequentially but also selectively using if-statements instructions such as branching if a conditons meet. The following program takes an input and output it once if input is non-negative and if zero, then output twice.',
        exampleCase: 'Inputting "0" to get "0" and "0".',
        /// stars: { 3:, 2: },
        patrialScript:[
            ["", "INP", ""],
            ["", "BRP", "positive"],
            ["", "BRZ", "zero"],
            ["", "HLT", ""],
            ["zero", "OUT", ""],
            ["", "OUT", ""],
            ["", "HLT", ""],
            ["positive", "OUT", ""],
            ["", "HLT", ""]
        ]
        /// exampleSolution:
        /// cases:
    },
    { //< level 8: iteration - using counter to exit infinite loop
        objective: 'Branching also allows iterative execution (looping), however, does give the risk of the program being stuck in an infinite loop. Take the program, for instance, if any non-negative is inputted, the loop in only executed once. But if a negative inputted it will on an forever, in that case, user will have to manually stop the simulator. Try it.',
        exampleCase: 'Inputting "1" to get "1".',
        /// stars: { 3:, 2: },
        patrialScript:[
            ["", "INP", ""],
            ["loop", "OUT", ""],
            ["", "BRP", "end"],
            ["", "BRA", "loop"],
            ["end", "HLT", ""]
        ]
        /// exampleSolution:
        /// cases:
    },
    //#endregion
    //#region levels 9-10
    { //< Level 9: comparison - which input is higher.
        //* Correction level.
        objective: 'This program compares two inputs and is intended to output the higher number except it does the exact opposite. Can you fix it? (do not worry about overflows)',
        exampleCase: 'Inputting "2" and "3" to get "3".',
        stars: { 3:14, 2:19 },
        patrialScript:[
            ["", "INP", ""],
            ["", "STA", "num1"],
            ["", "INP", ""],
            ["", "STA", "num2"],
            ["loop", "LDA", "TOTAL"],
            ["", "ADD", "num1"],
            ["", "STA", "total"],
            ["", "LDA", "num2"],
            ["", "SUB", "one"],
            ["", "STA", "num2"],
            ["", "BRP", "loop"],
            ["", "LDA", "total"],
            ["", "STA", "total"],
            ["", "OUT", ""],
            ["", "HLT", ""],
            ["num1", "DAT", ""],
            ["num2", "DAT", ""],
            ["one", "DAT", "1"],
            ["total", "DAT", "0"]
        ],
        exampleSolution:[
            ["", "INP", ""],
            ["", "STA", "num1"],
            ["", "INP", ""],
            ["", "STA", "num2"],
            ["", "SUB", "num1"],
            ["", "BRP", "pos"],
            ["", "LDA", "num1"],
            ["", "OUT", ""],
            ["", "BRA", "exit"],
            ["pos", "LDA", "num2"],
            ["", "OUT", ""],
            ["exit", "HLT", ""],
            ["num1", "DAT", ""],
            ["num2", "DAT", ""]
        ],
        cases: [
            [[2, 3], ["3"]],
            [[998, 999], ["999"]],
            [[-5, 5], ["5"]],
            [[5, -5], ["5"]],
            [[-499, 498], ["498"]],
            [[498, -499], ["498"]]
          ]
    },
    { //< Level 10: linear graph equation - y=2x+3.
        //* Formula level.
        objective: 'Make a program reflect the graph equation y=2x+3 where user inputs x and gets y in return.',
        exampleCase: 'Inputting "4" to get "11".',
        stars: { 3:8, 2:13 },
        exampleSolution: [
            ["", "INP", ""],
            ["", "STA", "input"],
            ["", "ADD", "input"],
            ["", "ADD", "three"],
            ["", "OUT", ""],
            ["", "HLT", ""],
            ["input", "DAT", ""],
            ["three", "DAT", "3"]
        ],
        cases: [
            [[4], ["11"]],
            [[0], ["3"]],
            [[-5], ["-7"]],
            [[5], ["13"]],
            [[999], ["2"]],
            [[-999], ["4"]]
        ]
    },
    //#endregion
    //#region level 11-20
    { //< Level 11: even - is positive number even?
        //* Partial level.
        objective: 'Knowing if a positive integer is even or odd is important. Complete this program where it outputs "y" (121) if even and "n" (110) if odd.',
        exampleCase: 'Inputting "121" to get "y".',
        stars: { 3:13, 2:18 },
        patrialScript:[
            ["", "INP", ""],
            ["loop", "BRZ", "isEven"],
            ["", "SUB", "two"],
            ["", "BRP", "loop"],
        ],
        exampleSolution:[
            ["", "INP", ""],
            ["loop", "BRZ", "isEven"],
            ["", "SUB", "two"],
            ["", "BRP", "loop"],
            ["", "LDA", "odd"],
            ["", "OTC", ""],
            ["", "HLT", ""],
            ["isEven", "LDA", "even"],
            ["", "OTC", ""],
            ["", "HLT", ""],
            ["odd", "DAT", "110"],
            ["even", "DAT", "121"],
            ["two", "DAT", "2"]
        ],
        cases: [
            [[8], ["y"]],
            [[0], ["y"]],
            [[3], ["n"]],
            [[2], ["y"]],
            [[40], ["y"]],
            [[41], ["n"]]
        ]
    },
    { //< Level 12: positive multiplication - calculator
        //* Correction level.
        objective: 'Multiplication is fundementally a series of adding, however this program fails to do so for positive inputs. Can you find out why and fix it? (no need to worry about negatives)',
        exampleCase: 'Inputting "2" and "3" to get "6".',
        stars: { 3:20, 2:25 },
        patrialScript: [
            ["", "INP", ""],
            ["", "STA", "num1"],
            ["", "INP", ""],
            ["", "STA", "num2"],
            ["loop", "LDA", "total"],
            ["", "ADD", "num1"],
            ["", "STA", "total"],
            ["", "LDA", "num2"],
            ["", "SUB", "one"],
            ["", "STA", "num2"],
            ["", "BRP", "loop"],
            ["", "LDA", "total"],
            ["", "STA", "total"],
            ["", "OUT", ""],
            ["", "HLT", ""],
            ["num1", "DAT", ""],
            ["num2", "DAT", ""],
            ["one", "DAT", "1"],
            ["total", "DAT", "0"]
        ],
        exampleSolution: [
            ["", "INP", ""],
            ["", "STA", "num1"],
            ["", "INP", ""],
            ["", "STA", "num2"],
            ["loop", "LDA", "total"],
            ["", "ADD", "num1"],
            ["", "STA", "total"],
            ["", "LDA", "num2"],
            ["", "SUB", "one"],
            ["", "STA", "num2"],
            ["", "BRP", "loop"],
            ["", "LDA", "total"],
            ["", "SUB", "num1"],
            ["", "STA", "total"],
            ["", "OUT", ""],
            ["", "HLT", ""],
            ["num1", "DAT", ""],
            ["num2", "DAT", ""],
            ["one", "DAT", "1"],
            ["total", "DAT", "0"]
        ],
        cases: [
            [[2, 3], ["6"]],
            [[3, 3], ["9"]],
            [[0, 0], ["0"]],
            [[0, 10], ["0"]],
            [[10, 0], ["0"]]
        ]
    },
    { //< Level 13: unit converter - add 273 for C to K
        //* Contextual level.
        objective: 'unit converter - add 273 for C to K',
        exampleCase: 'Inputting "25" to get "298" with a "K" afterwards.',
        stars: { 3:5, 2:10 },
        exampleSolution: [
            ["", "INP", ""],
            ["", "ADD", "const"],
            ["", "OUT", ""],
            ["", "HLT", ""],
            ["const", "DAT", "273"]
        ],
        cases: [
            [[25], ["298"]],
            [[0], ["273"]],
            [[-25], ["248"]],
            [[-273], ["0"]],
            [[726], ["999"]]
        ]
    },
    { //< Level 14: squaring - input ^ 2
        //* Contextual level.
        objective: 'A simple calculator has been made with adding, subtracting, and multiplication capabilities but forgot the square function. Make a program that squares postitive input (input^2).',
        exampleCase: 'Inputting "3" to get "9".',
        stars: { 3:22, 2:27 },
        exampleSolution: [
            ["start", "INP", ""],
            ["", "STA", "number"],
            ["", "LDA", "zero"],
            ["", "STA", "sum"],
            ["", "STA", "count"],
            ["loop", "LDA", "sum"],
            ["", "ADD", "number"],
            ["", "STA", "sum"],
            ["", "LDA", "count"],
            ["", "ADD", "one"],
            ["", "STA", "count"],
            ["", "SUB", "number"],
            ["", "BRP", "finish"],
            ["", "BRA", "loop"],
            ["finish", "LDA", "sum"],
            ["", "OUT", ""],
            ["", "HLT", ""],
            ["number", "DAT", ""],
            ["sum", "DAT", ""],
            ["count", "DAT", ""],
            ["zero", "DAT", "0"],
            ["one", "DAT", "1"]
        ],
        cases: [
            [[3], ["9"]],
            [[2], ["4"]],
            [[7], ["49"]],
            [[1], ["1"]],
            [[0], ["0"]],
            [[31], ["961"]]
        ]
    },
    { //< Level 15: overflow - addition over the limit?
        //* Partial level.
        objective: 'This calculators add 2 positive numbers together but it needs to notify the user if the result goes over accumulator limit of 999. Complete the program by displaying a "x" (120) when the user result exceeds that range.',
        exampleCase: 'Inputting "999" and "1" to get "x".',
        stars: { 3:12, 2:17 },
        patrialScript: [
            ["", "INP", ""],
            ["", "STA", "num"],
            ["", "INP", ""],
            ["", "ADD", "num"]
        ],
        exampleSolution: [
            ["", "INP", ""],
            ["", "STA", "num"],
            ["", "INP", ""],
            ["", "ADD", "num"],
            ["", "BRP", "fine"],
            ["", "LDA", "over"],
            ["", "OTC", ""],
            ["", "HLT", ""],
            ["fine", "OUT", ""],
            ["", "HLT", ""],
            ["over", "DAT", "120"],
            ["num", "DAT", ""]
        ],
        cases: [
            [[999, 1], ["x"]],
            [[5, 10], ["15"]],
            [[5, 998], ["x"]],
            [[0, 0], ["0"]],
            [[999, 999], ["x"]],
            [[999, 0], ["999"]]
        ]
    },
    { //< Level 16: digit significance - least significant digit
        //* Contextual level.
        objective: 'Depending on the situation and use, not all data are useful. This take up redundant space. In this senario, the user is only interested with the least significating digit (right digit), so make a program that returns the least significant digit no matter the input.',
        exampleCase: 'Inputting "123" to get "3".',
        stars: { 3:7, 2:12 },
        exampleSolution: [
            ["", "INP", ""],
            ["", "SHL", ""],
            ["", "SHL", ""],
            ["", "SHR", ""],
            ["", "SHR", ""],
            ["", "OUT", ""],
            ["", "HLT", ""]
        ],
        cases: [
            [[123], ["3"]],
            [[999], ["9"]],
            [[321], ["1"]],
            [[100], ["0"]],
            [[-123], ["-3"]],
            [[0], ["0"]]
        ]
    },
    { //< Level 17: floor division - calculator
        //* Contextual level.
        objective: 'Another key calculator operation is the "floor division". This is a useful operation if you want to get the lower-rounded integer answer, from division instead of a decimal (also known as float) answer. Try implementing it (only need to work for positive inputs).',
        exampleCase: 'Inputting "25" and "8" to get "3"',
        stars: { 3:23, 2:28 },
        exampleSolution: [
            ["start", "INP", ""],
            ["", "STA", "dividend"],
            ["", "INP", ""],
            ["", "STA", "divisor"],
            ["", "LDA", "zero"],
            ["", "STA", "answer"],
            ["", "LDA", "dividend"],
            ["loop", "SUB", "divisor"],
            ["", "STA", "dividend"],
            ["", "BRP", "greater"],
            ["", "LDA", "answer"],
            ["", "OUT", ""],
            ["", "HLT", ""],
            ["greater", "LDA", "answer"],
            ["", "ADD", "one"],
            ["", "STA", "answer"],
            ["", "LDA", "dividend"],
            ["", "BRA", "loop"],
            ["zero", "DAT", "0"],
            ["one", "DAT", "1"],
            ["answer", "DAT", ""],
            ["dividend", "DAT", ""],
            ["divisor", "DAT", ""]
        ],
        cases: [
            [[25, 8], ["3"]],
            [[25, 5], ["5"]],
            [[25, 25], ["1"]],
            [[25, 50], ["0"]],
            [[999, 999], ["1"]],
            [[25, 23], ["1"]]
        ]
    },
    { //< Level 18: FizzBuzz - classic programming
        //* Partial level.
        objective: 'FizzBuzz classic programming exercise where "Fizz" is printed if positive input is dividable by 3 while "Buzz" is printed if dividable by 5 (if dividable by both then print "FizzBuzz"). The "Fizz" part is completed, do the "Buzz" part and complete the program (do not worry about negative inputs).',
        exampleCase: 'Inputting "15" to get "F","i","z","z","B","u","z","z".',
        stars: { 3:65, 2:70 },
        patrialScript: [
            ["", "INP", ""],
            ["", "STA", "input"],
            ["", "LDA", "input"],
            ["", "STA", "fizzTemp"],
            ["fLoop", "LDA", "fizzTemp"],
            ["", "SUB", "three"],
            ["", "BRP", "fCheck"],
            ["", "BRA", "fFalse"],
            ["fCheck", "BRZ", "fTrue"],
            ["", "STA", "fizzTemp"],
            ["", "BRA", "fLoop"],
            ["fTrue", "LDA", "one"],
            ["", "STA", "fizzFlag"],
            ["", "BRA", "fDone"],
            ["fFalse", "LDA", "zero"],
            ["", "STA", "fizzFlag"],
            ["fDone", "LDA", "fizzFlag"],
            ["", "BRZ", "skipFizz"]
        ],
        exampleSolution: [
            ["", "INP", ""],
            ["", "STA", "input"],
            ["", "LDA", "input"],
            ["", "STA", "fizzTemp"],
            ["fLoop", "LDA", "fizzTemp"],
            ["", "SUB", "three"],
            ["", "BRP", "fCheck"],
            ["", "BRA", "fFalse"],
            ["fCheck", "BRZ", "fTrue"],
            ["", "STA", "fizzTemp"],
            ["", "BRA", "fLoop"],
            ["fTrue", "LDA", "one"],
            ["", "STA", "fizzFlag"],
            ["", "BRA", "fDone"],
            ["fFalse", "LDA", "zero"],
            ["", "STA", "fizzFlag"],
            ["fDone", "LDA", "fizzFlag"],
            ["", "BRZ", "skipFizz"],
            ["", "LDA", "f"],
            ["", "OTC", ""],
            ["", "LDA", "i"],
            ["", "OTC", ""],
            ["", "LDA", "z"],
            ["", "OTC", ""],
            ["", "LDA", "z"],
            ["", "OTC", ""],
            ["skipFizz", "LDA", "input"],
            ["", "STA", "buzzTemp"],
            ["bLoop", "LDA", "buzzTemp"],
            ["", "SUB", "five"],
            ["", "BRP", "bCheck"],
            ["", "BRA", "bFalse"],
            ["bCheck", "BRZ", "bTrue"],
            ["", "STA", "buzzTemp"],
            ["", "BRA", "bLoop"],
            ["bTrue", "LDA", "one"],
            ["", "STA", "buzzFlag"],
            ["", "BRA", "bDone"],
            ["bFalse", "LDA", "zero"],
            ["", "STA", "buzzFlag"],
            ["bDone", "LDA", "buzzFlag"],
            ["", "BRZ", "halt"],
            ["", "LDA", "b"],
            ["", "OTC", ""],
            ["", "LDA", "u"],
            ["", "OTC", ""],
            ["", "LDA", "z"],
            ["", "OTC", ""],
            ["", "LDA", "z"],
            ["", "OTC", ""],
            ["halt", "HLT", ""],
            ["input", "DAT", "000"],
            ["fizzTemp", "DAT", "000"],
            ["fizzFlag", "DAT", "000"],
            ["buzzTemp", "DAT", "000"],
            ["buzzFlag", "DAT", "000"],
            ["three", "DAT", "003"],
            ["five", "DAT", "005"],
            ["one", "DAT", "001"],
            ["zero", "DAT", "000"],
            ["f", "DAT", "070"],
            ["i", "DAT", "105"],
            ["z", "DAT", "122"],
            ["b", "DAT", "066"],
            ["u", "DAT", "117"]
        ],
        cases: [
            [[15], ["F", "i", "z", "z", "B", "u", "z", "z"]],
            [[3], ["F", "i", "z", "z"]],
            [[5], ["B", "u", "z", "z"]],
            [[45], ["F", "i", "z", "z", "B", "u", "z", "z"]],
            [[7], []],
            [[33], ["F", "i", "z", "z"]]
        ]
    },
    { //< Level 19: bank balance - adding/subtracting until negative
        //* Correction level.
        objective: 'This program acts as a bank balance system for a customer but instead of stop looping at 0 or above, it goes into the negative. Fix this problem by printing "empty" as soon as balance goes negative then end program.',
        exampleCase: 'Inputting "100" for balance then "-90", "10", and "-21" to get "10" then "20" then "e","m","p","t","y".',
        stars: { 3:24, 2:29 },
        patrialScript: [
            ["", "INP", ""],
            ["", "STA", "total"],
            ["loop", "INP", ""],
            ["", "ADD", "total"],
            ["", "STA", "total"],
            ["", "OUT", ""],
            ["", "BRP", "loop"],
            ["", "LDA", "e"],
            ["", "OTC", ""],
            ["", "LDA", "m"],
            ["", "OTC", ""],
            ["", "LDA", "p"],
            ["", "OTC", ""],
            ["", "LDA", "t"],
            ["", "OTC", ""],
            ["", "LDA", "y"],
            ["", "OTC", ""],
            ["", "HLT", ""],
            ["total", "DAT", "000"],
            ["e", "DAT", "101"],
            ["m", "DAT", "109"],
            ["p", "DAT", "112"],
            ["t", "DAT", "116"],
            ["y", "DAT", "121"]
        ],
        exampleSolution: [
            ["", "INP", ""],
            ["", "STA", "total"],
            ["loop", "OUT", ""],
            ["", "INP", ""],
            ["", "ADD", "total"],
            ["", "STA", "total"],
            ["", "BRP", "loop"],
            ["", "LDA", "e"],
            ["", "OTC", ""],
            ["", "LDA", "m"],
            ["", "OTC", ""],
            ["", "LDA", "p"],
            ["", "OTC", ""],
            ["", "LDA", "t"],
            ["", "OTC", ""],
            ["", "LDA", "y"],
            ["", "OTC", ""],
            ["", "HLT", ""],
            ["total", "DAT", "000"],
            ["e", "DAT", "101"],
            ["m", "DAT", "109"],
            ["p", "DAT", "112"],
            ["t", "DAT", "116"],
            ["y", "DAT", "121"]
        ],
        cases: [
            [[100, -90, 10, -21], ["100", "10", "20", "e", "m", "p", "t", "y"]],
            [[10, -90], ["10", "e", "m", "p", "t", "y"]],
            [[0, -1], ["0", "e", "m", "p", "t", "y"]],
            [[0, 10, -10, -1], ["0", "10", "0", "e", "m", "p", "t", "y"]],
            [[10, 0, -15], ["10", "10", "e", "m", "p", "t", "y"]],
            [[999, -999, -999], ["999", "0", "e", "m", "p", "t", "y"]]
          ]
    },
    { //< Level 20: fibonacci sequence - 1st to 17th term (0-987)
        //* Big formula level.
        //* Only level where the cases does not have required inputs.
        objective: 'fibonacci sequence - 1st to 17th term (0-987)',
        exampleCase: 'Outputting (without input): 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987',
        stars: { 3:18, 2:23 },
        exampleSolution: [
            ["", "LDA", "first"],
            ["", "OUT", ""],
            ["", "LDA", "second"],
            ["", "OUT", ""],
            ["loop", "LDA", "first"],
            ["", "ADD", "second"],
            ["", "OUT", ""],
            ["", "STA", "first"],
            ["", "LDA", "second"],
            ["", "ADD", "first"],
            ["", "BRP", "next"],
            ["", "HLT", ""],
            ["next", "OUT", ""],
            ["", "STA", "second"],
            ["", "BRA", "loop"],
            ["", "HLT", ""],
            ["first", "DAT", "0"],
            ["second", "DAT", "1"]
        ],
        cases: [
            [[], ["0", "1", "1", "2", "3", "5", "8", "13", "21", "34", "55", "89", "144", "233", "377", "610", "987"]]
            //^
        ]
    },
    //#endregion
]