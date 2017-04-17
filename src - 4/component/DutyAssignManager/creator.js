import {Form} from 'antd';
import FormMixin from './formMixin';

const createForm = Form.create;

const form = React.createClass({
    mixins: [FormMixin],

    componentDidMount() {
        this.setState({startDate: this.props.location.query.datetime, endDate: this.props.location.query.datetime});
    },

    getInitialState() {
        return {loading: false};
    },
});

export default createForm()(form);