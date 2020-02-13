# Luma Technical Interview 

## Problem Definition

Luma needs to regularly synchronize appointments from busy hospital to a local database. The hospital exposes an API (encoded in `luma-mock.js`) that providers data for appointment, providers, facilities and patients.

## Interview Task

Create a one way sync engine in NodeJS that will regularly pulls data from the hospital and store it locally. How you sync, how you store date, etc, are all at your discretion.


## Sync Engine Requirements

* Must pull data from LumaMock class (`luma-mock.js`) at a frequently (every 10 seconds) for a date range
* Data sync data must go from now to six months in the future
* Data sync must follow the order - 1. facilities, 2. providers, 3. appointment, 4. patients
* Data synchronized must be stored in memory and output logs to stdout 
* If data is already known, must provide a way to diff 2 versions where the Hospital version always wins 

## Dependencies

You’ll be give a started NodeJS project that contains the APIs to LumaMock and SyncEngine.
LumaMock exposes the apis to pull data from the hospital.
* getFacilities
* getProviders
* getAppointments(start, end)
* getPatient (patientId, facilityId). (Args will be available from appointment data)


## Deliverables

The code must expose an endpoint where we can start the sync engine and perform a sync.

## Bonus

Think of a way to optimize the sync frequency and speed
