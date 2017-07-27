/**
 * Created by jibin on 17/7/26.
 */

import React, {Component} from 'react';

class RefTest extends Component {
    constructor(props){
        super(props);
        this.state={
            count: 1,
            visible: true
        };
    }

    componentDidMount(){
        console.log('in componentDidMount');
        console.log(this.div);
        console.log(this.div2);
    }

    componentWillUpdate(){
        console.log('in componentWillUpdate');
        console.log(this.div);
        console.log(this.div2);
    }

    componentDidUpdate(){
        console.log('in componentDidUpdate');
        console.log(this.div);
        console.log(this.div2);
    }

    shouldComponentUpdate(){
        console.log('in shouldComponentUpdate');
        console.log(this.div);
        console.log(this.div2);
        return true;
    }

    handleClick(){
        this.setState({
            count: ++this.state.count
        });
    }
    handleClick2(){
        this.setState({
            visible: !this.state.visible
        });
    }

    render(){
        console.log('in render');
        console.log(this.div);
        console.log(this.div2);
        return (
            <div>
                <button onClick={this.handleClick.bind(this)}>Click Me</button>
                <div ref={ref=>{this.div = ref}}>{this.state.count}</div>
                <button onClick={this.handleClick2.bind(this)}>Click Me</button>
                {this.state.visible ? (
                    <div ref={ref=>{this.div2=ref}}>Show Show Show</div>
                ) : null}
            </div>

        );
    }
}

export default RefTest;
