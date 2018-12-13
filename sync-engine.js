const LumaMock = require('./luma-mock');
const moment = require('moment');
const loki = require('lokijs');  //does not save the database at all but just uses loki as an in-memory database with no persistence, sync calls.
let db = new loki('lunasync.db');  //in memory
let appointmentsCollection = db.addCollection('appointments', { indices: ['date'] });

let facilityCollection = db.addCollection('facility');  //id is default index
// facilityCollection.ensureUniqueIndex('id');
let appointmentTypesCollection = db.addCollection('types'); //id is default index
// appointmentTypesCollection.ensureUniqueIndex('id');
let providerCollection = db.addCollection('provider'); //id is default index
// providerCollection.ensureUniqueIndex('id');

let _cachedLookupData = false;

const lumaMock = new LumaMock();

const logger = {
	info: console.log,
	warn: console.log,
	error: console.log
}

function login() {
	return new Promise(resolve => {
		lumaMock.login((callback) => {
			resolve('Login ')
		});
	})
}

function logout() {
	return new Promise(resolve => {
		lumaMock.logout((callback) => {
			resolve('logout')
		});
	})
}

async function sync() {
	// await login();
	if (!_cachedLookupData) {
		// using async on facilities, providers and appointment types because that information does not needed to be serialized
		const syncFacilitiesResult = syncFacilities(), syncProvidersResult = syncProviders(), syncTypesResult = syncAppointmentTypes();
		logger.info('waiting for async to complete:', [await syncFacilitiesResult, await syncProvidersResult, await syncTypesResult]);
	}
	syncAppointments();
	// await logout();
}

function syncAppointmentTypes() {
	return new Promise(resolve => {
		lumaMock.getAppointmentTypes((err, types) => {
			types.forEach((types) => {
				logger.info(`types ${types.name}`);
				appointmentTypesCollection.insert(types);
			});
		});
		resolve('syncAppointmentTypes done');
	})

}
function syncFacilities() {
	return new Promise(resolve => {
		lumaMock.getFacilities((err, facilities) => {
			facilities.forEach((facility) => {
				logger.info(`facility ${facility.name}`);
				facilityCollection.insert(facility);
			});
		});
		resolve('syncFacilities done')
	})
}

function syncProviders() {
	return new Promise(resolve => {
		lumaMock.getProviders((err, providers) => {
			providers.forEach((provider) => {
				logger.info(`provider ${provider.name}`);
				providerCollection.insert(provider);
			});
		});
		resolve('syncProviders done')
	})
}

function syncAppointments() {
	console.log('get appointments');
	lumaMock.getAppointments(moment(), moment().add(10, 'days'), (err, appointments) => {
		appointments.forEach((appointment) => {
			lumaMock.getPatient(appointment.patient, appointment.facility, (err, patient) => {
				appointment.date = moment.utc(appointment.date._d).format(); //convert to UTC, more reliable
				syncRecords(appointment);
				const facilityLookup = facilityCollection.findOne({ id: appointment.facility });
				const typeLookup = appointmentTypesCollection.findOne({ id: appointment.type });
				const providerLookup = providerCollection.findOne({ id: appointment.provider });
				logger.info(`appointment: ${appointment.date},  patient: ${patient.name}, appointment: ${appointment.status}, facility: ${facilityLookup.name}, provider: ${providerLookup.name}, type: ${typeLookup.name}`);
			})
		});
	});
}

function syncRecords(apptData) {
	/* 	Search memory storage for an existing record,
		search params: UTC date, facility ID and
		status, we are checking to see if
		status is empty or cancelled
	*/

	let loggerMessage = "Sync - ";
	let result = appointmentsCollection.findOne({
		$and: [
			{ date: apptData.date },
			{ facility: apptData.facility },
			{ status: { '$in': ['cancelled', ''] } }
		]
	});

	/* 	Outcome Scenarios

		#1 - If result from memory search is null, we insert the record.

		#2 - If status is cancelled and patient value is undefined then free the slot, assumption is that this is a whitespace
						or blocked appointment

		#3 - If status is cancelled, update the status but keep the record

		#4 - This is the catch all, something else in the data  changed, could be an email address, or a phone number
		it is too expensive to find the changed data element, just delete and reinsert
	*/

	if (!result) {
		// Scenario 1
		loggerMessage += ' No matching record found, insert into memory';
		appointmentsCollection.insert(apptData);
	} else if (apptData.status === 'cancelled' && !apptData.patient) {
		// --> scenario 2
		loggerMessage += 'Remove from memory';
		appointmentsCollection.remove(result);
	} else if (apptData.status === 'cancelled') {
		// --> scenario 3
		loggerMessage += loggerMessage + 'Update status in memory';
		result.status = apptData.status;
		appointmentsCollection.update(result);
	} else {
		// --> scenario 4
		loggerMessage += loggerMessage + 'Remove and reinsert record, additional data element updated';
		appointmentsCollection.remove(result);
		appointmentsCollection.insert(apptData)
	}
	logger.info(loggerMessage);
}

let start = setInterval(function () { timer() }, 3000);
function timer() {
	sync();
	_cachedLookupData = true; //set a flag so that we cache data that will not change
}

function stopFunction() {
	clearInterval(start);
}
