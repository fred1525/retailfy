import React, { Component } from "react";
import API from "../utils/API";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import { Col, Row } from "../components/Grid";
import { Input, TextArea, FormBtn } from "../components/Form";
import Fileupload from "../components/Fileupload";
import "./style.css";
import Radium from "radium";


// redux
import { connect } from 'react-redux';
import { userAuth } from '../actions/authAction';

////////////media query//////////
var logostyle={
'@media (max-width:640px)':{
  position:"absolute",
  left:"4%",
  fontSize:"2rem"
}
}
var containerstyle={

    paddingLeft: "10%",
    paddingTop: "15%",
    paddingBottom: "10%",
    '@media (max-width:960px)':{
   
      paddingLeft:"5%",
      paddingTop:"20%",
      
    },

  '@media (max-width:640px)':{
   
    paddingLeft:"5%",
    paddingTop:"30%",
    
  }
 
  }
  var navstyle={
    width:"100%"
   }
  var navleftstyle={
    position:"absolute",
    width: "40%",
    top:0,
    right:"100px",
    height:"100%",
    
    '@media (max-width:1015px)': {
      position:"absolute",
    right:"50px"
    },
    '@media (max-width:640px)': {
      position:"absolute",
    width: "50%",
    height:"50%",
    right:"30px"
    }
    }
  var stylelogin = {
    right: "10%",
    width: "50%",
    position: "absolute",
    '@media (max-width:1015px)': {
      position:"absolute",
      right:"20%",
  
    },
    '@media (max-width:800px)': {
      position:"absolute",
      right:"10%",
  
    },
    '@media (max-width:640px)': {
      position:"absolute",
      right:"7%",
      width:"50%"
  
    }}
    var loginstyle = {
      '@media (max-width:640px)': {
    
         fontSize: "0.8rem",
    
      }
    }
   var styledropdown = {
    position: "absolute",
    right:"15%",
    top:"8%",
    '@media (max-width:1204px)': {
      position:"absolute",
      right:"10%",
      top:"8%",
  
    },
    '@media (max-width:920px)': {
      position:"absolute",
      right:"15%",
      top:"8%",
  
    },
    '@media (max-width:780px)': {
      position:"absolute",
      right:"10%",
  
    },
    '@media (max-width:640px)': {
      position:"absolute",
      right:"0",
      width:"20%"
  
    }
  }
///////////////////

class Adpost extends Component {
  state = {
    Title: "",
    Location: "",
    Description: "",
    Price: 0,
    Category: "",
    Contact: "",
    emptyfield: "",
    redirect: false,
    ////////////// image///////
    file: "",
    filename: "",
    filePath: "",
    uploadedFile: {}

  };

  //////////////uploading image///////////

  onChange = e => {
    // event.target has files property which is an array of files, in our case we uplaod just one image so we want files[0]
    this.setState({ file: e.target.files[0] });
console.log(e.target.files[0])
    // file[0] is an object and has propert of name which is the name of the file that has selected
    this.setState({ filename: e.target.files[0].name })
  }

  onSubmit = async e => {
    e.preventDefault();
    // formData is part of javascript- we store the image file in formData and we post it throgh API
    const formData = new FormData();
    formData.append('file', this.state.file);
    try {
      const res = await API.uploadImage(formData);
      console.log("result" + res)


      /////////uploadfile with fileupload////// the res coming back from the server includes file name and file path

      /////// this.setState({ uploadedFile: { fileName: res.data.fileName, filePath: res.data.filePath } })

      // this.setState({
      //   filePath: URL.createObjectURL(this.state.file)
      // })
     //////////////////////////////////////////////////////
      this.setState({
        filePath: res.data.filePath
      })
      this.setState({ uploadedFile: { fileName: this.state.filename, filePath: this.state.filePath } })

    }
    catch (err) {
      if (err.response.status === 500) {
        console.log('there was a problem with the server')
      } else {
        console.log(err.response.data.msg);
      }
    }

  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
  };

  setRedirect = () => {
    this.setState({
      redirect: true
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    if (this.props.authstate) {
      if (
        this.state.Title &&
        this.state.Location &&
        this.state.Description &&
        this.state.Price &&
        this.state.Contact
      ) {
        API.saveAd({
          title: this.state.Title,
          location: this.state.Location,
          description: this.state.Description,
          image: this.state.filePath,
          price: this.state.Price,
          category: this.state.Category,
          contactEmail: this.state.Contact
        })
          .then(res => {
            this.setState({ emptyfield: "Posted Successfully!" });
            // reset form
            this.setState({ Title: "", Location: "", Description: "", image: "", Category: "", Price: "", Contact: "", file: "", filename: "" })
          })
          .catch(err => this.setState({ emptyfield: err.response.data }));
      }
      else {
        this.setState({ emptyfield: "Please fill in all fields" })
      }
    }
    else {
      this.setState({ emptyfield: "Please sign in first" })
    }

  };

  handleLogOut = () => {

    API.logOut();
    this.props.userAuth(false)
  }


  render() {

    const isAuthenticated = this.props.authstate

    return (
      <div id="firstlookAd">
        {/* redirect to main page after submitting */}
        {this.renderRedirect()}
        <nav  style={navstyle}>
            {/* <Link  to="/"><img id="logo" src="./assets/images/logo.png"/></Link> */}

            <Link to="/"><p id="logo" style={logostyle}>RETAILFY</p></Link>

             <div style={navleftstyle}>
             {isAuthenticated ? (
              <div className="dropdown" style={styledropdown} >
                <button className="dropbtn">{this.props.user.userName.charAt(0)}</button>
                <div className="dropdown-content">
                  <Link to={`/myads/:${this.props.user.userId}`}><p>My Ads</p></Link>
                  <p onClick={this.handleLogOut} >Log Out</p>

                </div>
              </div>

            ) : (
              <div style={stylelogin}> <Link id="login" to="/register" ><p style={loginstyle}>Log In/ Sign Up</p></Link></div>

              )}

           

             </div>

          </nav>
        <div className="container" style={containerstyle}>

          <form>
            <Row>
              <Col size="md-5 sm-12">
                <Input
                  value={this.state.Title}
                  name="Title"
                  onChange={this.handleInputChange}
                  placeholder="Title"
                  style={{
                    fontFamily: "'Poppins', 'sans-serif'"
                  }}
                />
                <Input
                  value={this.state.Category}
                  name="Category"
                  onChange={this.handleInputChange}
                  placeholder="Category"
                  list="categories"
                  style={{
                    fontFamily: "'Poppins', 'sans-serif'"
                  }}
                />
                <datalist id="categories" style={{
                  fontFamily: "'Poppins', 'sans-serif'"
                }}>
                  <option value="Coats" />
                  <option value="Jackets" />
                  <option value="Blazers" />
                  <option value="Suits" />
                  <option value="Dresses" />
                  <option value="T-shirts" />
                  <option value="Pants" />
                  <option value="Jeans" />
                  <option value="Skirt/Shorts" />
                  <option value="Shoes" />
                  <option value="Bags" />
                  <option value="Accessories" />
                </datalist>

                {/* upload the image */}
                <Fileupload onSubmit={this.onSubmit} onChange={this.onChange} uploadedFile={this.state.uploadedFile}  />


                <Input
                  value={this.state.Location}
                  name="Location"
                  onChange={this.handleInputChange}
                  placeholder="Location"
                  style={{
                    fontFamily: "'Poppins', 'sans-serif'"
                  }}
                />
                <Input
                  value={this.state.Contact}
                  name="Contact"
                  onChange={this.handleInputChange}
                  placeholder="Contact"
                  style={{
                    fontFamily: "'Poppins', 'sans-serif'"
                  }}

                />
                <Input
                  value={this.state.Price}
                  name="Price"
                  onChange={this.handleInputChange}
                  placeholder="Price"
                  style={{
                    fontFamily: "'Poppins', 'sans-serif'"
                  }}
                />
              </Col>

              <Col size="md-5 sm-12">
                <Row>
                  <Col size="sm-12">
                    <TextArea
                      value={this.state.Description}
                      name="Description"
                      onChange={this.handleInputChange}
                      placeholder="Description"
                      style={{
                        fontFamily: "'Poppins', 'sans-serif'"
                      }}
                    ></TextArea>
                  </Col>
                </Row>
                <Row>
                  <Col size="sm-12">
                    {/* show all the errors in the following div */}
                    <div style={{ color: "white" }}>{this.state.emptyfield}</div>
                    <FormBtn
                      // disabled={!(this.state.Title && this.state.Location && this.state.Description && this.state.image && this.state.Price && this.state.Contact
                      //   )}
                      onClick={this.handleFormSubmit} >
                      Submit
                  </FormBtn>
                  </Col>
                </Row>
              </Col>
            </Row>
          </form>
        </div>
      </div>
    );
  }
}


// we need to get new state (auth) from the store- we use mapstateToProps to get state from the store and map it to properties of the component which in this case is main.js
const mapStateToProps = state => ({
  authstate: state.auth.authitem,      // the resean We used auth is that in rootReducer we use auth: authReducer/ what do we want from our authReducer is authuser state
  user: state.user.user

})                                  // so we map authstate to auth property- we access to this state from the store through this.props.auth

export default connect(mapStateToProps, { userAuth })(Radium(Adpost));
