const clock = document.querySelector(".clock");
const history = document.querySelector(".history");
const historyButton = history.querySelector(".history__toggle");
const historyStoper = history.querySelector(".options-button--stoper");
const appStore = document.querySelector(".history__app-store");
const appStoreInner = document.querySelector(".history__app-store .inner-history");
let now = new Date();

const hourPointer = clock.querySelector(".pointer--hours");
const minutePointer = clock.querySelector(".pointer--minutes");
const secondPointer = clock.querySelector(".pointer--seconds");

hourPointer.style.transform = `translateX(50%) rotate(${now.getHours()*30-90}deg)`;
minutePointer.style.transform = `translateX(50%) rotate(${now.getMinutes()*6-90}deg)`;
secondPointer.style.transform = `translateX(50%) rotate(${now.getSeconds()*6-90}deg)`;

refreshTime();

function refreshTime(){
    now = new Date();

    hourPointer.style.transform = `translateX(50%) rotate(${now.getHours()*30-90}deg)`;
    minutePointer.style.transform = `translateX(50%) rotate(${now.getMinutes()*6-90}deg)`;
    secondPointer.style.transform = `translateX(50%) rotate(${now.getSeconds()*6-90}deg)`;

    if(now.getHours() >= 19 && now.getHours() < 22){
        if(document.body.style.backgroundImage !== "url(./img/evening.jpg)"){
            document.body.style.setProperty("background-image","url(./img/evening.jpg)");
        }
    } else if(now.getHours() >= 22 || now.getHours() < 5){
        if(document.body.style.backgroundImage !== "url(./img/night.jpg)"){
            document.body.style.setProperty("background-image","url(./img/night.jpg)");
        }
    } else if(now.getHours() >= 7 && now.getHours() < 19){
        if(document.body.style.backgroundImage !== "url(./img/day.jpg)"){
            document.body.style.setProperty("background-image","url(./img/day.jpg)");
        }
    } else if(now.getHours() >= 5 && now.getHours() < 7){
        if(document.body.style.backgroundImage !== "url(./img/morning.jpg)"){
            document.body.style.setProperty("background-image","url(./img/morning.jpg)");
        }
    }

    requestAnimationFrame(refreshTime);

    return now;
}

historyButton.addEventListener('click',e=>{
    const button = e.target.closest(".history__toggle");
    button.classList.toggle("history__toggle--opened");
    history.classList.toggle("history--opened");
});

const historyScrollbar = new Scrollbar();

const checkOverflow = () =>{
    if(appStoreInner.scrollHeight > appStoreInner.clientHeight){
        const scale = appStoreInner.scrollHeight/appStoreInner.clientHeight;
        const heightPx = getComputedStyle(appStoreInner).getPropertyValue("height");
        const height = heightPx.substr(0,heightPx.length-2)/scale;
        historyScrollbar.scroll.style.height = `${height}px`;
        historyScrollbar.addScrollbar(appStore);
    } else {
        historyScrollbar.scrollbar.remove();
    }
}

historyStoper.addEventListener('click',e=>{
    const startBtn = document.createElement("button");
    const pauseBtn = document.createElement("button");
    const endBtn = document.createElement("button");

    startBtn.classList.add("options-button", "options-button--white", "options-button--start");
    pauseBtn.classList.add("options-button", "options-button--white", "options-button--pause");
    endBtn.classList.add("options-button", "options-button--white", "options-button--end");

    const time = document.createElement("span");
    time.classList.add("counter");
    time.textContent = `00:00:00.00`;

    const timer = new Timer(time);
    startBtn.addEventListener("click",e=>{
        timer.start(new Date());
    })

    pauseBtn.addEventListener("click",e=>{
        timer.stop();
    })

    endBtn.addEventListener("click",e=>{
        timer.end();
    })

    startBtn.textContent = "Start";
    pauseBtn.textContent = "Pause";
    endBtn.textContent = "End";

    const cnt = document.createElement("div");
    cnt.classList.add("timer-cnt");
    cnt.appendChild(startBtn);
    cnt.appendChild(pauseBtn);
    cnt.appendChild(endBtn);
    const button = e.currentTarget;
    const stoperWindow = new Window("Stoper",{
        onMin: checkOverflow,
        onClose: checkOverflow
    });
    stoperWindow.content.classList.add("stoper-content");
    stoperWindow.content.appendChild(cnt);
    stoperWindow.content.appendChild(time);
    stoperWindow.addWindow();
});