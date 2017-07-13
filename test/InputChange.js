/**
 * Created by jibin on 17/7/13.
 */

import React, {Component} from 'react';

class InputChange extends Component{
    constructor(){
        super();
        this.state = {
            inputValue: ''
        }
    }

    handleChange(event){
        console.log('change');
    }

    componentDidMount(){
        this.input.addEventListener('change',()=>{
            console.log('diy change bind');
        });
    }

    render(){
        return(
            <div>
                <input style={{width: '500px'}}  value={this.state.inputValue} ref={input=>this.input=input} onChange={this.handleChange.bind(this)}/>
            </div>
        );
    }
}

export default InputChange;
