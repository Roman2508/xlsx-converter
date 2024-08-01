export const transliterateCyrillicToLatin = (input: string): string => {
  const cyrillicToLatinMap: { [key: string]: string } = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'h',
    д: 'd',
    е: 'e',
    ё: 'yo',
    ж: 'zh',
    з: 'z',
    и: 'y',
    й: 'yo',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'kh',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'sch',
    ы: 'y',
    э: 'e',
    ю: 'yu',
    я: 'ia',
    А: 'A',
    Б: 'B',
    В: 'V',
    Г: 'H',
    Д: 'D',
    Е: 'E',
    Ё: 'Yo',
    Ж: 'Zh',
    З: 'Z',
    И: 'Y',
    Й: 'YO',
    К: 'K',
    Л: 'L',
    М: 'M',
    Н: 'N',
    О: 'O',
    П: 'P',
    Р: 'R',
    С: 'S',
    Т: 'T',
    У: 'U',
    Ф: 'F',
    Х: 'Kh',
    Ц: 'Ts',
    Ч: 'Ch',
    Ш: 'Sh',
    Щ: 'Sch',
    Є: 'e',
    є: 'e',
    Ы: 'Y',
    Э: 'E',
    Ю: 'Yu',
    Я: 'ia',
    і: 'i',
    І: 'I',
    Ї: 'i',
    ї: 'i',
    ['ъ']: '',
    ['Ъ']: '',
    ['ь']: '',
    ['Ь']: '',
    [' ']: '.',
    ["'"]: '',
    ['"']: '',
    ['`']: '',
  }

  const transliterate = (string: string) => {
    let result = ''
    for (const char of string) {
      if (cyrillicToLatinMap.hasOwnProperty(char)) {
        result += cyrillicToLatinMap[char]
      } else {
        result += char
      }
    }
    return result.toLocaleLowerCase()
  }

  const namesArr = input.split(' ')

  if (namesArr.length !== 2) {
    alert("Ім'я або прізвище не вказано")
    return ''
  }

  const lastname = namesArr[0].toLocaleLowerCase()
  const firstname = namesArr[1].toLocaleLowerCase()

  // Якщо перша буква ім'я і прізвища === Я
  if (firstname[0] === 'я' && lastname[0] === 'я') {
    let firstnameWithoutFirstChar = firstname.substring(1)
    let lastnameWithoutFirstChar = lastname.substring(1)

    const translitFirstname = transliterate(firstnameWithoutFirstChar)
    const translitLastname = transliterate(lastnameWithoutFirstChar)

    return `ya${translitFirstname}.ya${translitLastname}`
  }

  // Якщо перша буква ім'я === Я
  if (firstname[0] === 'я') {
    let firstnameWithoutFirstChar = firstname.substring(1)
    let lastnameFirstLetter = lastname[0]
    let lastnameWithoutFirstChar = lastname.substring(1)

    const translitFirstname = transliterate(firstnameWithoutFirstChar)
    const translitLastNameFirstChar = transliterate(lastnameFirstLetter)
    const translitLastname = transliterate(lastnameWithoutFirstChar)

    return `ya${translitFirstname}.${translitLastNameFirstChar}${translitLastname}`
  }

  // Якщо перша буква прізвища === Я
  if (lastname[0] === 'я') {
    let firstnameFirstLetter = firstname[0]
    let firstnameWithoutFirstChar = firstname.substring(1)
    let lastnameWithoutFirstChar = lastname.substring(1)

    const translitFirstNameFirstChar = transliterate(firstnameFirstLetter)
    const translitFirstname = transliterate(firstnameWithoutFirstChar)
    const translitLastname = transliterate(lastnameWithoutFirstChar)

    return `ya${translitLastname}.${translitFirstNameFirstChar}${translitFirstname}`
  }

  return transliterate(input)
}

export const createTransliteration = (data: string[]): string[] => {
  const transliteration = data.map((el) => transliterateCyrillicToLatin(el))
  return transliteration
}
