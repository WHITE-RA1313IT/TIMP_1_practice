player = false;

//Функция выстрела, вызываемая при нажатии на шашку
function Shot(checker){
    if ((checker.id.indexOf('black') >= 0 && !player) || (checker.id.indexOf('white') >= 0 && player)) return;
	else {
		checker.move(getRandomInt(checker.x - 90, checker.x + 90), !player ? -300 : 780);
		setTimeout(() => {
			Repulsion(checker);
			ChangePlayer();
		}, 300);
	}
}

//Функция смены игрока, вызываемая в конце функции Shot(checker)
function ChangePlayer() {
	console.log(CheckWinner());
	//Вывод победителя, если он выявлен
	if (CheckWinner() >= 0) {
		console.log(CheckWinner());
		if (CheckWinner()) {
			alert('БЕЛЫЕ ПОБЕДИЛИ');
		}
		else if (!CheckWinner()) {
			alert('ЧЁРНЫЕ ПОБЕДИЛИ');
		}
	}
	//Смена игрока и статуса игры
	if (player) {
		player = false;
		document.getElementById('status').innerHTML = "ХОДЯТ БЕЛЫЕ";
	}
	else {
		player = true;
		document.getElementById('status').innerHTML = "ХОДЯТ ЧЁРНЫЕ";
	}
}

//Функция выявления победителя, вызываемая в конце функции ChangePlayer()
function CheckWinner() {
	let count = 0;
	for (let i = 0; i < 8; i++) {
		if (WhiteArray[i].knocked_out) count++;
	}
	if (count == 8) return 0;
	
	count = 0;
	for (let i = 0; i < 8; i++) {
		if (BlackArray[i].knocked_out) count++;
	}
	if (count == 8) return 1;
	
	return -1;
}

//Функция, выявляющая пересечение двух объектов
function MacroCollision(obj1, obj2){
  let XColl = false;
  let YColl = false;

  if ((obj1.x + obj1.width - 5 >= obj2.x) && (obj1.x <= obj2.x + obj2.width - 5)) XColl = true;
  if ((obj1.y + obj1.height - 5 >= obj2.y) && (obj1.y <= obj2.y + obj2.height - 5)) YColl = true;

  if (XColl&YColl){return true;}
  return false;
}

let BlackArray = new Array(8);
let WhiteArray = new Array(8);

// Функция шаблонизации
function render(templateString, data) {
  // Заменяем в шаблоне все вхождения {{...}} на значения свойств объекта data
  return templateString.replace(/{{(.*?)}}/g, (match, prop) => data[prop.trim()]);
}

// Шаблон для шашек
const template = `<div class="{{class}}" id="{{id}}" onclick="{{onclick}}" style="left: {{left}}px; top: {{top}}px;"></div>`;

// Функция, инициализзирующая шашки в качестве объектов
function SetCheckers() {
	for (let i = 0; i < 8; i++) {
		let checker = document.createElement('div');
		checker.id = `black-${7-i}`;
		document.getElementById('block').prepend(checker);
	}
	
	for (let i = 0; i < 8; i++) {
		let checker = document.createElement('div');
		checker.id = `white-${7-i}`;
		document.getElementById('block').prepend(checker);
	}
	
	for (let i = 0; i < 8; i++) {
		BlackArray[i] = {
			moving: false,
			knocked_out: false,
			id: `black-${i}`,
			x: 30 + 60 * i,
			y: 30,
			width: 50,
			height: 50,
			//Метод перерисовки шашки
			draw: function() {				
				let context = { 
					class: "black-checker",
					onclick: `Shot(BlackArray[${i}])`,
					left: this.x,
					top: this.y
				};
				
				document.getElementById(this.id).innerHTML = render(template, context);
			},
			//Метод перемещения шашки
			move: function(x, y) {
				this.moving = true;
				let k = (y - this.y) / (x - this.x);
				let b = (x * this.y - this.x * y) / (x - this.x); 

				while(this.moving) {
					if (this.x < x) {
						this.x += 1;
					}
					else if (this.x > x) {
						this.x -= 1;
					}

					if (this.move) {
						this.y = k * this.x + b;
					}

					if (Conflict(this) || this.x == x || this.y == y) {
						this.moving = false;
						this.draw();
					}
				}

				setTimeout(() => {
					if (this.x < 0 || this.x > 480 || this.y < 0 || this.y > 480) {
						document.getElementById(`${this.id}`).remove();
						this.knocked_out = true;
					}
				}, 300);
			}
		}

		WhiteArray[i] = {
			moving: false,
			knocked_out: false,
			id: `white-${i}`,
			x: 30 + 60 * i,
			y: 60 * 8 - 30,
			width: 50,
			height: 50,
			//Метод перерисовки шашки
			draw: function() {    
				let context = { 
					class: "white-checker",
					onclick: `Shot(WhiteArray[${i}])`,
					left: this.x,
					top: this.y
				};
				document.getElementById(this.id).innerHTML = render(template, context);
			},
			//Метод перемещения шашки
			move: function(x, y) {
				this.moving = true;
				let k = (y - this.y) / (x - this.x);
				let b = (x * this.y - this.x * y) / (x - this.x); 

				while(this.moving) {
					if (this.x < x) {
						this.x += 1;
					}
					else if (this.x > x) {
						this.x -= 1;
					}

					if (this.move) {
						this.y = k * this.x + b;
					}

					if (Conflict(this) || this.x == x && this.y == y) {
						this.moving = false;
						this.draw();
					}
				}

				setTimeout(() => {
					if (this.x < 0 || this.x > 480 || this.y < 0 || this.y > 480) {
						document.getElementById(`${this.id}`).remove();
						this.knocked_out = true;
					}
				}, 300);
			}
		}
	}
}

//Функция, выявляющая, перескается ли заданная шашка с другими шашками противника
function Conflict(checker) {
    if (!player) {
		for (let i = 0; i < 8; i++) {
			if (MacroCollision(checker, BlackArray[i])) {
				return true;
			}
		}
		return false;
	}
	
	if (player) {
		for (let i = 0; i < 8; i++) {
			if (MacroCollision(checker, WhiteArray[i])) {
				return true;
			}
		}
		return false;
	}
}

//Функция, отвечающая за отталкивание шашек противника при столкновении
function Repulsion(checker) {	
	if (!player) {		
		for (let i = 0; i < 8; i++) {
			if (MacroCollision(checker, BlackArray[i]) && !BlackArray[i].knocked_out) {
				BlackArray[i].y = -300;
				BlackArray[i].draw();
				setTimeout(() => {
					document.getElementById(`${BlackArray[i].id}`).remove();
					BlackArray[i].knocked_out = true;
				}, 250);
			}
		}
	}
	
	if (player) {
		for (let i = 0; i < 8; i++) {
			if (MacroCollision(checker, WhiteArray[i]) && !WhiteArray[i].knocked_out) {
				WhiteArray[i].y = 780;
				WhiteArray[i].draw();
				setTimeout(() => {
					document.getElementById(`${WhiteArray[i].id}`).remove();
					WhiteArray[i].knocked_out = true;
				}, 250);
			}
		}
	}
}

//Функция, возвращающая рандомное число в диапазоне от min до max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Функция отрисовки доски
function CreateBoard() {
    let table = document.createElement('table');
	table.setAttribute('id', 'table');
	table.style.width = "480px";
	table.style.height = "480px";
    let table_style = document.createElement('style');
    table_style.innerHTML = `
        table {
            position: relative;
            border-collapse: collapse;
            right: auto;
            left: auto;
        }
        td {
            padding: 0px;
        }
    `;
    document.head.appendChild(table_style);
    
    let k = 0;
    for (let i = 0; i < 8; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j < 8; j++) {
            let td = document.createElement('td');
            let cell = document.createElement('div');
            cell.padding = 0;
            if (i % 2 == 0) {
                if (k % 2 == 0) cell.style.backgroundColor = 'snow';
                else cell.style.backgroundColor = 'saddlebrown';
            }
            else {
                if (k % 2 == 0) cell.style.backgroundColor = 'saddlebrown';
                else cell.style.backgroundColor = 'snow';
            }
            cell.style.width = 60;
            cell.style.height = 60;
            td.appendChild(cell);
            tr.appendChild(td);
            k++;
        }
        table.appendChild(tr);
    }
    
    document.getElementById('block').appendChild(table);
}

//Функция запонения доски
function FillBoard() {
	SetCheckers();
	for (let i = 0; i < BlackArray.length; i++) WhiteArray[i].draw();
	for (let i = 0; i < BlackArray.length; i++) BlackArray[i].draw();
}