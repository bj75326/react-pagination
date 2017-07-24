//Value.js

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './style.css';

class Value extends Component {

    constructor(props){
        super(props);
    }

    static defaultProps = {
        prefixCls: 'bin-select'
    };

    static Proptypes = {
        prefixCls: PropTypes.string,
        children: PropTypes.node.isRequired,        //value渲染内容
        disabled: PropTypes.bool,
        id: PropTypes.string,                       //value唯一id，asia使用
        onClick: PropTypes.func,                    //click事件句柄
        onRemove: PropTypes.func,                   //多选remove事件句柄
        option: PropTypes.object.isRequired         //option对象 {value: ..., label: ...}
        //扩展option object
        // {
        //      value: ...,
        //      label: ...,
        //      style: ...,
        //      className: ...,
        //      title: ...,
        //      href: ...,
        //      target: ...,
        //      disabled: ...
        // }

    };

    handleMouseDown(event){
        if(event.type === 'mousedown' && event.button !== 0){
            return;
        }
        if(this.props.onClick){
            event.stopPropagation();
            this.props.onClick(this.props.option, event);
            return;
        }
        if(this.props.option.href){
            event.stopPropagation();
        }
    }

    onRemove(event){
        event.preventDefault();
        event.stopPropagation();
        this.props.onRemove(this.props.option);
    }

    handleIconTouchStart(){
        this.dragging = false;
    }

    handleIconTouchMove(){
        this.dragging = true;
    }

    handleIconTouchEnd(event){
        if(this.dragging) return;

        this.onRemove(event);
    }

    renderLabel(){

        const {prefixCls, option, children, id} = this.props;
        return option.onClick || option.href ? (
            <a className={styles[`${prefixCls}-value-label`]} href={option.href} target={option.target}
               onMouseDown={this.handleMouseDown.bind(this)} onTouchEnd={this.handleMouseDown.bind(this)}
            >
                {Array.isArray(children) ? children[0]: children}
            </a>
        ) : (
            <span className={styles[`${prefixCls}-value-label`]} role="option" aria-selected="true"
                id={id}
            >
                {Array.isArray(children) ? children[0]: children}
            </span>
        );
    }

    renderRemoveIcon(){
        if(this.props.disabled || !this.props.onRemove){
            return;
        }

        const {prefixCls, children} = this.props;

        return (
            <span className={styles[`${prefixCls}-value-icon`]}
                  aria-hidden="true"
                  onMouseDown={this.onRemove.bind(this)}
                  onTouchStart={this.handleIconTouchStart.bind(this)}
                  onTouchMove={this.handleIconTouchMove.bind(this)}
                  onTouchEnd={this.handleIconTouchEnd.bind(this)}
            >
                {children[1]}
            </span>
        );
    }

    render(){

        const {prefixCls, option} = this.props;

        const valueClassName = classnames({
            [styles[`${prefixCls}-value`]]: true,
            [option.className]: !!option.className
        });

        return (
            <div className={valueClassName}
                style={option.style} title={option.title}
            >
                {this.renderLabel()}
                {this.renderRemoveIcon()}
            </div>
        );
    }
}

export default Value;
