import React, { Component } from "react";
import axios from "axios";
import { reactLocalStorage } from "reactjs-localstorage";
import { Buffer } from "buffer";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import Select from "react-select";
import AsyncSelect from "react-select/async";

const styles = {
  container: {
    margin: "30px",
    paddingTop: "15px",
    borderTop: "1px solid #000",
  },
};

class ManageFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFileLoaded: false,
      newName: "",
      shareId: null,
      selectedRole: null,
    };
  }

  componentDidMount() {
    console.log(this.props.location);
    let fileId = this.getFileIdFromUrl();
    let authToken = reactLocalStorage.get("authToken");
    const arrayBufferConfig = {
      headers: { Authorization: `Bearer ${authToken}` },
      responseType: "arraybuffer",
    };
    const config = {
      headers: { Authorization: `Bearer ${authToken}` },
    };
    this.setState(
      {
        fileId: fileId,
        arrayBufferConfig: arrayBufferConfig,
        config: config,
      },
      () => {
        this.getFile();
        this.getFileDetails();
        this.getRoleOfFile();
        this.getAccessList();
      }
    );
  }

  getFile = () => {
    axios
      .get(
        `https://murmuring-mountain-24156.herokuapp.com/file/${this.state.fileId}`,
        this.state.arrayBufferConfig
      )
      .then((response) => {
        console.log(response);
        console.log(response.headers["content-type"]);
        let base64ImageString = Buffer.from(response.data, "binary").toString(
          "base64"
        );
        let srcValue =
          `data:${response.headers["content-type"]};base64,` +
          base64ImageString;

        this.setState({
          fileData: srcValue,
          isFileLoaded: true,
          fileName: response.headers["content-disposition"],
          contentType: response.headers["content-type"],
        });
      })
      .catch((err) => {
        console.log(err);
        // alert(err.status + err.response)
      });
  };

  getFileDetails = () => {
    axios
      .get(
        `https://murmuring-mountain-24156.herokuapp.com/file/${this.state.fileId}/details`,
        this.state.config
      )
      .then((response) => {
        console.log(response);
        this.setState({
          fileDetails: response.data,
        });
      })
      .catch((err) => {
        console.log(err);
        // alert(err.status + err.response)
      });
  };

  getRoleOfFile = () => {
    axios
      .get(
        `https://murmuring-mountain-24156.herokuapp.com/file/${this.state.fileId}/role`,
        this.state.config
      )
      .then((response) => {
        console.log(response);
        this.setState({
          role: response.data.role,
        });
      })
      .catch((err) => {
        console.log(err);
        // alert(err.status + err.response)
      });
  };

  getAccessList = () => {
    axios
      .get(
        `https://murmuring-mountain-24156.herokuapp.com/file/${this.state.fileId}/users`,
        this.state.config
      )
      .then((response) => {
        console.log(response);
        this.setState({
          accessList: response.data,
        });
      })
      .catch((err) => {
        console.log(err);
        alert(JSON.stringify(err.response));
      });
  };

  getFileIdFromUrl = () => {
    return this.props.location["fileId"];
  };

  download = () => {
    let a = document.createElement("a");
    a.href = this.state.fileData;
    a.download = this.state.fileName;
    a.click();
  };

  getFileRename = (e) => {
    let name = e.currentTarget.name;
    let val = e.currentTarget.value;
    this.setState({
      [name]: val,
    });
  };

  handleRename = () => {
    axios
      .put(
        `https://murmuring-mountain-24156.herokuapp.com/file/${this.state.fileId}/rename`,
        {
          newFileName: this.state.newName,
        },
        this.state.config
      )
      .then((response) => {
        this.setState({
          fileDetails: {
            ...this.state.fileDetails,
            filename: this.state.newName,
          },
        });
      })
      .catch((err) => {
        console.log(err);
        alert(JSON.stringify(err.response));
      });
  };

  handleDelete = () => {
    axios
      .delete(
        `https://murmuring-mountain-24156.herokuapp.com/file/${this.state.fileId}`,
        this.state.config
      )
      .then((response) => {
        this.props.history("/app");
      })
      .catch((err) => {
        console.log(err);
        // alert(err.status + err.response)
      });
  };

  loadOptions = (inputValue, callback) => {
    axios
      .get(
        `https://murmuring-mountain-24156.herokuapp.com/get-all-files?searchString=${inputValue}`,
        this.state.config
      )
      .then((response) => {
        callback(
          response.data.map((row) => ({
            label: row.email,
            value: row,
          }))
        );
      })
      .catch((err) => {
        console.log(err);
        callback([]);
      });
  };

  handleInputChange = (newValue) => {
    return newValue;
  };

  handleShareOptionSelect = (selectedOption) => {
    this.setState({
      shareId: selectedOption,
    });
  };

  handleShare = () => {
    if (this.state.selectedRole && this.state.shareId) {
      let body = {
        destinationEmail: this.state.shareId.label,
        fileID: this.state.fileId,
        role: this.state.selectedRole.value,
      };
      axios
        .post(
          "https://murmuring-mountain-24156.herokuapp.com" + "/file/share",
          body,
          this.state.config
        )
        .then((response) => {
          alert(response.data.msg);
        })
        .catch((err) => {
          console.log(err);
          alert(JSON.stringify(err.response));
        });
    }
  };

  handleRoleSelect = (value) => {
    this.setState({
      selectedRole: value,
    });
  };

  handleRoleUpdateSelect = (value) => {
    this.setState({
      selectedRoleToUpdate: value,
    });
  };

  handleUpdateRole = (email) => {
    let body = {
      destinationEmail: email,
      fileID: this.state.fileId,
      role: this.state.selectedRoleToUpdate.value,
    };
    axios
      .post(
        "https://murmuring-mountain-24156.herokuapp.com" + "/file/share",
        body,
        this.state.config
      )
      .then((response) => {
        alert(response.data.msg);
        this.getAccessList();
      })
      .catch((err) => {
        console.log(err);
        alert(JSON.stringify(err.response));
      });
  };

  handleRemoveAccess = (email) => {
    // console.log(body, this.state.config);
    axios
      .delete(
        `https://murmuring-mountain-24156.herokuapp.com/file/${this.state.fileId}/access`,
        {
          data: { email: email },
          headers: {
            Authorization: `Bearer ${reactLocalStorage.get("authToken")}`,
          },
        }
      )
      .then((response) => {
        alert(response.data.msg);
        this.getAccessList();
      })
      .catch((err) => {
        console.log(err);
        alert(JSON.stringify(err.response));
      });
  };

  render() {
    // return (<div>
    //   {this.state.isFileLoaded ?
    //     this.state.contentType.includes("image") ?
    //       <div>
    //         <img style={{ display: "block", marginLeft: "auto", marginRight: "auto", width: "50%", maxWidth: "1000px", maxHeight: "500px" }}
    //           src={this.state.fileData} alt=""></img>
    //         <button onClick={() => {this.download()}}>Download</button>
    //       </div>
    //       : <div>
    //         <p>Unable To display the file. File type: {this.state.contentType}</p>
    //         <button onClick={() => {this.download()}}>Download</button>
    //       </div>
    //     :
    //     <div>
    //       manage files
    //     </div>
    //   }
    // </div>);
    console.log(this.state);
    return (
      <div>
        {this.state.isFileLoaded ? (
          <div
            style={{
              display: "flex",
              alignContent: "center",
              justifyContent: "space-evenly",
            }}
          >
            <h2>
              <label>File name: </label>
              {this.state.fileDetails.filename}
            </h2>
            <h2>
              <label>Role: </label> {this.state.role}
            </h2>
          </div>
        ) : null}
        {this.state.isFileLoaded ? (
          <div style={{ display: "flex" }}>
            <div style={{ flex: "0 0 65%" }}>
              {this.state.contentType.includes("image") ? (
                <img
                  style={{
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                    width: "50%",
                    maxWidth: "1000px",
                    maxHeight: "500px",
                  }}
                  src={this.state.fileData}
                  alt=""
                ></img>
              ) : (
                <div
                  style={{
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                    width: "50%",
                    maxWidth: "1000px",
                    maxHeight: "500px",
                  }}
                >
                  <p>
                    Unable To display the file. File type:{" "}
                    {this.state.contentType}
                  </p>
                </div>
              )}
            </div>
            <div>
              <div style={{ flex: 1 }}>
                File Details
                <div>
                  <div>
                    <p>
                      {this.state.accessList.length} user(s) have access to this
                      file
                    </p>
                    <ol>
                      {this.state.accessList.map((user) => (
                        <li
                          style={{
                            border: "1px solid #ccc",
                            display: "flex",
                            padding: "20px",
                          }}
                        >
                          <span>
                            {user.email} - {user.role}
                            <div style={{ display: "flex" }}>
                              <Select
                                isClearable={true}
                                options={[
                                  { label: "Owner", value: "Owner" },
                                  { label: "Editor", value: "Editor" },
                                  { label: "Viewer", value: "Viewer" },
                                ]}
                                onChange={this.handleRoleUpdateSelect}
                                placeholder="Change role"
                              />
                              <button
                                onClick={() =>
                                  this.handleUpdateRole(user.email)
                                }
                              >
                                Update Role
                              </button>
                              <button
                                onClick={() =>
                                  this.handleRemoveAccess(user.email)
                                }
                              >
                                remove access
                              </button>
                            </div>
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : this.state.isFileLoaded ? (
          <div>
            <p>
              Unable To display the file. File type: {this.state.contentType}
            </p>
          </div>
        ) : (
          <div>Loading please wait.. </div>
        )}

        {this.state.isFileLoaded ? (
          <div style={styles.container}>
            <div style={{ width: "2000px" }}>
              <div
                style={{ float: "left", width: "500px", marginLeft: "79px" }}
              >
                <p>Download</p>
                <button
                  onClick={() => {
                    this.download();
                  }}
                >
                  Download
                </button>
              </div>
              <div style={{ float: "left", width: "590px" }}>
                <p>Rename</p>
                <input
                  name="newName"
                  type="text"
                  onChange={this.getFileRename}
                />
                <button onClick={this.handleRename}>rename</button>
              </div>
              <div style={{ float: "left", width: "160px" }}>
                <p>Delete</p>
                <button onClick={this.handleDelete}>delete</button>
              </div>
              <br style={{ clear: "left" }} />
            </div>
          </div>
        ) : null}

        {/* {this.state.isFileLoaded ? (
          <div style={styles.container}>
            <button
              onClick={() => {
                this.download();
              }}
            >
              Download
            </button>

            <p>Rename</p>
            <input name="newName" type="text" onChange={this.getFileRename} />
            <button onClick={this.handleRename}>rename</button>

            <p>Delete</p>
            <button onClick={this.handleDelete}>delete</button>
          </div>
        ) : null}

        <div style={styles.container}>
          <p>Rename</p>
          <input name="newName" type="text" onChange={this.getFileRename} />
          <button onClick={this.handleRename}>rename</button>
        </div>

        <div style={styles.container}>
          <p>Delete</p>
          <button onClick={this.handleDelete}>delete</button>
        </div> */}

        <div style={styles.container}>
          <p>Share</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(200px, 1fr))",
              gap: "30px",
              margin: "30px 0",
            }}
          >
            <AsyncSelect
              cacheOptions
              loadOptions={this.loadOptions}
              defaultOptions
              onInputChange={this.handleInputChange}
              onChange={this.handleShareOptionSelect}
              selectedOption={this.state.shareId}
              isClearable
              placeholder="Select an email id"
            />
            <Select
              isClearable={true}
              options={[
                { label: "Owner", value: "Owner" },
                { label: "Editor", value: "Editor" },
                { label: "Viewer", value: "Viewer" },
              ]}
              onChange={this.handleRoleSelect}
              placeholder="Select a role"
            />
          </div>
          <button onClick={this.handleShare}>share</button>
        </div>

        {this.state.isFileLoaded
          ? null
          : // <div style={styles.container}>
            //   File Details
            //   <div>
            //     <div>
            //       <p>
            //         {this.state.accessList.length} user(s) have access to this
            //         file
            //       </p>
            //       <ol>
            //         {this.state.accessList.map((user) => (
            //           <li
            //             style={{
            //               border: "1px solid #ccc",
            //               display: "flex",
            //               padding: "20px",
            //             }}
            //           >
            //             <span>
            //               {user.email} - {user.role}
            //               <div style={{ display: "flex" }}>
            //                 <Select
            //                   isClearable={true}
            //                   options={[
            //                     { label: "Owner", value: "Owner" },
            //                     { label: "Editor", value: "Editor" },
            //                     { label: "Viewer", value: "Viewer" },
            //                   ]}
            //                   onChange={this.handleRoleUpdateSelect}
            //                   placeholder="Change role"
            //                 />
            //                 <button
            //                   onClick={() => this.handleUpdateRole(user.email)}
            //                 >
            //                   Update Role
            //                 </button>
            //                 <button
            //                   onClick={() => this.handleRemoveAccess(user.email)}
            //                 >
            //                   remove access
            //                 </button>
            //               </div>
            //             </span>
            //           </li>
            //         ))}
            //       </ol>
            //     </div>
            //   </div>
            // </div>
            null}
      </div>
    );
  }
}
export default (props) => {
  const history = useNavigate();
  const location = useParams();

  return <ManageFile history={history} location={location} {...props} />;
};
