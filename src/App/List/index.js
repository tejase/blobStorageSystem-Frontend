import React, { Component } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';


const Card1 = (props) => {


  console.log(props.cardList)

  return (<div style={{ border: '1px solid #ccc' }}>


    <label onClick={props.onClick}>{props.cardList["filename"]}</label>


  </div>);
}
class ListFiles extends Component {

  constructor(props) {
    super(props)
    this.state = { cardData: [] }
  }

  componentDidMount() {
    console.log(this.props)
    let authToken = reactLocalStorage.get('authToken');
    const config = {
      headers: { Authorization: `Bearer ${authToken}` }
    };
    this.setState({
      config: config
    }, () => {
      this.getAllFiles()
    })
  }

  getAllFiles() {
    console.log(this.state.config)
    axios.get("https://murmuring-mountain-24156.herokuapp.com"+"/files", this.state.config).then((response) => {
      console.log(response)
      this.setState({
        cardData: response.data
      })
    }).catch((err) => {
      console.log(err.response)
      alert(err.status + err.response)
    });
  }

  handleChangeFile = (e) => {
    console.log("hello")
    const file = e.target.files[0];
    let formData = new FormData();
    formData.append('file', file);
    console.log(file)
    this.setState({
      "fileToUpload": formData
    })


  }

  uploadFile = (e) => {
    e.preventDefault()
    axios
      .post("https://murmuring-mountain-24156.herokuapp.com"+"/file/upload", this.state.fileToUpload, this.state.config)
      .then((res) => {
        alert("Uploaded File successfully!");
        this.getAllFiles()
      })
      .catch((err) => {
        alert(JSON.stringify(err.response))
        console.log(err.response)
      })
  }

  onClickCard = (card) => {
    console.log(card,"Selected")
    this.props.history(`/app/files/${card._id}`)
  }
  render() {
    let cardList = this.state.cardData.map(card => {
      return (
        <div onClick={()=>{this.onClickCard(card)}}>
          <Card1  cardList={card} key={card.key} />
        </div>
      );
    })
    return (
      <div>
        <h2>Files</h2>
        {this.state.uploadPopUpShow ? null :
          <div>
            <form onSubmit={this.uploadFile}>
              <input type="file" name="file" onChange={this.handleChangeFile} />
              <button type="submit">Upload</button>
            </form>
            {cardList}
          </div>
        }
      </div>);
  }
}
export default (props) => {
  const history = useNavigate()
  const location = useLocation()

  return <ListFiles history={history} location={location} {...props} />
} 
