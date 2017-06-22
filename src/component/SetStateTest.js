//React.component setState test
//case to test setState async/sync

import React, {Component} from 'react';
import {on, off} from '../common/util.js';

class SetStateTest extends Component{

    constructor(props){
        super(props);
        this.state = {
            count: 0
        };
    }

    handleClick(){
        this.setState({count: this.state.count + 1});
        console.log('#this state', this.state);
    }

    handleClickLater(){
        setTimeout(()=>{
            this.handleClick();
        },0);
    }

    componentDidMount(){
        on(this.btn2, 'click', this.handleClick.bind(this), false);
    }

    componentUnMount(){
        //
    }

    render(){
        console.log('#enter render');
        return (
            <div>
                <div>{this.state.count}</div>
                <div>
                    <button onClick={this.handleClick.bind(this)}>Increment</button>
                    <button ref={btn2 => {this.btn2 = btn2}}>Increment Raw</button>
                    <button onClick={this.handleClickLater.bind(this)}>Increment Later</button>
                </div>
            </div>
        );
    }
}

export default SetStateTest;
