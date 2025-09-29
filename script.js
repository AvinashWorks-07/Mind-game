let values = ["🧁","🍧","🍬","🍄","🍉","🍿","🍎","🍇","🧀"]

let fullvalues = [...values,...values,...values,...values]

fullvalues = fullvalues.sort(()=> 0.5 - Math.random());

let box = document.querySelector(".box");

fullvalues.forEach((elem)=>{
    let card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML += `
                        <div class="inner-card">
                        <div class="front-card"></div>
                        <div class="back-card">${elem}</div>
                    </div>`;
    card.addEventListener("click", () => cardFlip(card, elem));
    box.appendChild(card);
})


let score = document.querySelector("#score")

let mintime = document.querySelector("#min");
let sectime = document.querySelector("#sec")
let secCount = 0;
let minCount = 0;

let matchCount = 0;
let isPause = false;

let interval;
function startTimer(){
    interval = setInterval(()=>{
        if(!isPause){
            secCount++;
            sectime.textContent = String(secCount).padStart(2, '0');
            if(secCount === 60){
                minCount++;
                mintime.textContent = String(minCount).padStart(2,'0');
                secCount = 0;
            }
            start.classList.add("hidden");
        }
    
},1000)
}
function stopInterval(){
    clearInterval(interval);
}

let pause = document.querySelector("#pause");
pause.addEventListener("click",()=>{
    isPause = !isPause;
    pause.innerHTML = isPause ? `<i class="ri-play-line"></i>` : `<i class="ri-pause-fill"></i>`;
})


let gameStarted = false;
let flipCards = [];

const cardFlip = (card, value)=>{
    if (isPause) return; // prevent flipping when paused

    if (!gameStarted) {
    startTimer();      // start the timer
    gameStarted = true; // make sure it only starts once
    }


    card.classList.add("flipped");
    flipCards.push({card, value});
    
    
    if(flipCards.length === 2){
        let [firstCard, secondCard] = flipCards;
        if(firstCard.value === secondCard.value){
            setTimeout(()=>{
                firstCard.card.style.visibility = "hidden";
                secondCard.card.style.visibility = "hidden";
                flipCards = [];
                matchCount += 2;
                score.textContent = matchCount;

                if(matchCount === fullvalues.length){
                    setTimeout(()=>{
                        document.querySelector(".win").classList.remove("hidden");
                        let finalMin = String(minCount).padStart(2,'0');
                        let finalSec = String(secCount).padStart(2, '0');
                        document.querySelector("#time-req").textContent = `${finalMin}:${finalSec}`
                        stopInterval();
                    },500)
            }
            },300)
            
        }else{
        setTimeout(()=>{
            firstCard.card.classList.remove("flipped");
            secondCard.card.classList.remove("flipped");
        },700)
        flipCards = []
    }

    }
}
document.querySelector("#restart").addEventListener("click",()=>{
    window.location.reload();
})