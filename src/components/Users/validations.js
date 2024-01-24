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

  const validEmailRegex = RegExp(
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
  );

  if (id === "title") {
    if (checkMinLength(value, 0)) {
      errors[id] = "Title cannot be empty!";
    } else {
      errors[id] = "";
    }
  }
  if (id === "firstName") {
    if (checkMinLength(value, 0)) {
      errors[id] = "First name cannot be empty!";
    } else {
      errors[id] = "";
    }
  }
  if (id === "lastName") {
    if (checkMinLength(value, 0)) {
      errors[id] = "Last name cannot be empty!";
    } else {
      errors[id] = "";
    }
  }
  if (id === "gender") {
    if (checkMinLength(value, 0)) {
      errors[id] = "Gender cannot be empty!";
    } else {
      errors[id] = "";
    }
  }
  if (id === "dob") {
    if (checkMinLength(value, 0)) {
      errors[id] = "Date of birth cannot be empty!";
    } else {
      errors[id] = "";
    }
  }
  if (id === "contactNo") {
    if (checkMinLength(value, 0)) {
      errors[id] = "Contact number cannot be empty!";
    } else {
      errors[id] = "";
    }
  }

  if (id === "email") {
    if (checkMinLength(value, 0)) {
      errors[id] = "Email cannot be empty!";
    } else if (!validEmailRegex.test(value)) {
      errors[id] = "Invalid email address!";
    } else {
      errors[id] = "";
    }
  }
  if (id === "salary") {
    if (checkMinLength(value, 0)) {
      errors[id] = "Salary cannot be empty!";
    } else {
      errors[id] = "";
    }
  }
  if (id === "department") {
    if (checkMinLength(value, 0)) {
      errors[id] = "Department cannot be empty!";
    } else {
      errors[id] = "";
    }
  }
  return errors;
};
