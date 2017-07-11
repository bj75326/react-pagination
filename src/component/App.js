//App.js

import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';

import Select from './Select.js';

import {CITYS} from '../../data/city.js';

class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            selector_01: {
                selectedValue: 'beijing',
                disabled: false,
                required: false
            }
        };
    }

    render(){

        const options = CITYS;

        return (
            <div className="page">
                <header>
                    <div className="inner">
                        <h1>React-Select</h1>
                        <h2>An alternative solution to apply common style for Select build with ReactJS.</h2>
                        <a href="#" className="button">
                            <div><FontAwesome name="github"/></div>
                            <div>
                                <div>View project on</div>
                                <div className="github">Github</div>
                            </div>
                        </a>
                    </div>
                </header>
                <div className="content-wrapper">
                    <h3 id="ji-chu-yong-fa"><a href="#ji-chu-yong-fa" className="header-anchor" aria-hidden="true">#</a>基本用法</h3>
                    <p>适用于广泛的基础单选</p>
                    <div className="demo-box" style={{height: '300px'}}>
                        <div className="demo-showcase" style={{width: '248px'}}>
                            <Select options={options} ident={"selector_01"} selectedValue={this.state.selector_01.selectedValue}
                                    disabled={this.state.selector_01.disabled}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default App;