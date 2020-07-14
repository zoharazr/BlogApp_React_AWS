import React ,{Component} from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import {createPost} from '../graphql/mutations'

class CreatePost extends Component{
    
    state={
        postOwnerId:"",
        postOwnerUsername:"",
        postTitle:"",
        postBody:""
    }

    componentDidMount = async() => {

    }

    handleChangePost = event => this.setState({
        [event.target.name] : event.target.value
    })

    handelAddPost = async event => {
        event.preventDefault()

        const input = {
            postOwnerId:"pala898", //this.state.postOwnerId,
            postOwnerUsername: "poull",//this.state.postOwnerUsername,
            postTitle: this.state.postTitle,
            postBody: this.state.postBody,
            createdAt: new Date().toISOString()

        }
        await API.graphql(graphqlOperation(createPost, {input}))
        this.setState({postTitle:"",postBody:""})
    }

    render(){
        return(
            <form className="add-post" 
            onSubmit = {this.handelAddPost}>

                <input style={{font:'19px'}}
                type="text" placeholder="Title"
                name="postTitle"
                required
                value={this.state.postTitle}
                onChange={this.handleChangePost}/>

                <textarea
                type="text"
                name="postBody"
                rows="3"
                cols="40"
                required
                placeholder="New Blog Post"
                value={this.state.postBody}
                onChange={this.handleChangePost}/>

                <input type="submit"
                className="btn"
                style={{ fontSize:'19px'}}/>
                
            </form>
        )
    }
}

export default CreatePost;