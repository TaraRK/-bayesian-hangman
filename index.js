const fs = require('fs');


module.exports = function(env) {
  var word_freq = JSON.parse(fs.readFileSync("word_freq.json", "utf8"));
  var dictionary = Object.keys(word_freq);
  var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

  // Utility: sum function
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

  function get_possible_word(pattern) {
    // use native .filter
    return dictionary.filter(function(w) {
      return match(pattern, w);
    });
  }

  function get_likelyhoods(pattern, words, use_word_frequency) {
    if (use_word_frequency === undefined) {
      use_word_frequency = false;
    }
    var total = use_word_frequency ? 0 : words.length;
    var letter_counts = {};
    for (var i = 0; i < alphabet.length; i++) {
      letter_counts[alphabet[i]] = 0;
    }

    for (var wi = 0; wi < words.length; wi++) {
      var w = words[wi];
      var weight = use_word_frequency ? (word_freq[w] || 0) : 1;
      if (use_word_frequency) {
        total += weight;
      }

      var wcopy = w;
      for (var j = 0; j < w.length; j++) {
        if (pattern.partial[j] !== "_") {
          continue;
        }
        var letter = wcopy[j];
        if (letter !== "$") {
          letter_counts[letter] = (letter_counts[letter] || 0) + weight;
          wcopy = wcopy.slice(0, j) + "$" + wcopy.slice(j+1);
        }
      }
    }

    for (var k = 0; k < alphabet.length; k++) {
      var l = alphabet[k];
      letter_counts[l] = letter_counts[l] / total;
    }

    return letter_counts;
  }

  // Renamed from next_letter_likelihoods to letter_inference
  function letter_inference(pattern, use_word_frequency) {
    if (use_word_frequency === undefined) {
      use_word_frequency = false;
    }
    var possible = get_possible_word(pattern);
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

  return {
    letter_inference: letter_inference
  };
};


