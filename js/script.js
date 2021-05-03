const clock = document.querySelector(".clock");
const history = document.querySelector(".history");
const historyButton = history.querySelector(".history__toggle");
const historyStoper = history.querySelector(".options-button--stoper");
const historyHistoryBtn = history.querySelector(".options-button--history");
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
        if(document.body.style.backgroundImage !== "url(../img/evening.jpg)"){
            document.body.style.setProperty("background-image","url(../img/evening.jpg)");
        }
    } else if(now.getHours() >= 22 || now.getHours() < 5){
        if(document.body.style.backgroundImage !== "url(../img/night.jpg)"){
            document.body.style.setProperty("background-image","url(../img/night.jpg)");
        }
    } else if(now.getHours() >= 7 && now.getHours() < 19){
        if(document.body.style.backgroundImage !== "url(../img/day.jpg)"){
            document.body.style.setProperty("background-image","url(../img/day.jpg)");
        }
    } else if(now.getHours() >= 5 && now.getHours() < 7){
        if(document.body.style.backgroundImage !== "url(../img/morning.jpg)"){
            document.body.style.setProperty("background-image","url(../img/morning.jpg)");
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
        const window = new Window("Do you wanna save this time?",{
            disabledMin: true,
            disabledClose: true
        });

        window.window.classList.add("com-window");
        const yesBtn = document.createElement("button");
        const noBtn = document.createElement("button");
        yesBtn.classList.add("options-button", "options-button--white");
        noBtn.classList.add("options-button", "options-button--white");
        yesBtn.textContent = "Yes";
        noBtn.textContent = "No";
        const value = time.textContent;

        const saveTime = () =>{
            const name = title.textContent;
            let item = localStorage.getItem("time-data");
            if(!item){
                localStorage.setItem("time-data","[]");
                item = localStorage.getItem("time-data");
            }
            const data = JSON.parse(item);
            const newData = {
                name,
                value
            }
            data.push(newData);
            localStorage.setItem("time-data",JSON.stringify(data));
        }

        yesBtn.addEventListener('click', window.closeWindow.bind(window));
        noBtn.addEventListener('click', window.closeWindow.bind(window));
        yesBtn.addEventListener('click', saveTime);

        window.content.appendChild(yesBtn);
        window.content.appendChild(noBtn);
        window.addWindow();
        timer.end();
    })

    startBtn.textContent = "Start";
    pauseBtn.textContent = "Pause";
    endBtn.textContent = "End";

    const title = document.createElement("p");
    title.classList.add("title");
    title.textContent = "Title";
    const cnt = document.createElement("div");
    cnt.classList.add("timer-cnt");
    cnt.appendChild(startBtn);
    cnt.appendChild(pauseBtn);
    cnt.appendChild(endBtn);
    const stoperWindow = new Window("Stoper",{
        onMin: checkOverflow,
        onClose: checkOverflow
    });
    
    title.addEventListener("click",e=>{
        const window = new Window("Change Title",{
            disabledMin: true,
            disabledClose: true
        });

        window.window.classList.add("com-window");
        const input = document.createElement("input");
        const okBtn = document.createElement("button");
        input.classList.add("input");
        input.placeholder = "Title";
        input.value = title.textContent;
        okBtn.classList.add("options-button", "options-button--white");
        okBtn.textContent = "OK";

        const changeTitle = () =>{
            if(input.value.length) title.textContent = input.value;
        }

        okBtn.addEventListener('click', window.closeWindow.bind(window));

        okBtn.addEventListener('click', changeTitle);

        input.addEventListener('keydown',e=>{
            if(e.key.toLowerCase() === "enter") okBtn.click();
        });


        window.content.appendChild(input);
        window.content.appendChild(okBtn);
        window.addWindow();
    });

    stoperWindow.content.classList.add("stoper-content");
    stoperWindow.content.appendChild(title);
    stoperWindow.content.appendChild(cnt);
    stoperWindow.content.appendChild(time);
    stoperWindow.addWindow();
});

historyHistoryBtn.addEventListener('click',e=>{
    const stoperWindow = new Window("History",{
        disabledMin: true,
    });
    const timeCnt = document.createElement("div");
    timeCnt.classList.add("time-cnt");
    let items = localStorage.getItem("time-data") || "[]";
    if(JSON.parse(items).length){
        timeCnt.classList.remove("time-cnt--empty");
        JSON.parse(items).forEach(el=>{
            const item = document.createElement("div");
            const name = document.createElement("h2");
            const value = document.createElement("span");
            const remove = document.createElement("button");
            remove.classList.add("window-options__button", "window-options__button--close","item__button", "item__button--cacel");
            const icon = document.createElement("i");
            icon.classList.add("fas", "fa-times");
            icon.setAttribute("aria-hidden","true");
            remove.appendChild(icon);
    
            item.classList.add("item");
            name.classList.add("item__name");
            name.textContent = el.name;
            value.classList.add("item__value");
            value.textContent = el.value;
            item.appendChild(name);
            item.appendChild(value);
            item.appendChild(remove);
            timeCnt.appendChild(item);
        })

        timeCnt.addEventListener("click",e=>{
            if(e.target.closest(".item__button--cacel")){
                const name = e.target.closest(".item").querySelector(".item__name").textContent;
                const correctItemIndex = JSON.parse(items).findIndex(el=>el.name === name);
                const data = JSON.parse(items);
                data.splice(correctItemIndex,1);
                localStorage.setItem("time-data",JSON.stringify(data));
            }
        });
    } else{
        timeCnt.classList.add("time-cnt--empty");
        timeCnt.textContent = "You don't have history yet";
    }

    stoperWindow.content.appendChild(timeCnt);
    stoperWindow.window.classList.add("history-window");

    stoperWindow.addWindow();
});