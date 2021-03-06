import React , {Component} from 'react'
import { listPosts } from '../graphql/queries'
import { API , graphqlOperation } from 'aws-amplify'
import DeletePost from './DeletePost'
import EditPost from './EditPost'
import { onCreatePost, onDeletePost, onUpdatePost, onCreateComment } from '../graphql/subscriptions'
import CreateComment from './CreateComment'
import CommentPost from './CommentPost'

class DisplayPost extends Component{
    
    state = {
        posts:[]
    }

    componentDidMount = async () =>{
        this.getPosts();
        this.createPostListener = API.graphql(graphqlOperation(onCreatePost)).subscribe({
            next: postData => {
                const newPost = postData.value.data.onCreatePost
                const prevPost = this.state.posts.filter( post => post.id !== newPost.id)
                const updateedPosts = [newPost,...prevPost]
                this.setState({posts:updateedPosts})
            }
        })

        this.deletePostListener = API.graphql(graphqlOperation(onDeletePost)).subscribe({
            next: postData => {
                const deletedPost = postData.value.data.onDeletePost
                const updatedPosts = this.state.posts.filter( post => post.id !== deletedPost.id)
                this.setState({posts:updatedPosts})
            }
        })

        this.updatePostListener = API.graphql(graphqlOperation(onUpdatePost)).subscribe({
            next: postData => {
                const { posts } =this.state
                const updatedPost = postData.value.data.onUpdatePost
                const index = posts.findIndex(post => post.id ===updatedPost.id)
                const updatePost = [...posts.slice(0,index),updatedPost,...posts.slice(index +1)]
                this.setState({posts: updatePost})
            }

           
        })

        this.createCommentListener = API.graphql(graphqlOperation(onCreateComment)).subscribe({
            next: commentData => {
                const createdComment = commentData.value.data.onCreateComment
                let posts = [ ...this.state.posts ]
                for(let post of posts){
                    if(createdComment.post.id === post.id){
                        post.comments.items.push(createdComment)
                    }
                }
                this.setState({ posts })
            } 
        })
    }
    
    componentWillUnmount() {
        this.createPostListener.unsubscribe();
        this.deletePostListener.unsubscribe();
        this.updatePostListener.unsubscribe();
        this.createCommentListener.unsubscribe();

    }

    getPosts = async ()=> {
        const result = await API.graphql(graphqlOperation(listPosts));
        this.setState({posts: result.data.listPosts.items})
    }
    render(){
        const { posts } = this.state
       
        return posts.map((post) => {
            return(
                <div className="posts" style={rowStyle} key={post.id}>
                    <h1>{post.postTitle}</h1>
                  
                    <span style={{fontStyle:"italic" ,color: "#0ca5e297"}}>
                        {"Wrote by: "}{post.postOwnerUsername}
                        {" on "}
                        <time style={{fontStyle:"italic"}}>
                            {" "}
                            { new Date(post.createdAt).toDateString() }
                        </time>
                    </span>

                    <p>{ post.postBody }</p>
                    <br/>
                    <span>
                        <DeletePost data={post}/>
                        <EditPost {...post}/>
                    </span>

                    <span>
                        <CreateComment postId={post.id}/>
                        {post.comments.items.length > 0 && <span style={{fontSize:"19px",color:"gary"}}>
                                Comments: </span>}
                                {
                                    post.comments.items.map((comment, index) => <CommentPost key={index} commentData={comment}/>)
                                }

                    </span>
                </div>

            )
        })
    }
}

const rowStyle = {
    background: '#f4f4f4',
    padding: '10px' ,
    border: '1px #ccc dotted',
    margin: '14px',
    
}

export default DisplayPost;