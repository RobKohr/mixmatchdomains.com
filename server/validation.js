var yup = require('yup');

const validations = {
  register: yup.object().shape({
    username: yup.string().required().min(34),
    password: yup.string().required().min(5),
  }),
}


function getErrorsFromValidationError(validationError) {
  const FIRST_ERROR = 0
  return validationError.inner.reduce((errors, error) => {
    return {
      ...errors,
      [error.path]: error.errors[FIRST_ERROR],
    }
  }, {})
}

validator = function(validatorName, data, callback){
  try{
    validations[validatorName].validateSync(data, { abortEarly: false })
    return callback(null);
  }catch(error){
    callback(getErrorsFromValidationError(error))
  }
}

module.exports = { validator };