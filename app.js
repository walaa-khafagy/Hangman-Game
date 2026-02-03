

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
    
    var data = [];
    function loadData(callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'data.json', true);
        
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    data = JSON.parse(xhr.responseText);
                    callback( displayCategories);
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    alert("There is a problem with loading the data, Try again!")
                }
            }
        };
        xhr.send();
    }

    function chooseDifficulty( callback) {

        var difficultyButtons = document.querySelectorAll('.difficulty-button');

        difficultyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.classList.add('chosen-difficulty');

                document.getElementById("chosen-difficulty-text").innerText = e.target.innerText;
                document.getElementById("chosen-difficulty-text").style.display = "inline-block";

                // hide difficulty buttons section
                document.querySelector(".difficulty").style.display = "none";

                // Display Categories 
                callback(data[e.target.id], chooseRandomWord);

                difficultyButtons.forEach(other => { other.disabled = true; });
            });
        });
    }

    function displayCategories(chosenDifficultyData, callback) {

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
                e.target.classList.add('chosen-category');

                categoryButtons.forEach(other => { other.disabled = true; });

                document.getElementById("chosen-category-text").innerText = e.target.innerText;
                document.getElementById("chosen-category-text").style.display = "inline-block";

                // hide category buttons
                document.querySelector(".categories").style.display = "none";

                // console.log(chosenDifficultyData[e.target.id]);
                // Choosing a random word 
                callback(chosenDifficultyData[e.target.id], displaytheWordBox);

            });
        });

    }


    function chooseRandomWord(wordsInChosenCategory, callback) {
        var randomWord = wordsInChosenCategory[Math.floor(Math.random() * wordsInChosenCategory.length)];
        callback(randomWord, startGuessing);
    }

    function displaytheWordBox(chosenWord, callback) {

        console.log("chosen random word: ", chosenWord);
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

        var correctLetters = {};
        for (var i = 0; i < chosenWord.length; i++) {
            var letterCode = chosenWord.toUpperCase().charCodeAt(i).toString();
            correctLetters[letterCode] = correctLetters[letterCode] || [];
            correctLetters[letterCode].push(i);
        }
        console.log(correctLetters);

        var correctChoices = 0;
        for (var charCode in correctLetters) {
            console.log(charCode);
            var letterButton = document.getElementById(charCode);

            letterButton.addEventListener('click', (e) => {
                gotOneRight(correctLetters, e.target.id);
                e.target.classList.add('correct');
                e.target.disabled = true;
                correctChoices += correctLetters[e.target.id].length;
                console.log(correctChoices);

                if (correctChoices == chosenWord.length) {
                    console.log("CONGRATULATIONS");
                    giveVerdict(true, "");
                }
            });
        }

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
                if (wrongChoices == 6) {
                    giveVerdict(false, chosenWord);
                    console.log("GAME OVER");
                }
            });
        }

    }

    function gotOneRight(correctLetters, letterCode) {

        for (var i = 0; i < correctLetters[letterCode].length; i++) {
            console.log(correctLetters[letterCode][i]);
            var position = document.getElementById('guessLetter' + correctLetters[letterCode][i]);
            position.innerText = String.fromCharCode(letterCode);
            position.style.background = "rgb(220, 237, 194)";

        }
    }

    function gotOneWrong(counter) {
        var hangmanParts = ['.head', '.hisBody', '.arm.left', '.arm.right', '.leg.left', '.leg.right'];
        document.querySelector(hangmanParts[counter]).classList.add('show');
    }

    function giveVerdict(verdict, answer) {
        document.querySelectorAll(".Alphabet").forEach(btn => btn.disabled = true);
        document.querySelector(".result").innerText = (verdict ? "CONGRATULATIONS" : ("GAME OVER, the word is " + answer));
        document.querySelector(".result").classList.add(verdict ? "win" : "lose");
    }


    function restartGame() {
        document.getElementById("chosen-difficulty-text").innerText = "";
        document.getElementById("chosen-difficulty-text").style.display = "none";
        document.getElementById("chosen-category-text").innerText = "";
        document.getElementById("chosen-category-text").style.display = "none";



    }
}

playGame();





