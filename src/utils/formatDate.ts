const defaultConfis: Intl.DateTimeFormatOptions = {
  timeZone: 'America/Sao_Paulo',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
};

export const formatDate = (date: Date | string, configs = defaultConfis) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', configs).format(dateObj);
};
