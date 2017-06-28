//AnimationTest2.js

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

    removeDropdownClass(){
        console.log(this.dropdown);
        if(!this.dropdownToggle){
            //closed dropdown
            this.dropdown.classList.remove('leave');
            this.dropdown.classList.remove('active');
            this.setState({open: false});
        }else{
            //opened dropdown
            this.dropdown.classList.remove('enter');
            this.setState({open: true});
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
                }} onAnimationEnd={this.removeDropdownClass.bind(this)} >

                </div>
            </div>
        );
    }
}

export default Page;