import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import CancelIcon from "@material-ui/icons/Cancel";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import Snackbar from "@material-ui/core/Snackbar";
import PersonIcon from "@material-ui/icons/Person";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import styles from "./PlayerDialog.style";

const SUPPORTED_FILE_TYPES = ["image/png", "image/jpg", "image/jpeg"];
const MAX_FILE_SIZE = 3 * 1024 * 1024;

@withStyles(styles)
class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      player: props.player,
      message: "",
      isFileSizeInvalid: false,
      isFileTypeInvalid: false,
      isDialogClosingRequested: false,
      isUserInactivationRequested: false,
      isMessageVisible: false
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.open && this.props.open) {
      this.setState({ player: this.props.player });
    }
  }

  get isPlayerChanged() {
    return (
      this.props.player &&
      this.state.player &&
      (this.state.player.email !== this.props.player.email ||
        this.state.player.name !== this.props.player.name ||
        this.state.player.photoUrl !== this.props.player.photoUrl)
    );
  }

  handleChangeEmail = e => {
    const email = e.target.value;
    this.setState(state => ({
      player: { ...state.player, email }
    }));
  };

  handleChangeName = e => {
    const name = e.target.value;
    this.setState(state => ({
      player: { ...state.player, name }
    }));
  };

  handleChangeAvatar = e => {
    const [file] = e.target.files;

    if (file) {
      this.setState({
        isFileSizeInvalid: file.size > MAX_FILE_SIZE,
        isFileTypeInvalid: !SUPPORTED_FILE_TYPES.includes(file.type)
      });
    }
  };

  requestDialogClosing = () => {
    if (this.isPlayerChanged) {
      this.setState({ isDialogClosingRequested: true });
    } else {
      this.closeDialog();
    }
  };

  cancelDialogClosing = () => {
    this.setState({ isDialogClosingRequested: false });
  };

  closeDialog = () => {
    this.setState({
      isDialogClosingRequested: false,
      isFileSizeInvalid: false,
      isFileTypeInvalid: false
    });
    this.props.onClose();
  };

  requestUserInactivation = e => {
    this.setState({ isUserInactivationRequested: true });
  };

  cancelUserInactivation = () => {
    this.setState({ isUserInactivationRequested: false });
  };

  inactivateUser = () => {
    this.setState({ isUserInactivationRequested: false });
    // TODO: send request to server to make this player inactive
    this.showMessage("Player was successfully deactivated");
    this.closeDialog();
  };

  saveChanges = () => {
    // TODO: send request to server to update the data
    this.showMessage("Player information was successfully updated");
    this.closeDialog();
  };

  showMessage = message => {
    this.setState({ message, isMessageVisible: true });
  };

  closeMessage = () => {
    this.setState({ isMessageVisible: false });
  };

  render() {
    const { classes, open } = this.props;
    const {
      player,
      message,
      isFileSizeInvalid,
      isFileTypeInvalid
    } = this.state;
    return (
      <>
        <Dialog
          open={open}
          onClose={this.requestDialogClosing}
          className={classes.player}
          fullWidth={true}
          maxWidth="xs"
        >
          <DialogTitle>Edit player information</DialogTitle>
          {player && (
            <DialogContent className={classes.player__content}>
              <div className={classes.player__avatarContainer}>
                <Avatar
                  src={player.photoUrl}
                  className={classes.player__avatar}
                >
                  {!player.photoUrl && (
                    <PersonIcon className={classes.player__avatarIcon} />
                  )}
                </Avatar>
                <input
                  accept="image/jpg,image/png"
                  id="text-button-file"
                  type="file"
                  hidden
                  onChange={this.handleChangeAvatar}
                />
                <label htmlFor="text-button-file">
                  <Button
                    component="span"
                    className={classes.player__uploadButton}
                  >
                    Upload photo
                  </Button>
                </label>
                {isFileSizeInvalid ? (
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    color="secondary"
                  >
                    File size exceeds 3 Mb.
                  </Typography>
                ) : null}
                {isFileTypeInvalid ? (
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    color="secondary"
                  >
                    You can upload only .png or .jpg file.
                  </Typography>
                ) : null}
              </div>
              <TextField
                fullWidth
                label="Player name"
                value={player.name || ""}
                margin="normal"
                onChange={this.handleChangeName}
              />

              <TextField
                fullWidth
                color="secondary"
                label="E-mail"
                value={player.email || ""}
                margin="normal"
                onChange={this.handleChangeEmail}
                type="email"
              />
            </DialogContent>
          )}
          <DialogActions className={classes.player__buttonContainer}>
            <Button
              className={classes.player__inactivateButton}
              variant="outlined"
              color="secondary"
              startIcon={<CancelIcon />}
              onClick={this.requestUserInactivation}
            >
              Make player inactive
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={this.saveChanges}
              disabled={!this.isPlayerChanged}
            >
              Save
            </Button>
          </DialogActions>
          <ConfirmationDialog
            open={this.state.isDialogClosingRequested}
            handleClose={this.cancelDialogClosing}
            title="Close popup"
            contentText="Are you sure you want to close the popup? All changes will be lost."
            handleConfirm={this.closeDialog}
          />
          <ConfirmationDialog
            open={this.state.isUserInactivationRequested}
            handleClose={this.cancelUserInactivation}
            title="Make player inactive"
            contentText={`Are you sure you want to make player ${
              player ? player.name : ""
            } inactive?`}
            handleConfirm={this.inactivateUser}
          />
        </Dialog>
        <Snackbar
          open={this.state.isMessageVisible}
          autoHideDuration={3000}
          onClose={this.closeMessage}
          message={message}
        />
      </>
    );
  }
}

export default Player;
