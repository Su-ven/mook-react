import {UtilFlux, TableMixin} from './../libs/ui-core';
import {TableMixin as UtilTableMixin} from './../libs/ui-extend';
import ListMixin from './listMixin';
import flux from './flux/listFirmOffer';
export default React.createClass({
    mixins: [TableMixin(flux), UtilTableMixin(), ListMixin(flux, "实盘客户")],
});