/**
 * Created by jibin on 17/7/22.
 */

import React, {Component} from 'react';

class SetStateCallback extends Component{
    constructor(props){
        super(props);
        this.state = {
            test: 1
        };
    }

    componentDidUpdate(){
        console.log('in componentDidUpdate');
    }

    handleClick(){
        const test = this.state.test;
        this.setState({test: test+1}, ()=>{
            console.log('in setState callback' + this.state.test);
            this.setState({test: test+1}, ()=>{
                console.log('in setState callback' + this.state.test);
            });
        });
    }

    render(){
        return (
            <div>
                <button onClick={this.handleClick.bind(this)}>Click me!</button>
            </div>
        );
    }
}

export default SetStateCallback;

