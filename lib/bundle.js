!function(e){function t(s){if(o[s])return o[s].exports;var n=o[s]={exports:{},id:s,loaded:!1};return e[s].call(n.exports,n,n.exports,t),n.loaded=!0,n.exports}var o={};return t.m=e,t.c=o,t.p="",t(0)}([function(e,t,o){"use strict";var s=o(2);s.TreeMenu=o(2),s.TreeNode=o(3),s.Utils=o(6),e.exports=s},function(e,t){e.exports=lodash},function(e,t,o){"use strict";var s=o(5),n=o(3),r=s.createFactory(n),a=o(4),i=o(1).clone,c=o(1).omit,l=o(1).sortBy,p=o(7),h=o(8),d=o(1).map,u=s.createClass({displayName:"TreeMenu",mixins:[a],propTypes:{stateful:s.PropTypes.bool,classNamePrefix:s.PropTypes.string,identifier:s.PropTypes.string,onTreeNodeClick:s.PropTypes.func,onTreeNodeCheckChange:s.PropTypes.func,onTreeNodeSelectChange:s.PropTypes.func,collapsible:s.PropTypes.bool,expandIconClass:s.PropTypes.string,collapseIconClass:s.PropTypes.string,data:s.PropTypes.oneOfType([s.PropTypes.array,s.PropTypes.object]),labelFilter:s.PropTypes.func,labelFactory:s.PropTypes.func,checkboxFactory:s.PropTypes.func,sort:s.PropTypes.oneOfType([s.PropTypes.bool,s.PropTypes["function"]])},getDefaultProps:function(){return{classNamePrefix:"tree-view",stateful:!1}},render:function(){var e=this.props;return s.createElement("div",{className:e.classNamePrefix},this._getTreeNodes())},_getDataFromChildren:function(e){var t=Array.isArray(e)?e:[e],o=this;return t.map(function(e){var t=i(c(e.props,"children"));return e.props.children&&(t.children=o._getDataFromChildren(e.props.children)),t})},_getTreeNodes:function(){function e(t,n){var a=!1;n||(a=!0,n=[]);var i=d(t,function(t,i){var l=c(t,["children","onClick","onCheckChange"]),p=[];return l.label=l.label||i,t.children&&(p=e(t.children,n.concat(s.getNodeId(o,l,i)))),l=h(l,s.getTreeNodeProps(o,l,n,a,i)),r(l,p)}),p=s.props.sort;if(p){var u="boolean"==typeof p?function(e){return e.props.label}:p;i=l(i,u)}return i}var t,o=this.props;p(!o.children||!o.data,"Either children or data props are expected in TreeMenu, but not both"),t=o.children?this._getDataFromChildren(o.children):o.data;var s=this;if(t)return e(t)}});e.exports=u},function(e,t,o){"use strict";var s=o(5),n=o(4),r=o(1).noop,a=s.createClass({displayName:"TreeNode",mixins:[n],propTypes:{stateful:s.PropTypes.bool,checkbox:s.PropTypes.bool,collapsible:s.PropTypes.bool,collapsed:s.PropTypes.bool,expandIconClass:s.PropTypes.string,collapseIconClass:s.PropTypes.string,checked:s.PropTypes.bool,label:s.PropTypes.string.isRequired,classNamePrefix:s.PropTypes.string,onClick:s.PropTypes.func,onCheckChange:s.PropTypes.func,onSelectChange:s.PropTypes.func,onCollapseChange:s.PropTypes.func,labelFilter:s.PropTypes.func,labelFactory:s.PropTypes.func,checkboxFactory:s.PropTypes.func},getInitialState:function(){return{}},getDefaultProps:function(){return{stateful:!1,collapsible:!0,collapsed:!1,checkbox:!1,onClick:function(e){console.log("Tree Node clicked: "+e.join(" > "))},onCheckChange:function(e){console.log("Tree Node indicating a checkbox check state should change: "+e.join(" > "))},onCollapseChange:function(e){console.log("Tree Node indicating collapse state should change: "+e.join(" > "))},checked:!1,expandIconClass:"",collapseIconClass:"",labelFactory:function(e,t){return s.createElement("label",{className:e},t)},checkboxFactory:function(e,t){return s.createElement("input",{className:e,type:"checkbox",checked:t,onChange:r})}}},_getCollapseNode:function(){var e=this.props,t=null;if(e.collapsible){var o=this._getRootCssClass()+"-collapse-toggle ",n=this._handleCollapseChange;e.children&&0!==e.children.length?o+=this._isCollapsed()?e.expandIconClass:e.collapseIconClass:(n=r,o+="collapse-spacer"),t=s.createElement("span",{onClick:n,className:o})}return t},render:function(){return s.createElement("div",{className:this._getRootCssClass()},this._getCollapseNode(),s.createElement("span",{onClick:this._handleClick},this._getCheckboxNode(),this._getLabelNode()),this._getChildrenNode())},componentWillReceiveProps:function(e){if(this._isStateful()){var t={};this.props.checked!==e.checked&&(t.checked=e.checked),this.setState(t)}},_getRootCssClass:function(){return this.props.classNamePrefix+"-node"},_getChildrenNode:function(){var e=this.props;if(this._isCollapsed())return null;var t=e.children;if(this._isStateful()){var o=this.state;t=s.Children.map(e.children,function(e){return s.cloneElement(e,{key:e.key,ref:e.ref,checked:o.checked})})}return s.createElement("div",{className:this._getRootCssClass()+"-children"},t)},_getLabelNode:function(){var e=this.props,t=e.classNamePrefix+"-node-label";this._isSelected()&&(t+=" selected");var o=e.label;return e.labelFilter&&(o=e.labelFilter(o)),this.props.labelFactory(t,o,this._getLineage())},_getCheckboxNode:function(){var e=this.props;return e.checkbox?this.props.checkboxFactory(e.classNamePrefix+"-node-checkbox",this._isChecked(),this._getLineage()):null},_isStateful:function(){return!!this.props.stateful},_isChecked:function(){return this._isStateful()&&"undefined"!=typeof this.state.checked?this.state.checked:this.props.checked},_isSelected:function(){return this._isStateful()&&"undefined"!=typeof this.state.selected?this.state.selected:this.props.selected},_isCollapsed:function(){return this._isStateful()&&"undefined"!=typeof this.state.collapsed?this.state.collapsed:!!this.props.collapsible&&this.props.collapsed},_handleClick:function(){return this.props.checkbox?this._handleCheckChange():this.props.onSelectChange?this._handleSelectChange():void this.props.onClick(this._getLineage())},_toggleNodeStateIfStateful:function(e){if(this._isStateful()){var t=!this.props[e];"undefined"!=typeof this.state[e]&&(t=!this.state[e]);var o={};o[e]=t,console.log(o),this.setState(o)}},_handleCheckChange:function(){this._toggleNodeStateIfStateful("checked"),this.props.onCheckChange(this._getLineage())},_handleSelectChange:function(){this._toggleNodeStateIfStateful("selected"),this.props.onSelectChange(this._getLineage())},_handleCollapseChange:function(){this._toggleNodeStateIfStateful("collapsed"),this.props.onCollapseChange(this._getLineage())},_getLineage:function(){return this.props.ancestor.concat(this.props.id)}});e.exports=a},function(e,t,o){"use strict";var s=o(1).pick,n=o(1).assign,r={getTreeNodeProps:function(e,t,o,r,a){return n({ancestor:o,onClick:e.onTreeNodeClick,onCheckChange:e.onTreeNodeCheckChange,onSelectChange:e.onTreeNodeSelectChange,onCollapseChange:e.onTreeNodeCollapseChange,id:this.getNodeId(e,t,a),key:"tree-node-"+o.join(".")+a},s(e,"classNamePrefix","collapseIconClass","expandIconClass","collapsible","stateful","labelFilter","checkboxFactory","labelFactory"))},getNodeId:function(e,t,o){return e.identifier&&t[e.identifier]?t[e.identifier]:o}};e.exports=r},function(e,t){e.exports=react},function(e,t){"use strict";var o={getNewTreeState:function(e,t,o,s){function n(e,t){e[o]=t;var s=e.children;s&&e.children.forEach(function(e,o){n(e,t)})}function r(a){a=a||t;var i=e.shift();return a.forEach(function(t,c){var l=s?a[c][s]:c;l===i&&(e.length?a[c].children=r(a[c].children):n(a[c],!a[c][o]))}),a}return r()}};e.exports=o},function(e,t){e.exports=invariant},function(e,t){e.exports=object-assign}]);
//# sourceMappingURL=bundle.js.map