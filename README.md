# Luma Technical Interview 

## Problem Definition

Luma needs to regularly synchronize appointments from busy hospital to a local database. The hospital exposes an api that providers data for appointment, providers, facilities and patients.

## Interview Task

Create a one way sync engine in node.js that will regularly pulls  data from the hospital and store it locally.  


## Sync Engine Requirements

* Must pull data from LumaMock class (given) frequently (every 10 seconds) for a specific start and end date range
* Must sync data from now to 6 months in the future
* Data sync must follow the order - facilities , providers, appointment, patients
* Data synchronized must be stored in memory and output logs to stdout 
* If data is already known, must provide a way to diff 2 versions where the Hospital version always wins. 

## Dependencies

You’ll be give a started node project that contains the apis to LumaMock and SyncEngine.
LumaMock exposes the apis to pull data from the hospital.
* getFacilities
* getProviders
* getAppointments(start, end)
* getPatient (patientId, facilityId). (Args will be available from appointment data)


## Deliverables

The code must expose an endpoint where we can start the sync engine and 

## Bonus

Think of a way to optimize the sync frequency and speed
