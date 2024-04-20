export enum ResendRequestStatus {
  Idle = 'IDLE',
  Sending = 'SENDING',
  Sent = 'SENT',
  Failure = 'FAILURE',
}

export enum VerificationRequestStatus {
  Idle = 'IDLE',
  Verifying = 'VERIFYING',
  Verified = 'VERIFIED',
  Failure = 'FAILURE',
}

export enum VerificationScreenStatus {
  Pending = 'PENDING',
  Verifying = 'VERIFYING',
  Sending = 'SENDING',
  Failure = 'FAILURE',
  Irreparable = 'IRREPARABLE',
  Success = 'SUCCESS',
}
