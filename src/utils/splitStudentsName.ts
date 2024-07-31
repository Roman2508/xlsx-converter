export const splitStudentsName = (name: string): { firstname: string; lastname: string } => {
  if (!name) return { firstname: '', lastname: '' }

  const fullname = name.split(/\s+/)

  return {
    firstname: fullname[1],
    lastname: fullname[0],
  }
}
