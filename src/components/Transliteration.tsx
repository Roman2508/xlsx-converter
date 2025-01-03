import React from 'react'
import * as XLSX from 'xlsx'
import { AbsoluteCenter, Box, Button, Divider, Input } from '@chakra-ui/react'
import { createTransliteration } from '../utils/createTransliteration'

export const Transliteration = () => {
  const fileRef = React.useRef<HTMLInputElement | null>(null)
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  const [name, setName] = React.useState('')
  const [isCopied, setIsCopied] = React.useState(false)
  const [transliteration, setTransliteration] = React.useState('')

  const onClickUpload = () => {
    if (!fileRef.current) return
    fileRef.current.click()
  }

  const handleChangeUpload = (e: any) => {
    e.preventDefault()

    let transliteration: string[] = []

    const files = (e.target as HTMLInputElement).files

    if (!files?.length) return

    const f = files[0]
    const reader = new FileReader()

    reader.onload = function (e) {
      const data = e.target?.result
      let readedData = XLSX.read(data, { type: 'binary' })
      const wsname = readedData.SheetNames[0]
      let ws = readedData.Sheets[wsname]

      /* Convert array to json*/
      const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 })

      /* create array of names */
      const studentsNames = dataParse.map((el: any) => el[0]).filter((el) => !!el)

      //   setData(newData)

      /* create transliteration */
      transliteration = createTransliteration(studentsNames)

      /* export transliteration names to xlsx file */
      if (transliteration.length) {
        const translitWordsObject = transliteration.map((el) => ({ name: el }))

        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.json_to_sheet(translitWordsObject)

        const newObj: any = {}

        // Зміщую всі рядки на 1 вверх, щоб прибрати шапку таблиці
        for (var k in ws) {
          if (k !== '!ref') {
            const rowNum = k.length === 2 ? k[1] : k.length === 3 ? `${k[1]}${k[2]}` : `${k[1]}${k[2]}${k[3]}`

            newObj[`${k[0]}${rowNum}`] = ws[`${k[0]}${Number(rowNum) + 1}`]
          } else {
            newObj['!ref'] = ws['!ref']
          }
        }

        // Видаляю всі undefined з об`єкта
        for (var k in newObj) {
          if (!newObj[k]) {
            delete newObj[k]
          }
        }

        XLSX.utils.book_append_sheet(wb, newObj, 'Лист 1')

        const filename = `${f.name.split('.')[0]}_translit.xlsx`
        XLSX.writeFile(wb, filename)
      }
    }

    reader.readAsBinaryString(f)
    e.target.value = null
  }

  const createUserTransliteration = () => {
    if (!name) return

    // Якщо не внесено прізвище та ім'я
    // if (name.split(' ').length !== 2) return
    setIsCopied(false)
    const value = createTransliteration([name])
    setTransliteration(value[0])
  }

  const copyToClipboard = (e: any) => {
    if (!inputRef || !inputRef.current) return
    inputRef.current.select()
    document.execCommand('copy')

    e.target.focus()
    setIsCopied(true)
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '10px' }}>
        <Input value={name} variant="filled" placeholder="Name" onChange={(e) => setName(e.target.value)} />
        <Button colorScheme="teal" size="md" onClick={createUserTransliteration} variant="outline">
          Create
        </Button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Input readOnly ref={inputRef} variant="filled" value={transliteration} placeholder="Transliteration" />
        <Button colorScheme="teal" size="md" variant="outline" onClick={copyToClipboard} sx={{ width: '80px' }}>
          {!isCopied ? (
            'Copy'
          ) : (
            <svg
              stroke="currentColor"
              fill="none"
              stroke-width="2"
              viewBox="0 0 24 24"
              stroke-linecap="round"
              stroke-linejoin="round"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path stroke="none" d="M0 0h24v24H0z"></path>
              <path d="M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z"></path>
              <path d="M4.012 16.737a2 2 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1"></path>
              <path d="M11 14h6"></path>
              <path d="M14 11v6"></path>
            </svg>
          )}
        </Button>
      </div>

      <Box position="relative" padding="10">
        <Divider />
        <AbsoluteCenter bg="white" px="4">
          або
        </AbsoluteCenter>
      </Box>

      <input ref={fileRef} type="file" onChange={handleChangeUpload} style={{ display: 'none' }} />
      <div>
        <Button colorScheme="teal" size="lg" onClick={onClickUpload}>
          Upload
        </Button>
      </div>
    </div>
  )
}
