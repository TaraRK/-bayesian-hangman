const { NONAME } = require('dns');
const fs = require('fs');

var exampleJavascriptFn = function(x) {
    return x + 1;
}

var word_freq = JSON.parse(fs.readFileSync("word_freq.json", "utf8"));
var dictionary = Object.keys(word_freq);
var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

function sum(arr) {
    return arr.reduce(function(acc, x){ return acc + x; }, 0);
}

function match(pattern, word) {
    if (word.length !== pattern.partial.length) {
        return false;
    }
    for (var i = 0; i < word.length; i++) {
        if (pattern.partial[i] === "_") {
            if (pattern.not_in.indexOf(word[i]) > -1) {
                return false;
            }
            if (pattern.in.indexOf(word[i]) > -1) {
                return false;
            }
        } else {
            if (pattern.partial[i] !== word[i]) {
                return false;
            }
        }
    }
    return true;
}

function get_possible_word(pattern, threshold) {
    return dictionary.filter(function(w) {
        return match(pattern, w) && (word_freq[w] || 0) > threshold;
    });
}

function get_likelyhoods(pattern, words, use_word_frequency) {
    if (use_word_frequency === undefined) {
        use_word_frequency = false;
    }

    var position_letter_counts = {};
    for (var pos = 0; pos < pattern.partial.length; pos++) {
        position_letter_counts[pos] = {};
        for (var i = 0; i < alphabet.length; i++) {
            position_letter_counts[pos][alphabet[i]] = 0;
        }
    }

    for (var wi = 0; wi < words.length; wi++) {
        var w = words[wi];
        var weight = use_word_frequency ? (word_freq[w] || 0) : 1;

        for (var pos = 0; pos < w.length; pos++) {
            if (pattern.partial[pos] === "_") {
                var letter = w[pos];
                position_letter_counts[pos][letter] += weight;
            }
        }
    }

    var position_probabilities = {};
    for (var pos = 0; pos < pattern.partial.length; pos++) {
        if (pattern.partial[pos] === "_") {
            var pos_total = sum(Object.values(position_letter_counts[pos]));
            if (pos_total > 0) { 
                for (var letter of alphabet) {
                    position_letter_counts[pos][letter] /= pos_total;
                }
            }
        }
    }
    var final_probabilities = {};
    for (var letter of alphabet) {
        var letter_probs = [];
        for (var pos = 0; pos < pattern.partial.length; pos++) {
            if (pattern.partial[pos] === "_") {
                letter_probs.push(position_letter_counts[pos][letter]);
            }
        }
        final_probabilities[letter] = letter_probs.length > 0 ? 
            Math.max(...letter_probs) : 0;
    }

    return final_probabilities;
}

function letter_inference(pattern, use_word_frequency) {
    if (use_word_frequency === undefined) {
        use_word_frequency = false;
    }

    var threshold = use_word_frequency ? 0.0 : 1e-6;

    var possible = get_possible_word(pattern, threshold);
    var likelihoods = get_likelyhoods(pattern, possible, use_word_frequency);
    
    var guessed_letters = pattern.in.concat(pattern.not_in);
    var filtered = {};
    
    for (var i = 0; i < alphabet.length; i++) {
        var letter = alphabet[i];
        if (guessed_letters.indexOf(letter) === -1) {
            filtered[letter] = likelihoods[letter];
        }
    }
    
    return filtered;
}

module.exports = {
    exampleJavascriptFn: exampleJavascriptFn,
    letter_inference: letter_inference
}