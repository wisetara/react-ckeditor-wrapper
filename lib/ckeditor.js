"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var CKEditor = function (_Component) {
  _inherits(CKEditor, _Component);

  function CKEditor(props) {
    _classCallCheck(this, CKEditor);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.changeListener = _this.changeListener.bind(_this);
    _this.loadListener = _this.loadListener.bind(_this);

    _this.state = {
      value: props.value,
      config: props.config || {},
      onChange: props.onChange
    };
    return _this;
  }

  CKEditor.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this;

    if (!window.CKEDITOR) {
      console.error("CKEditor not found");
      return;
    }

    this.instance = window.CKEDITOR.appendTo(this.divRef, this.state.config, this.state.value);

    this.instance.on('instanceReady', function (e) {
      //Set content and read only flag again. Can have changed since init.
      e.editor.setData(_this2.state.value);
      if ("readOnly" in _this2.state.config) _this2.instance.setReadOnly(_this2.state.config.readOnly);

      _this2.loadListener();
    });
    this.instance.on('change', this.changeListener);
  };

  CKEditor.prototype.componentWillReceiveProps = function componentWillReceiveProps(props) {
    //Only manipulate the editor when it's ready. The data will be set when it's
    //ready otherwise.
    if (this.instance && this.instance.status === "ready") {

      if (this.state.value !== props.value) {
        // setData will move the cursor to the begining of the input
        this.instance.setData(props.value);
      }

      if (props.config && this.state.config !== props.config) {
        if ("readOnly" in props.config) this.instance.setReadOnly(props.config.readOnly);
      }
    }

    this.setState({
      value: props.value,
      config: props.config || {},
      onChange: props.onChange
    });
  };

  CKEditor.prototype.componentWillUnmount = function componentWillUnmount() {
    this.instance.removeListener("change", this.changeListener);
    this.instance.destroy();
  };

  CKEditor.prototype.loadListener = function loadListener() {
    if (this.props.onLoad) {
      this.props.onLoad();
    }
  };

  CKEditor.prototype.changeListener = function changeListener() {
    this.state.value = this.instance.getData();
    this.handleChange();
  };

  CKEditor.prototype.handleChange = function handleChange() {
    this.state.onChange(this.state.value);
  };

  CKEditor.prototype.render = function render() {
    var _this3 = this;

    return _react2.default.createElement("div", { ref: function ref(input) {
        return _this3.divRef = input;
      } });
  };

  return CKEditor;
}(_react.Component);

exports.default = CKEditor;