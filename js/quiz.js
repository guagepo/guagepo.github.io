"use strict";

const questions = [
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

const results = {
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

/* ============================================
   題目背景顏色
============================================ */

const questionThemes = [
    "theme-dark",
    "theme-blue",
    "theme-orange",
    "theme-blue",
    "theme-dark"
];

/* ============================================
   抓取 HTML 元素
============================================ */

const screens = {
    intro: document.querySelector("#intro-screen"),
    question: document.querySelector("#question-screen"),
    loading: document.querySelector("#loading-screen"),
    result: document.querySelector("#result-screen")
};

const startButton = document.querySelector("#start-button");
const exitButton = document.querySelector("#exit-button");

const restartButton = document.querySelector("#restart-button");
const restartTopButton =
    document.querySelector("#restart-top-button");

const questionNumber =
    document.querySelector("#question-number");

const questionText =
    document.querySelector("#question-text");

const answerList =
    document.querySelector("#answer-list");

const questionContent =
    document.querySelector("#question-content");

const progressBar =
    document.querySelector("#progress-bar");

const resultName =
    document.querySelector("#result-name");

const resultEnglish =
    document.querySelector("#result-english");

const resultImage =
    document.querySelector("#result-image");

const resultSummary =
    document.querySelector("#result-summary");

    const downloadResultButton =
    document.querySelector("#download-result-button");

const shareResultButton =
    document.querySelector("#share-result-button");

const copyCaptionButton =
    document.querySelector("#copy-caption-button");

const shareMessage =
    document.querySelector("#share-message");


/* ============================================
   測驗狀態
============================================ */

let currentQuestionIndex = 0;

let answerHistory = [];

let isTransitioning = false;

let currentFinalType = "";

const scores = {
    observer: 0,
    explorer: 0,
    creator: 0,
    thinker: 0
};


/* ============================================
   切換畫面
============================================ */

function changeScreen(screenName) {
    Object.values(screens).forEach((screen) => {
        screen.classList.remove("active");
    });

    screens[screenName].classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* ============================================
   重設測驗
============================================ */

function resetQuiz() {
    currentQuestionIndex = 0;
    answerHistory = [];
    isTransitioning = false;
    currentFinalType = "";

    Object.keys(scores).forEach((type) => {
        scores[type] = 0;
    });

    resultImage.src = "";

    hideShareMessage();
}


/* ============================================
   顯示題目
============================================ */

function showQuestion() {
    const currentQuestion =
        questions[currentQuestionIndex];

    const totalQuestions = questions.length;

    questionNumber.textContent =
        `QUESTION ${String(currentQuestionIndex + 1).padStart(2, "0")} / ` +
        `${String(totalQuestions).padStart(2, "0")}`;

    questionText.textContent =
        currentQuestion.question;

    progressBar.style.width =
        `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`;

    screens.question.classList.remove(
            "theme-dark",
            "theme-blue",
            "theme-orange"
        );
        
    screens.question.classList.add(
            questionThemes[currentQuestionIndex]
        );

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

    questionContent.classList.remove("leaving");

    questionContent.style.animation = "none";

    requestAnimationFrame(() => {
        questionContent.style.animation = "";
    });
}


/* ============================================
   選擇答案
============================================ */

function selectAnswer(type) {
    if (isTransitioning) {
        return;
    }

    if (!Object.prototype.hasOwnProperty.call(scores, type)) {
        console.error("未知的測驗類型：", type);
        return;
    }

    isTransitioning = true;

    scores[type] += 1;
    answerHistory.push(type);

    questionContent.classList.add("leaving");

    window.setTimeout(() => {
        currentQuestionIndex += 1;

        if (currentQuestionIndex < questions.length) {
            showQuestion();
            isTransitioning = false;
            return;
        }

        showLoading();
    }, 320);
}


/* ============================================
   處理平手
============================================ */

function calculateFinalType() {
    const highestScore =
        Math.max(...Object.values(scores));

    const tiedTypes =
        Object.keys(scores).filter((type) => {
            return scores[type] === highestScore;
        });

    if (tiedTypes.length === 1) {
        return tiedTypes[0];
    }

    /*
     * 平手時，以最後一次選到的平手類型為結果。
     */
    const reversedHistory =
        [...answerHistory].reverse();

    const recentTiedType =
        reversedHistory.find((type) => {
            return tiedTypes.includes(type);
        });

    return recentTiedType ?? tiedTypes[0];
}


/* ============================================
   Loading
============================================ */

function showLoading() {
    changeScreen("loading");

    window.setTimeout(() => {
        showResult();
    }, 2200);
}


/* ============================================
   顯示結果
============================================ */

function showResult() {
    const finalType = calculateFinalType();
    const finalResult = results[finalType];

    currentFinalType = finalType;

    resultName.textContent =
        finalResult.name;

    resultEnglish.textContent =
        finalResult.english;

    resultSummary.textContent =
        finalResult.summary;

    resultImage.src =
        finalResult.image;

    resultImage.alt =
        `${finalResult.name} ${finalResult.english} 分析結果`;

    resultImage.onerror = () => {
        console.error(
            `找不到圖片：${finalResult.image}`
        );

        resultImage.alt =
            `無法載入${finalResult.name}結果圖片，請檢查圖片路徑。`;
    };

    changeScreen("result");
}


/* ============================================
   開始與重新測驗
============================================ */

function startQuiz() {
    resetQuiz();
    showQuestion();
    changeScreen("question");
}

if (startButton) {
    startButton.addEventListener("click", startQuiz);
} else {
    console.error("找不到 #start-button");
}

if (restartButton) {
    restartButton.addEventListener("click", startQuiz);
}

if (restartTopButton) {
    restartTopButton.addEventListener("click", startQuiz);
}

if (exitButton) {
    exitButton.addEventListener("click", () => {
        const shouldExit =
            window.confirm("確定要離開測驗並回到展覽首頁嗎？");

        if (shouldExit) {
            window.location.href = "index.html";
        }
    });
}
/* ============================================
   結果分享功能
============================================ */

function getCurrentResult() {
    if (!currentFinalType || !results[currentFinalType]) {
        return null;
    }

    return results[currentFinalType];
}


function createShareCaption(result) {
    return [
        `我是「${result.name} ${result.english}」！`,
        "",
        result.summary,
        "",
        "在 Speci⁺ 人擇空間，找到屬於我的觀看方式。",
        "你是哪一種？",
        "",
        "#Speci+",
        "#人擇空間",
        "#世新資傳",
        "#畢業成果展"
    ].join("\n");
}


function showShareMessage(message, isError = false) {
    if (!shareMessage) {
        return;
    }

    shareMessage.textContent = message;
    shareMessage.classList.toggle("error", isError);
    shareMessage.classList.add("visible");

    window.clearTimeout(showShareMessage.timeoutId);

    showShareMessage.timeoutId = window.setTimeout(() => {
        hideShareMessage();
    }, 3500);
}


function hideShareMessage() {
    if (!shareMessage) {
        return;
    }

    shareMessage.classList.remove("visible", "error");
}


/*
 * 把結果圖片讀取成 File。
 * Web Share API 分享圖片時需要 File 物件。
 */
async function getResultImageFile(result) {
    const response = await fetch(result.image);

    if (!response.ok) {
        throw new Error(`無法讀取圖片：${result.image}`);
    }

    const blob = await response.blob();

    const fileExtension =
        blob.type === "image/jpeg" ? "jpg" : "png";

    const fileName =
        `Speci-${currentFinalType}.${fileExtension}`;

    return new File(
        [blob],
        fileName,
        {
            type: blob.type || "image/png"
        }
    );
}


/* ============================================
   下載分析卡
============================================ */

async function downloadResultImage() {
    const result = getCurrentResult();

    if (!result) {
        showShareMessage("目前沒有可下載的測驗結果。", true);
        return;
    }

    try {
        const response = await fetch(result.image);

        if (!response.ok) {
            throw new Error("分析卡圖片載入失敗。");
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);

        const downloadLink = document.createElement("a");

        downloadLink.href = objectUrl;
        downloadLink.download =
            `Speci-${currentFinalType}-${result.english}.png`;

        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();

        URL.revokeObjectURL(objectUrl);

        showShareMessage(
            "分析卡已下載，可以上傳到 Instagram 限時動態。"
        );

    } catch (error) {
        console.error(error);

        /*
         * 如果 fetch 因為本機預覽方式失敗，
         * 改用直接開啟圖片。
         */
        const fallbackLink = document.createElement("a");

        fallbackLink.href = result.image;
        fallbackLink.download =
            `Speci-${currentFinalType}-${result.english}.png`;

        document.body.appendChild(fallbackLink);
        fallbackLink.click();
        fallbackLink.remove();

        showShareMessage(
            "已嘗試下載分析卡；若圖片直接開啟，請長按儲存。",
            true
        );
    }
}


/* ============================================
   系統分享
============================================ */

async function shareResult() {
    const result = getCurrentResult();

    if (!result) {
        showShareMessage("目前沒有可分享的測驗結果。", true);
        return;
    }

    const shareText = createShareCaption(result);

    try {
        const imageFile = await getResultImageFile(result);

        const shareDataWithFile = {
            title: `Speci⁺ 人擇空間｜${result.name}`,
            text: shareText,
            files: [imageFile]
        };

        /*
         * 手機與部分桌機瀏覽器可直接分享圖片。
         */
        if (
            navigator.share &&
            navigator.canShare &&
            navigator.canShare({
                files: [imageFile]
            })
        ) {
            await navigator.share(shareDataWithFile);

            showShareMessage("分享選單已開啟。");
            return;
        }

        /*
         * 如果無法分享圖片，退回分享文字與網站網址。
         */
        if (navigator.share) {
            await navigator.share({
                title: `Speci⁺ 人擇空間｜${result.name}`,
                text: shareText,
                url: new URL("quiz.html", window.location.href).href
            });

            showShareMessage(
                "此瀏覽器無法直接分享圖片，已改為分享測驗連結。"
            );

            return;
        }

        /*
         * 完全不支援 Web Share API 時：
         * 自動下載圖片並複製文字。
         */
        await downloadResultImage();
        await copyShareCaption();

        showShareMessage(
            "此瀏覽器不支援系統分享，已下載圖片並複製文案。"
        );

    } catch (error) {
        /*
         * 使用者自己關閉分享選單時，不顯示錯誤。
         */
        if (error.name === "AbortError") {
            return;
        }

        console.error(error);

        showShareMessage(
            "無法直接分享，請下載分析卡後上傳到 Instagram。",
            true
        );
    }
}


/* ============================================
   複製分享文案
============================================ */

async function copyShareCaption() {
    const result = getCurrentResult();

    if (!result) {
        showShareMessage("目前沒有可複製的測驗結果。", true);
        return;
    }

    const caption = createShareCaption(result);

    try {
        await navigator.clipboard.writeText(caption);

        showShareMessage("分享文案與 Hashtag 已複製。");

    } catch (error) {
        console.error(error);

        /*
         * 舊瀏覽器備用方式。
         */
        const textarea = document.createElement("textarea");

        textarea.value = caption;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";

        document.body.appendChild(textarea);

        textarea.select();
        textarea.setSelectionRange(
            0,
            textarea.value.length
        );

        const success =
            document.execCommand("copy");

        textarea.remove();

        showShareMessage(
            success
                ? "分享文案與 Hashtag 已複製。"
                : "複製失敗，請手動複製。",
            !success
        );
    }
}


/* ============================================
   綁定按鈕
============================================ */

if (downloadResultButton) {
    downloadResultButton.addEventListener(
        "click",
        downloadResultImage
    );
}

if (shareResultButton) {
    shareResultButton.addEventListener(
        "click",
        shareResult
    );
}

if (copyCaptionButton) {
    copyCaptionButton.addEventListener(
        "click",
        copyShareCaption
    );
}