/**
 * Created by jibin on 17/8/1.
 */

import React, {Component} from 'react';

class Parent extends Component{
    constructor(props){
        super(props);
        this.state = {
            text: 'default'
        }
    }

    handleClick(){
        console.log('parent click');
        this.setState({
            text: Math.random() * 1000
        });
    }

    componentDidUpdate(){
        this.setState({
            text: Math.random()* 1000
        });
    }

    render(){
        console.log('render parent');
        return (
            <div style={{width: '100px', height: '100px', backgroundColor: 'black'}} onClick={this.handleClick.bind(this)}>
                <span>{this.state.text}</span>
                <Child />
            </div>
        );
    }
}

class Child extends Component{
    constructor(props){
        super(props);
        this.state={
            text: 'child'
        }
    }

    handleClick(){
        console.log('child click');
        this.setState({
            text: Math.random()* 1000 + '~'
        });
    }

    componentDidUpdate(){
        this.setState({
            text: Math.random()* 1000 + '~'
        });
    }

    render(){
        return(
            <div style={{width: '50px', height: '50px', backgroundColor: 'white'}} onClick={this.handleClick.bind(this)}>
                <span>{this.state.text}</span>
            </div>
        );
    }
}

export default Parent;

