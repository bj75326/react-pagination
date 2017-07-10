/**
 * Created by jibin on 17/7/10.
 */

import React, {Component} from 'react';

import AutosizeInput from '../src/component/AutosizeInput.js';

class TestAutoSizeInput extends Component{
    constructor(){
        super();
        this.state = {
            selectedValue : ''
        };
    }

    onChange(event){
        console.log(event.target.value);

        this.setState({
            selectedValue: event.target.value
        });
    }

    render(){


        return (
            <div>
                <AutosizeInput
                    value={this.state.selectedValue}
                    onChange={this.onChange.bind(this)}
                    placeholder="请选择"
                    placeholderIsMinWidth={true}
                />
            </div>
        );
    }
}

export default TestAutoSizeInput;