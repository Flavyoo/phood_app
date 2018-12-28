/**
 * This service computes the similarity of two strings using Levenshtein distance, defined as follows per Wikipedia:
 * In information theory, linguistics and computer science, the Levenshtein distance is a string metric for measuring the difference between two sequences.
 * Informally, the Levenshtein distance between two words is the minimum number of single-character edits (insertions, deletions or substitutions) required to change one word into the other.
 * It is named after the Soviet mathematician Vladimir Levenshtein, who considered this distance in 1965.
 *
 *
 * Primary use case: comparing similar item names
 * These functions come directly from Stack Overflow:
 * Reference: https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely
 */

exports.computeSimilarity = computeSimilarity;

function computeSimilarity(s1, s2) {
    let longer = s1;
    let shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }

    const longerLength = longer.length;
    if (longerLength === 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    }

                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0) {
            costs[s2.length] = lastValue;
        }
    }
    return costs[s2.length];
}