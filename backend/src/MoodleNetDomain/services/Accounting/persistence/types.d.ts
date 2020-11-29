import { Flow } from '../../../../lib/domain/types/path'
import { CreatedDocumentBase, Maybe, MutableDocumentBase } from '../../../../lib/helpers/types'
import { AccountRequest } from '../Accounting'

type AccountKey = string
export interface AccountingPersistence {
  isUserNameAvailable(_: { username: string }): Promise<boolean>
  newAccountRequestExpired(_: { flow: Flow }): Promise<Maybe<NewAccountRequestDocument>>
  addNewAccountRequest(_: { req: AccountRequest; flow: Flow }): Promise<void>
  confirmNewAccountRequest(_: {
    flow: Flow
  }): Promise<'Confirmed' | 'Request Not Found' | 'Already Confirmed'>
  activateNewAccount(_: {
    requestFlow: Flow
    username: string
  }): Promise<
    AccountDocument | 'Request Not Found' | 'Unconfirmed Request' | 'Username Not Available'
  >
  config(): Promise<Config>
}

// ^ AccountDocument
type AccountDocument = {
  username: string
  email: string
  active: boolean
  requestFlow: Flow
} & MutableDocumentBase
// $ AccountDocument

// ^ NewAccountRequestDocument
type NewAccountRequestDocumentStatus =
  | 'Waiting Email Confirmation'
  | 'Email Confirmed'
  | 'Confirm Expired'
type NewAccountRequestDocument = {
  email: string
  status: NewAccountRequestDocumentStatus
} & Flow &
  MutableDocumentBase
// $ NewAccountRequestDocument

// ^ Config
type Config = {
  sendEmailConfirmationAttempts: number
  sendEmailConfirmationDelay: number
  newAccountRequestEmail: {
    text: string
    subject: string
    from: string
  }
} & CreatedDocumentBase
// $ Config
