function loadLetters() {
    var letters = document.querySelector('.letters');
    for (var i = 0; i < 26; i++) {
        var letter = document.createElement("button");
        letter.classList.add('Alphabet');
        letter.classList.add('letter');
        letter.innerText = String.fromCharCode(i + 65);
        letter.id = i + 65;
        letters.appendChild(letter);
    }
}

function playGame() {

    loadLetters();
    loadData(chooseDifficulty);

    function loadData(callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'data.json', true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    var data = JSON.parse(xhr.responseText);
                    callback(data, displayCategories);
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    alert("There is a problem with loading the data, Try again!")
                }
            }
        };
        xhr.send();
    }

    function chooseDifficulty(data, callback) {
        var difficultyButtons = document.querySelectorAll('.difficulty-button');
        difficultyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.getElementById("chosen-difficulty-text").innerText = e.target.innerText;
                document.getElementById("chosen-difficulty-text").style.display = "inline-block";
                // hide difficulty buttons section
                document.querySelector(".difficulty").style.display = "none";
                // Display Categories 
                callback(data[e.target.id], chooseRandomWord);
                // Setting number of hints
                document.getElementById('hintsRemaining').textContent = (e.target.id === "easy" ? 1 : (e.target.id == "medium" ? 2 : 4));
            });
        });
    }

    function displayCategories(chosenDifficultyData, callback) {

        // displaying the categories in the chosen level
        var categoriesInChosen = Object.keys(chosenDifficultyData);
        var categories = document.getElementById('container-categories');
        categoriesInChosen.forEach(function (category) {
            var tempButton = document.createElement("button");
            tempButton.innerText = category;
            tempButton.id = category;
            tempButton.classList.add('category-button');
            categories.insertAdjacentElement('beforeend', tempButton);
        });
        document.querySelector('.categories').style.display = "block";

        // User chooses category
        var categoryButtons = document.querySelectorAll('.category-button');
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.getElementById("chosen-category-text").innerText = e.target.innerText;
                document.getElementById("chosen-category-text").style.display = "inline-block";
                // hide category buttons
                document.querySelector(".categories").style.display = "none";
                // Choosing a random word 
                callback(chosenDifficultyData[e.target.id], displaytheWordBox);
            });
        });
    }

    function chooseRandomWord(wordsInChosenCategory, callback) {
        // Choosing a random word from the words existing in the category chosen
        var randomWord = wordsInChosenCategory[Math.floor(Math.random() * wordsInChosenCategory.length)];
        callback(randomWord, startGuessing);
    }

    function displaytheWordBox(chosenWord, callback) {
        var word = document.querySelector(".word");
        for (var i = 0; i < chosenWord.length; i++) {
            var letter = document.createElement("div");
            letter.id = "guessLetter" + i;
            letter.classList.add('letter');
            word.appendChild(letter);
        }
        callback(chosenWord);
    }

    function startGuessing(chosenWord) {

        // displaying the number of hints 
        document.getElementById("numberOfHints").style.display = "block";

        var correctLetters = {};
        for (var i = 0; i < chosenWord.length; i++) {
            var letterCode = chosenWord.toUpperCase().charCodeAt(i).toString();
            correctLetters[letterCode] = correctLetters[letterCode] || [];
            correctLetters[letterCode].push(i);
        }

        // adding event listiner on correct letters to mark them as correct and display the letters in the word
        for (var charCode in correctLetters) {
            var letterButton = document.getElementById(charCode);
            letterButton.addEventListener('click', (e) => {
                gotOneRight(chosenWord.length, correctLetters, e.target.id, "correctGuess");
            });
        }

        // Giving a hint
        document.getElementById("hintButton").addEventListener('click', () => {
            var remaining = Number(document.getElementById("hintsRemaining").textContent);
            if (remaining === 0) {
                alert("You have no hints remaining!");
            }
            else {
                remaining--;
                document.getElementById("hintsRemaining").textContent = remaining;
                // choosing from unguessed letters only
                var availableLetters = [];
                var lettersInWordSofar = document.querySelector(".word").children;
                for (var l = 0; l < lettersInWordSofar.length; l++) {
                    if (lettersInWordSofar[l].classList.contains("correctGuess") || lettersInWordSofar[l].classList.contains("hint")) {
                        continue;
                    } else {
                        availableLetters.push(chosenWord.toUpperCase().charCodeAt(l));
                    }
                }
                var randomIdx = Math.floor(Math.random() * (availableLetters.length - 1));
                // somewhat treating the hinted letter as a correct guess to display the letter in the word and disable it's button
                gotOneRight(chosenWord.length, correctLetters, String(availableLetters[randomIdx]), "hint");
            }

        });

        // counting wrong guesses 
        var wrongChoices = 0;
        for (var letter = 0; letter < 26; letter++) {
            var curLetterCode = (letter + 65).toString();
            if (curLetterCode in correctLetters) {
                continue;
            }
            var wrongbutton = document.getElementById(curLetterCode);
            wrongbutton.addEventListener('click', (e) => {
                e.target.classList.add('wrong');
                e.target.disabled = true;
                gotOneWrong(wrongChoices++);
                // 6 body parts revealed = game over
                if (wrongChoices == 6) {
                    giveVerdict(false, chosenWord);
                }
            });
        }
    }

    // displaying and marking the correct guessed letter and disabling its button
    function gotOneRight(numberOfletters, correctLetters, letterCode, classToAdd) {

        document.getElementById(letterCode).classList.add('correct');
        document.getElementById(letterCode).disabled = true;
        for (var i = 0; i < correctLetters[letterCode].length; i++) {
            var position = document.getElementById('guessLetter' + correctLetters[letterCode][i]);
            position.innerText = String.fromCharCode(letterCode);
            position.classList.add(classToAdd)
        }

        var idx = 0;
        while (idx < numberOfletters &&
            (document.getElementById('guessLetter' + idx).classList.contains("hint") ||
                document.getElementById('guessLetter' + idx).classList.contains("correctGuess"))) {
            idx++;
        }

        if (idx == numberOfletters) {
            giveVerdict(true, "");
        }
    }

    // revealing the next body part
    function gotOneWrong(counter) {
        var hangmanParts = ['.head', '.hisBody', '.arm.left', '.arm.right', '.leg.left', '.leg.right'];
        document.querySelector(hangmanParts[counter]).classList.add('show');
    }

    // displaying the final result pop-up and disabling all the buttons
    function giveVerdict(verdict, answer) {
        document.querySelectorAll(".Alphabet").forEach(btn => btn.disabled = true);
        document.getElementById("hintButton").disabled = true;

        var modal = document.getElementById("gameModal");
        var title = document.getElementById("modalTitle");
        var msg = document.getElementById("modalMessage");
        var content = document.querySelector(".modal-content");

        if (verdict) {
            content.classList.add("win");
            title.innerText = "CONGRATULATIONS!";
            msg.innerText = "You won! Great job!";
            var wellDone = document.createElement("img");
            wellDone.src = "Assets/well done.gif";
            wellDone.style.width = "40%";
            document.getElementById("modalVisual").appendChild(wellDone);
        } else {
            content.classList.add("lose");
            title.innerText = "GAME OVER";
            var word = document.querySelector(".word")
            var wordChildren = word.children;
            for (var i = 0; i < wordChildren.length; i++) {
                if (wordChildren[i].classList.contains("correctGuess") || wordChildren[i].classList.contains("hint"))
                    console.log(wordChildren[i]);
                else {
                    wordChildren[i].innerText = answer[i].toUpperCase();
                    wordChildren[i].classList.add("reveal");
                }
            }
            msg.innerText = "The word is:";
            var wordClone = word.cloneNode(true);
            document.querySelector(".modal-content").insertBefore(wordClone, document.getElementById("modalBtn"));

            var gameHangman = document.querySelector(".hangman");
            var hangmanClone = gameHangman.cloneNode(true);
            document.getElementById("modalVisual").appendChild(hangmanClone);
        }
        document.getElementById("modalBtn").addEventListener('click', () => window.location.reload());
        setTimeout(() => { modal.classList.add("show"); }, 500);
    }

    document.getElementById("retryButton").addEventListener('click', () => window.location.reload());

}

playGame();
