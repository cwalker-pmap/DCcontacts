import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import 'whatwg-fetch';

// Container for Contacts App
class ContactsAppContainer extends Component {

  // Constructor for initial state
  constructor(){
    // call super() to make use of 'this'
    super();
    // initial state is a empty contacts array
    this.state={
      contacts: []
    };
  }

  // Upon mount, fetch data from ./contacts.json located in public folder
  componentDidMount(){
    fetch('./contacts.json')
    .then((response) => response.json())
    .then((responseData) => {
      // response data populates contacts
      this.setState({contacts: responseData});
    })
    .catch((error) => {
      // log error if any
      console.log('Error fetching and parsing data', error);
    });
  }

  // Render the Contacts App
  render(){
    return (
      <div>
        {/*
          ContactsApp takes the state of the contacts array as a prop
        */}
        <ContactsApp contacts={this.state.contacts} />
      </div>
    );
  }
}

// Renders a SearchBar and a ContactList
// Passes down filterText state and handleUserInput callback as props
class ContactsApp extends Component {

  // Construct the initial state.
  constructor(){
    super();
    // Initial state is a empty filter.
    this.state={
      filterText: ''
    };
  }

  // Sets the filter text state to what the user is searching for.
  handleUserInput(searchTerm){
    this.setState({
      filterText: searchTerm
    })
  }
  
  // Render the SearchBar and ContactsList
  render(){
    // ContactsList component forwards the contacts properties, and 
    //   takes the state of the filterText as props.
    return(
      <div>
        {/* 
          SearchBar recieves the state of the filterText,
          and binds the handleUserInput function to onUserInput function. 
        */}
        <SearchBar filterText={this.state.filterText}
          onUserInput={this.handleUserInput.bind(this)} />
        {/*
          ContactsList recieves the contacts array as props,
          and the state of the filterText
        */}
        <ContactList contacts={this.props.contacts}
                     filterText={this.state.filterText}/>
      </div>
    )
  }
}
// Validate the type of props the contacts should be.
// In this case, it should be an array of objects.
ContactsApp.propTypes = {
  contacts: PropTypes.arrayOf(PropTypes.object)
}

// SearchBar is a pure component that takes 2 props from parent,
// filterText (string) and onUserInput (callback function)
class SearchBar extends Component {
  // Function that passes the value of the input to the onUserInput function parent component
  handleChange(event){
    this.props.onUserInput(event.target.value)
  }

  // Given the same contacts and filterText props, render the same input field.
  // Output will always be the same.
  render(){
    return <input type="search"
                  placeholder="search"
                  value={this.props.filterText}
                  onChange={this.handleChange.bind(this)} />
  }
}
SearchBar.propTypes = {
  onUserInput: PropTypes.func.isRequired,
  filterText: PropTypes.string.isRequired
}

// ContactList is a pure component that takes 2 props from parent,
// contacts (Array of Obj) and filterText (string)
// Responsible for filtering the contacts before rendering them.
class ContactList extends Component {
  render(){
    // filter the array of contacts based on the string in the filterText Prop
    let filteredContacts = this.props.contacts.filter(
      (contact) => contact.name.indexOf(this.props.filterText) !== -1
    );
    return(
      <ul>
        {/* 
          Map the results to ContactItems with the email as a unique key.
        */ }
        {filteredContacts.map(
          (contact) => <ContactItem key={contact.email}
                                    name={contact.name}
                                    email={contact.email} />
        )}
       </ul>
    )
  }
}
// Validate propTypes
ContactList.propTypes = {
  contacts: PropTypes.arrayOf(PropTypes.object),
  filterText: PropTypes.string.isRequired
}

// Renders a contact Item
class ContactItem extends Component {
  render() {
    return <li>{this.props.name} - {this.props.email}</li>
  }
}
ContactItem.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired
}

render(<ContactsAppContainer />, document.getElementById('root'));
