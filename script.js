document.addEventListener("DOMContentLoaded", function () {
    let itemOptions = {};
    let selectedStat = null;
    let extraOption = null;
    let extraOptionSelected = false;
    let itemDrawn = false;

    const optionList = [
        { name: "최대 대미지", range: [1, 220] },
        { name: "최소 대미지", range: [1, 250] },
        { name: "크리티컬 대미지", range: [1, 130] },
        { name: "근력/마법력", range: [1, 22000] },
        { name: "올스탯", range: [1, 18000] },
        { name: "올스탯(%)", range: [1, 14] },
        { name: "무기 공격력/속성력", range: [1, 250] },
        { name: "무기 공격력/속성력(%)", range: [1, 14] },
        { name: "고정 대미지", range: [1, 25000] }
    ];

    function updateUI() {
        let mainUI = document.getElementById("main-ui");
        let resultMessage = document.getElementById("result-message");

        if (!itemDrawn) {
            mainUI.style.display = "none";
            return;
        } else {
            mainUI.style.display = "block";
        }

        let optionContainer = document.getElementById("item-options");
        optionContainer.innerHTML = "";

        for (let key in itemOptions) {
            let li = document.createElement("li");
            li.textContent = `${key}: ${itemOptions[key]}`;
            li.classList.add("option-item");

            if (key === selectedStat) {
                li.classList.add("selected-option");
            }
            if (key === extraOption && extraOptionSelected) {
                li.classList.add("extra-option-selected");
            }

            li.addEventListener("click", function () {
                selectedStat = key;
                updateUI();
            });

            optionContainer.appendChild(li);
        }

        let extraOptionContainer = document.getElementById("extra-option");
        extraOptionContainer.innerHTML = "";

        if (!extraOptionSelected) {
            extraOptionContainer.innerHTML = "<h3>🔹 선택 가능한 5번째 옵션:</h3>";
            let remainingOptions = optionList.filter(opt => !(opt.name in itemOptions));

            remainingOptions.forEach(opt => {
                let btn = document.createElement("button");
                btn.textContent = opt.name;
                btn.classList.add("extra-option-btn");

                if (opt.name === extraOption) {
                    btn.classList.add("selected-extra-option");
                }

                btn.addEventListener("click", function () {
                    extraOption = opt.name;
                    updateUI();
                });

                extraOptionContainer.appendChild(btn);
            });
        }

        // 실패 메시지가 있다면 3초 후 사라지게 함
        if (resultMessage.textContent.includes("❌")) {
            setTimeout(() => {
                resultMessage.textContent = "";
            }, 1500);
        }
    }

    function getRandomOptions() {
        itemOptions = {};
        selectedStat = null;
        extraOption = null;
        extraOptionSelected = false;
        itemDrawn = true;

        let selectedOptions = optionList.sort(() => Math.random() - 0.5).slice(0, 4);
        selectedOptions.forEach(opt => {
            itemOptions[opt.name] = 1;
        });

        updateUI();
    }

    let enchantedOptions = []; // 이미 강화된 옵션 저장

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".option").forEach(option => {
        option.addEventListener("click", function () {
            let optionName = this.getAttribute("data-option");
            selectOption(optionName);
        });
    });
});

function selectOption(option) {
    // 이미 강화된 옵션이면 선택 자체를 막음
    if (enchantedOptions.includes(option)) {
        return; 
    }

    selectedStat = option;
    updateUI();
}

function enhance(successRate) {
    if (!selectedStat && (!extraOption || extraOptionSelected)) {
        document.getElementById("result-message").textContent = "⚠️ 옵션을 선택하세요!";
        return;
    }

    let targetOption = selectedStat;

    if (extraOption && !extraOptionSelected) {
        targetOption = extraOption;
    }

    if (enchantedOptions.includes(targetOption)) {
        document.getElementById("result-message").textContent = "⚠️ 이미 강화된 옵션입니다!";
        return;
    }

    let isSuccess = Math.random() < successRate;
    const resultMessage = document.getElementById("result-message");

    if (isSuccess) {
        let statInfo = optionList.find(opt => opt.name === targetOption);
        let statBoost = Math.floor(Math.random() * (statInfo.range[1] - statInfo.range[0] + 1)) + statInfo.range[0];

        if (targetOption === extraOption) {
            extraOptionSelected = true;
            itemOptions[targetOption] = 0;
        }

        itemOptions[targetOption] += statBoost;
        enchantedOptions.push(targetOption); // 성공한 옵션 저장
        resultMessage.textContent = `✅ 강화 성공! ${targetOption} +${statBoost}`;

        // UI에서 해당 옵션 비활성화
        disableEnchantedOption(targetOption);
    } else {
        resultMessage.textContent = "❌ 강화 실패... 아이템이 파괴되었습니다!";
        
        setTimeout(() => {
            itemOptions = {};
            extraOption = null;
            extraOptionSelected = false;
            itemDrawn = false;
            enchantedOptions = []; // 실패 시 초기화
            document.getElementById("main-ui").style.display = "none";
            resultMessage.textContent = "";
            resetOptionsUI(); // 모든 옵션 다시 활성화
        }, 1500);
    }

    resultMessage.style.display = "block";
    updateUI();
}

function disableEnchantedOption(option) {
    let optionElement = document.querySelector(`.option[data-option="${option}"]`);
    if (optionElement) {
        optionElement.classList.add("disabled-option");
        optionElement.removeEventListener("click", selectOption); // 클릭 이벤트 제거
    }
}

function resetOptionsUI() {
    document.querySelectorAll(".option").forEach(option => {
        option.classList.remove("disabled-option");
        option.addEventListener("click", function () {
            let optionName = this.getAttribute("data-option");
            selectOption(optionName);
        });
    });
}

    document.getElementById("get-item-btn").addEventListener("click", getRandomOptions);
    document.getElementById("normal-enhance-btn").addEventListener("click", function () {
        enhance(0.5);
    });
    document.getElementById("super-enhance-btn").addEventListener("click", function () {
        enhance(0.6);
    });

    updateUI();
});
