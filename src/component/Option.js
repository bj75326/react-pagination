//Option.js

import React, {Component} from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

class Option extends Component {

    constructor(props){
        super(props);
    }

    static PropTypes = {
        children: PropTypes.node,
        className: PropTypes.string,
        ident: PropTypes.string,
        isDisabled: PropTypes.bool,
        isFocused: PropTypes.bool,
        isSelected: PropTypes.bool,
        onFocus: PropTypes.func,
        onSelect: PropTypes.func,
        onUnfocus: PropTypes.func,
        option: PropTypes.object.isRequired,
        optionIndex: PropTypes.number,
        //扩展option object
        // {
        //      value: ...,
        //      label: ...,
        //      style: ...,
        //      className: ...,
        //      title: ...,
        //      href: ...,
        //      target: ...,
        //      disabled: ...,
        //      clearableValue: ...
        // }
    };

    blockEvent(event){
        event.stopPropagation();
        event.preventDefault();
        if(event.target.tagName !== 'A' || !event.target.href){
            return;
        }
        if(event.target.target){
            window.open(event.target.href, event.target.target);
        }else{
            window.location.href = event.target.href;
        }
    }

    onFocus(event){
        if(this.props.onFocus){
            this.props.onFocus(this.props.option, event);
        }
    }

    handleMouseDown(event){
        event.preventDefault();
        event.stopPropagation();
        this.props.onSelect(this.props.option, event);
    }

    handleMouseEnter(event){
        this.onFocus(event);
    }

    handleMouseMove(event){
        this.onFocus(event);
    }

    handleTouchStart(){
        this.dragging = false;
    }

    handleTouchMove(){
        this.dragging = true;
    }

    handleTouchEnd(event){
        if(this.dragging === true){
            return;
        }
        this.handleMouseDown(event);
    }

    render(){

        const {option, children, ident, optionIndex} = this.props;
        const className = classnames({
            [this.props.className]: !!this.props.className,
            [option.className]: !!option.className
        });

        return (
            option.disabled ? (
                <li className={className}
                    onMouseDown={this.blockEvent.bind(this)}
                    onClick={this.blockEvent.bind(this)}
                >
                    {children}
                </li>
            ) : (
                <li className={className}
                    style={option.style}
                    role="option"
                    onMouseDown={this.handleMouseDown.bind(this)}
                    onMouseEnter={this.handleMouseEnter.bind(this)}
                    onMouseMove={this.handleMouseMove.bind(this)}
                    onTouchStart={this.handleTouchStart.bind(this)}
                    onTouchMove={this.handleTouchMove.bind(this)}
                    onTouchEnd={this.handleTouchEnd.bind(this)}
                    id={ident + '-option-' + optionIndex}
                    title={option.title}
                >
                    {children}
                </li>
            )
        );
    }
}

export default Option;
