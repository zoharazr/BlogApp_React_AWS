import React ,{Component} from 'react'
import { API, graphqlOperation, Auth } from 'aws-amplify'
import { createComment } from '../graphql/mutations'


class CreateComment extends Component{

    state = { 
        commentOwnerId:"",
        commentOwnerUsername: "",
        content: "",
    }

    componentWillMount = async () => {
        await Auth.currentUserInfo()
            .then(user => {
                this.setState({
                    commentOwnerId:user.attributes.sub,
                    commentOwnerUsername:user.username
                })
            })
    }

    handleChangeContent = event => this.setState({content:event.target.value})

    handleAddComment = async event => {
        event.preventDefault()

        const input ={ 
            commentPostId: this.props.PostId,
            commentOwnerId:this.state.commentOwnerId,
            commentOwnerUsername:this.state.commentOwnerUsername,
            content: this.state.content,
            createdAt:new Date().toISOString()
        }
        await API.graphql(graphqlOperation(createComment,{input}))

        this.setState({content: ""})
        
    }
  
    render(){
        return (
            <div>
                <form className="add-comment" 
                    onSubmit ={this.handleAddComment}>
                    <textarea
                    type="text"
                    name= "content"
                    rows="3"
                    cols="40"
                    required
                    placeholder="add Your Comment..."
                    value= {this.state.content}
                    onChange={this.handleChangeContent}
                    />

                    <input
                    className="btn"
                    type="submit"
                    style={{fontSize:"19px"}}
                    value="Add Comment"
                    />


                </form>
            </div>
        )

        }
}

export default CreateComment;