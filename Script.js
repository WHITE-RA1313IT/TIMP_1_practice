let player = false;

function getCursorPositionX(block, event) {
    let rect = block.getBoundingClientRect()
    let x = event.clientX - rect.left
    return x;
}

function getCursorPositionY(block, event) {
    let rect = block.getBoundingClientRect()
    let y = event.clientY - rect.top
    return y;
}

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

function ChangePlayer() {
	console.log(CheckWinner());
	if (CheckWinner() >= 0) {
		console.log(CheckWinner());
		if (CheckWinner()) {
			alert('БЕЛЫЕ ПОБЕДИЛИ');
		}
		else if (!CheckWinner()) {
			alert('ЧЁРНЫЕ ПОБЕДИЛИ');
		}
	}
	if (player) {
		player = false;
		document.getElementById('status').innerHTML = "ХОДЯТ БЕЛЫЕ";
	}
	else {
		player = true;
		document.getElementById('status').innerHTML = "ХОДЯТ ЧЁРНЫЕ";
	}
}

function CheckWinner() {
	let count = 0;
	for (let i = 0; i < 8; i++) {
		if (WhiteArray[i].knocked_out) count++;
	}
	if (count === 8) return 0;
	
	count = 0;
	for (let i = 0; i < 8; i++) {
		if (BlackArray[i].knocked_out) count++;
	}
	if (count === 8) return 1;
	
	return -1;
}

function MacroCollision(obj1, obj2){
  var XColl = false;
  var YColl = false;

  if ((obj1.x + obj1.width - 5 >= obj2.x) && (obj1.x <= obj2.x + obj2.width - 5)) XColl = true;
  if ((obj1.y + obj1.height - 5 >= obj2.y) && (obj1.y <= obj2.y + obj2.height - 5)) YColl = true;

  if (XColl&YColl){return true;}
  return false;
}

var BlackArray = new Array(8);
var WhiteArray = new Array(8);
var Checkers = new Array(16);

for (let i = 0; i < 8; i++) {
	BlackArray[i] = {
		moving: false,
		knocked_out: false,
		id: `black-${7-i}`,
		x: 30 + 60 * i,
		y: 30,
		width: 50,
		height: 50,
		draw: function() {    
			let checker;
            let block = document.getElementById('block');
            if (document.getElementById(`${this.id}`) === null) {
                checker = document.createElement('div');
                checker.style.marginLeft = this.x;
                checker.style.marginTop = this.y;
                checker.className = 'black-checker';
                checker.setAttribute('id', `${this.id}`);
                checker.setAttribute('onclick', `Shot(BlackArray[${i}])`);
                block.prepend(checker);
            }
            else {
                checker = document.getElementById(`${this.id}`);
                checker.style.marginLeft = this.x;
			    checker.style.marginTop = this.y;
            }
		},
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
				
                if (Conflict(this) || this.x === x || this.y === y) {
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
    Checkers[i] = BlackArray[i];
	
	WhiteArray[i] = {
		moving: false,
		knocked_out: false,
        id: `white-${7-i}`,
		x: 30 + 60 * i,
		y: 60 * 8 - 30,
		width: 50,
		height: 50,
		draw: function() {    
			let checker;
            let block = document.getElementById('block');
            if (document.getElementById(`${this.id}`) === null) {
                checker = document.createElement('div');
                checker.style.marginLeft = this.x;
                checker.style.marginTop = this.y;
                checker.className = 'white-checker';
                checker.setAttribute('id', `${this.id}`);
                checker.setAttribute('onclick', `Shot(WhiteArray[${i}])`);
                block.prepend(checker);
            }
            else {
                checker = document.getElementById(`${this.id}`);
                checker.style.marginLeft = this.x;
			    checker.style.marginTop = this.y;
            }
		},
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
				
                if (Conflict(this) || this.x === x && this.y === y) {
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
    Checkers[i+8] = WhiteArray[i];
}

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

function Repulsion(checker) {
	if (!player) {
		for (let i = 0; i < 8; i++) {
			if (MacroCollision(checker, BlackArray[i])) {
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
			if (MacroCollision(checker, WhiteArray[i])) {
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
 
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function CreateBoard() {
    let table = document.createElement('table');
	table.setAttribute('id', 'table');
    let table_style = document.createElement('style');
    table_style.innerText = `
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
            if (i % 2 === 0) {
                if (k % 2 === 0) cell.style.backgroundColor = 'snow';
                else cell.style.backgroundColor = 'saddlebrown';
            }
            else {
                if (k % 2 === 0) cell.style.backgroundColor = 'saddlebrown';
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

function FillBoard() {
	for (let i = 0; i < BlackArray.length; i++) WhiteArray[i].draw();
	for (let i = 0; i < BlackArray.length; i++) BlackArray[i].draw();
}