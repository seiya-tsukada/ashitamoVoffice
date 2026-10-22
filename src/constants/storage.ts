// sessionStorage のキー（タブ単位で自分の識別情報を保持）
export const SESSION_STORAGE_KEYS = {
  USER_ID: 'virtual_office_user_id',
  USER_NAME: 'virtual_office_user_name',
  USER_ROLE: 'virtual_office_user_role',
  USER_JOB: 'virtual_office_user_job',
  USER_AVATAR_MODE: 'virtual_office_user_avatar_mode',
  USER_AVATAR: 'virtual_office_user_avatar',
} as const;
