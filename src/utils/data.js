const parameters = [
  'userid',
  'user_name',
  'login_attempts',
  'email',
  'session_id',
  'activity_id',
  'login_time',
]

const conditions = ['=','!=','CONTAINS','DOES NOT CONTAIN','STARTS WITH'];

export const getMenuOptions = (stage)=> {
  if (stage === "field") return parameters;
  if (stage === "action") return conditions;
  return [];
};