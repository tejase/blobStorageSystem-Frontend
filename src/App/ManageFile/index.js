import React, { Component } from "react";
import axios from "axios";
import { reactLocalStorage } from "reactjs-localstorage";
import { Buffer } from "buffer";
import { useLocation, useNavigate, useParams } from "react-router-dom";

class ManageFile extends Component {
  constructor(props) {
    super(props);
    this.state = { isFileLoaded: false };
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
      }
    );
  }

  getFile = () => {
    axios
      .get(`/file/${this.state.fileId}`, this.state.arrayBufferConfig)
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
      .get(`/file/${this.state.fileId}/details`, this.state.config)
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
      .get(`/file/${this.state.fileId}/role`, this.state.config)
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

  getFileIdFromUrl = () => {
    return this.props.location["fileId"];
  };

  download = () => {
    let a = document.createElement("a");
    a.href = this.state.fileData;
    a.download = this.state.fileName;
    a.click();
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
    return (
      <div>
        {this.state.isFileLoaded ? (
          <div>
            <h2>{this.state.fileDetails.filename}</h2>
            <div style={{ display: "flex" }}>
              <label>Role: </label> <span>{this.state.role}</span>
            </div>
          </div>
        ) : null}
        {this.state.isFileLoaded && this.state.contentType.includes("image") ? (
          <div>
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
          <button
            onClick={() => {
              this.download();
            }}
          >
            Download
          </button>
        ) : null}
      </div>
    );
  }
}
export default (props) => {
  const history = useNavigate();
  const location = useParams();

  return <ManageFile history={history} location={location} {...props} />;
};
