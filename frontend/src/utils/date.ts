import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import UTC from 'dayjs/plugin/utc'
dayjs.extend(relativeTime)
dayjs.extend(UTC)

export const formatDate = (date: Date, format = 'MMMM D, YYYY') =>
  date ? dayjs(date).format(format) : date

export const formatDateTime = (date: Date, format = 'MMMM D, YYYY, h:mm A') =>
  date ? dayjs(date).format(format) : date

export const formatDateTimeForAPI = (date: Date) =>
  date
    ? dayjs(date)
        .utc()
        .format()
    : date

export const formatDateTimeConversational = (date: Date) =>
  date ? dayjs(date).fromNow() : date
