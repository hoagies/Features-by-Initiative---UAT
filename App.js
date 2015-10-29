Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
	launch: function() {

		this.add({
			xtype: 'rallycombobox',
			stateful: true,
			stateId: this.getContext().getScopedStateId('initiative'),
			width: 600,
			fieldLabel: 'Select Initiative:',
			// Display Template
			displayTpl: Ext.create('Ext.XTemplate','<tpl for=".">','{FormattedID} - {Name}','</tpl>'),
			// List Template
			tpl: Ext.create('Ext.XTemplate','<tpl for=".">','<div class="x-boundlist-item">{FormattedID} - {Name}</div>','</tpl>'),
			storeConfig: {
				autoLoad: true,
				model: 'PortfolioItem/Initiative',
				fetch: ['FormattedID', 'Name'],
				sorters: [
					{
						property: 'ObjectID',
						direction: 'ASC'
					}
				],
				remoteGroup: false,
				remoteSort: false,
				remoteFilter: false,
				limit: Infinity
			},
			listeners: {
				select: this._onLoad,
				ready: this._onLoad,
				scope: this
			}
		});
	},
		
	_onLoad: function() {
		console.log('changing');
		
		if (this.down('#features_uat')) {
			this.down('#features_uat').destroy();
		}
		
		this.add({
			xtype: 'rallycardboard',
			id: 'features_uat',
			// types: ['User Story'],
			types: ['PortfolioItem/Feature'],
			attribute: 'c_UATState',
			context: this.getContext(),
			storeConfig: {
				filters: [
					this._getFilter()
				]
			},
			columnConfig: {
				plugins: [
					{ptype: 'rallycolumncardcounter'}
				]
			},
			cardConfig: {
				// fields: ['Feature','Iteration','Project'],
				showIconsAndHighlightBorder: false,
				editable: false,
				showAge: true
			},
			rowConfig: {
				field: 'c_UATTeamMember'
			},
			listeners: {
				load: function(board) {
					var rows = board.getRows();
					_.each(rows, function(row) {
						var cardsInRow = board.getCardsInRow(row);
						var cardCount = _.flatten(_.values(cardsInRow)).length;
						if(cardCount === 0) {
							row.collapse();
						}else{
							row.expand();
						}
					});
				}
			}
		});
	},
		
	_getFilter: function() {
		
		var combo = this.down('rallycombobox');
		var filters = Ext.create('Rally.data.QueryFilter', {
			property: 'c_UATTeamMember',
			operator: '!=',
			value: null
		});
		filters = filters.and({
			property: 'Parent.Parent',
			operator: '=',
			value: combo.getValue()
		});
		return filters;
	}

});