import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import Brightness2Icon from '@material-ui/icons/Brightness2';
import Brightness2OutlinedIcon from '@material-ui/icons/Brightness2Outlined';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    top: 0,
    bottom: 'auto',
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  },
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbarTitle: {
    flex: 1,
  },
  toolbarSecondary: {
    justifyContent: 'space-between',
    overflowX: 'auto',
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
}));



export default function Header(props) {
  const classes = useStyles();
  const theme = useTheme();
  const { sections, title, app } = props;
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  
  const handleDrawerClose = () => {
    setOpen(false);
  };

  // const getView = (app, title)  => {
  //   console.log("what the fk");
  //     console.log(title);
  //   // const url = null;
  //   if (title === 'Profile'){
  //     url = '/api/view/profile';
  //   }
  //   if (title === 'Game'){
  //     url = '/api/view/game';
  //   }
  //   fetch(url, {
  //     method: "GET",
  //     dataType: "JSON",
  //     headers: {
  //       "Content-Type": "application/json; charset=utf-8",
  //     }
  //   })
  //   .then((resp) => {
  //     if  (resp.status === 200){
  //       app.setState({page: title});
  //     }
  //     console.log(resp.status);
  //     return resp.json()
  //   }) 
  //   .catch((error) => {
  //     console.log(error, "catch the hoop")
  //   })
  // };

  var localTheme = window.localStorage.getItem('theme');
  var checked = localTheme ? (localTheme === 'dark' ? true : false) : true;
  return (
    <React.Fragment>
      <AppBar position="fixed" color="default" className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}>
      <Toolbar className={classes.toolbar}>
        <Typography
          component="h2"
          variant="h5"
          color="primary"
          align="left"
          noWrap
          className={classes.toolbarTitle}
        >
          {title}
        </Typography>
       
        <Switch
          checked={checked}
          onChange={app.toggleTheme}
          color="primary"
        />
        {checked? <Brightness2Icon color="primary"></ Brightness2Icon> : 
            <Brightness2OutlinedIcon color="primary"></ Brightness2OutlinedIcon>}
        {sections !== null ? <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
       
            onClick={handleDrawerOpen}
            className={clsx(open && classes.hide)}
          >
            <MenuIcon fontSize="large"/>
          </IconButton> : null}
      </Toolbar>
      </AppBar>
      {sections !== null ? 
      <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="right"
      open={open}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      {/* app.setState({page: section.title} */}
      <div className={classes.drawerHeader}>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </div>
      <Divider />
      <List>
        {sections.map((section) => (
          <ListItem button selected={section.title===app.state.page ? true : false} component="a" key={section.title} onClick={() => {app.setState({page: section.title})}}>
            <ListItemText primary={section.title} />
          </ListItem>
        ))}
        
      </List>
    </Drawer> : null}
      
      <Toolbar />
      
    </React.Fragment>
  );
}

Header.propTypes = {
  sections: PropTypes.array,
  title: PropTypes.string,
};