/**
 * Created by jibin on 17/7/17.
 */

import React, {Component} from 'react';

class StopPropagationTest extends Component{
    constructor(){
        super();
    }

    handleMotherMouseDown(event){
        console.log('Mother MouseDown run');
        event.stopPropagation();

    }

    handleSonMouseDown(event){
        console.log('Son MouseDown run');
        event.stopPropagation();
    }

    render(){

        return (
            <div style={{width: '50px', height: '50px', backgroundColor: 'black'}} onMouseDown={this.handleMotherMouseDown.bind(this)}>
                <div style={{width: '30px', height: '30px', backgroundColor: 'red'}} onMouseDown={this.handleSonMouseDown.bind(this)}></div>
            </div>
        );
    }
}

export default StopPropagationTest;
