import React from 'react'
import * as XLSX from 'xlsx'
import { AbsoluteCenter, Box, Button, Divider, Input } from '@chakra-ui/react'
import { createTransliteration } from '../utils/createTransliteration'

export const Transliteration = () => {
  const fileRef = React.useRef<HTMLInputElement | null>(null)

  const [name, setName] = React.useState('')
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

  React.useEffect(() => {
    if (!name) return

    // Якщо не внесено прізвище та ім'я
    if (name.split(' ').length !== 2) return

    const value = createTransliteration([name])
    setTransliteration(value[0])
  }, [name])

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <Input
        value={name}
        variant="filled"
        placeholder="Name"
        style={{ marginBottom: '16px' }}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        readOnly
        variant="filled"
        value={transliteration}
        placeholder="Transliteration"
        style={{ marginBottom: '0px' }}
      />

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
