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
    whiteSpace: 'pre'
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
        onAutosize: PropTypes.func                  // did Update 触发 autoSize 句柄

    };

    inputRef(el){
        this.input = el;
    }

    sizerRef(el){
        this.sizer = el;
    }

    placeHolderSizerRef(el){
        this.placeHolderSizer = el;
    }

    componentDidMount(){
        this.mounted = true;
        this.copyInputStyles();
        this.updateInputWidth();
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    componentDidUpdate(prevProps, prevState) {

        if(prevState.inputWidth !== this.state.inputWidth){
            if(typeof this.props.onAutosize === 'function'){
                this.props.onAutosize(this.state.inputWidth);
            }
        }
        this.updateInputWidth();
    }

    getInput(){
        return this.input;
    }

    focus(){
        this.input.focus();
    }

    blur(){
        this.input.blur();
    }

    //挂载之后获取 input css 样式
    copyInputStyles(){

        if (!this.mounted || !window.getComputedStyle) {
            return;
        }
        const inputStyle = this.input && window.getComputedStyle(this.input);

        if(!inputStyle){
            return;
        }

        let widthNode = this.sizer;

        widthNode.style.fontSize = inputStyle.fontSize;
        widthNode.style.fontFamily = inputStyle.fontFamily;
        widthNode.style.fontWeight = inputStyle.fontWeight;
        widthNode.style.fontStyle = inputStyle.fontStyle;
        widthNode.style.letterSpacing = inputStyle.letterSpacing;
        widthNode.style.textTransform = inputStyle.textTransform;
        if(this.props.placeholder){
            let placeholderNode = this.placeHolderSizer;
            placeholderNode.style.fontSize = inputStyle.fontSize;
            placeholderNode.style.fontFamily = inputStyle.fontFamily;
            placeholderNode.style.fontWeight = inputStyle.fontWeight;
            placeholderNode.style.fontStyle = inputStyle.fontStyle;
            placeholderNode.style.letterSpacing = inputStyle.letterSpacing;
            placeholderNode.style.textTransform = inputStyle.textTransform;
        }
    }

    //获取 sizer width 并且更改 input width
    updateInputWidth(){
        if(!this.mounted || !this.sizer || typeof this.sizer.scrollWidth === 'undefined'){
            return;
        }
        let newInputWidth = this.sizer.scrollWidth + 2;

        if(this.props.placeholder && this.props.placeholderIsMinWidth){
            newInputWidth = Math.max(newInputWidth, this.placeHolderSizer.scrollWidth) + 2;
        }

        if(newInputWidth < this.props.minWidth){
            newInputWidth = this.props.minWidth;
        }

        if(newInputWidth !== this.state.inputWidth){
            this.setState({
                inputWidth: newInputWidth
            });
        }
    }

    render(){

        const {className, style, defaultValue, value, inputClassName, placeholder} = this.props;
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
                    placeholder ? <div ref={this.placeHolderSizerRef.bind(this)} style={sizerStyle}>{placeholder}</div> : null
                }
            </div>
        );
    }
}

export default AutosizeInput;