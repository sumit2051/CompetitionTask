import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment, Card, Button, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export class CloseJob extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmitClose = this.handleSubmitClose.bind(this);
    }

    handleSubmitClose(event) {
        event.preventDefault();
        console.log(this.props.jobCloseId)

        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'https://talentservicestalent20200317021432.azurewebsites.net/listing/listing/closeJob',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(this.props.jobCloseId),
            type: "POST",
            contentType: "application/json",
           
            dataType: "json",
            success: function (res) {
                console.log("successfully closed");
               
            }.bind(this),
            error: function (res) {
                console.log(res.status)
            }

        })
        this.props.handleClose()
    }
       
    render() {
        
        return (

            <Modal
                open={this.props.closeOpen}
                closeOnEscape={true}
                closeOnRootNodeClick={true}
                size='small'
            >
                <Modal.Header>Close Job</Modal.Header>
                <Modal.Content>

                    <Form onSubmit={this.handleSubmitClose}>

                        <Form.Field >
                            <h3>Are you sure ?</h3>
                        </Form.Field>
                        <Form.Field hidden >
                            <label>Id</label>
                            <input
                                name='jobCloseId'
                                defaultValue={this.props.jobCloseId}
                                disabled />
                        </Form.Field>
                        <Form.Group floated='right'>
                        <Form.Field>
                            <Button onClick={this.props.handleClose} secondary >
                                Cancel
                        </Button>
                        </Form.Field>
                        <Form.Field>
                            <Button type="submit"
                                color='red'
                                labelPosition='right'
                                icon='delete'
                                content='Close'
                            />
                        </Form.Field>
                        </Form.Group>
                    </Form>
                </Modal.Content>
            </Modal>

        )
    }
}

CloseJob.propTypes = {
    closeOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    jobCloseId: PropTypes.string.isRequired
}



