import React , {Component} from 'react'
import { listPosts } from '../graphql/queries'
import { API , graphqlOperation } from 'aws-amplify'
import DeletePost from './DeletePost'
import EditPost from './EditPost'
import { onCreatePost, onDeletePost } from '../graphql/subscriptions'

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
                const updateedPosts = this.state.posts.filter( post => post.id !== deletedPost.id)
                this.setState({posts:updateedPosts})
            }
        })
        
    }
    componentWillUnmount() {
        this.createPostListener.unsubscribe();
        this.deletePostListener.unsubscribe();
    }

    getPosts = async ()=> {
        const result = await API.graphql(graphqlOperation(listPosts));
        this.setState({posts: result.data.listPosts.items})
        //console.log("All posts: ", JSON.stringify(result.data.listPosts.items))
        //console.log("All posts: ", result.data.listPosts.items);

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
                        <EditPost/>
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