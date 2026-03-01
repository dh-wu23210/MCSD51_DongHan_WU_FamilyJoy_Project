/** Module: calendarController. Handles calendarController responsibilities. */

const calendarService = require('../services/calendarService');
const { buildCalendarViewModel } = require('../viewModels/calendarViewModel');

/**
 * getCalendar: executes this module action.
 */
exports.getCalendar = async (req, res) => {
  const user = req.session.user;
  const monthParam = req.query.month || '';
  const requestedChildId = req.query.childId;
  const calendarData = await calendarService.getCalendarData(user, monthParam);
  const calendarSelectedChildId = requestedChildId || 'all';

  return res.render('pages/calendar/calendar', buildCalendarViewModel({
    user,
    rows: calendarData.rows,
    year: calendarData.year,
    month: calendarData.month,
    children: calendarData.children || [],
    selectedChildId: calendarSelectedChildId,
    monthParam,
    query: req.query
  }));
};
