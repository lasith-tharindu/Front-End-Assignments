const checkMinLength = (value, length) => value.length === length;

export const isErrorObjectEmpty = (errors) => {
  let valid = true;
  Object.values(errors).forEach((val) => {
    if (val.length > 0) {
      valid = false;
    }
  });
  return valid;
};

export const validateInputs = (id, value, _errors) => {
  let errors = _errors;

  if (id === "departmentCode") {
    if (checkMinLength(value, 0)) {
      errors[id] = "Department code cannot be empty!";
    } else {
      errors[id] = "";
    }
  }
  if (id === "departmentName") {
    if (checkMinLength(value, 0)) {
      errors[id] = "Department name cannot be empty!";
    } else {
      errors[id] = "";
    }
  }
  return errors;
};
