require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"CommentBoxTest2":[function(require,module,exports){
var request = require('superagent');
var CommentList = require('../../UIComponents/CommentList.jsx');
var CommentForm = require('../../UIComponents/CommentForm.jsx');

var CommentBoxTest2 = React.createClass({displayName: "CommentBoxTest2",
	loadCommentsFromServer: function() {
		request
			.get('/comments')
			.end( function( res )
			{
				if( res.ok ) {
					var data = res.body;
					this.setState({ data: data });
				}
			}.bind(this));
	},	
	handleCommentSubmit: function(comment) {
		var comments = this.state.data;
		var newComments = comments.concat([comment]);
		this.setState({data: newComments});

	    request
	    	.post(this.props.submitUrl)
	    	.send({author: comment.author, text: comment.text })
	    	.end( function(err, res){
	    		this.loadCommentsFromServer();
	    	}.bind(this));
	},
	getInitialState: function() {
		return {
			data: this.props.initialData
		};
	},
	componentDidMount: function() {
		this.loadCommentsFromServer();
		window.setInterval(this.loadCommentsFromServer, this.props.pollInterval);
	},
	render: function() {
		return (
			React.createElement("div", {className: "commentBox"}, 
				React.createElement("h1", null, "Comments"), 
				React.createElement(CommentList, {data: this.state.data}), 
				React.createElement(CommentForm, {onCommentSubmit: this.handleCommentSubmit})
			)
			);
	}
});

module.exports = CommentBoxTest2;
},{"../../UIComponents/CommentForm.jsx":2,"../../UIComponents/CommentList.jsx":3,"superagent":"superagent"}],1:[function(require,module,exports){
var markdown = require('markdown').markdown;
var Comment = React.createClass({displayName: "Comment",

	render: function(test) {
		var rawMarkup = markdown.toHTML(this.props.children.toString());
		return (
			React.createElement("div", {className: "comment"}, 
				React.createElement("h2", {className: "commentAuthor"}, this.props.author), 
				React.createElement("span", {dangerouslySetInnerHTML: {__html: rawMarkup}})
			)
			);
	}

});

module.exports = Comment;
},{"markdown":"markdown"}],2:[function(require,module,exports){
var CommentForm = React.createClass({displayName: "CommentForm",

	handleSubmit: function(e) {
		e.preventDefault();
		var author = this.refs.author.getDOMNode().value.trim();
		var text = this.refs.text.getDOMNode().value.trim();
		if (!text || !author) {
		  return;
		}
		this.props.onCommentSubmit({author: author, text: text});
		this.refs.author.getDOMNode().value = '';
		this.refs.text.getDOMNode().value = '';
		return;
	},

	render: function() {
		return (
			React.createElement("form", {className: "commentForm", onSubmit: this.handleSubmit}, 
				React.createElement("input", {type: "text", placeholder: "Your name", ref: "author"}), 
				React.createElement("input", {type: "text", placeholder: "Say something...", ref: "text"}), 
				React.createElement("input", {type: "submit", value: "Post"})
			)
			);
	}
});

module.exports = CommentForm;
},{}],3:[function(require,module,exports){
var Comment = require('./Comment.jsx');
var CommentList = React.createClass({displayName: "CommentList",

	render: function() {
		var commentNodes = this.props.data.map(function (comment){
			return (
				React.createElement(Comment, {author: comment.Author}, 
					comment.Text
				)
				);
			});
			return (
				React.createElement("div", {className: "commentList"}, 
					commentNodes
				)
				);
		}
});


module.exports = CommentList;
},{"./Comment.jsx":1}]},{},[]);
var CommentBoxTest2 = React.createFactory(require("CommentBoxTest2"));
