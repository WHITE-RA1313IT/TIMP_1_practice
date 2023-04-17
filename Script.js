let player = false;

let origin_coordinates;

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
    checker.move(0, 0);
}

function MacroCollision(obj1, obj2){
  var XColl=false;
  var YColl=false;

  if ((obj1.x + obj1.width >= obj2.x) && (obj1.x <= obj2.x + obj2.width)) XColl = true;
  if ((obj1.y + obj1.height >= obj2.y) && (obj1.y <= obj2.y + obj2.height)) YColl = true;

  if (XColl&YColl){return true;}
  return false;
}

var BlackArray = new Array(8);
var WhiteArray = new Array(8);
var Checkers = new Array(16);

for (let i = 0; i < 8; i++) {
	BlackArray[i] = {
		moving: false,
		id: `black-${7-i}`,
		x: 30 + 60 * i,
		y: 30,
		width: 50,
		height: 50,
		draw: function() {    
			let checker;
            let block = document.getElementById('block');
            if (document.getElementById(`${this.id}`) === null) {
                console.log('1');
                checker = document.createElement('div');
                checker.style.marginLeft = this.x;
                checker.style.marginTop = this.y;
                checker.className = 'checker';
                checker.setAttribute('id', `${this.id}`);
                checker.setAttribute('onclick', `Shot(BlackArray[${i}])`);
                block.prepend(checker);
            }
            else {
                console.log('2');
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
		}
	}
    Checkers[i] = BlackArray[i];
	
	WhiteArray[i] = {
		moving: false,
        id: `white-${7-i}`,
		x: 30 + 60 * i,
		y: 60 * 8 - 30,
		width: 50,
		height: 50,
		draw: function() {    
			let checker;
            let block = document.getElementById('block');
            if (document.getElementById(`${this.id}`) === null) {
                console.log('1');
                checker = document.createElement('div');
                checker.style.marginLeft = this.x;
                checker.style.marginTop = this.y;
                checker.className = 'checker';
                checker.setAttribute('id', `${this.id}`);
                checker.setAttribute('onclick', `Shot(WhiteArray[${i}])`);
                block.prepend(checker);
            }
            else {
                console.log('2');
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
		}
	}
    Checkers[i+8] = WhiteArray[i];
}

function Conflict(checker) {
    for (let i = 0; i < 16; i++) {
        if (checker === Checkers[i]) continue;
        if (MacroCollision(checker, Checkers[i])) {
            checker.moving = false;
            Checkers[i].move(Checkers[i].x, -300);
            return true;
        }
    }
    return false;
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
                if (k % 2 === 0) cell.style.backgroundColor = 'whitesmoke';
                else cell.style.backgroundColor = 'saddlebrown';
            }
            else {
                if (k % 2 === 0) cell.style.backgroundColor = 'saddlebrown';
                else cell.style.backgroundColor = 'whitesmoke';
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
	for (let i = 0; i < BlackArray.length; i++) WhiteArray[i].draw(document.getElementById('block'));
	for (let i = 0; i < BlackArray.length; i++) BlackArray[i].draw(document.getElementById('block'));
}

