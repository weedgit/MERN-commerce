import { Component } from 'react';
import AddItem from './AddItem';
import Home from './Home';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';

class Main extends Component {
    render(){
        return (
            <Container>
                <Switch>
                    <Route path='/home'>
                        <Home/>
                    </Route>
                    <Route path='/addItem'>
                        <AddItem/>
                    </Route>
                    <Redirect to='/home'/>
                </Switch>
            </Container>
        )
    }
}

export default withRouter(connect()(Main));