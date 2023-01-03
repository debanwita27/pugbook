import React from "react";
import UserContext from "../usercontext";

function CommentBox(props) {
	const { comments, setCommments } = props;
	const textRef = React.useRef(null);
	const { user } = React.useContext(UserContext);

	function addNewComment() {
		const comment = { userName: null, userComment: "", likes: 0, dislikes: 0 };
		comment.userName = user.id;
		comment.userComment = textRef.current.value;
		setCommments([comment, ...comments]);
		textRef.current.value = "";
	}

	return (
		<>
			<textarea ref={textRef} cols="100" placeholder="Comment here" />
			<br />
			<button className="button-primary" onClick={addNewComment}>
				Post
			</button>
		</>
	);
}

export default function Comments() {
	const [comments, setCommments] = React.useState([]);
	const { user } = React.useContext(UserContext);

	return (
		<>
			{user.isLoggedIn ? <CommentBox comments={comments} setCommments={setCommments} /> : null}

			<hr />
			<div className="commentList">
				{comments.map((comment, idx) => (
					<div className="comment" key={idx}>
						<div className="commentUser">{comment.userName}</div>
						<div className="commentPost">{comment.userComment}</div>
						{/* {comment.likes}
						{comment.dislikes} */}
					</div>
				))}
			</div>
		</>
	);
}
