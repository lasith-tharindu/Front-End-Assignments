import { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import NotFound from "../../img/untitled-2-01_2x-.png";
import * as validator from "./validations";
import moment from "moment";
import axios from "axios";
class Users extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        id: 0,
        title: "Mr",
        firstName: "",
        lastName: "",
        gender: "",
        dob: "",
        contactNo: "",
        age: "",
        email: "",
        salary: "",
        department: "",
      },
      errors: {
        title: "",
        firstName: "",
        lastName: "",
        gender: "",
        dob: "",
        contactNo: "",
        age: "",
        email: "",
        salary: "",
        department: "",
      },
      deleteUser: {
        id: 0,
        Name: "",
      },
      errorMsg: "",
      isError: false,
      validMsg: "",
      isLoading: true,
      isValid: false,
      spinner: false,
      redirect: "",
      isbtnDisable: false,
      isEdit: false,
      userData: [],
      departmentData: [],
    };
  }
  componentDidMount() {
    this.getAllUser();
    this.getAllDepartment();
  }
  getAllDepartment() {
    try {
      axios
        .get("https://localhost:44349/api/v1/department/all")
        .then((respones) => {
          this.setState({
            ...this.state,

            departmentData: respones.data.data.map((item) => ({
              id: item.id,
              departmentCode: item.code,
              departmentName: item.name,
              dateCreated: moment(item.createDated).format("LL"),
            })),
          });
        });
    } catch (error) {}
  }
  getAllUser() {
    try {
      axios.get("https://localhost:44349/api/v1/user/all").then((respones) => {
        if (respones.data.success != false) {
          this.setState({
            ...this.state,
            isLoading: false,
            userData: respones.data.data.map((item) => ({
              id: item.id,
              title: item.title,
              firstName: item.firstName,
              lastName: item.lastName,
              gender: item.gender,
              dob: item.dob,
              contactNo: item.contact,
              age: item.age,
              email: item.email,
              salary: item.salary,
              department: item.departmentName,
              departmentId: item.departmentId,
            })),
          });
        } else {
          this.setState({
            ...this.state,
            isLoading: false,
            userData: [],
          });
        }
      });
    } catch (error) {}
  }

  handleChange = (e) => {
    const { id, value } = e.target;
    if (id == "dob") {
      var diff_ms = Date.now() - new Date(value).getTime();
      var age_dt = new Date(diff_ms);
      this.setState({
        ...this.state,
        data: {
          ...this.state.data,
          [id]: value,
          age: Math.abs(age_dt.getUTCFullYear() - 1970),
        },
      });
    } else {
      this.setState({
        ...this.state,
        data: { ...this.state.data, [id]: value },
      });
    }
  };

  handleDelete() {
    try {
      axios
        .delete(
          `https://localhost:44349/api/v1/user?userId=${this.state.deleteUser.id}`
        )
        .then((respones) => {
          if (respones.data.success == true) {
            this.showSuccess("User has been deleted successfully.");
          } else if (respones.data.success == false) {
            this.showError(respones.data.message);
          }
        });
    } catch (error) {}
  }

  showSuccess(message) {
    this.setState(
      {
        ...this.state,
        validMsg: message,
        isValid: true,
        spinner: false,
        deleteUser: {
          id: 0,
          Name: "",
        },
      },
      () => {
        window.setTimeout(() => {
          this.setState({
            validMsg: "",
            isValid: false,
            isbtnDisable: false,
          });

          window.location.reload();
        }, 1500);
      }
    );
  }

  handleClear() {
    setTimeout(() => {
      this.setState({
        isEdit: false,
        data: {
          id: 0,
          title: "Mr",
          firstName: "",
          lastName: "",
          gender: "",
          dob: "",
          contactNo: "",
          age: "",
          email: "",
          salary: "",
          department: "",
        },
      });
    }, 150);
  }

  showError(msg) {
    this.setState(
      {
        ...this.state,
        errorMsg: msg,
        isError: true,
        spinner: false,
      },
      () => {
        setTimeout(() => {
          this.setState({
            errorMsg: "",
            isError: false,
            isbtnDisable: false,
          });
        }, 3500);
      }
    );
  }

  validateInputAndSetState = (id, value) => {
    const errors = validator.validateInputs(id, value, this.state.errors);
    this.setState({ ...this.state, errors, [id]: value });
  };

  handleSubmit = () => {
    for (let [id, value] of Object.entries(this.state.data)) {
      this.validateInputAndSetState(id, value);
    }

    var isValid = validator.isErrorObjectEmpty(this.state.errors);
    if (isValid) {
      if (!this.state.isEdit) {
        try {
          const fromData = {
            id: 0,
            title: this.state.data.title,
            firstName: this.state.data.firstName,
            lastName: this.state.data.lastName,
            gender: this.state.data.gender,
            dob: this.state.data.dob,
            contact: this.state.data.contactNo,
            age: this.state.data.age,
            email: this.state.data.email,
            salary: this.state.data.salary,
            departmentId: this.state.data.department,
            departmentName: "",
          };
          axios
            .post("https://localhost:44349/api/v1/user/add", fromData)
            .then((respones) => {
              if (respones.data.success == true) {
                this.showSuccess("User has been added successfully.");
              } else {
                this.showError(respones.data.message);
              }
            });
        } catch (error) {}
      } else {
        try {
          const fromData = {
            id: this.state.data.id,
            title: this.state.data.title,
            firstName: this.state.data.firstName,
            lastName: this.state.data.lastName,
            gender: this.state.data.gender,
            dob: this.state.data.dob,
            contact: this.state.data.contactNo,
            age: this.state.data.age,
            email: this.state.data.email,
            salary: this.state.data.salary,
            departmentId: this.state.data.department,
            departmentName: "",
          };
          axios
            .put("https://localhost:44349/api/v1/user/edit", fromData)
            .then((respones) => {
              if (respones.data.success == true) {
                this.showSuccess("User has been updated successfully.");
              } else {
                this.showError(respones.data.message);
              }
            });
        } catch (error) {}
      }
    } else {
      for (let [id, value] of Object.entries(this.state.errors)) {
        if (value.length !== 0) {
          this.showError(value);
          return false;
        }
      }
    }
  };

  currencyFormat(num) {
    return "Rs." + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
  render() {
    return (
      <Fragment>
        <div className="row mx-0 mt-2 ms-2 users-card me-2">
          <div className="col-md-12 users-top-row">
            <div className="d-flex justify-content-between p-3">
              <h5 className="users-text-1"> User Details </h5>
              <button
                type="button"
                className="btn-users-add-btn"
                data-bs-toggle="offcanvas"
                data-bs-target="#user-backdrop"
                aria-controls="offcanvasRight"
              >
                {" "}
                Add User
              </button>
            </div>
          </div>
          <div className="row mx-0 mt-2 ms-2 my-grade-card me-2">
            {this.state.isLoading ? (
              <div className="col-md-12 d-flex justify-content-center mt-3 mb-3">
                <span className="loader"></span>
              </div>
            ) : null}

            <div className="col-md-12">
              {!this.state.isLoading ? (
                <div className="table-responsive">
                  <table className="table">
                    <thead className="grade-column">
                      <tr>
                        <th
                          scope="col"
                          className="grade-main-table-title-text-1"
                        >
                          Title
                        </th>
                        <th
                          scope="col"
                          className="grade-main-table-title-text-1"
                        >
                          First Name
                        </th>
                        <th
                          scope="col"
                          className="grade-main-table-title-text-1"
                        >
                          Last Name
                        </th>
                        <th
                          scope="col"
                          className="grade-main-table-title-text-1"
                        >
                          Gender
                        </th>
                        <th
                          scope="col"
                          className="grade-main-table-title-text-1"
                        >
                          Date of birth
                        </th>

                        <th
                          scope="col"
                          className="grade-main-table-title-text-1"
                        >
                          Age
                        </th>
                        <th
                          scope="col"
                          className="grade-main-table-title-text-1"
                        >
                          Contact No
                        </th>
                        <th
                          scope="col"
                          className="grade-main-table-title-text-1"
                        >
                          Email Address
                        </th>
                        <th
                          scope="col"
                          className="grade-main-table-title-text-1"
                        >
                          Salary
                        </th>
                        <th
                          scope="col"
                          className="grade-main-table-title-text-1"
                        >
                          Department
                        </th>

                        <th
                          scope="col"
                          className="grade-main-table-title-text-1"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="grade-row">
                      {this.state.userData.length > 0 &&
                        this.state.userData.map((item, index) => {
                          return (
                            <tr>
                              <td scope="row" className="grade-table-text-2">
                                {item.title}
                              </td>
                              <td scope="row" className="grade-table-text-2">
                                {item.firstName}
                              </td>
                              <td className="grade-table-text-2">
                                {" "}
                                {item.lastName}
                              </td>
                              <td className="grade-table-text-2">
                                {" "}
                                {item.gender}
                              </td>
                              <td className="grade-table-text-2">
                                {" "}
                                {moment(item.dob).format("L")}
                              </td>
                              <td className="grade-table-text-2">
                                {" "}
                                {item.age}
                              </td>
                              <td className="grade-table-text-2">
                                {" "}
                                {item.contactNo}
                              </td>

                              <td className="grade-table-text-2">
                                {" "}
                                {item.email}
                              </td>
                              <td className="grade-table-text-2">
                                {" "}
                                {this.currencyFormat(item.salary)}
                              </td>
                              <td className="grade-table-text-2">
                                {" "}
                                {item.department}
                              </td>
                              <td className="grade-table-text-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="me-3 pointer-icon"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  data-bs-toggle="offcanvas"
                                  data-bs-target="#user-backdrop"
                                  onClick={() => {
                                    this.setState({
                                      ...this.state,
                                      isEdit: true,
                                      data: {
                                        id: item.id,
                                        title: item.title,
                                        firstName: item.firstName,
                                        lastName: item.lastName,
                                        gender: item.gender,
                                        dob: moment(item.dob).format(
                                          "YYYY-MM-DD"
                                        ),
                                        contactNo: item.contactNo,
                                        age: item.age,
                                        email: item.email,
                                        salary: item.salary,
                                        department: item.departmentId,
                                      },
                                    });
                                  }}
                                >
                                  <path
                                    d="M11 3.99998H6.8C5.11984 3.99998 4.27976 3.99998 3.63803 4.32696C3.07354 4.61458 2.6146 5.07353 2.32698 5.63801C2 6.27975 2 7.11983 2 8.79998V17.2C2 18.8801 2 19.7202 2.32698 20.362C2.6146 20.9264 3.07354 21.3854 3.63803 21.673C4.27976 22 5.11984 22 6.8 22H15.2C16.8802 22 17.7202 22 18.362 21.673C18.9265 21.3854 19.3854 20.9264 19.673 20.362C20 19.7202 20 18.8801 20 17.2V13M7.99997 16H9.67452C10.1637 16 10.4083 16 10.6385 15.9447C10.8425 15.8957 11.0376 15.8149 11.2166 15.7053C11.4184 15.5816 11.5914 15.4086 11.9373 15.0627L21.5 5.49998C22.3284 4.67156 22.3284 3.32841 21.5 2.49998C20.6716 1.67156 19.3284 1.67155 18.5 2.49998L8.93723 12.0627C8.59133 12.4086 8.41838 12.5816 8.29469 12.7834C8.18504 12.9624 8.10423 13.1574 8.05523 13.3615C7.99997 13.5917 7.99997 13.8363 7.99997 14.3255V16Z"
                                    stroke="black"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="pointer-icon"
                                  width="24"
                                  height="24"
                                  data-bs-toggle="modal"
                                  data-bs-target="#deleteModal"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  onClick={() => {
                                    this.setState({
                                      ...this.state,
                                      deleteUser: {
                                        id: item.id,
                                        Name: item.firstName,
                                      },
                                    });
                                  }}
                                >
                                  <path
                                    d="M16 6V5.2C16 4.0799 16 3.51984 15.782 3.09202C15.5903 2.71569 15.2843 2.40973 14.908 2.21799C14.4802 2 13.9201 2 12.8 2H11.2C10.0799 2 9.51984 2 9.09202 2.21799C8.71569 2.40973 8.40973 2.71569 8.21799 3.09202C8 3.51984 8 4.0799 8 5.2V6M10 11.5V16.5M14 11.5V16.5M3 6H21M19 6V17.2C19 18.8802 19 19.7202 18.673 20.362C18.3854 20.9265 17.9265 21.3854 17.362 21.673C16.7202 22 15.8802 22 14.2 22H9.8C8.11984 22 7.27976 22 6.63803 21.673C6.07354 21.3854 5.6146 20.9265 5.32698 20.362C5 19.7202 5 18.8802 5 17.2V6"
                                    stroke="black"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </svg>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
            {this.state.userData.length == 0 && !this.state.isLoading ? (
              <p className="d-flex justify-content-center flex-column align-items-center my-3 no-data-found-text">
                <img src={NotFound} alt="No Data Found" className="img-fluid" />
                There is no data found.
              </p>
            ) : null}
          </div>
        </div>
        <div
          className="offcanvas offcanvas-end"
          data-bs-backdrop="static"
          tabindex="-1"
          id="user-backdrop"
          aria-labelledby="user-backdropLabel"
        >
          <div className="offcanvas-header">
            <h5 className="create-new-course-text-1">
              {!this.state.isEdit ? "Add New User " : "Update User "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 28 28"
                fill="none"
              >
                <path
                  d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                  stroke="black"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </h5>
            <button
              type="button"
              className="btn-closes text-reset"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="offcanvas-body py-0">
            <div className="d-flex flex-column p-0">
              {!this.state.isEdit ? (
                <div className="mb-3">
                  <h6>Please fill out the below form.</h6>
                  <hr />
                </div>
              ) : null}
              <div className="mb-3 d-flex row">
                <div className="col-4">
                  <label className="form-label">
                    Title <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    id="title"
                    value={this.state.data.title}
                    onChange={this.handleChange}
                  >
                    <option value="Mr">Mr</option>
                    <option value="Ms">Ms</option>
                    <option value="Dr">Dr</option>
                    <option value="Rev">Rev</option>
                  </select>
                </div>
                <div className="col-4">
                  <label className="form-label">
                    First Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    value={this.state.data.firstName}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="col-4">
                  <label className="form-label">
                    Last Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    value={this.state.data.lastName}
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div className="mb-3 d-flex row">
                <div className="col-3">
                  <label className="form-label">
                    Gender <span className="text-danger">*</span>
                  </label>
                </div>
                <div className="col-9">
                  <select
                    className="form-select"
                    id="gender"
                    value={this.state.data.gender}
                    onChange={this.handleChange}
                  >
                    <option value="">Select an Option</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mb-3 d-flex row">
                <div className="col-3">
                  {" "}
                  <label className="form-label">
                    Date of Birth <span className="text-danger">*</span>
                  </label>
                </div>
                <div className="col-9">
                  <input
                    type="date"
                    className="form-control"
                    id="dob"
                    value={this.state.data.dob}
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div className="mb-3 d-flex row">
                <div className="col-3">
                  {" "}
                  <label className="form-label">
                    Contact No <span className="text-danger">*</span>
                  </label>
                </div>
                <div className="col-9">
                  <input
                    type="text"
                    className="form-control"
                    id="contactNo"
                    value={this.state.data.contactNo}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="mb-3 d-flex row">
                <div className="col-3">
                  <label className="form-label">Age</label>
                </div>
                <div className="col-9">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    id="age"
                    value={this.state.data.age}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="mb-3 d-flex row">
                <div className="col-3">
                  <label className="form-label">
                    Email <span className="text-danger">*</span>
                  </label>
                </div>
                <div className="col-9">
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    value={this.state.data.email}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="mb-3 d-flex row">
                <div className="col-3">
                  <label className="form-label">
                    Salary <span className="text-danger">*</span>
                  </label>
                </div>
                <div className="col-9">
                  <input
                    type="number"
                    className="form-control"
                    id="salary"
                    value={this.state.data.salary}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="mb-3 d-flex row">
                <div className="col-3">
                  <label className="form-label">
                    Department <span className="text-danger">*</span>
                  </label>
                </div>
                <div className="col-9">
                  <select
                    className="form-select"
                    id="department"
                    value={this.state.data.department}
                    onChange={this.handleChange}
                  >
                    <option value="">Select an Option</option>
                    {this.state.departmentData.length > 0 &&
                      this.state.departmentData.map((item, index) => {
                        return (
                          <option value={item.id}>{item.departmentName}</option>
                        );
                      })}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-12 d-flex justify-content-center my-1">
              {this.state.spinner ? (
                <div className="row">
                  <div className="col-12 d-flex justify-content-center">
                    <div className="spinner-border text-danger" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                </div>
              ) : null}
              {this.state.isError ? (
                <div
                  className="alert alert-danger w-100 text-center"
                  role="alert"
                >
                  {this.state.errorMsg}
                </div>
              ) : null}
              {this.state.isValid ? (
                <div
                  className="alert alert-success w-100 text-center"
                  role="alert"
                >
                  {this.state.validMsg}
                </div>
              ) : null}
            </div>
          </div>
          <div className="offcanvas-footer py-2 me-2">
            <div className="d-flex justify-content-between">
              <div></div>
              <div>
                <button
                  type="button"
                  className="btn btn-save  me-2"
                  onClick={(e) => this.handleSubmit()}
                  disabled={this.state.isbtnDisable}
                >
                  {!this.state.isEdit ? "Save" : "Update"}
                </button>
                <button
                  type="button"
                  className="btn btn-off-canvas-close"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                  onClick={() => {
                    this.handleClear();
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Deleted Modal --> */}
        <div
          className="modal fade"
          id="deleteModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="create-new-course-text-1">Are your sure?</h5>
                <button
                  type="button"
                  className="btn-closes text-reset"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="modal-body">
                <p>
                  Do you really want to delete these user? This process cannot
                  be undone.
                </p>
                <div className="col-12 d-flex justify-content-center my-1">
                  {this.state.spinner ? (
                    <div className="row">
                      <div className="col-12 d-flex justify-content-center">
                        <div
                          className="spinner-border text-danger"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  {this.state.isError ? (
                    <div
                      className="alert alert-danger w-100 text-center"
                      role="alert"
                    >
                      {this.state.errorMsg}
                    </div>
                  ) : null}
                  {this.state.isValid ? (
                    <div
                      className="alert alert-success w-100 text-center"
                      role="alert"
                    >
                      {this.state.validMsg}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="modal-footer">
                <div className="d-flex justify-content-between">
                  <div>
                    <button
                      type="button"
                      className="btn btn-danger  me-2"
                      onClick={(e) => this.handleDelete()}
                      disabled={this.state.isbtnDisable}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="btn btn-modal-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Users;
