function TypedLine(line) {
    this.raw = line.replace(/[^0-9]/g, ''); //
    this.field = [];
    this.field.push(this.raw.slice(0, 10), 
                    this.raw.slice(10, 21), 
                    this.raw.slice(21, 32), 
                    this.raw[32], 
                    this.raw.slice(33, 47)
                );
    this.value = parseInt(this.field[4].slice(5, 14)) / 100;
    this.expirationDate = getExpirationDate(this.field[4].slice(0, 4));
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function getExpirationDate(expirationFactor) {
    let baseDate = new Date(2000, 6, 3); // 03/07/2000
    let today = new Date(Date.now());
    today.setHours(0,0,0,0);
    let nextBaseDate = baseDate.addDays(9000);
    while (nextBaseDate < today) {
        baseDate = nextBaseDate;
        nextBaseDate = nextBaseDate.addDays(9000);
    }
    let expirationDate = baseDate.addDays(parseInt(expirationFactor) - 1000);
    return expirationDate;
}

function modulo10(digits, isEven = true) {
    let sum = 0;
    console.log(digits);
    for (i = 0; i < digits.length - 1; i++){
        let check;
        // Os multiplicadores começam com o número 2(dois), sempre pela direita, alternando-se 1 e 2;
        check = isEven + 1;
        isEven = !isEven
        // Multiplicar cada algarismo que compõe o número pelo seu respectivo peso (multiplicador):
        check *= digits[i];
        // Caso o resultado da multiplicação seja maior que 9 (nove) deverão ser somados os algarismos do produto, até reduzi-lo a um único algarismo:
        if (check >= 10) {
            check = 1 + (check % 10);
        }
        sum += check;
    }
    // Subtrair o total apurado no item anterior, da dezena imediatamente superior ao total apurado:
    let verifyingDigit = (10 - (sum % 10)) % 10;
    if (verifyingDigit != digits[digits.length - 1]) {
        return false;
    }
    return true;
}

TypedLine.prototype.isValid = function() {
    let cont = 0;
    if (!modulo10(this.field[0])) return false;
    if (!modulo10(this.field[1], false)) return false;
    if (!modulo10(this.field[2], false)) return false;
    return true;
}

TypedLine.prototype.getBarcode = function() {
    let barcode = this.field[0].slice(0, 4);
    barcode += this.field[3];
    barcode += this.field[4];
    barcode += this.field[0].slice(4, 9);
    barcode += this.field[1].slice(0, 10);
    barcode += this.field[2].slice(0, 10);
    return barcode;
}

module.exports = TypedLine;