import React, { Component } from "react";
import axios from "axios"
import { reactLocalStorage } from "reactjs-localstorage";
import { Buffer } from 'buffer';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

class ManageFile extends Component {

  constructor(props) {
    super(props)
    this.state = { isFileLoaded: false }
  }

  componentDidMount() {
    console.log(this.props.location)
    let fileId = this.getFileIdFromUrl()
    let authToken = reactLocalStorage.get('authToken');
    const config = { headers: { Authorization: `Bearer ${authToken}` }, responseType: 'arraybuffer' };
    this.setState({
      fileId: fileId,
      config: config
    }, () => {
      this.getFile()
    })
  }
  getFile = () => {
    axios.get(`/file/${this.state.fileId}`, this.state.config).then((response) => {
      console.log(response)
      console.log(response.headers["content-type"])
      let base64ImageString = Buffer.from(response.data, 'binary').toString('base64')
      let srcValue = `data:${response.headers["content-type"]};base64,` + base64ImageString

      this.setState({ fileData: srcValue, isFileLoaded: true, fileName: response.headers["content-disposition"], contentType: response.headers["content-type"] });


    }).catch((err) => {
      console.log(err)
      // alert(err.status + err.response)
    });
  }

  getFileIdFromUrl = () => {
    return this.props.location["fileId"]
  }


  download = () => {
    let a = document.createElement("a");
    a.href = this.state.fileData;
    a.download = this.state.fileName;
    a.click();
  }


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

    if (this.state.isFileLoaded && this.state.contentType.includes("image")) {
      return (
        <div>
          <img style={{ display: "block", marginLeft: "auto", marginRight: "auto", width: "50%", maxWidth: "1000px", maxHeight: "500px" }}
            src={this.state.fileData} alt=""></img>
          <button onClick={() => { this.download() }}>Download</button>
        </div>
      );
    }
    else if (this.state.isFileLoaded) {
      return (
        <div>
          <p>Unable To display the file. File type: {this.state.contentType}</p>
          <button onClick={() => { this.download() }}>Download</button>
        </div>
      )
    }
    else {
      return (<div>Loading please wait.. </div>)
    }
  }
}
export default (props) => {
  const history = useNavigate()
  const location = useParams()

  return <ManageFile history={history} location={location} {...props} />
} 
