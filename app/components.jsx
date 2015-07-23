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

var socket = null;

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
  <PageHeader>DSC Alarm <small>Control Panel</small></PageHeader>
);

var KeyPad = React.createClass({
  btnClick: function(e) {
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
    var status = {};
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
      <Panel><div className="text-center">{this.state.status.message + " - " + this.state.status.zones}</div></Panel>
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