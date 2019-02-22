import * as express from 'express'

import { Paths } from 'mediation/paths'
import { Paths as ResponsePaths } from 'response/paths'
import { Paths as ClaimantResponsePaths } from 'claimant-response/paths'
import { ErrorHandling } from 'main/common/errorHandling'
import { Claim } from 'claims/models/claim'
import { Draft } from '@hmcts/draft-store-client'
import { MediationDraft } from 'mediation/draft/mediationDraft'
import { FreeMediation, FreeMediationOption } from 'main/app/forms/models/freeMediation'
import { DraftService } from 'services/draftService'

function renderView (res: express.Response): void {
  const user: User = res.locals.user
  const claim: Claim = res.locals.claim

  res.render(Paths.mediationAgreementPage.associatedView, {
    otherParty: claim.otherPartyName(user)
  })

}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.mediationAgreementPage.uri, (req: express.Request, res: express.Response) => {
    renderView(res)
  })
  .post(
    Paths.mediationAgreementPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const claim: Claim = res.locals.claim
      const draft: Draft<MediationDraft> = res.locals.mediationDraft
      const user: User = res.locals.user

      if (req.body.accept) {
        draft.document.youCanOnlyUseMediation = new FreeMediation(FreeMediationOption.YES)

        await new DraftService().save(draft, user.bearerToken)
        res.redirect(Paths.canWeUsePage.evaluateUri({ externalId: claim.externalId }))
      } else {
        draft.document.youCanOnlyUseMediation = new FreeMediation(FreeMediationOption.NO)

        await new DraftService().save(draft, user.bearerToken)

        if (!claim.isResponseSubmitted()) {
          res.redirect(ResponsePaths.taskListPage.evaluateUri({ externalId: claim.externalId }))
        } else {
          res.redirect(ClaimantResponsePaths.taskListPage.evaluateUri({ externalId: claim.externalId }))
        }
      }
    }))