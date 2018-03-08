export enum DefenceType {
  FULL_ADMISSION,
  PART_ADMISSION_BECAUSE_AMOUNT_IS_TOO_HIGH,
  PART_ADMISSION_BECAUSE_BELIEVED_AMOUNT_IS_PAID,
  FULL_REJECTION_BECAUSE_FULL_AMOUNT_IS_PAID,
  FULL_REJECTION_WITH_DISPUTE,
  FULL_REJECTION_WITH_COUNTER_CLAIM,
  FULL_REJECTION_BECAUSE_ALREADY_PAID_LESS_THAN_CLAIMED_AMOUNT,
  PART_ADMISSION
}