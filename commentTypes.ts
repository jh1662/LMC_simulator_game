//  Generic.
//^ Describing or explaining the code line above.
//: Describing or explaining all code lines below until first emptry line or lower indentation than comment's.
//* Describing or explaining all code lines below in the same scope - until code line with lower indentation than comment's.
//< Describing or explaining the code in the same line.
//! Noting any logic errors or other significant code that needs fixing (for developer) ASAP.
//? Noting any confustion for user to solve later.
/// Disabled code line
//# Notes for the current scope it is in (not as strict as '//*') but does not affect region start nor end declarations.
//x Note that is not neccessarily related to the code - such as talking about the greater project (can also be done with '//X').
//@ Decalation for both the developers and the compiler to unserstand, such as '// @ts-ignore' to ignore TS errors in the line below the comment.

/* showing its use in multiline comments:
    ^
    :
    *
    <
    !
    ?
    /
    #
    x
*/

//x Due to '/**/' restrictions and limitations, some multiline comments are done with multiple adjecent single-line comments.
//x If each of those comment line is its own sentence (start capitalised, unless not a letter, and ends with full stop '.') then it is its own saperate comment.

//x otherwise you concider the multiply comment lines
//x as the one comment


//#region Region Name
//x code
//#endregion

//#region Closed Region
//#region Sub-region
//#endregion
//#endregion

