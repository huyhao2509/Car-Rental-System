'use strict';

const bookingCreateService = require('./BookingCreateService');
const bookingQueryService = require('./BookingQueryService');
const bookingUpdateService = require('./BookingUpdateService');
const bookingAdminService = require('./BookingAdminService');

module.exports = {
    BookingCreateService: bookingCreateService,
    BookingQueryService: bookingQueryService,
    BookingUpdateService: bookingUpdateService,
    BookingAdminService: bookingAdminService,
};
