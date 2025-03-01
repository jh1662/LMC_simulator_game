// moduleA.js

// Import from moduleC
import { greeting } from './moduleC.js';

// Export a function
export function greet() {
    console.log(greeting);
}
