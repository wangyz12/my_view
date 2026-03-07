import moment from 'moment';

/**
 * 获取当前时间所属时段
 * @param dateTime - 日期时间，可以是 Date 对象、时间戳或日期字符串
 * @returns 返回对应的时段：'凌晨' | '早上' | '上午' | '中午' | '下午' | '晚上' | '深夜'
 */
export function getTimePeriod(
  dateTime?: Date | string | number
): string {
  // 如果没有传入参数，默认使用当前时间
  const time = dateTime ? moment(dateTime) : moment();

  // 获取当前小时数（24小时制）
  const hour = time.hour();

  // 根据小时数判断时段
  if (hour >= 0 && hour < 3) {
    return '凌晨';
  } else if (hour >= 3 && hour < 6) {
    return '早上';
  } else if (hour >= 6 && hour < 11) {
    return '上午';
  } else if (hour >= 11 && hour < 13) {
    return '中午';
  } else if (hour >= 13 && hour < 18) {
    return '下午';
  } else if (hour >= 18 && hour < 22) {
    return '晚上';
  } else {
    return '深夜';
  }
}

/**
 * 获取当前时间所属时段（简化版，只有上午/中午/下午/晚上）
 * @param dateTime - 日期时间，可以是 Date 对象、时间戳或日期字符串
 * @returns 返回对应的时段：'上午' | '中午' | '下午' | '晚上'
 */
export function getSimpleTimePeriod(
  dateTime?: Date | string | number
): string {
  const time = dateTime ? moment(dateTime) : moment();
  const hour = time.hour();

  if (hour >= 6 && hour < 11) {
    return '上午';
  } else if (hour >= 11 && hour < 13) {
    return '中午';
  } else if (hour >= 13 && hour < 18) {
    return '下午';
  } else {
    return '晚上';
  }
}

/**
 * 获取带问候语的时间文本
 * @param dateTime - 日期时间，可以是 Date 对象、时间戳或日期字符串
 * @returns 返回问候语，例如：'上午好'、'下午好'等
 */
export function getGreeting(
  dateTime?: Date | string | number
): string {
  const period = getSimpleTimePeriod(dateTime);
  return `${period}好`;
}

/**
 * 获取详细的时间时段信息
 * @param dateTime - 日期时间，可以是 Date 对象、时间戳或日期字符串
 * @returns 返回包含时段、小时、格式化时间等信息的对象
 */
export interface TimePeriodInfo {
  period: string; // 时段（凌晨/早上/上午/中午/下午/晚上/深夜）
  simplePeriod: string; // 简化的时段（上午/中午/下午/晚上）
  hour: number; // 小时数（24小时制）
  minute: number; // 分钟数
  formattedTime: string; // 格式化的时间（HH:mm:ss）
  greeting: string; // 问候语
}

export function getTimePeriodInfo(
  dateTime?: Date | string | number
): TimePeriodInfo {
  const time = dateTime ? moment(dateTime) : moment();

  return {
    period: getTimePeriod(dateTime),
    simplePeriod: getSimpleTimePeriod(dateTime),
    hour: time.hour(),
    minute: time.minute(),
    formattedTime: time.format('HH:mm:ss'),
    greeting: getGreeting(dateTime),
  };
}

// 默认格式常量
const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';
const DEFAULT_TIME_FORMAT = 'HH:mm:ss';

/**
 * 通用时间格式化方法
 * @param dateTime - 日期时间：可以是 Date 对象、日期字符串或时间戳
 * @param format - 格式化模板，默认：'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的时间字符串
 */
export function formatTime(
  dateTime?: Date | string | number | null,
  format: string = DEFAULT_FORMAT
): string {
  if (!dateTime) {
    return moment().format(format);
  }
  return moment(dateTime).format(format);
}

/**
 * 格式化为日期字符串
 * @param dateTime - 日期时间
 * @param format - 格式化模板，默认：'YYYY-MM-DD'
 * @returns 格式化后的日期字符串
 */
export function formatDate(
  dateTime?: Date | string | number | null,
  format: string = DEFAULT_DATE_FORMAT
): string {
  return formatTime(dateTime, format);
}

/**
 * 格式化为时间字符串
 * @param dateTime - 日期时间
 * @param format - 格式化模板，默认：'HH:mm:ss'
 * @returns 格式化后的时间字符串
 */
export function formatTimeOnly(
  dateTime?: Date | string | number | null,
  format: string = DEFAULT_TIME_FORMAT
): string {
  return formatTime(dateTime, format);
}

/**
 * 格式化为年月日字符串
 * @param dateTime - 日期时间
 * @param separator - 分隔符，默认：'-'
 * @returns 格式化后的年月日字符串，如：2025-01-01
 */
export function formatYMD(
  dateTime?: Date | string | number | null,
  separator: string = '-'
): string {
  return formatTime(dateTime, `YYYY${separator}MM${separator}DD`);
}

/**
 * 格式化为时分秒字符串
 * @param dateTime - 日期时间
 * @param separator - 分隔符，默认：':'
 * @returns 格式化后的时分秒字符串，如：12:30:45
 */
export function formatHMS(
  dateTime?: Date | string | number | null,
  separator: string = ':'
): string {
  return formatTime(dateTime, `HH${separator}mm${separator}ss`);
}

/**
 * 格式化为中文日期
 * @param dateTime - 日期时间
 * @returns 格式化后的中文日期，如：2025年01月01日
 */
export function formatChineseDate(
  dateTime?: Date | string | number | null
): string {
  return formatTime(dateTime, 'YYYY年MM月DD日');
}

/**
 * 格式化为中文时间
 * @param dateTime - 日期时间
 * @returns 格式化后的中文时间，如：12时30分45秒
 */
export function formatChineseTime(
  dateTime?: Date | string | number | null
): string {
  return formatTime(dateTime, 'HH时mm分ss秒');
}

/**
 * 格式化为中文日期时间
 * @param dateTime - 日期时间
 * @returns 格式化后的中文日期时间，如：2025年01月01日 12时30分45秒
 */
export function formatChineseDateTime(
  dateTime?: Date | string | number | null
): string {
  return formatTime(dateTime, 'YYYY年MM月DD日 HH时mm分ss秒');
}

/**
 * 格式化为相对时间
 * @param dateTime - 日期时间
 * @param baseTime - 基准时间，默认当前时间
 * @returns 相对时间字符串，如：刚刚、5分钟前、2小时后等
 */
export function formatRelative(
  dateTime: Date | string | number,
  baseTime?: Date | string | number
): string {
  const target = moment(dateTime);
  const base = baseTime ? moment(baseTime) : moment();

  const diffSeconds = base.diff(target, 'seconds');
  const absSeconds = Math.abs(diffSeconds);

  if (absSeconds < 60) {
    return diffSeconds >= 0 ? '刚刚' : '马上';
  }

  const diffMinutes = base.diff(target, 'minutes');
  const absMinutes = Math.abs(diffMinutes);

  if (absMinutes < 60) {
    return diffMinutes >= 0
      ? `${diffMinutes}分钟前`
      : `${-diffMinutes}分钟后`;
  }

  const diffHours = base.diff(target, 'hours');
  const absHours = Math.abs(diffHours);

  if (absHours < 24) {
    return diffHours >= 0
      ? `${diffHours}小时前`
      : `${-diffHours}小时后`;
  }

  const diffDays = base.diff(target, 'days');
  const absDays = Math.abs(diffDays);

  if (absDays < 30) {
    return diffDays >= 0 ? `${diffDays}天前` : `${-diffDays}天后`;
  }

  const diffMonths = base.diff(target, 'months');
  const absMonths = Math.abs(diffMonths);

  if (absMonths < 12) {
    return diffMonths >= 0
      ? `${diffMonths}个月前`
      : `${-diffMonths}个月后`;
  }

  const diffYears = base.diff(target, 'years');
  return diffYears >= 0 ? `${diffYears}年前` : `${-diffYears}年后`;
}

/**
 * 格式化时间范围
 * @param startTime - 开始时间
 * @param endTime - 结束时间
 * @param format - 格式化模板，默认：'YYYY-MM-DD HH:mm:ss'
 * @param separator - 分隔符，默认：' - '
 * @returns 格式化后的时间范围字符串
 */
export function formatRange(
  startTime: Date | string | number,
  endTime: Date | string | number,
  format: string = DEFAULT_FORMAT,
  separator: string = ' - '
): string {
  return `${formatTime(startTime, format)}${separator}${formatTime(
    endTime,
    format
  )}`;
}

/**
 * 智能格式化（自动判断显示规则）
 * @param dateTime - 日期时间
 * @returns 智能格式化的时间字符串
 * @example
 * - 今天：显示 12:30
 * - 昨天：显示 昨天 12:30
 * - 前天：显示 前天 12:30
 * - 今年：显示 01-01 12:30
 * - 往年：显示 2025-01-01
 */
export function formatSmart(
  dateTime?: Date | string | number | null
): string {
  if (!dateTime) {
    return '';
  }

  const time = moment(dateTime);
  const now = moment();

  if (time.isSame(now, 'day')) {
    // 今天：显示时间
    return time.format('HH:mm');
  } else if (time.isSame(now.clone().subtract(1, 'day'), 'day')) {
    // 昨天
    return `昨天 ${time.format('HH:mm')}`;
  } else if (time.isSame(now.clone().subtract(2, 'day'), 'day')) {
    // 前天
    return `前天 ${time.format('HH:mm')}`;
  } else if (time.isSame(now, 'year')) {
    // 今年内：显示月-日 时:分
    return time.format('MM-DD HH:mm');
  } else {
    // 往年：显示年-月-日
    return time.format('YYYY-MM-DD');
  }
}

/**
 * 解析时间字符串为 Date 对象
 * @param dateTime - 日期时间字符串
 * @param format - 输入格式，默认自动检测
 * @returns Date 对象
 */
export function parseTime(
  dateTime: string,
  format?: string
): Date | null {
  const m = format ? moment(dateTime, format) : moment(dateTime);

  return m.isValid() ? m.toDate() : null;
}

/**
 * 验证时间字符串是否有效
 * @param dateTime - 日期时间字符串
 * @param format - 格式，默认自动检测
 * @returns 是否有效
 */
export function isValidTime(
  dateTime: string,
  format?: string
): boolean {
  const m = format
    ? moment(dateTime, format, true)
    : moment(dateTime);

  return m.isValid();
}
