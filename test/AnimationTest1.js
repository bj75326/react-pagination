//AnimationTest1.js

import React, {Component} from 'react';
//import CustomContent from 'AnimationTestChild.js';

class Page extends Component {
    constructor(props){
        super(props);
        this.state= {
            open: false
        };
        this.dropdownToggle = this.state.open;
    }

    /*
    componentDidMount(){
        //dropdown绑定animationEnd事件
        this.dropdown.addEventListener('animationend', this.removeDropdownClass.bind(this), false);
    }

    componentWillUnmount(){
        //dropdown解绑animationEnd事件
        this.dropdown.removeEventListener('animationend', this.removeDropdownClass, false);
    }
    */

    removeDropdownClass(){
        console.log(this.dropdown);
        if(!this.dropdownToggle){
            //closed dropdown
            this.dropdown.classList.remove('leave')
            this.dropdown.classList.remove('active');
        }else{
            //opened dropdown
            this.dropdown.classList.remove('enter');
        }
    }

    handleToggleClick(){
        //const isOpened = !this.state.open;
        //this.setState({open: isOpened});
        //this.dropdown.classList.remove('enter').remove('leave').remove('active');

        if(this.dropdownToggle){
            //close dropdown
            this.dropdown.classList.add('leave');

        }else{
            //open dropdown
            this.dropdown.classList.add('active');
            this.dropdown.classList.add('enter');
        }
        this.dropdownToggle = !this.dropdownToggle;
    }

    render(){

        const dropdownClass = this.state.open ? 'normal active' : 'normal';
        return (
            <div className="page">
                <header className="header"><button onClick={this.handleToggleClick.bind(this)}>Toggle</button></header>
                <div ref={dropdown=>{this.dropdown=dropdown;}} className={dropdownClass} style={{width: '60px',
                    height: '200px',
                    backgroundColor: 'black',
                    margin: '5px auto',
                    transformOrigin: 'center top 0px'
                }}>

                </div>
            </div>
        );
    }
}

export default Page;