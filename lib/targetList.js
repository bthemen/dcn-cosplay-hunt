/* In order to store multiple targets in a single hunter row, we use a "quick and dirty" approach of 
combining their UIDs in a comma-separated string, rather than resorting to an entire new table.
This file contains translation methods that go back and forth between a JS list of strings: [String, ..., String]
and our custom format:  "String,...,String"*/
export function targetListFromString(targetListString) {
    let entries = targetListString.split(",");
    console.log(entries);
    return entries.map( (entry) => `${entry}`)
}
export function stringFromTargetList(targetList) {
    return targetList.reduce(
        (accumulator, currentValue) => {
            if (accumulator == "") {
                // For the first item, don't prepend comma
                return `${currentValue}`
            } else {
                return accumulator + "," + `${currentValue}`
            }
        }, ""
    )
}