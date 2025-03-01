var ErrorType;
(function (ErrorType) {
    ErrorType[ErrorType["labelDuplicate"] = 0] = "labelDuplicate";
    ErrorType[ErrorType["labelInvalid"] = 1] = "labelInvalid";
    ErrorType[ErrorType["labelMissing"] = 2] = "labelMissing";
    ErrorType[ErrorType["instructionInvalid"] = 3] = "instructionInvalid";
    ErrorType[ErrorType["addressinvalid"] = 4] = "addressinvalid";
    ErrorType[ErrorType["addressOutOfBounds"] = 5] = "addressOutOfBounds";
    ErrorType[ErrorType["addressOutOfBoundsDAT"] = 6] = "addressOutOfBoundsDAT";
    ErrorType[ErrorType["addressExpected"] = 7] = "addressExpected";
    ErrorType[ErrorType["addressNotExpected"] = 8] = "addressNotExpected";
    ErrorType[ErrorType["opcodeAllAbsent"] = 9] = "opcodeAllAbsent";
    ErrorType[ErrorType["tokenNotAlphanumeric"] = 10] = "tokenNotAlphanumeric";
})(ErrorType || (ErrorType = {}));
//^ Naming convension like that instead of invalidLabee, expectedAddress, etc because when using them, one just need to know the first word
//^ (affected token type - label, opcode, and operand) and IDE auto-fill takes care of the rest.
var TokenType;
(function (TokenType) {
    TokenType[TokenType["label"] = 0] = "label";
    TokenType[TokenType["opcode"] = 1] = "opcode";
    TokenType[TokenType["operand"] = 2] = "operand";
})(TokenType || (TokenType = {}));
export class Compiler {
    //* no need for constructor method
    generateErrorMessage(lineId, tokenType, errorType, invalidToken) {
        //* invalidToken may or may not be used depending on type of error ('errorType' argument).
        //* Code structure with or without 'invalidToken' is so similar that method overloading (
        //* methods with same name but different parameter set) is not worth it.
        let message = ` error at the ${TokenType[tokenType]} of line ${lineId} - `;
        //^ base the middle of the error message on where it happend (code line and token type)
        switch (errorType) {
            //^ base left and right ends of error message on the error type and sometimes the content of the corrosponding invalid token ('invalidToken').
            //* no 'break' syntax because all cases
            //: errors relating to the label token
            case ErrorType.labelDuplicate:
                return "Duplicate label" + message + `atleast 2 code lines are labeled the same (${invalidToken})`;
            case ErrorType.labelInvalid:
                return "Invalid label" + message + `label "${invalidToken}" is invalid. Use letters (A-Z) and numbers (0-9) only but must start with a letter.`;
            case ErrorType.labelMissing:
                return "Missing label" + message + `label "${invalidToken}" is called but cannot find code line with that label.`;
            //: only error relating to opcode
            case ErrorType.instructionInvalid:
                return "Invalid token" + message + `"${invalidToken}" is not a valid opcode token. Valid opcodes: ADD, SUB, STA, LDA, SHL, SHR, BRA, BRZ, BRP, INP, OUT, HLT, DAT`;
            //: errors relating to the address token (including the default case)
            case ErrorType.addressinvalid:
                return "Invalid address" + message + `"${invalidToken}" is not a valid address, address must be either an integer within range 0 to 99 or an existing label`;
            case ErrorType.addressOutOfBounds:
                return "Out-of-bounds address" + message + `label "${invalidToken}" is integer but out of bounds (0-99)`;
            case ErrorType.addressOutOfBoundsDAT:
                //* used exclusively with the DAT opcode
                return "operand not expected" + message + `label "${invalidToken}" is integer but out of bounds (-999 - 999)`;
            case ErrorType.addressExpected:
                return "operand expected" + message + `operand expected for opcode`;
            case ErrorType.addressExpected:
                return "operand not expected" + message + `operand expected for opcode`;
            //: lack of input - no opcodes at all:
            case ErrorType.opcodeAllAbsent:
                return "no operands detected, assembly programs cannot execute without opcodes - empty";
            //^ different structure to other errors because there is no code (by standard of lack of opcodes) in the assembly script
            //: general error - not alphanumeric
            default: //< ErrorType tokenNotAlphanumeric
                //^ using default case satisfy TS-2366 for method's return data-type
                return "non-alphanumeric" + message + `token "${invalidToken}" is not alphanumeric. Alphanumeric must only comprise of numbers digits (0-9) and letters (A-Z)`;
        }
    }
    errorMessage(lineId, tokenType, errorType, invalidToken) {
        //* 'errorMessage' and 'generateErrorMessage' became thier own methods because one has a lot code to accommodate all of the differnt kind of errors
        //* and the other calls a method from another class.
        const message = this.generateErrorMessage(lineId, tokenType, errorType, invalidToken);
        console.log(message);
    }
    labelMapping(script) {
        //* might be slightly more sense to use Map<string, string> instead but the different data types allows develops to easily identify what the key set and value set are
        //: Get list of labels for compilation and check for duplicate label declarations.
        //: Saperate from the other nested loop because an assembly program can call a label before its decalration.
        let labels = new Map();
        //^ map label to corrosponding line id to compile the labels into the numerical line ids later on.
        for (let lineId = 0; lineId < script.length; lineId++) {
            //: we know that caller method will never provide undefined elements and the code needed to deal
            //: with undefined in 2D array too large and complicated (unless both element and sub-aray are used)
            //: so "as" is used instead to satisfy TS-2532 and TS-2345 respectively.
            const token = script[lineId][0];
            if (token == "") {
                break;
            }
            //^ Does current line have a label?
            //^ Label's existance is not mandatory
            if (labels.has(token)) {
                //^ Is label already defined?
                //* If code line has a label declaration, it must be unique.
                this.errorMessage(lineId, 0, ErrorType.labelDuplicate, token);
                //^ called here instead of caller method because only this method know the line where the label error happened
                return new Map([["", -1]]);
                //^ returned map is '[["", -1]]' (for fail) because -1 cannot be a lineId thus it get recognised by caller method
            }
            labels.set(token, lineId);
            //^ label exists and is unique but not fully validated yet.
        }
        return labels;
        //^ the other validation part of the labels (check if alphanumeric) is done in the caller method
    }
    compress(script) {
        let isEmpty = true;
        //^ Empty script specifically means that there is no opcode in the assembly script/code.
        //^ Assume true until proven otherwise.
        for (let lineId = 0; lineId < script.length; lineId) {
            let opcode = script[lineId][1];
            //^ Use of "as" instead of "if", to satisfy TS-2367 due to complexity of getting element from 2D array.
            //^ It is not possible to code a line without opcode, therefore the program assumes that a line without
            //^ opcode is either an empty line or comment/region.
            if (opcode != "") {
                continue;
            }
            script.splice(lineId, 1);
            isEmpty = false;
        }
        if (isEmpty) {
            return [];
        }
        return script;
        //^ if script was empty (lack of operands), return referance would be an empty 2D-list ('[]').
    }
    validateAndCompile(script) {
        //* Actually does both the validation and compilation.
        //* They are not their own method because it is far more computationally expensive and long to do so as
        //* Together will take O(n*3+n) while saperating them will take O((n*3)*2+n) big-O notation.
        //* If script is invalid, return '[-1]', otherwise return the script compiled.
        /// //* return 'number[]' stucture: [ 'success or type of error', 'code line relevant to error', 'token column relevant to error', 'token causing the error', 'description of error']
        const instructions = ["ADD", "SUB", "STA", "SHL", "SHR", "LDA", "BRA", "BRZ", "BRP", "INP", "OUT", "HLT", "DAT"];
        //^ Does not include "DAT" as it is an opcode but not necessarily an instruction.
        const noOperands = ["SHL", "SHR", "INP", "OUT", "HLT"];
        ///const mandatoryOperands:string[] = ["ADD", "SUB", "STA", "LDA", "BRA", "BRZ", "BRP", "DAT"];
        const compiledInstructions = new Map([["ADD", 1], ["SUB", 2], ["STA", 3], ["SHL", 401], ["SHR", 402], ["LDA", 5], ["BRA", 600], ["BRZ", 700], ["BRA", 800], ["INP", 901], ["OUT", 902], ["HLT", 0]]);
        //^ easier to identify what the key set and value set are as 'Map<string, number>' instead of 'Map<string, string>'
        let compiledScript = [];
        script = this.compress(script);
        if (script.length == 0) {
            return [-1];
        }
        const labels = this.labelMapping(script);
        if (labels.get("") == -1) {
            return [-1];
        }
        //^ no error sending here because it happens in the label mapping private method ('labelMapping')
        let compiledInstruction = "";
        for (let lineId = 0; lineId < script.length; lineId++) {
            //* many constants are used as compiler does not recognise list[index] for fixing TS-2532 multiple times
            let line = script[lineId];
            if (line == undefined) {
                continue;
            }
            //^ satisfies TS-18048
            for (let column = 0; column < 3; column++) {
                //* 'column' does not take the line numbering column into account here
                let token = line[column];
                if (token == undefined) {
                    token = "";
                }
                //^ satisfies TS-2345
                let ExpectedOperand = true;
                //^ Outside nested loop because it (potentially) written to when validating opcode and read from when validating operand.
                //^ Assume that operand is expected until proven wrong.
                //^ Default 'true' instead of 'false' because it makes codes have less intensity/frequency of indented code.
                let opcodeDAT = false;
                //: validating the token
                if ((/[^A-Z0-9]/).test(token)) {
                    this.errorMessage(lineId, column, ErrorType.tokenNotAlphanumeric, token);
                    return [-1];
                }
                //^ Does token contain any character that is not alphanumeric?
                //^ Makes token only consists alphanumeric characters (26 letters A-Z and numerical digits 0-9).
                switch (column) {
                    case TokenType.label:
                        if ((/^[^0-9]/).test(token)) {
                            this.errorMessage(lineId, column, ErrorType.labelInvalid, token);
                            return [-1];
                        }
                        //^ Labels cannot have numbers at the start because that will confuse the user and other compilers (just like
                        //^ most other programming languages and other LMC simulators) with line Ids.
                        break;
                    case TokenType.opcode:
                        if (!instructions.includes(token)) {
                            this.errorMessage(lineId, column, ErrorType.instructionInvalid, token);
                            return [-1];
                        }
                        //^ Invalid if opcode is not recignised.
                        //^ All possible input combinations for opcode are limited to the instruction set so validation is simple.
                        if (noOperands.includes(token)) {
                            ExpectedOperand = false;
                            break;
                        }
                        //^ for operand validation - depends if corrosponding opcode expects an operand or not.
                        if (token == "DAT") {
                            opcodeDAT = true;
                        }
                        //^ For (existing) operand validation - if opcode is "DAT" then expect operand to be in integer range -999 to 999,
                        //^ otherwise operand to be in address range 0 to 99 or a label refernace.
                        if (opcodeDAT) {
                            break;
                        }
                        //: if valid, then opcode is already in its compiled form
                        let compiledOpcode = compiledInstructions.get(token);
                        if (compiledOpcode == undefined) {
                            compiledOpcode = 0;
                        }
                        //^ satisfies TS-18048 but should never be true.
                        compiledInstruction = compiledOpcode.toString();
                        break;
                    default: //< TokenType.operand
                        if (labels.has(token)) {
                            this.errorMessage(lineId, column, ErrorType.labelDuplicate, token);
                            return [-1];
                        }
                        //^ Has called label already been defined?
                        //^ If address/operand is label, then that must label must be declared otherwise error will appear.
                        if ((/[A-Z]/).test(token)) {
                            //* if referances label, check if label is declared than compile it into line id
                            const compiled = labels.get(token);
                            if (compiled == undefined) {
                                this.errorMessage(lineId, column, ErrorType.labelMissing, token);
                                return [-1];
                            }
                            //^ NOT to satisfy TS warnings/errors - compiled is expected to be 'undefined'
                            //^ if value cannot be found with subjected label as key.
                            compiledInstruction += compiled.toString();
                            //^ compiles operand into line id
                            break;
                        }
                        if (!ExpectedOperand) {
                            //* invalid if opcode does not expect an operand but gets one anyways
                            if (token != "") {
                                this.errorMessage(lineId, column, ErrorType.addressNotExpected, token);
                                return [-1];
                            }
                            break;
                            //^ if current operand is empty then no need to compile it
                        }
                        if (token == "") {
                            this.errorMessage(lineId, column, ErrorType.addressExpected, token);
                            return [-1];
                        }
                        //^ If instruction requires an operand/address.
                        //^ Invalid if opcode expects an operand but does not get one.
                        //: if operand exists but is not label referance:
                        if (!(opcodeDAT && (/^-?(?:[1-9]?\d{1,2}|0)$/).test(token))) {
                            this.errorMessage(lineId, column, ErrorType.addressOutOfBounds, token);
                            return [-1];
                        }
                        //^ Invalid if not made out of numerical digit ('[0-9]') that is in range -999 to -1
                        //^ ('-?' and '\d{1,2}'), 1 to 999 ('\d{1,2}'), or is 0 (|0) in any way in whole string
                        //^ ('^' and '$' respectively), as swell as having the DAT opcode.
                        if (!(!opcodeDAT && (/^(?:[1-9]?\d|0)$/).test(token))) {
                            this.errorMessage(lineId, column, ErrorType.addressOutOfBoundsDAT, token);
                            return [-1];
                        }
                        //^ if not DAT, expect operand to be integer in range 0-99, otherwise invalid
                        compiledInstruction += token;
                }
            }
            compiledScript.push(parseInt(compiledInstruction, 10));
            //^ apparently its is good practice to specify the second argument dispite being optional.
        }
        return compiledScript;
        //^ if method execution gets to this point without exiting/returning then the program is fully valid
    }
}
