const hangmanModule = require('./index.js')(); // Adjust path as needed


console.log(hangmanModule.letter_inference({ partial: ["m", "_", "_", "_"], in: ["a"], not_in: ["b"] }, false));
  
