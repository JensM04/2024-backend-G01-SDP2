class SeedableNumberGenerator {
    #seed;
    #a;
    #c;
    #min;
    #max;

    constructor({
        seed = 1,
        a = 3,
        c = 3,
        min = 0,
        max = 7
    }) {
        if(a > (max + 1 - min) || c > (max + 1 - min)) throw new Error('a and c should be smaller than max + 1 - min');
        this.#seed = seed;
        this.#a = a;
        this.#c = c;
        this.#min = min;
        this.#max = max + 1;
    }

    #linearCongruentialMethod() {
        const randomNum = this.#min + ((this.#seed++ * this.#a) + this.#c) % (this.#max - this.#min);
        return randomNum;
    }

    random() {
        const x = Math.sin(this.#seed++) * 10000;
        return x - Math.floor(x);
    }

    nextInt() {
        return this.#linearCongruentialMethod();
    }

    randomInt(min = 0, max) {
        const randomNum = min + ((this.#seed++ * (max - 1)) + (max - 1)) % (max - min);
        return randomNum;
    }
}

module.exports = SeedableNumberGenerator;

if(require.main === module) {
    const ng = new SeedableNumberGenerator({
        a: 3,
        c: 3,
        min: 3,
        max: 10,
        seed: 3,
    });
    // test of alle random waardes tussen 0 en 1 liggen

    const randomArray = Array.from({length: 1000}, () => ng.random());
    console.log(randomArray);
    if(randomArray.filter(el => el < 0 || el > 1 || isNaN(el)).length > 0)
        console.log('FOUT -> een ongeldige waarde werd gegenereerd');
    else {
        console.log('random() genereert geldige waardes');
    }

    const randomIntArray = Array.from({length: 1000}, () => ng.nextInt());
    console.log(randomIntArray);
    if(randomIntArray.filter((el) => el < 3 || el > 10 || isNaN(el)).length > 0)
        console.log('FOUT -> een ongeldige waarde werd gegenereerd');
    else {
        console.log('randomInt() genereert geldige waardes');
    }
} 