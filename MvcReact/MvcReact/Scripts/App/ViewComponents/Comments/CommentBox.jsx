var request = require('superagent');
var CommentList = require('../../UIComponents/CommentList.jsx');
var CommentForm = require('../../UIComponents/CommentForm.jsx');

var CommentBox = React.createClass({
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
			<div className="commentBox">
				<h1>Comments</h1>
				<CommentList data={this.state.data}/>
				<CommentForm onCommentSubmit={this.handleCommentSubmit}/>
			</div>
			);
	}
});

module.exports = CommentBox;
