export const convertBirthdayFromLcloud = (date: string) => {
  const b = String(date)

  return `${b[4]}${b[5]}${b[6]}${b[7]}-${b[2]}${b[3]}-${b[0]}${b[1]}`
}
