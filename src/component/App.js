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
            },
            selector_02: {
                selectedValue: 'beijing,shanghai',
                disabled: false,
                required: false
            }
        };
    }
    //simpleValue set as true.
    onChange(ident, value){
        console.log('onChange');
        console.log(value);
        this.setState({
            [ident]: {selectedValue: value}
        });
        console.log(this.state);
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
                                    onChange={this.onChange.bind(this)}
                                    simpleValue={true}
                                    searchable={true}
                            />
                        </div>
                    </div>
                    <h3 id="ji-chu-duo-xuan"><a href="#ji-chu-duo-xuan" className="header-anchor" aria-hidden="true">#</a>基本多选</h3>
                    <p>适用性较广的基础多选，用 Tag 展示已选项</p>
                    <div className="demo-box" style={{height: '300px'}}>
                        <div className="demo-showcase" style={{width: '308px'}}>
                            <Select options={options} ident="selector_02" selectedValue={this.state.selector_02.selectedValue}
                                    disabled={this.state.selector_02.disabled}
                                    multi={true}
                                    onChange={this.onChange.bind(this)}
                                    simpleValue={true}
                                    searchable={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default App;