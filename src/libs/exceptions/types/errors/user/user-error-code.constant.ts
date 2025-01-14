/**
 * 1000 ~ 1999
 */
export const USER_ERROR_CODE = {
  ALREADY_CREATED_USER: 'ALREADY_CREATED_USER',
  INVALID_EMAIL_VERIFY_TOKEN: 'INVALID_EMAIL_VERIFY_TOKEN',
  ALREADY_VERIFIED_EMAIL: 'ALREADY_VERIFIED_EMAIL',
  CANNOT_RESEND_VERIFICATION_EMAIL_AN_HOUR:
    'CANNOT_RESEND_VERIFICATION_EMAIL_AN_HOUR',
  ALREADY_USED_EMAIL_VERIFY_TOKEN: 'ALREADY_USED_EMAIL_VERIFY_TOKEN',
  CANNOT_RESEND_PASSWORD_CHANGE_VERIFICATION_EMAIL_AN_HOUR:
    'CANNOT_RESEND_PASSWORD_CHANGE_VERIFICATION_EMAIL_AN_HOUR',
  INVALID_PASSWORD_CHANGE_VERIFY_TOKEN: 'INVALID_PASSWORD_CHANGE_VERIFY_TOKEN',
  ALREADY_USED_PASSWORD_CHANGE_VERIFY_TOKEN:
    'ALREADY_USED_PASSWORD_CHANGE_VERIFY_TOKEN',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
} as const;
