import React from 'react'
import * as XLSX from 'xlsx'
import { CSVLink } from 'react-csv'
import { Button, FormLabel, Input } from '@chakra-ui/react'

import { splitStudentsName } from '../utils/splitStudentsName'
import { createTransliteration } from '../utils/createTransliteration'

// Google:
// First Name [Required]  Last Name [Required]	Email Address [Required]	    Password [Required]	 Org Unit Path [Required]
// Бейтуллаєва	          Людмила	            beitulaeva.liudmyla@pharm.zt.ua 29101990	         /Студенти/Післядипломна/PHe-23-5
// Болобан	              Лілія	                boloban.liliia@pharm.zt.ua	    21041989	         /Студенти/Післядипломна/PHe-23-5

const csvButtonTitle = 'The exported file format will have the following pattern:'

export const GoogleWorkspace = () => {
  const fileRef = React.useRef<HTMLInputElement | null>(null)
  const csvUserLinkRef = React.useRef<any>()
  const csvGroupLinkRef = React.useRef<any>()

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
      if (el.length < 3) return ''

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

    return newData.filter((el) => !!el)
  }

  const convertDataForGroupsGoogleWorkspace = (data: any[]) => {
    const newData = data.map((el) => {
      if (el.length < 3) return ''

      const firstname = splitStudentsName(el[0]).firstname
      const lastname = splitStudentsName(el[0]).lastname
      const translit = createTransliteration([`${lastname} ${firstname}`])[0]
      const groupEmail = el[2] ? `${el[2].split('/').pop().toLowerCase()}${domainValue}` : el[2]
      const userEmail = `${translit}${domainValue}`

      // ld9-22-1@pharm.zt.ua,budnichenko.olha@pharm.zt.ua,USER,MEMBER
      return {
        ['Group Email [Required]']: groupEmail,
        ['Member Email']: userEmail,
        ['Member Type']: 'USER',
        ['Member Role']: 'MEMBER',
      }
    })

    return newData.filter((el) => !!el)
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

  const handleAnotherImport = () => {
    if (!fileRef.current) return
    fileRef.current.value = ''
    setData([])
    setUploadedFileName('data')
    setUploadedFileName('')
  }

  const onClickCSVUser = () => {
    /* @ts-ignore */
    csvUserLinkRef?.current?.link.click()
  }

  const onClickCSVGroup = () => {
    /* @ts-ignore */
    csvUserLinkRef?.current?.link.click()
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

      <CSVLink
        ref={csvUserLinkRef}
        data={data.length ? convertDataForGoogleWorkspace(data) : ''}
        filename={`${newFileName ? newFileName.split('.')[0] : 'data'}.csv`}
      />

      <CSVLink
        ref={csvGroupLinkRef}
        data={data.length ? convertDataForGroupsGoogleWorkspace(data) : ''}
        filename={`${newFileName ? newFileName.split('.')[0] : 'data'}.csv`}
      />

      <div className="buttons-wrapper" style={{ flexWrap: 'wrap' }}>
        <Button
          size="lg"
          variant="outline"
          colorScheme="teal"
          isDisabled={!data.length}
          style={{ flex: 1, minWidth: '100%' }}
          onClick={() => handleExportFile(data)}
        >
          Export XLSX
        </Button>

        <div className="buttons-wrapper" style={{ width: '100%' }}>
          <Button
            size="lg"
            variant="outline"
            colorScheme="teal"
            onClick={onClickCSVUser}
            isDisabled={!data.length}
            style={{ width: '100%' }}
            title={`${csvButtonTitle} First Name [Required], Last Name [Required], Email Address [Required], Password [Required], Org Unit Path [Required]`}
          >
            Export CSV (users)
          </Button>

          <Button
            size="lg"
            variant="outline"
            colorScheme="teal"
            onClick={onClickCSVGroup}
            isDisabled={!data.length}
            style={{ width: '100%' }}
            title={`${csvButtonTitle} Group Email [Required],Member Email,Member Type,Member Role`}
          >
            Export CSV (groups)
          </Button>
        </div>
      </div>

      <br />
    </div>
  )
}
