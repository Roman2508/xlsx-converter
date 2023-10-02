import React from "react"
import * as XLSX from "xlsx"
import "./App.css"
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Input,
  Alert,
  AlertIcon,
} from "@chakra-ui/react"
import { convertBirthdayFromLcloud } from "./utils/convertBirthdayFromLcloud"

interface IDataForLcloud {
  fullName: string
  birthday: string
  group: string
}

const App = () => {
  const fileRef = React.useRef<HTMLInputElement | null>(null)

  const [data, setData] = React.useState<unknown[]>([])
  const [uploadedFileName, setUploadedFileName] = React.useState("")
  const [domainValue, setDomainValue] = React.useState("@pharm.zt.ua")
  const [newFileName, setNewFileName] = React.useState("File")

  const convertDataForLcloud = (data: any[]) => {
    // data[0].splice(0, 1)

    const newData = data.slice(1).map((el) => {
      const birthday = convertBirthdayFromLcloud(el[1])

      return {
        ["ПІБ"]: el[0],
        ["Дата народження"]: birthday,
        ["Група"]: el[2],
      }
    })

    return newData
  }

  const onClickUpload = () => {
    if (!fileRef.current) return
    fileRef.current.click()
  }

  const handleChangeUpload = (e: Event) => {
    e.preventDefault()

    const files = (e.target as HTMLInputElement).files

    if (!files?.length) return

    const f = files[0]
    const reader = new FileReader()
    reader.onload = function (e) {
      const data = e.target.result
      let readedData = XLSX.read(data, { type: "binary" })
      const wsname = readedData.SheetNames[0]
      const ws = readedData.Sheets[wsname]

      setUploadedFileName(f.name)

      /* Convert array to json*/
      const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 })

      // dataParse.splice(0, 1)
      setData(dataParse)
      console.log(dataParse)
    }
    reader.readAsBinaryString(f)
  }

  const handleExportFile = () => {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(convertDataForLcloud(data))

    let newObj: any = {}

    // Зміщую всі рядки на 1 вверх, щоб прибрати шапку таблиці
    for (var k in ws) {
      if (k !== "!ref") {
        const rowNum =
          k.length === 2
            ? k[1]
            : k.length === 3
            ? `${k[1]}${k[2]}`
            : `${k[1]}${k[2]}${k[3]}`

        newObj[`${k[0]}${rowNum}`] = ws[`${k[0]}${Number(rowNum) + 1}`]
      } else {
        newObj["!ref"] = ws["!ref"]
      }
    }

    // Видаляю всі undefined з об`єкта
    for (var k in newObj) {
      if (!newObj[k]) {
        delete newObj[k]
      }
    }

    XLSX.utils.book_append_sheet(wb, newObj, "Лист 1")
    XLSX.writeFile(wb, "data.xlsx")
  }

  return (
    <div>
      <h1 style={{ marginBottom: "20px" }}>Download xlsx file</h1>

      <Tabs variant="soft-rounded" colorScheme="green">
        <TabList>
          <Tab>Google Workspace</Tab>
          <Tab>Moodle</Tab>
          <Tab>LCloud</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <p>one!</p>
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
          <TabPanel>
            <p>three!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <input
        ref={fileRef}
        type="file"
        onChange={handleChangeUpload}
        style={{ display: "none" }}
      />
      <div>
        <Button colorScheme="teal" size="lg" onClick={onClickUpload}>
          Upload
        </Button>
        {uploadedFileName && <span>{uploadedFileName}</span>}
      </div>

      <br />

      <Input
        placeholder="Домен"
        size="lg"
        value={domainValue}
        onChange={(e) => setDomainValue(e.target.value)}
      />

      <br />
      <br />

      <Input
        placeholder="Назва ногово файлу"
        size="lg"
        value={newFileName}
        onChange={(e) => setNewFileName(e.target.value)}
      />

      <br />
      <br />

      <Button
        colorScheme="teal"
        size="lg"
        onClick={handleExportFile}
        // isLoading
        // loadingText="Завантаження"
      >
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

export default App
