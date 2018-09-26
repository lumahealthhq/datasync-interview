const moment = require('moment');

function LumaMock() {}

LumaMock.configuration = {
}

const logger = {
	info: console.log,
	warn: console.log,
	error: console.log
}

LumaMock.prototype.login = function(callback) {
	const self = this;
	logger.info('LumaMock: logged in', self.options.integratorClientConnectionId);
	return callback();
};

LumaMock.prototype.logout = function(callback) {
	logger.info('LumaMock: logged out');
	return callback();
};

LumaMock.prototype.getAppointmentTypes = function(callback) {
	return callback(null,  [
	{
		id: 1,
		name: 'New Patient'
	},
	{
		id: 2,
		name: 'Follow Up'
	}
	]);
};

LumaMock.prototype.getFacilities = function(callback) {
	return callback(null, [
	{
		id: 1,
		name: 'Luma Mock Facility North'
	},
	{
		id: 2,
		name: 'Luma Mock Facility South'
	},
	{
		id: 3,
		name: 'Luma Mock Facility East'
	},
	{
		id: 4,
		name: 'Luma Mock Facility West'
	},
	{
		id: 5,
		name: 'Luma Mock Facility HQ'
	}
	]);
};

LumaMock.prototype.getProviders = function(callback) {
	return callback(null, [
	{
		id: 1,
		name: ' Howser',
		firstname: 'Doogie',
		lastname: 'Hower'
	},
	{
		id: 2,
		name: 'Gregory House',
		firstname: 'Gregory',
		lastname: 'House'
	},
	{
		id: 3,
		name: 'Leonard McCoy',
		firstname: 'Leonard',
		lastname: 'McCoy'
	},
	{
		id: 4,
		name: 'Leo Spaceman',
		firstname: 'Leo',
		lastname: 'Spaceman'
	},
	{
		id: 5,
		name: 'Beverly Crusher',
		firstname: 'Beverly',
		lastname: 'Crusher'
	}
	]);
};

LumaMock.prototype.getPatient = function(id, facilityId, callback) {
	var dateOfBirth = moment(`${randomIntFromInterval(1,12)}/${randomIntFromInterval(1,30)}/${randomIntFromInterval(1920, 2016)}`, 'MM/DD/YYYY');
	var patientObject = {};

	switch (id) {
		case 1:
			patientObject = {
				name: 'Marnie TheDog',
				firstname: 'Marnie',
				lastname: 'TheDog'
			};
			break;
		case 2:
			patientObject = {
				name: 'Doug ThePug',
				firstname: 'Doug',
				lastname: 'ThePug'
			};
			break;
		case 3:
			patientObject = {
				name: 'Jill TheSquirrel',
				firstname: 'Jill',
				lastname: 'TheSquirrel'
			};
			break;
		case 4:
			patientObject = {
				name: 'Jean Luc Picard',
				firstname: 'Jean Luc',
				lastname: 'Picard'
			};
			break;
		case 5:
			patientObject = {
				name: 'Liz Lemon',
				firstname: 'Liz',
				lastname: 'Lemon'
			};
			break;
	}
	patientObject.id = id;
	patientObject.dateOfBirth = dateOfBirth;
	patientObject.contact = [{
		type: 'sms',
		value: '+1 949-555-1234'
	}, {
		type: 'email',
		value: 'aditya+lumamock@lumahealth.io'
	},
	];
	return callback(null, patientObject);
};

LumaMock.prototype.getAppointments = function(start, end, callback) {
	var days = moment(end).diff(moment(start), 'days');
	var appts = [];
	for (var i = 0; i < days * 2; i++) {
		var newAppt = {
			patient: i % 5 + 1,
			provider: i % 5 + 1,
			type: i % 2 + 1,
			facility: i % 5 + 1,
			id: i,
			duration: 30,
			status: getRandomStatus(),
			date: moment().add(i, 'days').hour(getRandomHour()).minute(0).seconds(0)
		};
		const randVal = Math.random();
		// make a bunch of them blocked appts
		if (randVal < 0.25) {
			delete newAppt.patient;
		}
		// and make some of them whitespace
		if (randVal > 0.25 && randVal < 0.5) {
			newAppt.whitespace = true;
			delete newAppt.patient;
		}
		appts.push(newAppt);
	}
	return callback(null, appts);
};

function randomIntFromInterval(min, max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}

function getRandomHour() {
	var hours = [7, 10, 14, 18];
	return hours[randomIntFromInterval(0, hours.length -1)];
}

function getRandomStatus() {
	var states = ['unconfirmed', 'confirmed', 'cancelled'];
	return states[randomIntFromInterval(0, states.length - 1)];
}

function getRandomDuration() {
	var durations = [10, 30, 60];
	return durations[randomIntFromInterval(0, durations.length - 1)];
}

LumaMock.prototype.updateAppointmentStatus = function(appointmentId, facilityId, status, date, duration, callback) {
	logger.info('LumaMock: updating appt', appointmentId, 'to', status);
	return callback();
};

LumaMock.prototype.bookShadowAppointment = function(time, duration, provider, facility, callback) {
	return callback(null, new Date().valueOf());
};

LumaMock.prototype.clearShadowAppointment = function(appointmentId, callback) {
	logger.info('LumaMock: clearing shadow appointment', appointmentId);
	return callback();
};

LumaMock.prototype.createAppointment = function(time, duration, type, provider, facility, patient, callback) {
	logger.info('LumaMock: creating appt');
	return callback(null, new Date().valueOf());
};

LumaMock.prototype.getPatientProcedures = function(patient, callback) {
	logger.info('LumaMock: getPatientProcedures');
	return callback(null, [
		{
			id: 1111,
			patient,
			cpt: '47350', // intentionally a string
			date: moment(),
			appointment: null,
			description: 'Repair Procedures on the Liver'
		},
		{
			id: 134325,
			patient,
			cpt: 99214,
			date: moment(),
			appointment: null,
			description: 'Level 4 Established Office Visit'
		}
	]);
}

LumaMock.prototype.getPatientDiagnoses = function(patient, callback) {
	logger.info('LumaMock: getPatientDiagnoses');
	return callback(null, [
		{
			id: 492038,
			patient,
			icd: 'S06.0x1A',
			description: 'Concussion with loss of consciousness of 30 minutes or less, initial encounter',
			date: moment()
		},
		{
			id: 12415,
			patient,
			icd: 'M99.01',
			date: moment(),
			description: 'Segmental and somatic dysfunction of cervical region'
		}
	]);
};


LumaMock.prototype.getPatientRecalls = function(patient, callback) {
	logger.info('LumaMock: getPatientRecalls', patient);
	return callback(null, [
		{
			id: randomIntFromInterval(1, 100),
			patient,
			date: moment().add(8, 'days').startOf('day').hour(10),
		}
	]);
}

module.exports = LumaMock;