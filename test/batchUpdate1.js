/**
 * Created by jibin on 17/7/31.
 */
import React, {Component} from 'react';

class Parent extends Component {
    constructor(props){
        super(props);
        this.state = {
            text: 'default'
        };
    }

    handleChildClick(){
        this.setState({
            text: Math.random() * 1000
        });
    }

    render(){
        console.log('parent render');
        return (
            <div className="parent">
                this is parent!
                <Child text={this.state.text} onClick={this.handleChildClick.bind(this)}/>
            </div>
        );
    }
}

class Child extends Component {
    constructor(props){
        super(props);
        this.state={
            text: this.props.text + '~'
        };
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            text: nextProps.text + '~'
        });
    }

    componentWillUpdate(nextProps, nextState){
        console.log(nextProps.text);
        console.log(nextState.text);
    }

    handleClick(){
        this.setState({
            text: 'clicked'
        });
        this.props.onClick();
    }

    render(){
        console.log('child render');
        return (
            <div className="child">
                this is child!
                <p>something from parent</p>
                <p>{this.state.text}</p>
                <button onClick={this.handleClick.bind(this)}>Click Me</button>
            </div>
        );
    }
}

export default Parent;
