import React from 'react'
import * as XLSX from 'xlsx'
import { Button, FormLabel, Input } from '@chakra-ui/react'
import { createTransliteration } from '../utils/createTransliteration'
import { splitStudentsName } from '../utils/splitStudentsName'

// Google:
// First Name [Required]  Last Name [Required]	Email Address [Required]	    Password [Required]	 Org Unit Path [Required]
// Бейтуллаєва	          Людмила	            beitulaeva.liudmyla@pharm.zt.ua 29101990	         /Студенти/Післядипломна/PHe-23-5
// Болобан	              Лілія	                boloban.liliia@pharm.zt.ua	    21041989	         /Студенти/Післядипломна/PHe-23-5

export const GoogleWorkspace = () => {
  const fileRef = React.useRef<HTMLInputElement | null>(null)

  const [data, setData] = React.useState<unknown[]>([])
  const [newFileName, setNewFileName] = React.useState('data')
  const [uploadedFileName, setUploadedFileName] = React.useState('')
  const [domainValue, setDomainValue] = React.useState('@pharm.zt.ua')

  const onClickUpload = () => {
    if (!fileRef.current) return
    fileRef.current.click()
  }

  const convertDataForGoogleWorkspace = (data: any[]) => {
    const newData = data.map((el) => {
      const firstname = splitStudentsName(el[0]).firstname
      const lastname = splitStudentsName(el[0]).lastname
      const translit = createTransliteration([`${lastname} ${firstname}`])[0]
      const email = `${translit}${domainValue}`
      const password = String(el[1])
      const orgUnit = el[2]

      return {
        ['First Name [Required]']: lastname,
        ['Last Name [Required]']: firstname,
        ['Email Address [Required]']: email,
        ['Password [Required]']: password,
        ['Org Unit Path [Required]']: orgUnit,
      }
    })

    return newData
  }

  const handleExportFile = (data: any) => {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(convertDataForGoogleWorkspace(data))

    let newObj: any = {}

    // Видаляю всі undefined з об`єкта
    for (var k in newObj) {
      if (!newObj[k]) {
        delete newObj[k]
      }
    }

    XLSX.utils.book_append_sheet(wb, ws, 'Лист 1')
    XLSX.writeFile(wb, newFileName)

    fileRef.current = null
    setUploadedFileName('')
    setNewFileName('data')
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
      setNewFileName(`${f.name.split('.')[0]}_google.xlsx`)

      /* Convert array to json*/
      const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 })

      const withoutEmpty = dataParse.filter((el: any) => el.length)

      setData(withoutEmpty)
    }
    reader.readAsBinaryString(f)
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <input ref={fileRef} type="file" onChange={handleChangeUpload} style={{ display: 'none' }} />
      <div>
        <Button colorScheme="teal" size="lg" onClick={onClickUpload} style={{ width: '100%' }}>
          Import data
        </Button>
        {uploadedFileName && <span>{uploadedFileName}</span>}
      </div>

      <br />

      <FormLabel>Домен</FormLabel>
      <Input placeholder="Домен" size="lg" value={domainValue} onChange={(e) => setDomainValue(e.target.value)} />

      <br />
      <br />

      <FormLabel>Назва ногово файлу</FormLabel>
      <Input
        size="lg"
        value={newFileName}
        placeholder="Назва ногово файлу"
        onChange={(e) => setNewFileName(e.target.value)}
      />

      <br />
      <br />

      <Button size="lg" colorScheme="teal" style={{ width: '100%' }} onClick={() => handleExportFile(data)}>
        Export data
      </Button>

      <br />
    </div>
  )
}
