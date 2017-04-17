import {UtilTool} from './../../libs/ui-core';
import BtnMobile from './BtnMobile';
import CardTag from './CardTag';
import CardContact from './CardContact';
import CardTrack from './CardTrack';
import fluxDetail from '../flux/detail';
import './RightSide.less';

let RightSide = React.createClass({
    render() {
        return <div>
            <CardTag customerId={this.props.customerId}/>
            <CardContact customerId={this.props.customerId}/>
            <CardTrack customerId={this.props.customerId}/>
        </div>;
    }
});
export default RightSide;
