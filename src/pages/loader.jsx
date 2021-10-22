import React, { Component } from 'react'

class LoaderView extends Component {

  // 数据请求在componentWillMount
  UNSAFE_componentWillMount () { }

  componentDidMount () { }
  componentDidShow () { }

  componentWillUnmount () { }
  componentDidHide () { }

  render () {
    return (
      <div>
        <div>loader的必要</div>
        <div>
          webpack默认是不支持非js文件的，所以在webpack5之前我们通过loader的方式返回可执行的js脚本文件，内部将处理这些webpack不认识的文件。在webpack 5+版本之后，这些loader的作用都已经被内置了～
        </div>
      </div>
    )
  }
}

export default LoaderView