export const toDateInput = (value) => (value ? new Date(value).toISOString().slice(0, 10) : '');

export const buildFormData = (values, fileFields = []) => {
  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (fileFields.includes(key) && value instanceof FileList) {
      if (value[0]) formData.append(key, value[0]);
    } else if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  return formData;
};
