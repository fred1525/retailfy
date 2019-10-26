import React, { Component } from "react";
import API from "../utils/API";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../components/Grid";
import { List, ListItem } from "../components/List";
import SearchForm from "../components/SearchForm";
import SearchResults from "../components/SearchResults";
import Nav from "../components/Nav";

class Books extends Component {
  state = {
    search: "",
    results: []
  };

  componentDidMount() {
    this.loadAds();
  }

  loadAds = () => {
    API.getAllAds()
      .then(res => this.setState({ results: res }))
      .catch(err => console.log(err));
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    if (this.state.search) {
      API.getAdsByCategory(this.state.search)
        .then(res => this.setState({ results: res }))
        .catch(err => console.log(err));
    }
  };

  render() {
    return (
      <>
        <Nav>
          <Link to="/">Retailfy</Link>
          <Link to="/register">Log In/ Sign Up</Link>
          <Link to="/adpost">Post Ad</Link>
        </Nav>
        <Container fluid>
          <Row>
            <Col size="sm-12">
              <SearchForm
                handleFormSubmit={this.handleFormSubmit}
                handleInputChange={this.handleInputChange}
                search={this.state.search}
              />
            </Col>
          </Row>

          <Row>
            {this.state.results.length ? (
              <SearchResults results={this.state.results} />
            ) : (
              <h3>No Results to Display</h3>
            )}
          </Row>
        </Container>
      </>
    );
  }
}

export default Main;