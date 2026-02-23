var comment = '';
var original = current.comments.getJournalEntry(1);
var marker = "(Additional comments)";
var index = original.indexOf(marker); // returns the starting index of the marker

if (index != -1) { // check if the marker was found
    // Extract the substring from the start (0) up to the marker's index
    comment = original.split("(Additional comments)")[1];
    // Result: "This is a comment" (using .Trim() for clean up)
}