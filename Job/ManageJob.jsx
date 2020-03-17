import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment, Card, Button} from 'semantic-ui-react';
import { CloseJob } from './CloseJob.jsx';
import moment from 'moment';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,
            closeOpen: false,
            title: "",
            summary: "",
            expiryDate: "",
            expiryStatus:"",
            noOfSuggestions: "", 
            sortBy: {
                date: "desc"
            },
            sortByOptions: "",
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            selectByFilter: "",
            activePage: 1,
            totalPages: 10,
            activeIndex: "",
            siblingRange: 1
            
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        this.updateWithoutSave = this.updateWithoutSave.bind(this);
        this.handleExpiry = this.handleExpiry.bind(this);
        this.selectOrder = this.selectOrder.bind(this);
        this.selectFilter = this.selectFilter.bind(this);
        this.pageChangeHandler = this.pageChangeHandler.bind(this);
        
        //your functions go here
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        //this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
        this.loadData(() =>            
            this.setState({ loaderData })            
        )
        loaderData.isLoading = false;
        //console.log(this.state.loaderData)
    }

    componentDidMount() {
        
        this.init();
       
    };

   

    loadData(callback) {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'https://talentservicestalent20200317021432.azurewebsites.net/listing/listing/getSortedEmployerJobs',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json' 
            },
            type: "GET",
            contentType: "application/json",
            data: {
                activePage: this.state.activePage,
                sortbyDate: this.state.sortBy.date,
                showActive: this.state.filter.showActive,
                showClosed: this.state.filter.showClosed,
                showDraft: this.state.filter.showDraft,
                showExpired: this.state.filter.showExpired,
                showUnexpired: this.state.filter.showUnexpired,
            },
            dataType: "json",
            success: function (res) {
                let jobsData = null;
                if (res.myJobs) {                    
                    jobsData = res.myJobs
                    //console.log("loadJobs", loadJobs)
                }
                this.updateWithoutSave(jobsData) 
            }.bind(this),
            error: function (res) {
                console.log(res.status)
            }
           
        })
        callback();
    }

    pageChangeHandler( event, data) {
        console.log(data);
        this.setState({
            activePage: data.activePage
        },            
        () => { this.init(); })

    }

    handleExpiry(expiryDate) {
        let expiry = expiryDate;
        let utcDate = new Date(moment.utc());
        if (expiry <= utcDate) {
            return 'Expired';
            }
        else {
            return 'UnExpired';
                }         
    }
    selectOrder(event, val){
        event.preventDefault();
        console.log(">>", val.value)
        this.setState({ sortBy: { date: val.value } }, () => { this.init();})
        
    }

    selectFilter(event, val) {
        event.preventDefault();
        console.log(">>", val.value)
        switch (val.value) {
            case "active":
                this.setState({
                    filter: {
                        showActive: true,
                        showClosed: false,
                        showExpired: true,
                        showUnexpired: true
                    }
                    
                },
                    () => { this.init(); }
                );

                break;
            case "closed":
                this.setState({
                    filter: {
                        showActive: false,
                        showClosed: true,
                        showExpired: true,
                        showUnexpired: true
                    }
                },
                    () => { this.init(); }
                );
                break;
                default:
                break;
        }
        
    }
        
    updateWithoutSave(newData) {
        let newSD = Object.assign([], newData)
        this.setState({
            loadJobs: newSD
        })
        console.log(this.state.loadJobs);
    }

    

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    

   
    render() {
        const { loadJobs, title, summary, closeOpen, noOfSuggestions, expiryDate, expiryStatus, activePage, siblingRange, totalPages } = this.state;
        const sortByOptions = [
            { key: "1" , text: "New to Old", value: "desc" },
            { key: "2",  text: "Old to New", value: "aesc" }
        ] 
        const selectByFilter = [
            { key: "1", text: "Show Active", value: "active" },
            { key: "2", text: "Show Closed ", value: "closed" },
        ]
       
        return (

            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <section className="page-body">
                    <div className="ui container">
                        <div className="ui container">
                            <h2 className="ui header">List of Jobs</h2>
                            <span>
                                <div className="ui grid" style={{ marginTop: '1em' }}>
                                    <i className="icon filter"></i> Filter : 
                                    
                                    <Dropdown
                                        text='Choose Filter'
                                        options={selectByFilter}
                                        onChange={this.selectFilter}
                                        simple item
                                    />
                                    
                                    <i className="icon calendar alternate"></i> Sort by Date
                                    <Dropdown
                                        text='Choose Order'
                                        options={sortByOptions}
                                        onChange={this.selectOrder}
                                        simple item
                                    />
                                  </div>
                            </span>
                            <span>
                                <div className="ui vertically divided grid" style={{ marginTop: '2em' }}>                                                                           
                                    <div className="three column row">
                                        {loadJobs.map(lj =>
                                        <div className="column">                                                
                                                <Card fluid>
                                                    <Card.Content key={lj.id}>
                                                        <a className="ui black right ribbon label" >
                                                            <i aria-hidden="true" class="user icon"></i>
                                                            {lj.noOfSuggestions}</a>
                                                        <Card.Header>{lj.title}</Card.Header>                                           
                                                        <Card.Description>
                                                            {lj.summary}
                                                        </Card.Description>
                                                    </Card.Content>
                                                    <Card.Content extra>
                                                        
                                                        <button className="ui red button">{this.handleExpiry(lj.expiryDate)}</button>
                                                        <Button.Group floated='right'>
                                                        <Button                                                           
                                                            basic color='blue'
                                                            content='Close'
                                                            compact
                                                            onClick={
                                                                () => {
                                                                    this.setState({ closeOpen: true })
                                                                }
                                                            }
                                                        />   
                                                        <CloseJob
                                                             key='modal1'
                                                             jobCloseId={lj.id}
                                                             closeOpen={this.state.closeOpen}
                                                             handleClose={
                                                                        () => {
                                                                            this.setState({ closeOpen: false })
                                                                        }
                                                                    }
                                                                />   
                                                        <Link to= {`/EditJob/${lj.id}`}>
                                                                <Button basic color='blue' compact>
                                                                <p>Edit</p>
                                                            </Button>
                                                        </Link>

                                                     </Button.Group>
                                                    </Card.Content>
                                                </Card>
                                                
                                            </div>
                                        )}
                                        </div>
                                </div>
                            </span>
                            <span>
                                <Pagination
                                    defaultActivePage={1}
                                    pointing
                                    secondary
                                    totalPages={totalPages}
                                    onPageChange={this.pageChangeHandler}
                                    siblingRange={siblingRange}

                                />
                            </span>
                        </div>
                    </div>
                </section>
            </BodyWrapper>
        )
    }
}
                                              