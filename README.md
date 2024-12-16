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

please forgive file names its 4am

the package I used for word frequency is called wordfreq

the dictionary I used is all words that wordfreq says has any nonzero probability (idk what words they just rounded to 0)

hangman function in hangman.py makes that graphic from weeks ago


**Notes:** 

tara  it WONT WORK as is because Initialization warning [3/4]: Trace not initialized after 100000 attempts.will happen.

We need to think about this, should be okay, but I guess giving it a massive pile of data and saying how often was it generated is not good. We should feed each data to the model one by one and then sum(???) the alphas. we think about the math of this
