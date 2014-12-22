var React = require('react'),
	Field = require('../field'),
	Note = require('../../components/note'),
	InputDate = require('../../components/inputDate'),
	moment = require('moment');

module.exports = Field.create({

	supports: {
		focusTarget: 'dateInput'
	},

	// default input formats
	dateInputFormat: 'YYYY-MM-DD',
	timeInputFormat: 'h:mm:ss a',

	// parse formats (duplicated from lib/fieldTypes/datetime.js)
	parseFormats: ['YYYY-MM-DD', 'YYYY-MM-DD h:m:s a', 'YYYY-MM-DD h:m a', 'YYYY-MM-DD H:m:s', 'YYYY-MM-DD H:m'],

	getInitialState: function() {
		return { 
			dateValue: this.props.value ? moment(this.props.value).format(this.dateInputFormat) : '',
			timeValue: this.props.value ? moment(this.props.value).format(this.timeInputFormat) : ''
		};
	},

	getDefaultProps: function() {
		formatString: 'Do MMM YYYY, h:mm:ss a'
	},

	// TODO: Move isValid() so we can share with server-side code
	isValid: function(value) {
		return moment(value, this.parseFormats).isValid();
	},

	// TODO: Move format() so we can share with server-side code
	format: function(value, format) {
		format = format || this.dateInputFormat + ' ' + this.timeInputFormat;
		return value ? moment(value).format(format) : '';
	},

	handleChange: function(dateValue, timeValue) {
		var value = dateValue + ' ' + timeValue,
			datetimeFormat = this.dateInputFormat + ' ' + this.timeInputFormat;

		this.props.onChange({
			path: this.props.path,
			value: this.isValid(value) ? moment(value, datetimeFormat).toISOString() : null
		});
	},

	dateChanged: function(value) {
		this.setState({ dateValue: value });
		this.handleChange(value, this.state.timeValue);
	},

	timeChanged: function(event) {
		this.setState({ timeValue: event.target.value });
		this.handleChange(this.state.dateValue, event.target.value);
	},

	setNow: function() {
		var dateValue = moment().format(this.dateInputFormat),
			timeValue = moment().format(this.timeInputFormat);

		this.setState({
			dateValue: dateValue,
			timeValue: timeValue
		})
		this.handleChange(dateValue, timeValue);
	},

	renderUI: function() {
		
		var input,
			fieldClassName = 'field-ui';
		
		if (this.props.noedit) {
			input = (
				<div className={fieldClassName}>
					<div className="field-value">{this.format(this.props.value, this.props.formatString)}</div>
				</div>
			);
		} else {
			input = (
				<div className={fieldClassName}>
					<div className="form-row">
						<div className="col-xs-5">
							<InputDate ref="dateInput" name={this.props.paths.date} value={this.state.dateValue} format={this.dateInputFormat} onChange={this.dateChanged} />
						</div>
						<div className="col-xs-5">
							<input type="text" name={this.props.paths.time} value={this.state.timeValue} placeholder="HH:MM:SS am/pm" onChange={this.timeChanged} autoComplete="off" className="form-control time" />
						</div>
						<div className="col-xs-2">
							<button type="button" className="btn btn-default btn-block btn-set-now" onClick={this.setNow}>Now</button>
						</div>
					</div>
				</div>
			);
		}
		
		return (
			<div className="field field-type-datetime">
				<label className="field-label">{this.props.label}</label>
				{input}
				<div className="col-sm-9 col-md-10 col-sm-offset-3 col-md-offset-2">
					<Note note={this.props.note} />
				</div>
			</div>
		);
	}

});
