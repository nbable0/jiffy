import React, {Component} from "react"
import loader from "./images/loader.svg";
import clearButton from "./images/close-icon.svg"
import Gif from './Gif'


const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length)
  return arr[randIndex];
}


//pick props inside header component
//pass down functions as props well as things
//like numbers, strings, arrays or objects
const Header = ({clearSearch, hasResults}) => (
  <div className="header grid">
    {/*if we have results show clear, if not show title */}
    {hasResults ? (
    <button onClick={clearSearch}>
    <img src={clearButton} /> 
    </button>)
    : (<h1 className="title">Jiffy</h1>)}
  </div>
)

const UserHint = ({loading, hintText}) => (
  <div className="user-hint">
    {/*here we check for load or hint and add in with if/else */}
    {loading ? <img className="block mx-auto" src={loader} /> : hintText}
  </div>
)

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      searchTerm: "",
      hintText: "",
      gifs: []
    }
  }

  //want function to search giphy api using fetch and puts search term into query url
  searchGiphy = async searchTerm => {
    this.setState({
      //set loading to be true and get spinner
      loading: true,
    });
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=EJDXmSNZNNGUwO5aKpJVED6Y4N2uZ4ch&q=${searchTerm}&limit=25&offset=0&rating=PG&lang=en`
      );
      // here we convert raw response into json data
      const {data} = await response.json();

      //here we check if array of results is empty, if it is we throw an error to stop the code and handle in catch
      if (!data.length) {
        throw `Nothing found for ${searchTerm}`
      }


      //grab random result from images 
      const randomGif = randomChoice(data);

      console.log(randomGif)

      this.setState((prevState, props) => ({
        ...prevState,
        gifs:[...prevState.gifs, randomGif],
        //turn off loading spinner when loaded
        loading: false,
        hintText: `Hit enter to see more ${searchTerm}`
      }))

      //if fetch fails, go here
    } catch (error) {
      this.setState((prevState, props) => ({
        ...prevState,
        hintText: error,
        loading: false,
      }))
      console.log(error)
    }
  };

  handleChange = event => {
    const {value} = event.target
    //set searchTerm in state, use in input value, creates controlled input
    this.setState((prevState, props) => ({
      //take old props, spread them here,
      ...prevState,
      //then overwrite
      searchTerm: value,
      //return hint if text longer than 2s
      hintText: value.length > 2 ? `Hit enter to search ${value}` : ""
    }))
  }

  handleKeyPress = event => {
    const {value} = event.target
    //when we have 2 or more characters in search
    //and pressed enter, run search
    if (value.length > 2 && event.key === "Enter") {
      //here we call searchGiphy function using search term
      this.searchGiphy(value)
    }
  }

  //function to clear search - reset state by clearing everything out and making it default
  clearSearch = () => {
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: '',
      hintText: '',
      gifs:[]
    }));
    //grab input and focus
    this.textInput.focus();
  };


  render() {
    const {searchTerm, gifs} = this.state;
    //here we set a variable to see if we have gifs
    const hasResults = gifs.length;
    return (
      <div className="page">
        <Header clearSearch={this.clearSearch} hasResults={hasResults}/>
        <div className="search grid">
        {/*here we loop over array of images from state and create multiple videos from it*/}
          {this.state.gifs.map(gif => (
            //spread out all properties on gif component
          <Gif {...gif} />
          ))}
          
          {/*stack of images*/}
          <input
            className="input grid-item"
            placeholder="type somthing"
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            value={searchTerm}
            ref={(input) => {this.textInput = input;}}
          />
        </div>
        {/*here we pass in our userhint state and spread*/}
        <UserHint {...this.state} />
      </div>
    )
  }
}

export default App
