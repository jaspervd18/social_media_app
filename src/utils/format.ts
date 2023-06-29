const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
});

const formatDateTime = (date: Date | string) => {
  return dateTimeFormatter.format(new Date(date));
};

export { formatDateTime };
