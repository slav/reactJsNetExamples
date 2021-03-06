﻿var markdown = require('markdown').markdown;
var Comment = React.createClass({

	render: function(test) {
		var rawMarkup = markdown.toHTML(this.props.children.toString());
		return (
			<div className="comment">
				<h2 className="commentAuthor">{this.props.author}</h2>
				<span dangerouslySetInnerHTML={{__html: rawMarkup}} />
			</div>
			);
	}

});

module.exports = Comment;