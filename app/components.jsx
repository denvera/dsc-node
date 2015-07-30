var rb = ReactBootstrap;
var PageHeader = ReactBootstrap.PageHeader;
var ButtonGroup = ReactBootstrap.ButtonGroup;
var DropdownButton = ReactBootstrap.DropdownButton;
var MenuItem = ReactBootstrap.MenuItem;
var Button = ReactBootstrap.Button;
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Table = rb.Table;
var Panel = rb.Panel;
var Nav = rb.Nav;
var NavItem = rb.NavItem;
var Navbar = rb.Navbar;

var socket = null;
var beep = new Audio("beep-07.wav");

function qbeep() {
  (new
	Audio(
	"data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+ Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ 0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7 FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb//////////////////////////// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU="
	)).play();
}

var StatusButtons = React.createClass({
  getInitialState: function() {
    leds = {};
    return ({ leds: leds });
  },
  componentDidMount: function() {
    socket.on('leds', function(leds) {
      var newleds = {};
      newleds.ready = (leds & 0x01) ? "success" : "default";
      newleds.armed = (leds & 0x02) ? "danger" : "default";
      newleds.memory =(leds & 0x04) ? "warning" : "default";
      newleds.bypass =(leds & 0x08) ? "info" : "default";
      newleds.trouble=(leds & 0x10) ? "warning" : "default";
      newleds.program=(leds & 0x20) ? "danger" : "default";
      this.setState({leds: newleds});
    }.bind(this) );
  },
  render: function() {
    return(
      <ButtonGroup>
        <Button bsStyle={this.state.leds.ready}>Ready</Button>        
        <Button bsStyle={this.state.leds.armed}>Arm</Button>
        <Button bsStyle={this.state.leds.memory}>Memory</Button>
        <Button bsStyle={this.state.leds.bypass}>Bypass</Button>
        <Button bsStyle={this.state.leds.trouble}>Trouble</Button>                
        <Button bsStyle={this.state.leds.program}>Program</Button>
      </ButtonGroup>
    );
  }
  
});

const pageHeaderInstance = (
   //<PageHeader>DSC Alarm <small>Control Panel</small></PageHeader>
    <Navbar brand='DSC Control Panel'>
    <Nav>
     <NavItem eventKey={1} href='#'>KeyPad</NavItem>
     <NavItem eventKey={2} href='#'>Events</NavItem>
    </Nav>
    </Navbar>
);

var KeyPad = React.createClass({
  btnClick: function(e) {
    ///beep.pause();
    //beep.currentTime = 0;
    //beep.play();
    qbeep();
    console.log('Click ' + e.target.innerHTML);
    socket.emit('key', e.target.innerHTML);
    
  },
  render: function() {
 /*   var children = React.Children.map(this.props.children, function(c) {
    console.log(c.type);
      if (c.type == ReactBootstrap.Button.type) {
        var handleClick = this.handleClick;
        return React.cloneElement(c, { onClick: handleClick });
      } else {
        return c;
      }      
    }.bind(this));
   */ 
    return(
      <Table>            
      <tr><td><Button onClick={this.btnClick}>1</Button></td><td><Button onClick={this.btnClick}>2</Button></td><td><Button onClick={this.btnClick}>3</Button></td><td className="text-left"><Button onClick={this.btnClick}>Stay</Button></td></tr>
      <tr><td><Button onClick={this.btnClick}>4</Button></td><td><Button onClick={this.btnClick}>5</Button></td><td><Button onClick={this.btnClick}>6</Button></td><td className="text-left"><Button onClick={this.btnClick}>Away</Button></td></tr>
      <tr><td><Button onClick={this.btnClick}>7</Button></td><td><Button onClick={this.btnClick}>8</Button></td><td><Button onClick={this.btnClick}>9</Button></td><td className="text-left"><Button disabled>Exit</Button></td></tr>
      <tr><td><Button onClick={this.btnClick}>*</Button></td><td><Button onClick={this.btnClick}>0</Button></td><td><Button onClick={this.btnClick}>#</Button></td><td className="text-left"><Button disabled>Reset</Button></td></tr>
      <tr><td><Button onClick={this.btnClick}>F</Button></td><td><Button onClick={this.btnClick}>A</Button></td><td><Button onClick={this.btnClick}>P</Button></td><td className="text-left"><Button disabled>Chime</Button></td></tr>      
      </Table>
     );
   }
});

var Status = React.createClass({
  getInitialState: function() {
    var status = {
      message: "",
    };
    return {status: status }; 
  },
  componentDidMount: function() {
    socket.on('status', function(status) {
      var newstatus = this.state.status;
      if (status.msgText != undefined) { 
        newstatus.message = status.msgText; 
        console.log('Msg: ' + status.msgText); 
      }
      if (status.zones != undefined) { 
        newstatus.zones = status.zones;
        console.log('Zones: ' + status.zones); 
      }
             
      this.setState({status : newstatus});
    }.bind(this) );
  },
  render: function() {
    return (
      <Panel><div className="text-center">{this.state.status.message + ((this.state.status.zones != undefined) ? " - " + this.state.status.zones : "")}</div></Panel>
    );
  }
});

function setSocket(sock) {
  socket = sock;
 
  React.render(pageHeaderInstance, header);
  
  React.render(			
    <Grid>
    <Row className='status'>
    <Col xs={4} md={4}></Col> 
    <Col xs={4} md={4}><Status/></Col>
    </Row>
    <Row className='buttons'>
  	 <Col xs={12} md={12}><div className="text-center"><StatusButtons/></div></Col>
    </Row>
    <Row><br/></Row>
    <Row>
    <Col xs={4} md={4}></Col>  
    <Col xs={4} md={4}><div className="text-center"><KeyPad></KeyPad></div></Col>
    </Row>
    </Grid>
  	,
  	document.getElementById('example')
  );

}
exports.setSocket = setSocket;