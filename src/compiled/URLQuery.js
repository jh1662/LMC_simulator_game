var Themes;
(function (Themes) {
    Themes[Themes["default"] = 0] = "default";
    Themes[Themes["lowContrast"] = 1] = "lowContrast";
    Themes[Themes["greyscale"] = 2] = "greyscale";
})(Themes || (Themes = {}));
export class URLQuery {
    constructor() {
        const query = window.location.search.slice(1);
        //^ string slicing because the query includes the question mark ('?') query notation.
        const data = query.split("/");
        //^ Any queries in the LMC application will always concist of atleast 3 pieces of data.
        //^ The potential 4th one is the campain level.
        this.parsedData = [];
        console.log("Raw:");
        console.log(data);
        this.main(data);
        console.log("Parsed:");
        console.log(this.parsedData);
    }
    getConfig(configIndex) { return this.parsedData[configIndex]; } //< getter
    //^ 0-3 corrosponding to sound effect toggle, dark mode toggle, theme, and current level respectively.
    main(data) {
        //* is called by constructor but appropiate for code block to be part of the constructor (usually constructors don't handle much logic - mostly assaignments)
        const feedback = this.parseAndValidate(data);
        if (feedback != "") {
            document.documentElement.innerHTML = "<p>" + feedback + "</p>";
        }
        //^ requires access to the HTML document
        this.applySettings();
    }
    applySettings() {
        //* gets applied to every page so is in this file instead of a copy per page
        let theme;
        if (this.parsedData[0]) {
            console.log("Sound effects on");
        }
        //^ TS treats '1' as true and '0' as false.
        else {
            console.log("Sound effects off");
        }
        if (this.parsedData[1]) {
            theme = "-dark";
        }
        else {
            theme = "-light";
        }
        theme = Themes[this.parsedData[2]] + theme;
        //^ Enum key names are same as wanted in string.
        //^ For example theme will be "default-dark".
        //^ Far more simpler and compact than a switch statement.
        document.documentElement.setAttribute('data-theme', theme);
        //^ Changes [x] in '<html lang="en" data-theme="[x]">'.
        //^ Requires access to the HTML document.
    }
    parseAndValidate(data) {
        //* Very important because user may choose to edit the URL manually.
        //* Parsing and validate in same code for computing effeciency ( O(n) instead of O(2n) ).
        //: length checking
        if (data.length == 1 && data[0] == "") {
            //^ Specific contidtions used due to how 'window.location.search.slice(1)' work.
            //* If no query arguments are provided then use default values.
            this.parsedData = [0, 0, 0, 1];
            this.resetQuery();
            return "";
        }
        if (data.length != 4) {
            return `URL query needs 4 arguments, ${data.length} was given`;
        }
        //^ prevent a different number of config from being supplied
        //: general config checking
        for (let config of data) {
            this.parsedData.push(Number(config));
            //^ if cannot convert to number, will be 'NaN' instead
            if (!Number.isInteger(this.parsedData.at(-1)) || Number.isNaN(this.parsedData.at(-1))) {
                return `${config} is not a valid argument - must be an integer`;
            }
            //^ simpler to use "data.at(-1)" than "data[data.length-1]"
            if (this.parsedData.at(-1) < 0) {
                return `${config} is not a valid argument - must be a non-negative integer`;
            }
            //^ 'this.parsedData.at(-1)' will retrun number because it has been checked before for a element length of atleast 3.
            //^ More simpler to test lower boundry here instead of repeated because all 'config' start from 0.
        }
        //: Specific config checking.
        //: Type declarations (for TS-2532) used because of previous validation.
        if (this.parsedData[0] > 1) {
            return 'invalid argument option - sound effects config can only be 1 or 0';
        }
        //^ Means if it is 1 or 0 (nagitived handled in previous validation).
        //^ As in 'true' and 'false' respectively.
        if (this.parsedData[1] > 1) {
            return 'invalid argument option - dark mode config can only be 1 or 0';
        }
        if (this.parsedData[2] > 2) {
            return 'invalid argument option - dark mode config can only be 0, 1, or 2';
        }
        if (this.parsedData[3] > 30 || this.parsedData[3] == 0) {
            return 'invalid argument option - current campain level can only be from 1 to 30';
        }
        return "";
        //^ sucessful parsed and is thus valid
    }
    resetQuery() {
        //* Idea of code - https://stackoverflow.com/questions/5999118/how-can-i-add-or-update-a-query-string-parameter .
        //* Selects default query arguments of user haven't specify any in th URL and updates the URL without refresh.
        const url = new URL(window.location.href);
        //^ Get current URL
        url.search = "?" + "0/0/0/1";
        //^ Add query (including '?' notation) to URL
        window.history.pushState({ custom: 'state' }, "", url.toString());
        //^ Updates URL to include the query in the browser URL but without any refresh to make it seamless.
    }
}
