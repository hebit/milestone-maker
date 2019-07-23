import React, {Component} from 'react';
import axios from 'axios';
import moment from 'moment';
import './App.css';
import Box from './componets/box';
import glLogo from './gitlab_logo.png';

class App extends Component {
  state = {
    dates: []
  }

  settings = {
    acessKey: 'PBpuVdjxc8dTgbUCkzVz',
    groupId: '4521828',
    sprint_days: 14
  }

  async componentDidMount(){
    if(this.state.dates.length === 0){
        let first_date = await this.getDatesFromGitlab()
        let dates = []
        for(let i = 0; i < 3; i++){
          dates.push(first_date.clone().add({days: this.settings.sprint_days * i }))
        }
        this.setState({dates})
    }
  }

  getDatesFromGitlab = async () => {
    const { acessKey, groupId } = this.settings
    let res = await axios.get(`https://gitlab.com/api/v4/groups/${groupId}/milestones?private_token=${acessKey}`)
    let data = res.data.map(item => item.due_date).sort()
    let last_date = data[data.length - 1]
    let   first_date = moment(last_date).add({days: 1})
    return first_date
  }

  postMilestone = (first_date) => {
    const { acessKey, groupId } = this.settings;
    first_date.start_date = first_date
    first_date.due_date = first_date.clone().add({days: this.settings.sprint_days - 1})
    axios.post(`https://gitlab.com/api/v4/groups/${groupId}/milestones?private_token=${acessKey}`,
    {
      title: `Milestone ${first_date.format("YYYY MMM")} [${first_date.start_date.format('DD')} a ${first_date.due_date.format('DD')}]`,
      start_date:  first_date.start_date.format('YYYY-MM-DD'),
      due_date:  first_date.due_date.format('YYYY-MM-DD')
    })
  }

  createNewMilestone = (key) => {
    let dates = this.state.dates
    let last_date = dates[dates.length - 1]
    for(let i = 0; i <= key; i++){
      let first_date = dates[0]
      this.postMilestone(first_date)
      dates.push(last_date.clone().add({days: this.settings.sprint_days * (i + 1)}))
      dates.shift()
    }
    this.setState({dates})
  }

  render() {
    let { dates } = this.state
    const { sprint_days } = this.settings
    dates = dates.map(
      (item, key) => <Box date={item} key={key} sprint_days={sprint_days} action={ () => this.createNewMilestone(key)}/>
    )

    return (
      <div className="App">
        <div className="top-bar">
          <img src={glLogo} className="glLogo" alt="gitlab logo"/>
        </div>
        {dates}
      </div>
    );
  }
}
export default App;
