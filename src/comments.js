const {
  Comment,
  Input,
  Button,
  Divider,
  Icon,
  TextArea,
  Form,
  Loader,
  Segment
} = semanticUIReact;

//Initiate the OpenMedia plugin library
const WpLib = OMWebPluginLib;
const builder = WpLib.Plugin.SamePageBuilder.create(); //.onNotify(onClientNotify)
const plugin = WpLib.Plugin.createPlugin(builder);

//TODO: read source and target fields from settings file
const commentsFieldId = 304;

class CommentsSection extends React.Component {
  constructor(props) {
    super(props);
    this.handleOnInput = this.handleOnInput.bind(this);
    this.handleAddComment = this.handleAddComment.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.getUserName = this.getUserName.bind(this);
    this.getUserAvatar = this.getUserAvatar.bind(this);
    this.state = {
		isLoading: true,
      textAreaValue: "",
      comments: {
        total: 0,
        commentshistory: []
      }
    };
  }

  componentDidMount() {
    //We load the Comments from the header field of the document
    const api = plugin.getApi();
    api.getCurrentDocumentId().then((docId) => {
      const fieldIds = [{ id: commentsFieldId }];
      api.getFields(docId, fieldIds).then((fields) => {
        this.setState({
          comments: JSON.parse(fields[0].value)
        });
      });
    });
  }

  handleAddComment(e) {
    var today = new Date();
    //TODO: Just in case there are updates by another user, reload comments from Server
    var newCommentList = this.state.comments;

    var newComment = {
      user: "10006",
      timestamp: today.getTime(),
      text: this.state.textAreaValue
    };

    //TODO: In this order, set fields "Last comment by, Last Comment at,, Comments
    //TODO: Update comments and empty field only if all set fields above where successfull
    newCommentList.commentshistory.push(newComment);
    newCommentList.total += 1;
    this.setState({
      // comments: newCommentList,
      comments: newCommentList,
      textAreaValue: ""
    });
    //TODO update current window size
  }

  handleCancel(e) {
    this.setState({
      textAreaValue: ""
    });
  }

  handleOnInput(e, { value }) {
    console.log(value);
    this.setState({
      textAreaValue: value
    });
  }

  getUserName(userID) {
    if (userID == "10000") {
      return "Matt";
    }
    if (userID == "10002") {
      return "Sylvia";
    }
    //fallback: display the user's ID
    return userID;
  }
  getUserAvatar(userID) {
    if (userID == "10000") {
      return "https://react.semantic-ui.com//assets/images/avatar/small/matt.jpg";
    }
    if (userID == "10002") {
      return "https://react.semantic-ui.com/assets/images/avatar/small/jenny.jpg";
    }
    //fallback: default image
    //TODO: store image in the src files
    return "https://react.semantic-ui.com/assets/images/avatar/small/joe.jpg";
  }
  render() {
    return (
      <Segment basic>
        {/*
            //TODO: Only show the last X comments
      
            <Divider horizontal>
                <Button content=" 16 older " />
              </Divider>
            */}

        <Comment.Group>
          {this.state.comments.total == 0 ? (
            <div />
          ) : (
            this.state.comments.commentshistory.map((item) => (
              <Comment>
                <Comment.Avatar src={this.getUserAvatar(item.user)} />
                <Comment.Content>
                  <Comment.Author as="a">
                    {this.getUserName(item.user)}
                  </Comment.Author>
                  <Comment.Metadata>
                    {/*
											TODO: import javascript timeago
											<TimeAgo date={item.timestamp} minPeriod={60} />*/}
                    {item.timestamp}
                  </Comment.Metadata>
                  <Comment.Text>{item.text}</Comment.Text>
                  {/*
                         TODO: manage threaded comments
                          <Comment.Actions>
                            <Comment.Action>Reply</Comment.Action>
                          </Comment.Actions>
                          */}
                </Comment.Content>
              </Comment>
            ))
          )}
        </Comment.Group>

        <Form reply>
          <Form.TextArea
            autoHeight
            placeholder="Write your comment here"
            onInput={this.handleOnInput}
            value={this.state.textAreaValue}
          />
          <Button
            onClick={this.handleAddComment}
            style={{ float: "right" }}
            content="Add Comment"
            disabled={this.state.textAreaValue.length > 0 ? false : true}
            labelPosition="left"
            icon="edit"
            primary
          />
          <Button 
		  onClick={this.handleCancel}
		  style={{ float: "right" }} 
		  content="Cancel" />
        </Form>
        <br />
        <br />
      </Segment>
    );
  }
}
