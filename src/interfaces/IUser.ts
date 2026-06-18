import type IAssociation from "./IAssociation"

export interface IUser {
  userName: string
  email: string
  name: string
  association: IAssociation
  guardNumber: string
  address: string
  isConfirmed: boolean
  token: string
  roles: string[]
}
