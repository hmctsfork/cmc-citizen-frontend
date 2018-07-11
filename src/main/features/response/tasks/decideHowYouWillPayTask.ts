import { Validator } from 'class-validator'

import { ResponseDraft } from 'response/draft/responseDraft'
import { DefendantPaymentType } from 'response/form/models/defendantPaymentOption'

const validator = new Validator()

function isValid (input): boolean {
  return input !== undefined && validator.validateSync(input).length === 0
}

export class DecideHowYouWillPayTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {
    return isValid(responseDraft.fullAdmission.paymentOption)
      && this.paymentDetailsAreProvidedFor(responseDraft)
  }

  private static paymentDetailsAreProvidedFor (responseDraft: ResponseDraft): boolean {
    switch (responseDraft.fullAdmission.paymentOption.option) {
      case DefendantPaymentType.IMMEDIATELY:
      case DefendantPaymentType.INSTALMENTS:
        return true
      case DefendantPaymentType.BY_SET_DATE:
        return isValid(responseDraft.fullAdmission.paymentDate)
      default:
        throw new Error(`Unknown payment option: ${responseDraft.fullAdmission.paymentOption.option}`)
    }
  }
}