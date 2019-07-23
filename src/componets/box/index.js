import React , {Component} from 'react';
import Moment from 'react-moment';
import 'moment/locale/pt-br';
import './style.css';

class Box extends Component{
    render() {
        const date = this.props.date.format('YYYY-MM-DD');
        const sprint_days = this.props.sprint_days;

        return (
            <button className="box" onClick={this.props.action}>
                <span className="title">
                    Milestone 
                    <Moment locale="pt-BR" date={date} format=" YYYY MMM [D"/> a 
                    <Moment locale="pt-BR" date={date} format=" D]"add={{days: sprint_days - 1}}/>
                </span>
                <span className="date">
                    Periodo: [
                    <Moment locale="pt-BR" date={date} format="DD/MM/YYYY - "/>
                    <Moment locale="pt-BR" date={date} format="DD/MM/YYYY" add={{days: sprint_days - 1}}/>]
                </span>
            </button>
        );
    }
}

export default Box;
