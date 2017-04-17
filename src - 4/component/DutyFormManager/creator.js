import {Form} from 'antd';
import FormMixin from './formMixin';

const createForm = Form.create;

const form = React.createClass({
    mixins: [FormMixin],

    getInitialState() {
        return {loading: false};
    },
});

export default createForm()(form);