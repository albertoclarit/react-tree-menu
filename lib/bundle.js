/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var api = __webpack_require__(1);
	
	api.TreeMenu = __webpack_require__(1);
	api.TreeNode = __webpack_require__(3);
	api.Utils = __webpack_require__(8);
	
	module.exports = api;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(2),
	    TreeNode = __webpack_require__(3),
	    TreeNodeFactory = React.createFactory(TreeNode),
	    TreeNodeMixin = __webpack_require__(4),
	    clone = __webpack_require__(5).clone,
	    omit = __webpack_require__(5).omit,
	    sortBy = __webpack_require__(5).sortBy,
	    invariant = __webpack_require__(6),
	    assign = __webpack_require__(7),
	    map = __webpack_require__(5).map;
	
	/**
	 * The root component for a tree view. Can have one or many <TreeNode/> children
	 *
	 * @type {TreeMenu}
	 */
	var TreeMenu = React.createClass({
	  displayName: 'TreeMenu',
	
	
	  mixins: [TreeNodeMixin],
	
	  propTypes: {
	
	    stateful: React.PropTypes.bool,
	    classNamePrefix: React.PropTypes.string,
	    identifier: React.PropTypes.string,
	    onTreeNodeClick: React.PropTypes.func,
	    onTreeNodeCheckChange: React.PropTypes.func,
	    onTreeNodeSelectChange: React.PropTypes.func,
	    collapsible: React.PropTypes.bool,
	    expandIconClass: React.PropTypes.string,
	    collapseIconClass: React.PropTypes.string,
	    data: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.object]),
	    labelFilter: React.PropTypes.func,
	    labelFactory: React.PropTypes.func,
	    checkboxFactory: React.PropTypes.func,
	    sort: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.function])
	  },
	
	  getDefaultProps: function getDefaultProps() {
	    return {
	      classNamePrefix: "tree-view",
	      stateful: false
	    };
	  },
	
	  render: function render() {
	
	    var props = this.props;
	
	    return React.createElement(
	      'div',
	      { className: props.classNamePrefix },
	      this._getTreeNodes()
	    );
	  },
	
	  /**
	   * Gets data from declarative TreeMenu nodes
	   *
	   * @param children
	   * @returns {*}
	   * @private
	   */
	  _getDataFromChildren: function _getDataFromChildren(children) {
	
	    var iterableChildren = Array.isArray(children) ? children : [children];
	
	    var self = this;
	    return iterableChildren.map(function (child) {
	
	      var data = clone(omit(child.props, "children"));
	
	      if (child.props.children) {
	        data.children = self._getDataFromChildren(child.props.children);
	      }
	
	      return data;
	    });
	  },
	
	  /**
	   * Get TreeNode instances for render()
	   *
	   * @returns {*}
	   * @private
	   */
	  _getTreeNodes: function _getTreeNodes() {
	
	    var treeMenuProps = this.props,
	        treeData;
	
	    invariant(!treeMenuProps.children || !treeMenuProps.data, "Either children or data props are expected in TreeMenu, but not both");
	
	    if (treeMenuProps.children) {
	      treeData = this._getDataFromChildren(treeMenuProps.children);
	    } else {
	      treeData = treeMenuProps.data;
	    }
	
	    var thisComponent = this;
	
	    function dataToNodes(data, ancestor) {
	
	      var isRootNode = false;
	      if (!ancestor) {
	        isRootNode = true;
	        ancestor = [];
	      }
	
	      var nodes = map(data, function (dataForNode, i) {
	
	        var nodeProps = omit(dataForNode, ["children", "onClick", "onCheckChange"]),
	            children = [];
	
	        nodeProps.label = nodeProps.label || i;
	
	        if (dataForNode.children) {
	          children = dataToNodes(dataForNode.children, ancestor.concat(thisComponent.getNodeId(treeMenuProps, nodeProps, i)));
	        }
	
	        nodeProps = assign(nodeProps, thisComponent.getTreeNodeProps(treeMenuProps, nodeProps, ancestor, isRootNode, i));
	
	        return TreeNodeFactory(nodeProps, children);
	      });
	
	      var sort = thisComponent.props.sort;
	
	      if (sort) {
	        var sorter = typeof sort === "boolean" ? function (node) {
	          return node.props.label;
	        } : sort;
	        nodes = sortBy(nodes, sorter);
	      }
	
	      return nodes;
	    }
	
	    if (treeData) {
	      return dataToNodes(treeData);
	    }
	  }
	
	});
	
	module.exports = TreeMenu;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("react");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(2),
	    TreeNodeMixin = __webpack_require__(4),
	    noop = __webpack_require__(5).noop;
	
	/**
	 * Individual nodes in tree hierarchy, nested under a single <TreeMenu/> node
	 *
	 *
	 * @type {TreeNode}
	 */
	var TreeNode = React.createClass({
	  displayName: 'TreeNode',
	
	
	  mixins: [TreeNodeMixin],
	
	  propTypes: {
	
	    stateful: React.PropTypes.bool,
	    checkbox: React.PropTypes.bool,
	    collapsible: React.PropTypes.bool,
	    collapsed: React.PropTypes.bool,
	    expandIconClass: React.PropTypes.string,
	    collapseIconClass: React.PropTypes.string,
	    checked: React.PropTypes.bool,
	    label: React.PropTypes.string.isRequired,
	    classNamePrefix: React.PropTypes.string,
	    onClick: React.PropTypes.func,
	    onCheckChange: React.PropTypes.func,
	    onSelectChange: React.PropTypes.func,
	    onCollapseChange: React.PropTypes.func,
	    labelFilter: React.PropTypes.func,
	    labelFactory: React.PropTypes.func,
	    checkboxFactory: React.PropTypes.func
	
	  },
	
	  getInitialState: function getInitialState() {
	    return {};
	  },
	
	  getDefaultProps: function getDefaultProps() {
	    return {
	      stateful: false,
	      collapsible: true,
	      collapsed: false,
	      checkbox: false,
	      onClick: function onClick(lineage) {
	        console.log("Tree Node clicked: " + lineage.join(" > "));
	      },
	      onCheckChange: function onCheckChange(lineage) {
	        console.log("Tree Node indicating a checkbox check state should change: " + lineage.join(" > "));
	      },
	      onCollapseChange: function onCollapseChange(lineage) {
	        console.log("Tree Node indicating collapse state should change: " + lineage.join(" > "));
	      },
	      checked: false,
	      expandIconClass: "",
	      collapseIconClass: "",
	      labelFactory: function labelFactory(labelClassName, displayLabel) {
	        return React.createElement(
	          'label',
	          { className: labelClassName },
	          displayLabel
	        );
	      },
	      checkboxFactory: function checkboxFactory(className, isChecked) {
	        return React.createElement('input', {
	          className: className,
	          type: 'checkbox',
	          checked: isChecked,
	          onChange: noop });
	      }
	    };
	  },
	
	  _getCollapseNode: function _getCollapseNode() {
	    var props = this.props,
	        collapseNode = null;
	
	    if (props.collapsible) {
	      var collapseClassName = this._getRootCssClass() + "-collapse-toggle ";
	      var collapseToggleHandler = this._handleCollapseChange;
	      if (!props.children || props.children.length === 0) {
	        collapseToggleHandler = noop;
	        collapseClassName += "collapse-spacer";
	      } else {
	        collapseClassName += this._isCollapsed() ? props.expandIconClass : props.collapseIconClass;
	      }
	      collapseNode = React.createElement('span', { onClick: collapseToggleHandler, className: collapseClassName });
	    }
	    return collapseNode;
	  },
	
	  render: function render() {
	    return React.createElement(
	      'div',
	      { className: this._getRootCssClass() },
	      this._getCollapseNode(),
	      React.createElement(
	        'span',
	        { onClick: this._handleClick },
	        this._getCheckboxNode(),
	        this._getLabelNode()
	      ),
	      this._getChildrenNode()
	    );
	  },
	
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	
	    if (!this._isStateful()) return;
	
	    var mutations = {};
	
	    if (this.props.checked !== nextProps.checked) {
	      mutations.checked = nextProps.checked;
	    }
	
	    this.setState(mutations);
	  },
	
	  _getRootCssClass: function _getRootCssClass() {
	    return this.props.classNamePrefix + "-node";
	  },
	
	  _getChildrenNode: function _getChildrenNode() {
	
	    var props = this.props;
	
	    if (this._isCollapsed()) return null;
	
	    var children = props.children;
	
	    if (this._isStateful()) {
	      var state = this.state;
	      children = React.Children.map(props.children, function (child) {
	        return React.cloneElement(child, {
	          key: child.key,
	          ref: child.ref,
	          checked: state.checked
	        });
	      });
	    }
	
	    return React.createElement(
	      'div',
	      { className: this._getRootCssClass() + "-children" },
	      children
	    );
	  },
	
	  _getLabelNode: function _getLabelNode() {
	
	    var props = this.props,
	        labelClassName = props.classNamePrefix + "-node-label";
	
	    if (this._isSelected()) {
	      labelClassName += " selected";
	    }
	
	    var displayLabel = props.label;
	
	    if (props.labelFilter) displayLabel = props.labelFilter(displayLabel);
	
	    return this.props.labelFactory(labelClassName, displayLabel, this._getLineage());
	  },
	
	  _getCheckboxNode: function _getCheckboxNode() {
	    var props = this.props;
	    if (!props.checkbox) return null;
	
	    return this.props.checkboxFactory(props.classNamePrefix + "-node-checkbox", this._isChecked(), this._getLineage());
	  },
	
	  _isStateful: function _isStateful() {
	
	    return this.props.stateful ? true : false;
	  },
	
	  _isChecked: function _isChecked() {
	
	    if (this._isStateful() && typeof this.state.checked !== "undefined") return this.state.checked;
	    return this.props.checked;
	  },
	
	  _isSelected: function _isSelected() {
	
	    if (this._isStateful() && typeof this.state.selected !== "undefined") return this.state.selected;
	    return this.props.selected;
	  },
	
	  _isCollapsed: function _isCollapsed() {
	
	    if (this._isStateful() && typeof this.state.collapsed !== "undefined") return this.state.collapsed;
	
	    if (!this.props.collapsible) return false;
	
	    return this.props.collapsed;
	  },
	
	  _handleClick: function _handleClick() {
	    if (this.props.checkbox) {
	      return this._handleCheckChange();
	    } else if (this.props.onSelectChange) {
	      return this._handleSelectChange();
	    }
	
	    this.props.onClick(this._getLineage());
	  },
	
	  _toggleNodeStateIfStateful: function _toggleNodeStateIfStateful(field) {
	    if (this._isStateful()) {
	      var newValue = !this.props[field];
	      if (typeof this.state[field] !== "undefined") {
	        newValue = !this.state[field];
	      }
	      var mutation = {};
	      mutation[field] = newValue;
	      console.log(mutation);
	      this.setState(mutation);
	    }
	  },
	
	  _handleCheckChange: function _handleCheckChange() {
	
	    this._toggleNodeStateIfStateful("checked");
	
	    this.props.onCheckChange(this._getLineage());
	  },
	
	  _handleSelectChange: function _handleSelectChange() {
	
	    this._toggleNodeStateIfStateful("selected");
	
	    this.props.onSelectChange(this._getLineage());
	  },
	
	  _handleCollapseChange: function _handleCollapseChange() {
	
	    this._toggleNodeStateIfStateful("collapsed");
	
	    this.props.onCollapseChange(this._getLineage());
	  },
	
	  _getLineage: function _getLineage() {
	
	    return this.props.ancestor.concat(this.props.id);
	  }
	
	});
	
	module.exports = TreeNode;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var pick = __webpack_require__(5).pick,
	    extend = __webpack_require__(5).assign;
	
	var TreeNodeMixin = {
	
	  /**
	   * Build the properties necessary for the TreeNode instance
	   *
	   * @param rootProps
	   * @param props
	   * @param ancestor
	   * @param isRootNode
	   * @param childIndex
	   * @returns {{classNamePrefix: (*|TreeMenu.propTypes.classNamePrefix|TreeMenu.getDefaultProps.classNamePrefix|TreeNodeMixin._getTreeNodeProps.classNamePrefix), collapseIconClass: (*|TreeMenu.propTypes.collapseIconClass|App._getStaticTreeExample.collapseIconClass|App._getDynamicTreeExample.collapseIconClass|TreeNodeMixin._getTreeNodeProps.collapseIconClass), expandIconClass: (*|TreeMenu.propTypes.expandIconClass|App._getStaticTreeExample.expandIconClass|App._getDynamicTreeExample.expandIconClass|TreeNodeMixin._getTreeNodeProps.expandIconClass), collapsible: (*|TreeMenu.propTypes.collapsible|TreeMenu.getDefaultProps.collapsible|App._getStaticTreeExample.collapsible|TreeNodeMixin._getTreeNodeProps.collapsible), ancestor: *, onClick: (TreeMenu.propTypes.onTreeNodeClick|*|App._getStaticTreeExample.onTreeNodeClick|App._getDynamicTreeExample.onTreeNodeClick), onCheckChange: (TreeMenu.propTypes.onTreeNodeCheckChange|*|App._getStaticTreeExample.onTreeNodeCheckChange|App._getDynamicTreeExample.onTreeNodeCheckChange), onCollapseChange: (App._getDynamicTreeExample.onTreeNodeCollapseChange|*), id: *, key: string}}
	   * @private
	   */
	  getTreeNodeProps: function getTreeNodeProps(rootProps, props, ancestor, isRootNode, childIndex) {
	
	    //TODO: use omit/pick to clean this up
	
	    return extend({
	      ancestor: ancestor,
	      onClick: rootProps.onTreeNodeClick,
	      onCheckChange: rootProps.onTreeNodeCheckChange,
	      onSelectChange: rootProps.onTreeNodeSelectChange,
	      onCollapseChange: rootProps.onTreeNodeCollapseChange,
	      id: this.getNodeId(rootProps, props, childIndex),
	      key: "tree-node-" + ancestor.join(".") + childIndex
	    }, pick(rootProps, "classNamePrefix", "collapseIconClass", "expandIconClass", "collapsible", "stateful", "labelFilter", "checkboxFactory", "labelFactory"));
	  },
	
	  getNodeId: function getNodeId(rootProps, props, childIndex) {
	    return rootProps.identifier && props[rootProps.identifier] ? props[rootProps.identifier] : childIndex;
	  }
	};
	
	module.exports = TreeNodeMixin;

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("invariant");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("object-assign");

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	
	var TreeMenuUtils = {
	
	  /**
	   * //TODO: use immutable API here..this function mutates!
	   *
	   * @param lineage
	   * @param prevState
	   * @param mutatedProperty
	   * @param identifier optional
	   * @returns {*}
	   */
	  getNewTreeState: function getNewTreeState(lineage, prevState, mutatedProperty, identifier) {
	
	    function setPropState(node, value) {
	      node[mutatedProperty] = value;
	      var children = node.children;
	      if (children) {
	        node.children.forEach(function (childNode, ci) {
	          setPropState(childNode, value);
	        });
	      }
	    }
	
	    function getUpdatedTreeState(state) {
	      state = state || prevState;
	      var id = lineage.shift();
	      state.forEach(function (node, i) {
	        var nodeId = identifier ? state[i][identifier] : i;
	        if (nodeId === id) {
	          if (!lineage.length) {
	            setPropState(state[i], !state[i][mutatedProperty]);
	          } else {
	            state[i].children = getUpdatedTreeState(state[i].children);
	          }
	        }
	      });
	
	      return state;
	    }
	
	    return getUpdatedTreeState();
	  }
	
	};
	
	module.exports = TreeMenuUtils;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map