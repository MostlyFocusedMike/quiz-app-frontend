import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import HomePage from './components/HomePage'
import NavBar from './components/NavBar'
// import Topics from './components/Topics'
import QuizOrTopic from './components/QuizOrTopic'
import TopicsList from './components/TopicsList'
import Profile from './components/Profile'
import clock from './images/clock.jpg'
import Signup from './components/Signup'
import './App.css';

class App extends Component {
  state = {
    topics: [],
    auth: {
      currentUser: {}
    }
  }

  componentDidMount(){
    fetch("https://quiz-app-etm.herokuapp.com/topics", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })
      .then(r => r.json())
      .then(res => this.setState({
        topics: res
      })
    );

    const token = localStorage.getItem('token')
    if (token) {
      const options =   {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token
        }
      }
      fetch(`https://quiz-app-etm.herokuapp.com/api/v1/reauth`, options)
      .then(resp => resp.json())
      .then(user => {
        this.setState({
          auth: {
            currentUser: user
          }
        })

      }
    )
    }

  }

  fetchTopic = (id) => {
    fetch(`https://quiz-app-etm.herokuapp.com/topics/${id}`)
      .then(r => r.json())
      .then(topic => {
        let topics = [...this.state.topics]
        const oldTopic = topics.find(oldTopic => oldTopic.id === topic.id)
        topics[topics.indexOf(oldTopic)] = topic
        this.setState({topics})
      })
  }

  handleLogin = (user) => {
   this.setState({
       auth: {
         currentUser: user
       }
     }, () => {
       localStorage.setItem('token', user.jwt)
     })

  }

   handleLogout = () => {
     this.setState({
       auth: {
         currentUser: {}
       }
     })
     localStorage.clear()
   }

  render() {
    const loggedIn = !!this.state.auth.currentUser.id
    console.log(window.location.href);
    return (
      <Router>
        <div>
          <NavBar currentUser={this.state.auth.currentUser} handleLogout={this.handleLogout}/>

          <Route exact path="/" render={() => <HomePage handleLogin={this.handleLogin} loggedIn={loggedIn}/>}/>
          <Route
            exact path="/topics/:title"
            render={ (props) =>
              <QuizOrTopic {...props}
                topics={this.state.topics}
                fetchTopic={this.fetchTopic}
                loggedIn={loggedIn}
                currentUser={this.state.auth.currentUser}
              /> }/>
           <Route exact path="/topics" render={(props) => <TopicsList {...props} topics={this.state.topics} loggedIn={loggedIn}/>}/>
           <Route exact path="/signup" component={(props) => <Signup handleLogin={this.handleLogin} loggedIn={loggedIn}/>}/>
           <Route exact path="/users/:id" render={(props) => <Profile currentUser={this.state.auth.currentUser} {...props} loggedIn={loggedIn}/>} />
                <img id="clock" src={clock} />
        </div>

      </Router>
    );
  }
}

export default App;
// I took out main here
