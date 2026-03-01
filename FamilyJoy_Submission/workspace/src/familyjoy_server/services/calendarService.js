/** Module: calendarService. Handles calendarService responsibilities. */

const questRepo = require('../repositories/questRepo');
const userRepo = require('../repositories/userRepo');
const { formatDateString } = require('../utils/dateUtils');

/**
 * getMonthRange: executes this module action.
 */
function getMonthRange(dateStr) {
  const date = dateStr ? new Date(dateStr) : new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  return {
    startDate: formatDateString(start),
    endDate: formatDateString(end),
    year,
    month
  };
}

/**
 * getCalendarDataForChild: executes this module action.
 */
async function getCalendarDataForChild(userId, dateStr) {
  const { startDate, endDate, year, month } = getMonthRange(dateStr);
  const rows = await questRepo.getDailyQuestsByChildDateRange(userId, startDate, endDate);
  return { rows, year, month };
}

/**
 * getCalendarDataForParent: executes this module action.
 */
async function getCalendarDataForParent(familyId, dateStr) {
  const { startDate, endDate, year, month } = getMonthRange(dateStr);
  const rows = await questRepo.getDailyQuestsByFamilyDateRange(familyId, startDate, endDate);
  const children = await userRepo.listActiveChildrenByFamily(familyId);
  return { rows, year, month, children };
}

/**
 * getCalendarData: executes this module action.
 */
async function getCalendarData(user, dateStr) {
  if (user.role === 'parent') {
    return getCalendarDataForParent(user.familyId, dateStr);
  }
  return getCalendarDataForChild(user.id, dateStr);
}

module.exports = {
  getCalendarDataForChild,
  getCalendarDataForParent,
  getCalendarData,
  getMonthRange
};
