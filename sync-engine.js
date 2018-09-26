const LumaMock = require('./luma-mock');
const moment = require('moment');

const lumaMock = new LumaMock();


sync();

function sync () {
	//TBD
}


function syncFacilities () {
	lumaMock.getFacilities((err, facilities) => {
		facilities.forEach((facility) => {
			console.log(`facility ${facility.name}`);
		});
	});
}


function syncProviders () {
	lumaMock.getProviders((err, providers) => {
		providers.forEach((provider) => {
			console.log(`provider ${provider.name}`);
		});
	});
}


function syncAppointments () {
	lumaMock.getAppointments(moment(), moment().add(10,'days'), (err, appointments) => {
		appointments.forEach((appointment) => {
			lumaMock.getPatient(appointment.patient, appointment.facility, (err, patient) => {
				console.log(`appointment ${appointment.date}  patient ${patient.name}`);
			})
		});
	});
}