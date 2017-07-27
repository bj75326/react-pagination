//defaultMenuRenderer.js

import React from 'react';
import classnames from 'classnames';
import styles from '../component/style.css';
import FontAwesome from 'react-fontawesome';

const menuRenderer = ({
    focusedOption,
    ident,
    prefixCls,
    multi,
    labelKey,
    onFocus,
    onSelect,
    optionClassName,
    optionRenderer,
    optionComponent,
    options,
    valueArray,
    valueKey,
    onOptionRef   //onOptionRef(ref, isFocused)
})=>{
    let Option = optionComponent;

    return(
        <ul className={styles[`${prefixCls}-dropdown-list`]}>
            {
                options.map((option, i)=>{
                    let isSelected = valueArray && valueArray.indexOf(option) > -1;
                    let isFocused = option === focusedOption;
                    let optionClass = classnames({
                        [styles[`${prefixCls}-item`]]: true,
                        [styles[`${prefixCls}-item-selected`]]: isSelected,
                        [styles[`${prefixCls}-item-disabled`]]: option.disabled,
                        [styles[`${prefixCls}-item-focused`]]: isFocused
                    });
                    return (
                        <Option
                            className={optionClass}
                            ident={ident}
                            isDisabled={option.disabled}
                            isFocused={isFocused}
                            isSelected={isSelected}
                            key={ident + '-' + i}
                            onFocus={onFocus}
                            onSelect={onSelect}
                            option={option}
                            optionIndex={i}
                            ref={ref=>{onOptionRef(ref, isFocused)}} //Select.js 中可以获取 this.focused
                        >
                            <span>{optionRenderer(option, i)}</span>
                            {multi? <FontAwesome name="check"/> : null}
                        </Option>
                    );
                })
            }
        </ul>
    );
};

export default menuRenderer;