import { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import NotFound from "../../img/untitled-2-01_2x-.png";
import * as validator from "./validations";
import moment from "moment";
import axios from "axios";

class Department extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        id: 0,
        departmentCode: "",
        departmentName: "",
      },
      errors: {
        departmentCode: "",
        departmentName: "",
      },
      deleteDepartment: {
        id: 0,
        departmentName: "",
      },

      errorMsg: "",
      isError: false,
      validMsg: "",
      isValid: false,
      spinner: false,
      isLoading: true,
      redirect: "",
      isbtnDisable: false,
      isEdit: false,
      departmentData: [],
    };
  }
  componentDidMount() {
    this.getAllDepartment();
  }

  getAllDepartment() {
    try {
      axios
        .get("https://localhost:44349/api/v1/department/all")
        .then((respones) => {
          if (respones.data.success != false) {
            this.setState({
              ...this.state,
              isLoading: false,
              departmentData: respones.data.data.map((item) => ({
                id: item.id,
                departmentCode: item.code,
                departmentName: item.name,
                dateCreated: moment(item.createDated).format("LL"),
              })),
            });
          } else {
            this.setState({
              ...this.state,
              isLoading: false,
              departmentData: [],
            });
          }
        });
    } catch (error) {}
  }

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({ ...this.state, data: { ...this.state.data, [id]: value } });
  };

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
            code: this.state.data.departmentCode,
            name: this.state.data.departmentName,
          };
          axios
            .post("https://localhost:44349/api/v1/department/add", fromData)
            .then((respones) => {
              if (respones.data.success == true) {
                this.showSuccess("Department has been added successfully.");
              } else {
                this.showError(respones.data.message);
              }
            });
        } catch (error) {}
      } else {
        try {
          const fromData = {
            id: this.state.data.id,
            code: this.state.data.departmentCode,
            name: this.state.data.departmentName,
          };
          axios
            .put("https://localhost:44349/api/v1/department/edit", fromData)
            .then((respones) => {
              if (respones.data.success == true) {
                this.showSuccess("Department has been updated successfully.");
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

  handleDelete() {
    try {
      axios
        .delete(
          `https://localhost:44349/api/v1/department?Id=${this.state.deleteDepartment.id}`
        )
        .then((respones) => {
          if (respones.data.success == true) {
            this.showSuccess("Department has been deleted successfully.");
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
        deleteDepartment: {
          id: 0,
          departmentName: "",
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
          departmentCode: "",
          departmentName: "",
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

  render() {
    return (
      <Fragment>
        <div className="row mx-0 mt-2 ms-2 users-card me-2">
          <div className="col-md-12 users-top-row">
            <div className="d-flex justify-content-between p-3">
              <h5 className="users-text-1"> Department</h5>
              <button
                type="button"
                className="btn-users-add-btn"
                data-bs-toggle="modal"
                data-bs-target="#department-backdrop"
                aria-controls="offcanvasRight"
              >
                Add Department
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
                          Department Code
                        </th>
                        <th
                          scope="col"
                          className="grade-main-table-title-text-1"
                        >
                          Department Name
                        </th>
                        <th
                          scope="col"
                          className="grade-main-table-title-text-1"
                        >
                          Date Created
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
                      {this.state.departmentData.length > 0 &&
                        this.state.departmentData.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td scope="row" className="grade-table-text-2">
                                {item.departmentCode}
                              </td>
                              <td className="grade-table-text-2">
                                {" "}
                                {item.departmentName}
                              </td>
                              <td className="grade-table-text-2">
                                {item.dateCreated}
                              </td>

                              <td className="grade-table-text-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="me-3 pointer-icon"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  data-bs-toggle="modal"
                                  data-bs-target="#department-backdrop"
                                  onClick={() => {
                                    this.setState({
                                      ...this.state,
                                      isEdit: true,
                                      data: {
                                        id: item.id,
                                        departmentName: item.departmentName,
                                        departmentCode: item.departmentCode,
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
                                      deleteDepartment: {
                                        id: item.id,
                                        departmentName: item.departmentName,
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
            {this.state.departmentData.length == 0 && !this.state.isLoading ? (
              <p className="d-flex justify-content-center flex-column align-items-center my-3 no-data-found-text">
                <img src={NotFound} alt="No Data Found" className="img-fluid" />
                There is no data found.
              </p>
            ) : null}
          </div>
        </div>

        {/* <!--Add  Modal --> */}
        <div
          className="modal fade"
          id="department-backdrop"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="create-new-course-text-1">
                  {!this.state.isEdit
                    ? "Add New Department "
                    : "Update Department "}
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
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="modal-body">
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
                        Department Code <span className="text-danger">*</span>
                      </label>
                    </div>
                    <div className="col-8">
                      <input
                        type="text"
                        className="form-control"
                        id="departmentCode"
                        value={this.state.data.departmentCode}
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                  <div className="mb-3 d-flex row">
                    <div className="col-4">
                      <label className="form-label">
                        Department Name <span className="text-danger">*</span>
                      </label>
                    </div>
                    <div className="col-8">
                      <input
                        type="text"
                        className="form-control"
                        id="departmentName"
                        value={this.state.data.departmentName}
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                </div>
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
                      className="btn btn-save  me-2"
                      onClick={(e) => this.handleSubmit()}
                      disabled={this.state.isbtnDisable}
                    >
                      {!this.state.isEdit ? "Save" : "Update"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-modal-close"
                      data-bs-dismiss="modal"
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
                  Do you really want to delete these department? This process
                  cannot be undone.
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

export default Department;
