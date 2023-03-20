function GetResult() {
    const input_main = document.querySelector('.maintext');
    const input_sub = document.querySelector('.subtext');
    
    var main = input_main.value;
    var sub = input_sub.value;
    var output_text = "";
    
    var first = true;
    for (let i = 0; i < main.length; i++) {
        if (main[i] == sub[0]) {
            let k = 0, index = i;
            for (let j = 0; j < sub.length; j++)    {
                if (main[i+k] == sub[j]) {
                    k++;
                }
                else break;
            }
            if (k == sub.length) {
                if (first) {
                    output_text += index + 1;
                    first = false;
                }
                else output_text += ", " + (index + 1);
            }
        }
    }
    
    p = document.getElementById('output');
    p.innerHTML = "Начала подстрок находятся под следующими номерами: " + output_text;
}

    
    