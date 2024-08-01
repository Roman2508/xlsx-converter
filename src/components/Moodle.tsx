import React from 'react'
import * as XLSX from 'xlsx'
import { CSVLink } from 'react-csv'
import { Button, FormLabel, Input } from '@chakra-ui/react'
import { splitStudentsName } from '../utils/splitStudentsName'

import { createTransliteration } from '../utils/createTransliteration'

// MOODLE:
// username	            email	                        password firstname lastname	   alternatename department	cohort1	profile_field_Role
// beitulaeva.liudmyla	beitulaeva.liudmyla@pharm.zt.ua	12345678 Людмила   Бейтуллаєва 104-22	     104-22	    g104	Студент

export const Moodle = () => {
  const fileRef = React.useRef<HTMLInputElement | null>(null)

  const [data, setData] = React.useState<unknown[]>([])
  const [newFileName, setNewFileName] = React.useState('data')
  const [uploadedFileName, setUploadedFileName] = React.useState('')
  const [domainValue, setDomainValue] = React.useState('@pharm.zt.ua')

  const onClickUpload = () => {
    if (!fileRef.current) return
    fileRef.current.click()
  }

  const convertDataForMoodle = (data: any[]) => {
    const newData = data.map((el) => {
      const firstname = splitStudentsName(el[0]).firstname
      const lastname = splitStudentsName(el[0]).lastname
      const translit = createTransliteration([`${lastname} ${firstname}`])[0]
      const email = `${translit}${domainValue}`
      const password = String(el[1])
      const alternatename = el[2]

      return {
        ['username']: translit,
        ['email']: email,
        ['password']: password,
        ['firstname']: firstname,
        ['lastname']: lastname,
        ['alternatename']: alternatename,
        ['department']: alternatename,
        ['cohort1']: alternatename,
        ['profile_field_Role']: 'Студент',
      }
    })

    return newData
  }

  const handleExportFile = (data: any) => {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(convertDataForMoodle(data))

    let newObj: any = {}

    // Видаляю всі undefined з об`єкта
    for (var k in newObj) {
      if (!newObj[k]) {
        delete newObj[k]
      }
    }

    XLSX.utils.book_append_sheet(wb, ws, 'Лист 1')
    XLSX.writeFile(wb, newFileName)
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
      setNewFileName(`${f.name.split('.')[0]}_moodle.xlsx`)

      /* Convert array to json*/
      const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 })

      const withoutEmpty = dataParse.filter((el: any) => el.length > 3)

      setData(withoutEmpty)
    }
    reader.readAsBinaryString(f)
  }

  const handleAnotherImport = () => {
    if (!fileRef.current) return
    fileRef.current.value = ''
    setData([])
    setUploadedFileName('data')
    setUploadedFileName('')
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <input ref={fileRef} type="file" onChange={handleChangeUpload} style={{ display: 'none' }} />

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

      <div className="buttons-wrapper">
        <Button
          size="lg"
          colorScheme="teal"
          variant="outline"
          isDisabled={!data.length}
          style={{ flex: 1, minWidth: 'calc(50% - 5px)' }}
          onClick={() => handleExportFile(data)}
        >
          Export XLSX
        </Button>

        <CSVLink
          data={convertDataForMoodle(data)}
          style={{ flex: 1, minWidth: 'calc(50% - 5px)' }}
          filename={`${newFileName ? newFileName.split('.')[0] : 'data'}.csv`}
        >
          <Button size="lg" variant="outline" colorScheme="teal" isDisabled={!data.length} style={{ width: '100%' }}>
            Export CSV
          </Button>
        </CSVLink>
      </div>

      <br />
    </div>
  )
}
