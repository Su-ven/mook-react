import {UtilFlux, TableMixin} from './../libs/ui-core';
import {TableMixin as UtilTableMixin} from './../libs/ui-extend';
import ListMixin from './listMixin';
import flux from './flux/listPotential';

export default React.createClass({
    mixins: [TableMixin(flux), UtilTableMixin(), ListMixin(flux, "潜在客户")],
});
