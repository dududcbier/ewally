function TypedLine(line) {
    this.raw = line.replace(/[^0-9]/g, '');
    if (this.raw[0] != '8') {
        // No CIF starts with 8 and utility payment slips always do
        this.type = 'Bank';
        this.field = [];
        this.field.push(this.raw.slice(0, 10), 
                    this.raw.slice(10, 21), 
                    this.raw.slice(21, 32), 
                    this.raw[32], 
                    this.raw.slice(33, 47)
                );
        this.barcode = this.field[0].slice(0, 4) + 
                       this.field[3] + 
                       this.field[4] + 
                       this.field[0].slice(4, 9) + 
                       this.field[1].slice(0, 10) + 
                       this.field[2].slice(0, 10);
        this.value = parseInt(this.field[4].slice(5, 14)) / 100;
        this.expirationDate = getExpirationDate(this.field[4].slice(0, 4));
        this.isValid = function() {
            if (this.raw.length != 47) {
                return false;
            } 
            for (f = 0; f < 3; f++) {
                if (!modulo10(this.field[f])) return false;
            }
            return true;
        };
    } else {
        this.type = 'Utility Company';
        this.barcode = this.raw.slice(0, 11) +
                       this.raw.slice(12, 23) +
                       this.raw.slice(24, 35) +
                       this.raw.slice(36, 47);
        if (this.barcode[2] == 6 || this.barcode[2] == 8)
            this.value = parseInt(this.barcode.slice(4, 15)) / 100;
        else {
            this.value = NaN;
        }
        let year = parseInt(this.barcode.slice(19, 23));
        let month = parseInt(this.barcode.slice(23, 25));
        let day = parseInt(this.barcode.slice(25, 27));
        if (year < 1950 || month > 12 || day > 31) {
            this.expirationDate = null;
        } else {
            this.expirationDate = new Date(year, month - 1, day);
        }
        let modulo = function () { return false; };
        if (this.barcode[2] == 6 || this.barcode[2] == 7) {
            modulo = modulo10;
        } else if (this.barcode[2] == 8 || this.barcode[2] == 9) {
            modulo = modulo11;
        }
        this.isValid = function() {
            if (this.raw.length != 48) {
                return false;
            } 
            for (i = 0; i < 4; i++) {
                if (!modulo(this.raw.slice(i * 12, 12 * (i + 1))))
                    return false;
            }
            // Check barcode verifying digit too
            let barcodeCheck = this.barcode.slice(0, 3) +
                               this.barcode.slice(4, 44) + 
                               this.raw[3];
            if(!modulo(barcodeCheck)) return false;
            return true;
        }
    }
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

function modulo10(digits) {
    const seq = [2, 1];
    let sum = 0;
    for (i = 0; i < digits.length - 1; i++){
        let check = seq[i % 2] * digits[digits.length - 2 - i];
        if (check >= 10) {
            check = 1 + (check % 10);
        }
        sum += check;
    }
    let verifyingDigit = (10 - (sum % 10)) % 10;
    if (verifyingDigit != digits[digits.length - 1]) {
        return false;
    }
    return true;
}

function modulo11(digits) {
    const seq = [2, 3, 4, 5, 6, 7, 8, 9];
    let sum = 0;
    for (i = 0; i < digits.length - 1; i++) {
        sum += digits[digits.length - 2 - i] * seq[i % 8];
    }
    if (sum % 11 == digits[digits.length - 1]) {
        return false;
    }
    return true;
}

module.exports = TypedLine;