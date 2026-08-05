const success = (res, data, message = 'Operación exitosa', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const created = (res, data, message = 'Recurso creado exitosamente') => {
  return success(res, data, message, 201);
};

const noContent = (res) => {
  return res.status(204).send();
};

const paginated = (res, data, pagination, message = 'Operación exitosa') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  });
};

module.exports = {
  success,
  created,
  noContent,
  paginated,
};
