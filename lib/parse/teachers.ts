import { etjanst } from './etjanst'
import { Teacher } from '../types'

const abbreviate = (firstname?: string, lastname?: string): string => {
  return `${firstname?.substr(0,1)}${lastname?.substr(0,2)}`.toUpperCase()
}

export const teacher = ({
  id,
  sisId,
  firstname,
  lastname,
  emailaddress,
  telWork,
  active,
  status,
}: any): Teacher => ({
  id,
  sisId,
  firstname,
  lastname,
  email: emailaddress,
  phoneWork: telWork,
  active,
  status,
  timeTableAbbreviation: abbreviate(firstname, lastname)
})

export const teachers = (data: any): Teacher[] =>
  etjanst(data).map(teacher)
