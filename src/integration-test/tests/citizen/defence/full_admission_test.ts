import I = CodeceptJS.I
import { createClaimData } from 'integration-test/data/test-data'
import { PartyType } from 'integration-test/data/party-type'
import { PaymentOption } from 'integration-test/data/payment-option'
import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import { DefenceSteps } from 'integration-test/tests/citizen/defence/steps/defence'
import { UserSteps } from 'integration-test/tests/citizen/home/steps/user'

const helperSteps: Helper = new Helper()
const defenceSteps: DefenceSteps = new DefenceSteps()
const userSteps: UserSteps = new UserSteps()

async function prepareClaim (I: I, loginAs) {
  const claimantEmail: string = userSteps.getClaimantEmail()

  const claimData: ClaimData = createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  const claimRef: string = await I.createClaim(claimData, claimantEmail)

  await helperSteps.enterPinNumber(claimRef, claimantEmail)
  await I.loggedInAs(await loginAs('defendant').then(() => 'Defendant'))
  helperSteps.startResponseFromDashboard(claimRef)

  return { data: claimData }
}

if (process.env.FEATURE_ADMISSIONS === 'true') {
  Feature('Fully admit all of the claim')

  Scenario('I can complete the journey when I fully admit all of the claim with immediate payment @nightly @admissions', { retries: 3 }, async (I: I, loginAs) => {
    const claimData = await prepareClaim(I, loginAs)
    defenceSteps.makeFullAdmission(claimData.data.defendants[0], PartyType.INDIVIDUAL, PaymentOption.IMMEDIATELY, claimData.data.claimants[0].name, false)
  })

  Scenario('I can complete the journey when I fully admit all of the claim with payment by set date @nightly @admissions', { retries: 3 }, async (I: I, loginAs) => {
    const claimData = await prepareClaim(I, loginAs)
    defenceSteps.makeFullAdmission(claimData.data.defendants[0], PartyType.INDIVIDUAL, PaymentOption.BY_SET_DATE, claimData.data.claimants[0].name, false)
  })

  Scenario('I can complete the journey when I fully admit all of the claim with full payment by instalments @citizen @admissions', { retries: 3 }, async (I: I, loginAs) => {
    const claimData = await prepareClaim(I, loginAs)
    defenceSteps.makeFullAdmission(claimData.data.defendants[0], PartyType.INDIVIDUAL, PaymentOption.INSTALMENTS, claimData.data.claimants[0].name, false)
  })
}
