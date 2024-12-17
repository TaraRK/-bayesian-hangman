# Bayesian hangman

This is our final project for the class 9.66, Computational Cognitive Science.

**setup:**

mkdir -p ~/.webppl
npm install --prefix ~/.webppl webppl-json

**command to run model and get alpha:**

cd webppl-model

webppl test.wppl --require webppl-json --require .

**what is where:**

webppl code in webppl-model/test.wppl

code that calculates probabilities for models 3 and 4 in webppl-model/src/library.js

code that turns a csv into a dataset is in make_things.ipynb

the package I used for word frequency is called wordfreq

the dictionary I used is all words that wordfreq says has any nonzero probability (idk what words they just rounded to 0)

hangman function in hangman.py makes that graphic from weeks ago

**\*

*
