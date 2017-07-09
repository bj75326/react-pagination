//AutosizeInput.js


import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const sizerStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    visibility: 'hidden',
    height: 0,
    overflow: 'scroll',
    writeSpace: 'pre'
};

class AutosizeInput extends Component {
    constructor(props){
        super(props);

        this.state = {
            inputWidth: this.props.minWidth
        };
    }

    static defaultProps = {
        prefixCls: 'bin-autosizeInput',
        minWidth: 1
    };

    static PropTypes = {
        className: PropTypes.string,                // wrapper 添加 classnames
        prefixCls: PropTypes.string,

        defaultValue: PropTypes.any,                // input field default value
        value: PropTypes.any,                       // input field value

        minWidth: PropTypes.oneOfType([             // input 最小 width
            PropTypes.number,
            PropTypes.string
        ]),

        placeholder: PropTypes.string,              // input placeholder text
        placeholderIsMinWidth: PropTypes.bool,      // 是否设置 input 最小 width 为 placeholder 的长度

        style: PropTypes.object,                    // wrapper 添加行内样式
        inputStyle: PropTypes.object,               // input 添加行内样式
        inputClassName: PropTypes.string,           // input 添加 classnames

        onChange: PropTypes.func,                   // input onChange 句柄

    };

    inputRef(el){
        this.input = el;
    }

    sizerRef(el){
        this.sizer = el;
    }

    render(){

        const {className, style, defaultValue, value, inputClassName} = this.props;
        const sizerValue = [defaultValue, value, ''].reduce((prev, curr)=>{
            if(prev !== undefined && prev !== null) return prev;
            return curr;
        });
        const wrapperStyle = Object.assign({}, style);
        if(!wrapperStyle.display) wrapperStyle.display = 'inline-block';

        const inputStyle = Object.assign({}, this.props.inputStyle);
        inputStyle.width = this.state.inputWidth + 'px';
        inputStyle.boxSizing = 'content-box';

        const inputProps = Object.assign({}, this.props);
        inputProps.className = inputClassName;
        inputProps.style = inputStyle;

        delete inputProps.className;
        delete inputProps.prefixCls;
        delete inputProps.defaultValue;
        delete inputProps.minWidth;
        delete inputProps.placeholderIsMinWidth;
        delete inputProps.inputStyle;
        delete inputProps.inputClassName;

        delete inputProps.onAutosize;


        const autosizeInputClass = classnames({
            [className]: !!className
        });

        return (
            <div className={autosizeInputClass} style={wrapperStyle}>
                <input {...inputProps} ref={this.inputRef.bind(this)}/>
                <div ref={this.sizerRef.bind(this)} style={sizerStyle}>{sizerValue}</div>
                {

                }
            </div>
        );
    }
}

export default AutosizeInput;