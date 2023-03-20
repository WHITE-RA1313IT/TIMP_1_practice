/*global document, window, alert, console, require*/

function CreateBoard() {
    document.body.appendChild(document.createElement('table'));
    document.querySelector('table').setAttribute('cellpadding', '0');
    document.querySelector('table').appendChild(document.createElement('tbody'));
    
    let tbody = document.querySelector('tbody');

    let cell_color1 = "white", cell_color2 = "black";
    let cell_count = 1;
    for (let i = 1; i <= 8; i++) {
        var tr = document.createElement("tr");
        for (let j = 1; j <= 8; j++) {
            let td = document.createElement('td');
            tr.appendChild(td);
            let cell = document.createElement("button");
            cell.setAttribute('cell_id', i + '_' + j);
            
            if (cell_count % 2 == 0) {
                cell.setAttribute("class", cell_color2 + "-cell");
            }   
            else {
                cell.setAttribute("class", cell_color1 + "-cell");
            }
            
            if (cell.getAttribute("class") == "white-cell") cell.setAttribute("disabled", "false");
            else {
                if (cell_count >= 1 && cell_count <= 15) cell.setAttribute("class", "white-checker-non-active");
                if (cell_count >= 49 && cell_count <= 64) cell.setAttribute("class", "black-checker-non-active");
                cell.setAttribute("onclick", 'Play("' + i + '_' + j + '")');
            } 
            
            if (cell_count % 8 == 0) {
                let temp = cell_color2;
                cell_color2 = cell_color1;
                cell_color1 = temp;
            }
            
            cell_count++;
            td.appendChild(cell);
        }
        tbody.appendChild(tr);
    }
}

function Play(id) {
    "use strict";
    
    console.log(id);
    
    let i = id.charAt(0);
    let j = id.charAt(2);

    var p = document.querySelector('[cell_id="'+ id + '"]'), status = p.getAttribute("class");
    
    if (status.indexOf("non-active") !== -1) {
        p.setAttribute("class", status.replace("non-active", "active"));
        
        if (i-1 >= 1 && i-1 <= 8 && j-1 >= 1 && j-1 <= 8) {
            var left_cell = document.querySelector('[cell_id="'+ (i-1) + '_' + (j-1) + '"]');
            left_cell.setAttribute('style', 'cursor:pointer');
            left_cell.setAttribute('onclick', 'Move("' + id + '", "' + (i-1) + '_' + (j-1) + '", "' + (i-1) + '_' + (j-(-1)) + '")'); 
        }
        
        if (i-1 >= 1 && i-1 <= 8 && j-(-1) >= 1 && j-(-1) <= 8) {
            var right_cell = document.querySelector('[cell_id="'+ (i-1) + '_' + (j-(-1)) + '"]');
            right_cell.setAttribute('style', 'cursor:pointer');
            right_cell.setAttribute('onclick', 'Move("' + id + '", "' + (i-1) + '_' + (j-(-1)) + '", "' + (i-1) + '_' + (j-1) + '")'); 
        }        
    } 
    else {
        p.setAttribute("class", status.replace("active", "non-active"));
        
        var left_cell = document.querySelector('[cell_id="'+ (i-1) + '_' + (j-1) + '"]');
        if (left_cell.getAttribute('class') === 'black-checker-non-active') left_cell.setAttribute('onclick', 'Play("' + (i-1) + '_' + (j-1) + '")');
        else left_cell.removeAttribute('onclick');
        left_cell.removeAttribute('style');
        
        var right_cell = document.querySelector('[cell_id="'+ (i-1) + '_' + (j-(-1)) + '"]');
        if (right_cell.getAttribute('class') !== 'black-checker-non-active') right_cell.setAttribute('onclick', 'Play("' + (i-1) + '_' + (j-(-1)) + '")');
        else right_cell.removeAttribute('onclick');
        right_cell.removeAttribute('style');
    }
}

function Move(first_id, second_id, third_id) {
    console.log(first_id + ' ' + second_id);
    var a = document.querySelector('[cell_id="' + first_id + '"]');
    var b = document.querySelector('[cell_id="' + second_id + '"]');
    var c = document.querySelector('[cell_id="' + third_id + '"]');
    if (b.getAttribute('class') !== "black-cell" && b.getAttribute('class') !== 'white-checker-non-active') return;
    
    a.setAttribute('class', 'black-cell');
    a.removeAttribute('onclick');
    a.removeAttribute('style');
    
    if (b.getAttribute('class') !== 'white-checker-non-active') {
        b.setAttribute('class', 'black-checker-non-active');
        b.setAttribute('onclick', 'Play("'+ second_id + '")');    
    }
    else {
        if (second_id.charAt(2) > first_id.charAt(2)) {
            var b_next_id = (second_id.charAt(0)-1) + '_' + (second_id.charAt(2)-(-1));
            if (document.querySelector('[cell_id="' + b_next_id + '"]').getAttribute('class') !== 'black-cell') return;
            console.log(b_next_id);
            document.querySelector('[cell_id="' + b_next_id + '"]').setAttribute('class', 'black-checker-non-active');
            b.setAttribute('class', 'black-cell');
            b.removeAttribute('onclick');
            b.removeAttribute('style');
        }
        else {
            var b_next_id = (second_id.charAt(0)-1) + '_' + (second_id.charAt(2)-1);
            if (document.querySelector('[cell_id="' + b_next_id + '"]').getAttribute('class') !== 'black-cell') return;
            console.log(b_next_id);
            document.querySelector('[cell_id="' + b_next_id + '"]').setAttribute('class', 'black-checker-non-active');
            b.setAttribute('class', 'black-cell');
            b.removeAttribute('onclick');
            b.removeAttribute('style');
        }
    }

    if (c.getAttribute('class') !== 'black-checker-non-active') c.removeAttribute('onclick');
    else c.setAttribute('onclick', 'Play("' + third_id + '")');
    c.removeAttribute('style');
}
