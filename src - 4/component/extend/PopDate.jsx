import {
    Popover,
    DatePicker,
    Icon,
    Button,
} from 'antd';
let PopDatepicker = React.createClass({
    getInitialState: function () {
        return {
            popVisible: false,
        };
    },
    okCallback(date, dateString) {
        this.setState({
            popVisible: false,
        });
        let okCallback = this.props.okCallback;
        if (typeof(okCallback) == "function") {
            okCallback(dateString);
        }
    },
    handlePopVisibleChange(popVisible) {
        let self = this;
        this.setState({popVisible}, function () {
            if (popVisible) {
                //隐藏其它的已经弹出的datepicker
                var otherDatepickers = document.getElementsByClassName("ant-calendar-picker-container");
                for (var i = 0; i < otherDatepickers.length; i++) {
                    let d = otherDatepickers[i];
                    //d.parentNode.removeChild(d);
                    d.style.display = "none";
                }
            }
        });
    },
    render(){
        const popContent = (
            <DatePicker showTime={true} format="yyyy-MM-dd HH:mm:ss" autoComplete="off" onChange={this.okCallback}/>
        );
        return <Popover placement="left" content={popContent} title="" visible={this.state.popVisible}
                        overlayClassName="su-pop-datepicker"
                        onVisibleChange={this.handlePopVisibleChange}>
                <Button type="primary" size="small"><Icon type="edit"></Icon></Button>
        </Popover>;
    }
});
export default PopDatepicker;