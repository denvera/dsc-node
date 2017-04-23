// import 'react';
var ReactDOM = require('react-dom');
var React = require('react');
var _ = require('lodash');

var PageHeader = require('react-bootstrap/lib/PageHeader');
var ButtonGroup = require('react-bootstrap/lib/ButtonGroup');
var DropdownButton = require('react-bootstrap/lib/DropdownButton');
var MenuItem = require('react-bootstrap/lib/MenuItem');
var Button = require('react-bootstrap/lib/Button');
var Grid = require('react-bootstrap/lib/Grid');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');
var Table = require('react-bootstrap/lib/Table');
var Panel = require('react-bootstrap/lib/Panel');
var Nav = require('react-bootstrap/lib/Nav');
var NavItem = require('react-bootstrap/lib/NavItem');
var Navbar = require('react-bootstrap/lib/Navbar');
var Modal = require('react-bootstrap/lib/Modal');
var FormControl = require('react-bootstrap/lib/FormControl');

var socket = null;

function qbeep() {
    (new
      Audio(
      "data:audio/wav;base64,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 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU="
      )).play();
}

var StatusButtons = React.createClass({
    getInitialState: function () {
        var leds = {};
        return ({ leds: leds });
    },
    componentDidMount: function () {
        this.socket = io();
        this.socket.on('leds', function (leds) {
            var newleds = {};
            newleds.ready = (leds & 0x01) ? "success" : "default";
            newleds.armed = (leds & 0x02) ? "danger" : "default";
            newleds.memory = (leds & 0x04) ? "warning" : "default";
            newleds.bypass = (leds & 0x08) ? "info" : "default";
            newleds.trouble = (leds & 0x10) ? "warning" : "default";
            newleds.program = (leds & 0x20) ? "danger" : "default";
            this.setState({ leds: newleds });
        }.bind(this));
    },
    componentWillUnmount: function() {
        this.job = {};
        this.socket.removeAllListeners('leds');
    },
    render: function () {
        return (
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

const NavHeader = React.createClass({
    getInitialState: function () {
        return ({ activeKey: 1 });
    },
    handleSelect: function (selectedKey) {
        this.setState({
            activeKey: selectedKey
        });
        switch (selectedKey) {
            case 1:
                ReactDOM.render(StatusPage, document.getElementById('main'));
                break;
            case 2:
                console.log('Events');
                break;
            case 3:
                console.log('Nav: ' + selectedKey);
                ReactDOM.render(
                    <Events />
                    ,document.getElementById('main')
                );
                break;
            case 4:
                ReactDOM.render(SettingsPage, document.getElementById('main'));
        }
    },
    render: function () {
      return (
        <Navbar>
        <Navbar.Header>
            <Navbar.Brand>
                <a href='#'>DSC Control Panel</a>
            </Navbar.Brand>
        </Navbar.Header>
      <Nav activeKey={this.state.activeKey} onSelect={this.handleSelect} bsStyle='tabs'>
       <NavItem eventKey={1} href='#'>KeyPad</NavItem>
       <NavItem eventKey={3} href='#'>KeyBus Messages</NavItem>
       <NavItem eventKey={4} href='#'>Settings</NavItem>
      </Nav>
      </Navbar>);
    }
});

var KeyPad = React.createClass({
    componentDidMount: function () {
        this.socket = io();
        this.socket.on('beep', this.beep);
    },
    btnClick: function (e) {
        qbeep();
        console.log('Click ' + e.target.innerHTML);
        this.socket.emit('key', e.target.innerHTML);

    },
    beep: function (beepInfo) {
        console.log('Beep: long: ' + beep.long + ' count: ' + beep.count);
        if (beep.long) {
            for (var i = 0; i < 10; i++) {
                qbeep();
            }
        } else {
            var i = 0;
            var bcnt = beeps.count;
            function beeps() {
                qbeep();
                if (i++ < bcnt) {
                    setTimeout(arguments.callee, 100);
                }
            }
            setTimeout(beeps, 100);
        }
    },
    render: function () {
      return (
      <Table>
          <tbody>
          <tr><td><Button onClick={this.btnClick}>1</Button></td><td><Button onClick={this.btnClick}>2</Button></td><td><Button onClick={this.btnClick}>3</Button></td><td className="text-left"><Button style={{width:150}} onClick={this.btnClick}>Stay</Button></td></tr>
          <tr><td><Button onClick={this.btnClick}>4</Button></td><td><Button onClick={this.btnClick}>5</Button></td><td><Button onClick={this.btnClick}>6</Button></td><td className="text-left"><Button style={{width:150}} onClick={this.btnClick}>Away</Button></td></tr>
          <tr><td><Button onClick={this.btnClick}>7</Button></td><td><Button onClick={this.btnClick}>8</Button></td><td><Button onClick={this.btnClick}>9</Button></td><td className="text-left"><Button style={{width:150}} disabled>Exit</Button></td></tr>
          <tr><td><Button onClick={this.btnClick}>*</Button></td><td><Button onClick={this.btnClick}>0</Button></td><td><Button onClick={this.btnClick}>#</Button></td><td className="text-left"><Button style={{width:150}} disabled>Reset</Button></td></tr>
          <tr><td><Button onClick={this.btnClick}>F</Button></td><td><Button onClick={this.btnClick}>A</Button></td><td><Button onClick={this.btnClick}>P</Button></td><td className="text-left"><Button style={{width:150}} onClick={this.btnClick}>Chime</Button></td></tr>
          </tbody>
      </Table>
     );
    }
});

var Status = React.createClass({
    getInitialState: function () {
        var status = {
            message: "",
        };
        return { status: status };
    },
    componentDidMount: function () {
        this.socket = io();
        this.socket.emit('poke', 'status');
        this.socket.on('status', function (status) {
            var newstatus = this.state.status;
            if (status.msgText != undefined) {
                newstatus.message = status.msgText;
                console.log('Msg: ' + status.msgText);
            }
            if (status.zones != undefined) {
                newstatus.zones = status.zones;
                console.log('Zones: ' + status.zones);
            }

            this.setState({ status: newstatus });
        }.bind(this));
    },
    componentWillUnmount: function() {
        this.job = {};
        this.socket.removeAllListeners('status');
    },
    render: function () {
        return (
      <Panel><div className="text-center">{this.state.status.message + ((this.state.status.zones != undefined) ? " - " + this.state.status.zones : "")}</div></Panel>
    );
    }
});

var Events = React.createClass({
    getInitialState: function () {
        return { events: [] };
    },
    componentDidMount: function () {
        this.socket = io();
        this.socket.on('event', function (event) {
            console.log('New Event: ' + event);
            //this.state.events.unshift(event);
            this.state.events.push(event);
            if (this.state.events.length > 100) {
                this.state.events.shift();
            }
            this.setState({ events: this.state.events });
        }.bind(this));
    },
    componentWillUnmount: function() {
        this.job = {};
        this.socket.removeAllListeners('event');
    },
    render: function () {
        var rows = [];
        _.forEachRight(this.state.events, function (e, i) {
            rows.push(<tr><td>{i}</td><td>{e.time}</td><td>{e.type}: 0x{e.cmd.toString(16)}</td><td>{e.body}</td></tr>);
        });
        return (<Table responsive>
            <thead>
                <tr><th>#</th><th>Time</th><th>Type</th><th>Content</th></tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </Table>);
    }
});

var StatusPage = (<Grid>
    <Row className='status'>
    <Col xs={4} md={4}></Col>
    <Col xs={4} md={4}><Status /></Col>
    </Row>
    <Row className='buttons'>
  	 <Col xs={12} md={12}><div className="text-center"><StatusButtons /></div></Col>
    </Row>
    <Row><br /></Row>
    <Row>
    <Col xs={4} md={4}></Col>
    <Col xs={4} md={4}><div className="text-center"><KeyPad></KeyPad></div></Col>
    </Row>
    <Row>
        {/* <Col xs={12} md={12}><Events/></Col> */}
    </Row>
</Grid>);

var BasicConfirm = React.createClass({
    getInitialState() {
        return ({ showModal: true });
    },
    open() {
        this.setState({ showModal: true });
    },
    close() {
        this.setState({ showModal: false });
    },
    render() {
        return (<Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton><Modal.Title>{this.props.title}</Modal.Title></Modal.Header>
          <Modal.Body>
            <p>{this.props.body}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.onConfirm} bsStyle='danger'>{this.props.confirmText}</Button>
            <Button onClick={this.props.onClose}>Close</Button>
          </Modal.Footer>
        </Modal>);
    }
});

var Upgrade = React.createClass({
    componentDidMount() {
        this.socket = io();
    },
    getInitialState() {
        return ({ showModal: false });
    },
    open() {
        this.setState({ showModal: true });
    },
    close() {
        this.setState({ showModal: false });
    },
    upgrade() {
        this.socket.emit('upgrade', 'now');
        this.setState({ showModal: false });
    },
    render: function () {
        return (
        <div>
        <Button onClick={this.open} bsStyle='danger'>Upgrade DSC Gateway Firmware</Button>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton><Modal.Title>Upgrade DSC Gateway Firmware?</Modal.Title></Modal.Header>
          <Modal.Body>
            <p>This will trigger a firmware update which may brick the device</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.upgrade} bsStyle='danger'>Upgrade Firmware</Button>
            <Button onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
        </div>
      );
    }
});

var Scheduler = React.createClass({
    getInitialState: function () {
        return ({ jobs: [] });
    },
    componentDidMount: function () {
        this.socket = io();
        this.socket.on('jobs', function (jobs) {
            this.setState({ jobs: jobs });
        }.bind(this));
        this.socket.emit('poke', 'jobs');
    },
    componentWillUnmount: function() {
        this.job = {};
        this.socket.removeAllListeners('jobs');
    },
    onSubmit: function (e) {
        e.preventDefault();
        console.log("Trying to add: spec: " + this.textschedule.value + " name: ")
        var job = {
            spec: this.textschedule.value,
            name: this.jobname.value,
            action: this.action.value
        };
        this.socket.emit('addjob', job,
                       function (success) {
                           if (success) {
                               var jobs = this.state.jobs;
                               jobs.push(job);
                               this.setState({ jobs: jobs });
                               console.log('Added job!');
                               this.setState({ jobs: jobs });
                           } else {
                               console.log('Error adding job: ' + job + '!');
                           }
                       }.bind(this));
    },
    confirmDelete: function (i, e) {
        console.log('Remove job index ' + i);
        this.socket.emit('deljob', i);
        var jobs = this.state.jobs;
        _.pullAt(jobs, i);
        this.setState({ jobs: jobs, modal: null });
    },
    closeModal: function () {
        console.log('Close modal');
        this.setState({ modal: null });
    },
    confirm(i, e) {
        var oc = function () { this.confirmDelete(i, e); }.bind(this);
        var modal = <BasicConfirm title="Delete scheduled job?" confirmText="Delete Job" body="Delete the scheduled job?" onConfirm={oc} onClose={this.closeModal} />
        this.setState({ modal: modal });
    },
    render: function () {
        var i = 0;
        var jobs = _.map(this.state.jobs, function (j) {
            return (<tr key={i }><td>{i}</td><td>{j.spec}</td><td>{j.name}</td><td>{j.action}</td><td><Button onClick={this.confirm.bind(this, i)} key={i++} bsSize='small' bsStyle='danger'>Delete</Button></td></tr>);
        }.bind(this));
        var modal = this.state.modal ? this.state.modal : "";
        return (
      <div>
      <form>
      <Table>
      <tbody>
          <tr>
            <td><FormControl type='text' placeholder='Enter schedule' inputRef={(textschedule) => this.textschedule = textschedule} label='Enter schedule as text' /></td>
            <td><FormControl type='text' placeholder='Enter job name' inputRef={(jobname) => this.jobname = jobname} label='Enter job name' /></td>
            <td>
            <FormControl componentClass='select' label='Action' placeholder='action' inputRef={(action) => this.action = action}>
              <option value='arm'>Arm</option>
              <option value='stay'>Stay</option>
              <option value='disarm'>Disarm</option>
            </FormControl>
            </td>
          </tr>
      </tbody>
      </Table>
      <div>
      <pre>
      *    *    *    *    *    *<br />
┬    ┬    ┬    ┬    ┬    ┬<br />
│    │    │    │    │    |<br />
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)<br />
│    │    │    │    └───── month (1 - 12)<br />
│    │    │    └────────── day of month (1 - 31)<br />
│    │    └─────────────── hour (0 - 23)<br />
│    └──────────────────── minute (0 - 59)<br />
└───────────────────────── second (0 - 59, optional)<br />
      </pre>
      </div>
      <Button type='submit' onClick={this.onSubmit}>Add Scheduled Event</Button>
      </form>
      <Table>
        <thead><tr><th>#</th><th>Schedule</th><th>Name</th><th>Action</th><th>Delete</th></tr></thead>
        <tbody>
            {jobs}
        </tbody>
      </Table>
          {modal}
      </div>
    );
    }
});

var SettingsPage = (
    <Grid>
      <Row className='upgrade-row'>
        <Col xs={12} md={12}><Upgrade /></Col>
      </Row>
      <Row><br /></Row>
      <Row className='scheduler-row'>
        <Col xs={12} md={12}><Scheduler /></Col>
      </Row>
    </Grid>);


ReactDOM.render(<NavHeader />, header);
ReactDOM.render(StatusPage, document.getElementById('main'));
