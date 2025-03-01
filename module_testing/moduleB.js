// moduleB.js

// Import from moduleA
// Ensure the import statement matches the exact file name casing
import { greet } from './moduleA.js';

// Use the imported function
document.addEventListener("DOMContentLoaded", () => {
    greet();
});
