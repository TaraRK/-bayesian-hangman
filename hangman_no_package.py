import matplotlib.pyplot as plt
import json 

#load word_freq.json and letter_freq.json 
word_freq = json.load(open("word_freq.json", "r"))
letter_freq = json.load(open("letter_freq.json", "r"))



alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

def get_dictionary(file_name):
    with open(file_name, "r") as file:
        dictionary = file.read().splitlines()
        
    #remove words with non-alphabet characters
    dictionary = [word for word in dictionary if all(char in alphabet for char in word)]
    return dictionary


def match(pattern, word):
    #partial matches
    if len(word) != len(pattern["partial"]):
        return False
    
    for i in range(len(word)):
        if pattern["partial"][i] == "_":
            if word[i] in pattern["not_in"]:
                return False
            if word[i] in pattern["in"]:
                return False
            
        else:
            if pattern["partial"][i] != word[i]:
                return False      
    
    return True

def get_possible_word(pattern, dictionary):
    return [word for word in dictionary if match(pattern, word)]


def get_likelyhoods(pattern, words, use_word_frequency = False):
    
    if use_word_frequency:
        total = 0 #will be incremented
    else: 
        total = len(words)
    
    letter_counts = {letter: 0 for letter in alphabet}
    for word in words:
        if use_word_frequency:
            weight = word_freq.get(word, 0)
            total += weight

        else:
            weight = 1
        
        word_copy = word
        for i in range(len(word)):
            if pattern["partial"][i] != "_":
                continue
            
            letter = word_copy[i]
            if letter!= "$":
                letter_counts[letter] += weight
                word_copy = word_copy.replace(letter, "$") #just so we don't double count that letter in a word 
    
    
    # print(letter_counts)
    # print(total)
    letter_counts = {letter: count/total for letter, count in letter_counts.items()}
    return letter_counts


def graph_likelyhoods(likelyhoods, guessed_letter=None):
    # Reverse the order of keys and values
    keys = list(likelyhoods.keys())[::-1]
    values = list(likelyhoods.values())[::-1]

    # Assign colors: red for guessed letter, blue for others
    colors = ['red' if key == guessed_letter else 'blue' for key in keys]

    # Create a horizontal bar chart
    plt.barh(keys, values, color=colors)

    # Customize labels: Highlight the guessed letter's label in red
    ax = plt.gca()
    y_labels = ax.get_yticklabels()
    for i, label in enumerate(y_labels):
        if keys[i] == guessed_letter:
            label.set_color('red')  # Set the label color to red

    plt.xlabel("Probability")
    plt.ylabel("Letters")
    plt.title("Likelihood Distribution (Reversed Order)")
    plt.show()
    
    
def hangman(word, guesses, dictionary, use_word_frequency = False):
    pattern = {
        "partial": ["_"] * len(word),
        "not_in": set(),
        'in': set()
    }
    
    for guess in guesses:
        
        print(pattern)
        print("Guess: ", guess)
        
        possible = get_possible_word(pattern, dictionary)
        likelyhoods = get_likelyhoods(pattern, possible, use_word_frequency)
        graph_likelyhoods(likelyhoods, guessed_letter=guess)
        
        
        if guess in word:
            for i in range(len(word)):
                if word[i] == guess:
                    pattern["partial"][i] = guess
                    pattern["in"].add(guess)
        else:
            pattern["not_in"].add(guess)
            
    
        
    return likelyhoods