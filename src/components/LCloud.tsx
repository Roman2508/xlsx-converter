import React from 'react'
import * as XLSX from 'xlsx'
import { Button, FormLabel, Input } from '@chakra-ui/react'

import { convertBirthdayFromLcloud } from '../utils/convertBirthdayFromLcloud'

// Cloud:
// Без шапки
// Бейтуллаєва Людмила Павлівна 1997-04-27	12
// Болобан Лілія Олегівна       2004-06-20	12
// Біділо Дар’я Олександрівна   2003-12-28	12

export const LCloud = () => {
  const fileRef = React.useRef<HTMLInputElement | null>(null)

  const [data, setData] = React.useState<unknown[]>([])
  const [newFileName, setNewFileName] = React.useState('File')
  const [uploadedFileName, setUploadedFileName] = React.useState('')
  const [domainValue, setDomainValue] = React.useState('@pharm.zt.ua')

  const convertDataForLcloud = (data: any[]) => {
    const newData = data.slice(1).map((el) => {
      const birthday = convertBirthdayFromLcloud(el[1])

      return {
        ['ПІБ']: el[0],
        ['Дата народження']: birthday,
        ['Група']: el[2],
      }
    })

    return newData
  }

  const onClickUpload = () => {
    if (!fileRef.current) return
    fileRef.current.click()
  }

  const handleChangeUpload = (e: any) => {
    e.preventDefault()

    const files = (e.target as HTMLInputElement).files

    if (!files?.length) return

    const f = files[0]
    const reader = new FileReader()
    reader.onload = function (e) {
      const data = e.target?.result
      let readedData = XLSX.read(data, { type: 'binary' })
      const wsname = readedData.SheetNames[0]
      const ws = readedData.Sheets[wsname]

      setUploadedFileName(f.name)
      setNewFileName(`${f.name.split('.')[0]}_lcloud.xlsx`)

      /* Convert array to json*/
      const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 })

      const withoutEmpty = dataParse.filter((el: any) => el.length)

      setData(withoutEmpty)
    }
    reader.readAsBinaryString(f)
    e.target.value = null
  }

  const handleExportFile = () => {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(convertDataForLcloud(data))

    let newObj: any = {}

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
    XLSX.writeFile(wb, newFileName)
  }

  const handleAnotherImport = () => {
    if (!fileRef.current) return
    fileRef.current.value = ''
    setData([])
    setUploadedFileName('data')
    setUploadedFileName('')
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <input ref={fileRef} type="file" onChange={handleChangeUpload} style={{ display: 'none' }} />
      {/* <div>
        <Button colorScheme="teal" size="lg" style={{ width: '100%' }} onClick={onClickUpload}>
          Import data
        </Button>
        {uploadedFileName && <span>{uploadedFileName}</span>}
      </div> */}

      <div className="buttons-wrapper">
        <div style={{ flex: 1, minWidth: 'calc(50% - 5px)' }}>
          <Button colorScheme="teal" size="lg" style={{ width: '100%' }} onClick={onClickUpload}>
            Import data
          </Button>
          {uploadedFileName && <p style={{ textAlign: 'center' }}>{uploadedFileName}</p>}
        </div>

        {!!data.length && (
          <Button
            colorScheme="teal"
            size="lg"
            style={{ flex: 1, minWidth: 'calc(50% - 5px)' }}
            onClick={handleAnotherImport}
          >
            Import another data
          </Button>
        )}
      </div>

      <br />

      <FormLabel>Domain</FormLabel>
      <Input placeholder="Domain" size="lg" value={domainValue} onChange={(e) => setDomainValue(e.target.value)} />

      <br />
      <br />

      <FormLabel>New file name</FormLabel>
      <Input
        size="lg"
        value={newFileName}
        placeholder="New file name"
        onChange={(e) => setNewFileName(e.target.value)}
      />

      <br />
      <br />

      <Button size="lg" colorScheme="teal" style={{ width: '100%' }} onClick={handleExportFile}>
        Export data
      </Button>

      <br />

      {/* <div style={{ position: "absolute", right: "30px", top: "30px" }}>
        <Alert status="error">
          <AlertIcon />
          Формат файла не відповідає шаблону!
        </Alert>

        <Alert status="success">
          <AlertIcon />
          Файл завантажено!
        </Alert>
      </div> */}
    </div>
  )
}
