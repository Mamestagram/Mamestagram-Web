const regex = /(?=.*[a-zA-Z])(?=.*[0-9])/;
let string = "ss7s";
console.log(`string: '${string}'`)
console.log(`regex: ${regex}`)
console.log(regex.test(string), "match:", regex.exec(string) !== null ? `'${regex.exec(string)}'` : regex.exec(string));
console.log(`replaced: '${string.replace(regex, "!")}'`)