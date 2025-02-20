import React from 'react'
import { Button } from '@chakra-ui/react'

/* 
:: -1 - Укажіть речовину, яка не реагує з етаном: ::Укажіть речовину, яка не реагує з етаном:{
=H2SO4
~Br2                          
~O2                           
~Cl2}
*/

const MoodleGIFT = () => {
  const fileRef = React.useRef<HTMLInputElement | null>(null)

  const onClickUpload = () => {
    if (!fileRef.current) return

    fileRef.current.click()
  }

  const convertToGIFT = (input: any) => {
    const lines = input.trim().split('\n')

    let lineStart = 0
    let questions: string[][] = []

    lines.forEach((el: string, index: number) => {
      // el === '' - для розриву в місцях де пустий рядок
      // index + 1 === lines.length для перевірки чи це останнє питання

      if (el === '\r' || index + 1 === lines.length) {
        const line = lines.slice(lineStart, index + 1)

        lineStart = index + 1
        questions.push(line)
      }
    })

    const giftText = questions.map((el) => {
      return `:: ${el[0].slice(0, 100)} ::${el[0]}{
=${el[1]}
${el
  .slice(2)
  .map((answer, index) => {
    if (!answer) return

    if (index + 3 < el.length) {
      return `~${answer}\n`
    } else {
      const isAnswerEmpty = !el[index].replace(/\r/g, '')

      if (!isAnswerEmpty) {
        return `~${answer}`
      }
      return `${answer}`
    }
  })
  .join('')}}
`
    })

    return giftText.join('\n') // Объединяем все вопросы в один текст
  }

  const downloadTextFile = (text: string) => {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'output'
    a.click()

    // Звільнити URL-адресу
    URL.revokeObjectURL(url)
  }

  const handleChangeUpload = async (e: any) => {
    e.preventDefault()
    const reader = new FileReader()

    reader.onload = async (e) => {
      if (!e.target) return

      const text = e.target.result

      const gift = convertToGIFT(text)

      downloadTextFile(gift)

      // @ts-ignore
      // fileRef?.current?.value = ''
    }
    reader.readAsText(e.target.files[0])
  }

  return (
    <div>
      <input ref={fileRef} type="file" onChange={handleChangeUpload} style={{ display: 'none' }} />

      <div style={{ flex: 1, minWidth: 'calc(50% - 5px)' }}>
        <Button colorScheme="teal" size="lg" style={{ width: '100%' }} onClick={onClickUpload}>
          Import data
        </Button>
      </div>
    </div>
  )
}

export default MoodleGIFT
