import { Claim } from 'claims/models/claim'
import { Logger } from '@hmcts/nodejs-logging'

const logger = Logger.getLogger('ClaimStatusFlow')

export class ClaimStatusFlow {

  static readonly flow: ClaimStatusNode = {
    description: 'Claim Exists',
    isValidFor: () => true,
    next: [
      {
        description: 'Claim Issued',
        isValidFor: (claim) => !claim.response,
        dashboard: 'claim_issued',
        next: []
      }
    ]
  }
  static decide (flow: ClaimStatusNode, claim: Claim): string {
    if (flow.isValidFor(claim)) {
      const nextPossibleConditions = (flow.next || []).filter(state => state.isValidFor(claim))
      if (nextPossibleConditions.length > 1) {
        throw new Error(`Two possible paths are valid for a claim, check the flow's logic`)
      }
      if (nextPossibleConditions.length === 0) {
        if (!flow.dashboard) {
          throw new Error(`Trying to render an intermediate state with no dashboard, check the flow's logic`)
        }
        return flow.dashboard
      }
      return this.decide(nextPossibleConditions[0], claim)
    }
  }

  // the try/catch should be removed once we don't need backward compatibility with 'old' dashboards - it's here to make sure we render the
  // old status in case there are problems with the new one (which should be addressed)
  public static dashboardFor (claim: Claim): string {
    try {
      return this.decide(ClaimStatusFlow.flow, claim)
    } catch (err) {
      logger.error(err)
      return ''
    }
  }
}

export interface ClaimStatusNode {
  description: string
  dashboard?: string
  isValidFor: (claim) => boolean
  next: ClaimStatusNode[]
}
