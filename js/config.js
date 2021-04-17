class Window {
	constructor(title = "") {
		this.title = title;
		this.min = document.createElement("button");
		this.close = document.createElement("button");
		this.window = document.createElement("div");
		this.topBar = document.createElement("div");
		this.content = document.createElement("div");
		this.appStore = document.querySelector(".history__app-store");
		this.active = null;
		this.posX = null;
		this.posY = null;
		this.posXEnd = null;
		this.posYEnd = null;
		this.isMin = false;
		this.styling();
	}

	styling() {
		this.window.classList.add("window");
		this.topBar.classList.add("window__top-bar");
		this.content.classList.add("window__content");

		const title = document.createElement("h2");
        title.classList.add("window__title");
		title.innerText = this.title;
		this.topBar.appendChild(title);
		const windowOption = document.createElement("div");
		windowOption.classList.add("window-options");
		this.min.classList.add("window-options__button","window-options__button--min");
		this.close.classList.add("window-options__button","window-options__close");
		this.min.innerHTML = `<i class="far fa-window-minimize"></i>`;
		this.close.innerHTML = `<i class="fas fa-times"></i>`;
		windowOption.appendChild(this.min);
		windowOption.appendChild(this.close);

		this.topBar.appendChild(windowOption);
		this.window.appendChild(this.topBar);
		this.window.appendChild(this.content);

		this.addingFunctions();
	}

	addingFunctions() {
		this.topBar.addEventListener("mousedown", this.dragStart.bind(this));
		document.body.addEventListener("mousemove", this.dragging.bind(this));
		document.body.addEventListener("mouseup", this.dragEnd.bind(this));
		this.close.addEventListener("click", this.closeWindow.bind(this));
		this.min.addEventListener("click", this.minWindow.bind(this));
		this.window.addEventListener("mousedown", this.focusWindow.bind(this));
	}

	dragStart(e) {
		if (e.target === e.currentTarget) {
			e.preventDefault;
			this.active = true;
			this.posX = e.offsetX;
			this.posY = e.offsetY;
		}
	}

	dragging(e) {
		if (this.active) {
			e.preventDefault;
			const {left, top} = this.topBar.getBoundingClientRect();
			this.window.style.left = `${e.clientX - this.posX}px`;
			this.window.style.top = `${e.clientY - this.posY}px`;
		}
	}

	dragEnd(e) {
		e.preventDefault;
		this.active = false;
		this.posXEnd = `${e.clientX}px`;
		this.posYEnd = `${e.clientY}px`;
		this.window.style.top = `${this.posYEnd - e.offsetY}px`;
		this.window.style.left = `${this.posXEnd - e.offsetX}px`;
	}

	focusWindow() {
		this.window.style.setProperty("z-index", `${document.querySelectorAll(".window").length}`);
		const zIndex = +this.window.style.getPropertyValue("z-index");

		const ws = Array.from(document.querySelectorAll(".window")).sort((prev, next) => {
			return +prev.style.getPropertyValue("z-index") - +next.style.getPropertyValue("z-index");
		});

		const windowsSorted = ws.filter(el => {
			return +el.style.getPropertyValue("z-index") >= zIndex;
		});

		if (windowsSorted[0]) {
			const theHeighst = windowsSorted[windowsSorted.length - 1].style.getPropertyValue("z-index");
			windowsSorted.map((el, i) => {
				if (i !== 0) {
					const zIndex = +el.style.getPropertyValue("z-index");
					el.style.setProperty("z-index", `${zIndex - 1}`);
					return el;
				}
			});

			this.window.style.setProperty("z-index", theHeighst);
		}
	}

	addWindow(place = document.body) {
		place.appendChild(this.window);
		this.window.style.position = "absolute";
		this.window.classList.add("window--open");
		this.window.addEventListener("animationend", e => {
			if (this.window.classList.contains("window--open")){
				e.stopImmediatePropagation();
				this.window.classList.remove("window--open");
			}
		});
		this.focusWindow();
	}

	closeWindow() {
		this.window.classList.add("window--close");
		this.window.classList.remove("focus");
		this.window.addEventListener("animationend", e => {
			if (this.window.classList.contains("window--close")) {
				e.stopImmediatePropagation();
				this.window.classList.remove("window--close");
				this.window.remove();
			}
		});
	}

	minWindow() {
		if(this.isMin){
			this.isMin = false;
			this.addWindow().bind(this);
		} else{
			this.isMin = true;
			this.window.style.position = "static";
			this.appStore.appendChild(this.window);
		}
	}
}

class Timer{
	constructor(place){
		this.place = place;
		this.time = [];
		this.stopTime = 0;
		this.startTime = 0;
		this.pauseTime = 0;
		this.begin = 0;
		this.handleAnimationFrame = null;
		this.startTimer = false;
		this.stopTimer = true;
	}

	timeCounter(){
		const date = new Date();
		let nums;
		if(this.pauseTime){
			nums = new Date(date - this.begin - this.pauseTime);
		} else{
			nums = new Date(date - this.begin);
		}
		let hours = `${Math.floor(nums.getHours()-1)}`;
		let minutes = `${Math.floor(nums.getMinutes())}`;
		let seconds = `${Math.floor(nums.getSeconds())}`;
		let miliseconds = `${Math.floor(nums.getMilliseconds()/10)}`;

		this.time = [];
		this.time.push(hours,minutes,seconds,miliseconds);
		this.handleAnimationFrame = requestAnimationFrame(this.timeCounter.bind(this));
		let {textContent} = this.place;
		this.place.textContent = `${this.time[0].padStart(2,"0")}:${this.time[1].padStart(2,"0")}:${this.time[2].padStart(2,"0")}.${this.time[3].padStart(2,"0")}`;
	}

	start(start){
			if(!this.startTimer){
				this.startTimer = true;
				this.stopTimer = false;
				if(!this.begin) this.begin = start;
				if(this.stopTime){
					this.startTime = new Date();
					this.pauseTime += new Date(this.startTime - this.stopTime).getTime();
				}
				this.timeCounter();
			}
	}

	stop(){
		if(!this.stopTimer){
			this.stopTimer = true;
			this.startTimer = false;
			this.stopTime = new Date();
			cancelAnimationFrame(this.handleAnimationFrame);
		}
	}

	end(){
		this.startTimer = false;
		this.stopTimer = true;
		this.pauseTime = 0;
		this.startTime = 0;
		this.stopTime = 0;
		this.begin = 0;
		this.place.textContent = `00:00:00.00`;
		cancelAnimationFrame(this.handleAnimationFrame);
	}
}
