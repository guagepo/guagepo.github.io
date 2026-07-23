"use strict";

const quizQuestions = [
    {
        question: "當你走進一個陌生展場，最先吸引你的是什麼？",
        answers: [
            {
                text: "畫面、色彩與整體視覺氛圍",
                type: "creator"
            },
            {
                text: "可以操作或親自體驗的作品",
                type: "explorer"
            },
            {
                text: "作品背後想討論的概念與議題",
                type: "thinker"
            },
            {
                text: "創作者留下的情感與故事",
                type: "observer"
            }
        ]
    },
    {
        question: "面對大量資訊同時出現時，你通常會怎麼做？",
        answers: [
            {
                text: "先找出最有視覺吸引力的內容",
                type: "creator"
            },
            {
                text: "邊操作邊理解，不一定先看說明",
                type: "explorer"
            },
            {
                text: "分析與比較，再決定什麼值得保留",
                type: "thinker"
            },
            {
                text: "注意其中容易被忽略的小細節",
                type: "observer"
            }
        ]
    },
    {
        question: "如果由你完成一件作品，你最重視什麼？",
        answers: [
            {
                text: "是否具有獨特而完整的風格",
                type: "creator"
            },
            {
                text: "觀眾能不能參與並產生互動",
                type: "explorer"
            },
            {
                text: "作品是否能傳達清楚的觀點",
                type: "thinker"
            },
            {
                text: "作品是否能留下真實的感受",
                type: "observer"
            }
        ]
    },
    {
        question: "AI 一次生成了許多不同版本，你會如何選擇？",
        answers: [
            {
                text: "選擇最有美感、最符合整體風格的版本",
                type: "creator"
            },
            {
                text: "選擇最有趣、最出乎意料的版本",
                type: "explorer"
            },
            {
                text: "選擇最符合目的與邏輯的版本",
                type: "thinker"
            },
            {
                text: "選擇最能呈現情緒與人味的版本",
                type: "observer"
            }
        ]
    },
    {
        question: "看完一件作品後，你最希望留下什麼感受？",
        answers: [
            {
                text: "原來視覺還能用這種方式呈現",
                type: "creator"
            },
            {
                text: "原來我也能成為作品的一部分",
                type: "explorer"
            },
            {
                text: "原來這個問題還能這樣思考",
                type: "thinker"
            },
            {
                text: "這個故事讓我產生了共鳴",
                type: "observer"
            }
        ]
    }
];

const quizResults = {
    observer: {
        name: "觀察者",
        english: "OBSERVER",
        image: "images/results/observer.png",
        summary:
            "你選擇用觀察保存意義。你擅長從細節、情緒與故事中發現容易被忽略的價值。"
    },

    explorer: {
        name: "探索者",
        english: "EXPLORER",
        image: "images/results/explorer.png",
        summary:
            "你選擇用探索打開可能。你享受親自參與的過程，也願意走進未知，重新定義觀看方式。"
    },

    creator: {
        name: "創造者",
        english: "CREATOR",
        image: "images/results/creator.png",
        summary:
            "你選擇用創造回應資訊。你擅長重新排列既有元素，透過風格與形式建立自己的語言。"
    },

    thinker: {
        name: "思考者",
        english: "THINKER",
        image: "images/results/thinker.png",
        summary:
            "你選擇用思考建立價值。你重視分析、判斷與邏輯，善於從大量資訊中留下值得的內容。"
    }
};

const screens = {
    intro: document.querySelector("#quiz-intro"),
    question: document.querySelector("#quiz-question-screen"),
    loading: document.querySelector("#quiz-loading"),
    result: document.querySelector("#quiz-result")
};


const startButton = document.querySelector("#start-quiz");
const restartButton = document.querySelector("#restart-quiz");

const questionNumber = document.querySelector("#question-number");
const questionText = document.querySelector("#question-text");
const answerList = document.querySelector("#answer-list");
const questionContent = document.querySelector("#question-content");
const progressBar = document.querySelector("#quiz-progress-bar");

const resultName = document.querySelector("#result-name");
const resultEnglish = document.querySelector("#result-english");
const resultImage = document.querySelector("#result-image");
const resultSummary = document.querySelector("#result-summary");

let currentQuestionIndex = 0;
let answerHistory = [];

const scores = {
    observer: 0,
    explorer: 0,
    creator: 0,
    thinker: 0
};

function changeScreen(screenName) {
    Object.values(screens).forEach((screen) => {
        screen.classList.remove("active");
    });

    screens[screenName].classList.add("active");

    screens[screenName].scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function resetScores() {
    Object.keys(scores).forEach((type) => {
        scores[type] = 0;
    });
}

function resetQuiz() {
    currentQuestionIndex = 0;
    answerHistory = [];

    resetScores();

    resultImage.src = "";
    resultImage.alt = "Speci+ 測驗結果分析圖";

    showQuestion();
}

function showQuestion() {
    const currentQuestion = quizQuestions[currentQuestionIndex];

    questionNumber.textContent =
        `QUESTION ${String(currentQuestionIndex + 1).padStart(2, "0")} / ` +
        `${String(quizQuestions.length).padStart(2, "0")}`;

    questionText.textContent = currentQuestion.question;

    const progress =
        ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

    progressBar.style.width = `${progress}%`;

    answerList.innerHTML = "";

    currentQuestion.answers.forEach((answer) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "answer-button";
        button.textContent = answer.text;

        button.addEventListener("click", () => {
            selectAnswer(answer.type);
        });

        answerList.appendChild(button);
    });

    questionContent.style.animation = "none";

    requestAnimationFrame(() => {
        questionContent.style.animation = "";
    });
}

function selectAnswer(type) {
    if (!Object.prototype.hasOwnProperty.call(scores, type)) {
        console.error("未知的結果類型：", type);
        return;
    }

    scores[type] += 1;
    answerHistory.push(type);

    currentQuestionIndex += 1;

    if (currentQuestionIndex < quizQuestions.length) {
        showQuestion();
        return;
    }

    showLoading();
}

function getFinalType() {
    const highestScore = Math.max(...Object.values(scores));

    const tiedTypes = Object.keys(scores).filter((type) => {
        return scores[type] === highestScore;
    });

    if (tiedTypes.length === 1) {
        return tiedTypes[0];
    }

    /*
     * 平手時以觀眾最後一次選到的平手類型為結果，
     * 避免每次都固定顯示同一個類型。
     */
    const reversedAnswers = [...answerHistory].reverse();

    return (
        reversedAnswers.find((type) => tiedTypes.includes(type)) ??
        tiedTypes[0]
    );
}

function showLoading() {
    changeScreen("loading");

    window.setTimeout(() => {
        showResult();
    }, 2000);
}

function showResult() {
    const finalType = getFinalType();
    const result = quizResults[finalType];

    resultName.textContent = result.name;
    resultEnglish.textContent = result.english;
    resultSummary.textContent = result.summary;

    resultImage.src = result.image;
    resultImage.alt = `${result.name} ${result.english} 測驗結果分析圖`;

    resultImage.onerror = () => {
        console.error(`無法載入結果圖片：${result.image}`);

        resultImage.alt =
            `找不到 ${result.name} 結果圖片，請檢查圖片路徑。`;
    };

    changeScreen("result");
}

startButton.addEventListener("click", () => {
    resetQuiz();
    changeScreen("question");
});

restartButton.addEventListener("click", () => {
    resetQuiz();
    changeScreen("question");
});