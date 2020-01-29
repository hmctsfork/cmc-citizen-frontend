import { MomentFactory } from 'shared/momentFactory'
import { Moment } from 'moment'

export class Document {
  id: string
  documentManagementUrl: string
  documentManagementBinaryUrl: string
  documentName: string
  documentType: string
  createdDatetime: Moment
  createdBy: string
  size: string

  deserialize (input: any): Document {
    if (input) {
      this.id = input.id
      this.documentManagementUrl = input.documentManagementUrl
      this.documentManagementBinaryUrl = input.documentManagementBinaryUrl
      this.documentName = input.documentName
      this.documentType = input.documentType
      this.createdDatetime = MomentFactory.parse(input.createdDatetime)
      this.createdBy = input.createdBy
      this.size = input.size
    }

    return this
  }
}
